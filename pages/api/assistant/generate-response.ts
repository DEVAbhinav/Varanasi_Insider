import { NextApiRequest, NextApiResponse } from 'next';
import { generateResponse } from '@/lib/assistant/llm-service';
import knowledgeBase from '@/data/assistant/knowledge_base.json';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { messages, preferredLLM } = req.body;

        if (!messages || messages.length === 0) {
            return res.status(400).json({ error: 'No messages provided' });
        }

        // Convert timestamps if they are strings
        const formattedMessages = messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp),
        }));

        const result = await generateResponse(
            formattedMessages,
            knowledgeBase as Record<string, any>,
            { preferredLLM }
        );

        return res.status(200).json({
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
        return res.status(500).json({ error: 'Failed to generate response', details: String(error) });
    }
}
