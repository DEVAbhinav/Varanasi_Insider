import { NextApiRequest, NextApiResponse } from 'next';
import { refineResponse } from '@/lib/assistant/llm-service';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { originalResponse, instruction, llm } = req.body;

        if (!originalResponse || !instruction) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

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

        const fullInstruction = instructionMap[instruction] || instruction;

        const refined = await refineResponse(
            originalResponse,
            fullInstruction,
            llm || 'gemini'
        );

        return res.status(200).json({
            success: true,
            refined,
        });
    } catch (error) {
        console.error('Refine response error:', error);
        return res.status(500).json({ error: 'Failed to refine response', details: String(error) });
    }
}
