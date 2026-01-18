import { NextApiRequest, NextApiResponse } from 'next';
import { sendWhatsAppMessage } from './whatsapp-webhook';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { conversationId, to, text } = req.body;

        if (!to || !text) {
            return res.status(400).json({ error: 'Missing to or text' });
        }

        const result = await sendWhatsAppMessage(to, text, conversationId);

        if (result.success) {
            return res.status(200).json({ success: true, messageId: result.messageId });
        } else {
            return res.status(500).json({ success: false, error: result.error });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to send message', details: String(error) });
    }
}
