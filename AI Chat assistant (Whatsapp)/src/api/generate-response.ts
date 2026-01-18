/**
 * Generate Response API Endpoint
 * 
 * Called by agent dashboard when "Get AI Response" button is clicked.
 * Returns suggested reply + customer insights.
 */

import { generateResponse, refineResponse } from '../services/llm-service';
import knowledgeBase from '../../data/knowledge_base.json';

// Types
interface Message {
    role: 'customer' | 'agent';
    content: string;
    timestamp: string;
}

interface GenerateRequest {
    conversationId: string;
    messages: Message[];
    preferredLLM?: 'gemini' | 'gpt';
}

interface RefineRequest {
    originalResponse: string;
    instruction: 'shorten' | 'formalize' | 'casual' | 'add_urgency' | 'remove_emoji' | 'hindi_touch' | 'focus_price' | 'focus_trust';
    llm?: 'gemini' | 'gpt';
}

/**
 * POST /api/generate-response
 * 
 * Generate AI-suggested response for agent to review/edit
 */
export async function handleGenerateResponse(req: Request): Promise<Response> {
    try {
        const body: GenerateRequest = await req.json();

        if (!body.messages || body.messages.length === 0) {
            return Response.json({ error: 'No messages provided' }, { status: 400 });
        }

        // Convert timestamps
        const messages = body.messages.map(m => ({
            ...m,
            timestamp: new Date(m.timestamp),
        }));

        // Generate response
        const result = await generateResponse(
            messages,
            knowledgeBase as Record<string, any>,
            { preferredLLM: body.preferredLLM }
        );

        return Response.json({
            success: true,
            suggestion: result.content,
            customerProfile: result.customerProfile,
            topics: result.suggestedTopics,
            metadata: {
                llmUsed: result.llmUsed,
                tokensUsed: result.tokensUsed,
                cached: result.cached,
            },
        });

    } catch (error) {
        console.error('Generate response error:', error);
        return Response.json(
            { error: 'Failed to generate response', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * POST /api/refine-response
 * 
 * Refine an existing response with specific instructions
 */
export async function handleRefineResponse(req: Request): Promise<Response> {
    try {
        const body: RefineRequest = await req.json();

        if (!body.originalResponse || !body.instruction) {
            return Response.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Map instruction to full prompt
        const instructionMap: Record<string, string> = {
            shorten: 'Make this response more concise while keeping the warmth. Max 80 words.',
            formalize: 'Make this slightly more formal/professional, but still friendly.',
            casual: 'Make this more casual and conversational.',
            add_urgency: 'Add gentle, real urgency if there\'s a valid reason (festival, season).',
            remove_emoji: 'Remove emojis but keep the friendly tone.',
            hindi_touch: 'Add 1-2 natural Hindi words for warmth (like Namaste Ji, Bhaiya).',
            focus_price: 'Make pricing more prominent and clear.',
            focus_trust: 'Add more trust-building elements.',
        };

        const fullInstruction = instructionMap[body.instruction] || body.instruction;

        const refined = await refineResponse(
            body.originalResponse,
            fullInstruction,
            body.llm || 'gemini'
        );

        return Response.json({
            success: true,
            refined,
        });

    } catch (error) {
        console.error('Refine response error:', error);
        return Response.json(
            { error: 'Failed to refine response', details: String(error) },
            { status: 500 }
        );
    }
}

/**
 * GET /api/quick-responses
 * 
 * Get pre-built quick response templates
 */
export async function handleGetQuickResponses(): Promise<Response> {
    const quickResponses = await import('../../data/quick_responses.json');
    return Response.json(quickResponses.default);
}

// Export for routing
export default {
    generateResponse: handleGenerateResponse,
    refineResponse: handleRefineResponse,
    getQuickResponses: handleGetQuickResponses,
};
