/**
 * Multi-LLM Service for Kashi Taxi Agent Assist
 * 
 * Supports Gemini 2.5 Flash Lite (primary) with GPT fallback.
 * Optimized for minimal API calls and cost efficiency.
 */

import { SYSTEM_PROMPT, PERSONA_DETECTION_PROMPT, TOPIC_EXTRACTION_PROMPT } from '../prompts/system-prompt';

// Types
interface Message {
    role: 'customer' | 'agent';
    content: string;
    timestamp: Date;
}

interface CustomerProfile {
    group_type: string;
    group_size: number | null;
    has_elderly: boolean;
    has_children: boolean;
    purpose: string;
    booking_stage: string;
    detected_fears: string[];
    detected_desires: string[];
    emotional_state: string;
}

interface GenerateResponseOptions {
    preferredLLM?: 'gemini' | 'gpt';
    maxTokens?: number;
    temperature?: number;
}

interface LLMResponse {
    content: string;
    llmUsed: 'gemini-3-flash' | 'gpt-5.2';
    customerProfile: CustomerProfile | null;
    suggestedTopics: string[];
    tokensUsed: number;
    cached: boolean;
}

// Environment config with validation
const config = {
    geminiApiKey: process.env.GEMINI_API_KEY || '',
    openaiApiKey: process.env.OPENAI_API_KEY || '',
    primaryLLM: process.env.PRIMARY_LLM || 'gemini-2.5-flash-lite',
    fallbackLLM: process.env.FALLBACK_LLM || 'gpt-4o-mini',
    timeout: parseInt(process.env.LLM_TIMEOUT_MS || '30000'),
    maxContextTokens: parseInt(process.env.MAX_CONTEXT_TOKENS || '8000'),
    enableCache: process.env.ENABLE_RESPONSE_CACHE === 'true',
};

// Validate API key on startup
if (!config.geminiApiKey) {
    console.warn('⚠️ GEMINI_API_KEY not set - LLM calls will fail');
}

// Simple in-memory cache (replace with Redis in production)
const responseCache = new Map<string, { response: string; timestamp: Date }>();
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

/**
 * Generate a suggested response for the agent
 */
export async function generateResponse(
    conversationHistory: Message[],
    knowledgeBase: Record<string, any>,
    options: GenerateResponseOptions = {}
): Promise<LLMResponse> {
    // Validate input
    if (!conversationHistory || conversationHistory.length === 0) {
        throw new Error('No conversation history provided');
    }

    // Sanitize messages (prevent prompt injection)
    const sanitizedHistory = conversationHistory.map(m => ({
        ...m,
        content: sanitizeInput(m.content)
    }));

    // 1. Use keyword-based topic detection (FREE - no LLM call)
    const topics = detectTopicsFromKeywords(sanitizedHistory);

    // 2. Get relevant knowledge base sections
    const relevantKnowledge = extractRelevantKnowledge(knowledgeBase, topics);

    // 4. Check cache
    const cacheKey = buildCacheKey(conversationHistory, topics);
    if (config.enableCache && responseCache.has(cacheKey)) {
        const cached = responseCache.get(cacheKey)!;
        if (Date.now() - cached.timestamp.getTime() < CACHE_TTL_MS) {
            return {
                content: cached.response,
                llmUsed: config.primaryLLM as any,
                customerProfile: null,
                suggestedTopics: topics,
                tokensUsed: 0,
                cached: true,
            };
        }
    }

    // 4. Build full prompt (includes inline persona detection)
    const prompt = buildFullPrompt(sanitizedHistory, null, relevantKnowledge);

    // 5. Call LLM (single call instead of 3)
    const llmToUse = options.preferredLLM || 'gemini';
    let response: string;
    let llmUsed: 'gemini-3-flash' | 'gpt-5.2';
    let tokensUsed: number;

    try {
        if (llmToUse === 'gemini') {
            const result = await callGemini(prompt, options);
            response = result.content;
            tokensUsed = result.tokensUsed;
            llmUsed = 'gemini-3-flash';
        } else {
            const result = await callGPT(prompt, options);
            response = result.content;
            tokensUsed = result.tokensUsed;
            llmUsed = 'gpt-5.2';
        }
    } catch (error) {
        // Fallback to other LLM
        console.error(`${llmToUse} failed, falling back...`, error);
        if (llmToUse === 'gemini') {
            const result = await callGPT(prompt, options);
            response = result.content;
            tokensUsed = result.tokensUsed;
            llmUsed = 'gpt-5.2';
        } else {
            const result = await callGemini(prompt, options);
            response = result.content;
            tokensUsed = result.tokensUsed;
            llmUsed = 'gemini-3-flash';
        }
    }

    // 7. Cache response
    if (config.enableCache) {
        responseCache.set(cacheKey, { response, timestamp: new Date() });
    }

    return {
        content: response,
        llmUsed: llmUsed as any,
        customerProfile: null, // Extracted from response if needed
        suggestedTopics: topics,
        tokensUsed,
        cached: false,
    };
}

/**
 * Sanitize user input to prevent prompt injection
 */
function sanitizeInput(text: string): string {
    if (!text) return '';
    // Remove potential injection patterns
    return text
        .replace(/\[SYSTEM\]/gi, '[USER]')
        .replace(/\[INSTRUCTION\]/gi, '')
        .replace(/ignore previous instructions/gi, '')
        .replace(/forget everything/gi, '')
        .substring(0, 2000); // Limit message length
}

/**
 * Select best LLM based on conversation complexity
 */
function selectLLM(
    conversation: Message[],
    profile: CustomerProfile | null
): 'gemini' | 'gpt' {
    // Use GPT for complex scenarios
    const useGPT =
        // Long conversations need better context handling
        conversation.length > 10 ||
        // Anxious customers need more nuanced responses
        profile?.emotional_state === 'anxious' ||
        profile?.emotional_state === 'frustrated' ||
        // Ready-to-book stage is high value
        profile?.booking_stage === 'ready' ||
        // High complexity queries
        conversation.some(m => m.content.length > 500);

    return useGPT ? 'gpt' : 'gemini';
}

/**
 * Build the full prompt with context injections
 */
function buildFullPrompt(
    conversation: Message[],
    profile: CustomerProfile | null,
    knowledge: string
): string {
    let prompt = SYSTEM_PROMPT;

    // Inject knowledge base
    prompt = prompt.replace(
        '[KNOWLEDGE_BASE_INJECTION]',
        `### Relevant Service Information\n${knowledge}`
    );

    // Inject conversation history
    const conversationText = conversation
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n\n');
    prompt = prompt.replace('[CONVERSATION_HISTORY]', conversationText);

    // Inject customer profile
    const profileText = profile
        ? JSON.stringify(profile, null, 2)
        : 'Not enough information yet';
    prompt = prompt.replace('[CUSTOMER_PROFILE]', profileText);

    return prompt;
}

/**
 * Extract relevant knowledge base sections for the conversation topics
 */
function extractRelevantKnowledge(
    knowledgeBase: Record<string, any>,
    topics: string[]
): string {
    const sections: string[] = [];

    for (const topic of topics) {
        // Map topics to knowledge base paths
        const mapping: Record<string, string[]> = {
            'airport_transfer': ['routes.airport_to_city'],
            'ayodhya': ['routes.varanasi_to_ayodhya', 'tour_packages.ayodhya_1n2d'],
            'prayagraj': ['routes.varanasi_to_prayagraj'],
            'bodh_gaya': ['routes.varanasi_to_bodh_gaya', 'tour_packages.buddhist_circuit'],
            'tempo_traveller': ['vehicles.tempo_travellers'],
            'aarti': ['aarti_timings'],
            'boat_ride': ['boat_rides'],
            'ghats': ['ghats'],
            'sarnath': ['attractions.sarnath'],
            'dev_deepawali': ['festivals.dev_deepawali'],
            'maha_shivaratri': ['festivals.maha_shivaratri'],
            'pricing': ['day_tour_packages'],
            'wedding': ['services.wedding_transport'],
            'corporate': ['services.corporate_transport'],
            'safety': ['safety'],
            // Add more mappings as needed
        };

        const paths = mapping[topic] || [];
        for (const path of paths) {
            const value = getNestedValue(knowledgeBase, path);
            if (value) {
                sections.push(`**${path}:**\n${JSON.stringify(value, null, 2)}`);
            }
        }
    }

    // Limit context size
    const combined = sections.join('\n\n');
    if (combined.length > 4000) {
        return combined.substring(0, 4000) + '\n... [truncated for context limit]';
    }

    return combined || 'No specific service information needed for this query.';
}

/**
 * Helper to get nested object value by dot-notation path
 */
function getNestedValue(obj: Record<string, any>, path: string): any {
    return path.split('.').reduce((o, k) => o?.[k], obj);
}

/**
 * Extract topics from conversation using LLM
 */
async function extractTopics(conversation: Message[]): Promise<string[]> {
    const prompt = TOPIC_EXTRACTION_PROMPT.replace(
        '[CONVERSATION]',
        conversation.map(m => `${m.role}: ${m.content}`).join('\n')
    );

    try {
        // Quick call to Gemini for topic extraction
        const result = await callGemini(prompt, { maxTokens: 200 });
        return JSON.parse(result.content);
    } catch {
        // Fallback to keyword-based detection
        return detectTopicsFromKeywords(conversation);
    }
}

/**
 * Detect customer persona from conversation
 */
async function detectPersona(conversation: Message[]): Promise<CustomerProfile | null> {
    if (conversation.length < 2) return null;

    const prompt = PERSONA_DETECTION_PROMPT.replace(
        '[CONVERSATION]',
        conversation.map(m => `${m.role}: ${m.content}`).join('\n')
    );

    try {
        const result = await callGemini(prompt, { maxTokens: 500 });
        return JSON.parse(result.content);
    } catch {
        return null;
    }
}

/**
 * Fallback keyword-based topic detection
 */
function detectTopicsFromKeywords(conversation: Message[]): string[] {
    const text = conversation.map(m => m.content.toLowerCase()).join(' ');
    const topics: string[] = [];

    const keywords: Record<string, string[]> = {
        'airport': ['airport', 'flight', 'vns'],
        'ayodhya': ['ayodhya', 'ram mandir', 'ram janmabhoomi'],
        'prayagraj': ['prayagraj', 'allahabad', 'sangam'],
        'aarti': ['aarti', 'ganga aarti'],
        'boat': ['boat', 'rowing'],
        'tempo': ['tempo', 'traveller', '12 seater', '17 seater'],
        'wedding': ['wedding', 'shaadi', 'baraat'],
        'sarnath': ['sarnath', 'buddha', 'buddhist'],
        'pricing': ['price', 'cost', 'rate', 'fare', 'kitna'],
    };

    for (const [topic, kws] of Object.entries(keywords)) {
        if (kws.some(kw => text.includes(kw))) {
            topics.push(topic);
        }
    }

    return topics.length > 0 ? topics : ['general'];
}

/**
 * Build cache key from conversation pattern
 */
function buildCacheKey(conversation: Message[], topics: string[]): string {
    const lastMessages = conversation.slice(-3).map(m => m.content).join('|');
    const topicKey = topics.sort().join(',');
    return `${topicKey}:${hashString(lastMessages)}`;
}

function hashString(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
    }
    return hash.toString(36);
}

// ==================== LLM API Calls ====================

interface LLMCallResult {
    content: string;
    tokensUsed: number;
}

/**
 * Call Gemini 3 Flash API
 */
async function callGemini(
    prompt: string,
    options: GenerateResponseOptions
): Promise<LLMCallResult> {
    const modelName = config.primaryLLM; // Use from env

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${config.geminiApiKey}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    maxOutputTokens: options.maxTokens || 500,
                    temperature: options.temperature || 0.7,
                },
            }),
            signal: AbortSignal.timeout(config.timeout),
        }
    );

    if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return {
        content: data.candidates[0].content.parts[0].text,
        tokensUsed: data.usageMetadata?.totalTokenCount || 0,
    };
}

/**
 * Call GPT 5.2 API
 */
async function callGPT(
    prompt: string,
    options: GenerateResponseOptions
): Promise<LLMCallResult> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.openaiApiKey}`,
        },
        body: JSON.stringify({
            model: 'gpt-5.2',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7,
        }),
        signal: AbortSignal.timeout(config.timeout),
    });

    if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return {
        content: data.choices[0].message.content,
        tokensUsed: data.usage?.total_tokens || 0,
    };
}

/**
 * Refine a response with specific instructions
 */
export async function refineResponse(
    originalResponse: string,
    instruction: string,
    llm: 'gemini' | 'gpt' = 'gemini'
): Promise<string> {
    const prompt = `Original response:\n${originalResponse}\n\nInstruction: ${instruction}\n\nRefined response:`;

    if (llm === 'gemini') {
        const result = await callGemini(prompt, { maxTokens: 300 });
        return result.content;
    } else {
        const result = await callGPT(prompt, { maxTokens: 300 });
        return result.content;
    }
}

export default { generateResponse, refineResponse };
