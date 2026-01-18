/**
 * WhatsApp Business API Webhook Handler (Next.js Version)
 */

import { NextApiRequest, NextApiResponse } from 'next';
import { conversationStore } from '@/lib/assistant/conversation-store';

const config = {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'kashi_taxi_webhook_verify',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // GET /api/assistant/whatsapp-webhook - Verification
    if (req.method === 'GET') {
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === config.verifyToken) {
            return res.status(200).send(challenge);
        }
        return res.status(403).send('Forbidden');
    }

    // POST /api/assistant/whatsapp-webhook - Incoming messages
    if (req.method === 'POST') {
        try {
            const payload = req.body;
            if (payload.object !== 'whatsapp_business_account') {
                return res.status(400).send('Not a WhatsApp webhook');
            }

            for (const entry of payload.entry) {
                for (const change of entry.changes) {
                    const value = change.value;
                    if (value.messages) {
                        for (const message of value.messages) {
                            await processIncomingMessage(message, value.contacts?.[0]);
                        }
                    }
                    if (value.statuses) {
                        for (const status of value.statuses) {
                            await processStatusUpdate(status);
                        }
                    }
                }
            }
            return res.status(200).send('OK');
        } catch (error) {
            console.error('Webhook error:', error);
            return res.status(200).send('OK'); // Always 200 to Meta
        }
    }

    return res.status(405).send('Method not allowed');
}

async function processIncomingMessage(message: any, contact?: any) {
    const customerPhone = message.from;
    const customerName = contact?.profile?.name || 'Customer';
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    let content = '';
    if (message.type === 'text') content = message.text?.body || '';
    else content = `[${message.type} message]`;

    await conversationStore.addMessage({
        conversationId: customerPhone,
        messageId: message.id,
        role: 'customer',
        content,
        timestamp,
        customerName,
        customerPhone,
        status: 'received',
    });
}

async function processStatusUpdate(status: any) {
    await conversationStore.updateMessageStatus(
        status.id,
        status.status,
        new Date(parseInt(status.timestamp) * 1000)
    );
}

export async function sendWhatsAppMessage(to: string, text: string, conversationId?: string) {
    // If not configured, just log and simulate success for the demo
    if (!config.phoneNumberId || config.phoneNumberId === 'your_phone_number_id') {
        process.env.NODE_ENV === 'development' && console.log(`[DEMO] Sending WhatsApp to ${to}: ${text}`);

        await conversationStore.addMessage({
            conversationId: conversationId || to,
            messageId: `demo_${Date.now()}`,
            role: 'agent',
            content: text,
            timestamp: new Date(),
            status: 'sent',
        });

        return { success: true, messageId: `demo_${Date.now()}` };
    }

    try {
        const response = await fetch(
            `${config.apiUrl}/${config.phoneNumberId}/messages`,
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messaging_product: 'whatsapp',
                    recipient_type: 'individual',
                    to: to,
                    type: 'text',
                    text: { body: text },
                }),
            }
        );

        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message || 'Failed to send message');

        const messageId = data.messages?.[0]?.id;

        await conversationStore.addMessage({
            conversationId: conversationId || to,
            messageId: messageId || `agent_${Date.now()}`,
            role: 'agent',
            content: text,
            timestamp: new Date(),
            status: 'sent',
        });

        return { success: true, messageId };
    } catch (error) {
        console.error('Send error:', error);
        return { success: false, error: String(error) };
    }
}
