import { NextApiRequest, NextApiResponse } from 'next';
import quickResponses from '@/data/assistant/quick_responses.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    return res.status(200).json(quickResponses);
}
