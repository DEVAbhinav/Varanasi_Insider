/**
 * WhatsApp Business API Webhook Handler
 * 
 * Receives incoming messages from WhatsApp Cloud API,
 * stores conversations, and triggers agent notifications.
 */

import { ConversationStore } from './conversation-store';

// Types matching WhatsApp Cloud API webhook payload
interface WebhookPayload {
    object: string;
    entry: Array<{
        id: string;
        changes: Array<{
            value: {
                messaging_product: string;
                metadata: {
                    display_phone_number: string;
                    phone_number_id: string;
                };
                contacts?: Array<{
                    profile: { name: string };
                    wa_id: string;
                }>;
                messages?: Array<WhatsAppMessage>;
                statuses?: Array<MessageStatus>;
            };
            field: string;
        }>;
    }>;
}

interface WhatsAppMessage {
    from: string;
    id: string;
    timestamp: string;
    type: 'text' | 'image' | 'audio' | 'document' | 'location' | 'interactive';
    text?: { body: string };
    image?: { id: string; caption?: string };
    audio?: { id: string };
    location?: { latitude: number; longitude: number; name?: string };
    interactive?: { type: string; button_reply?: { id: string; title: string } };
}

interface MessageStatus {
    id: string;
    status: 'sent' | 'delivered' | 'read' | 'failed';
    timestamp: string;
    recipient_id: string;
}

// Environment config
const config = {
    verifyToken: process.env.WHATSAPP_VERIFY_TOKEN || 'kashi_taxi_webhook_verify',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID!,
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN!,
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com/v18.0',
};

// Initialize conversation store
const conversationStore = new ConversationStore();

/**
 * GET /api/webhook - Webhook verification (required by Meta)
 */
export function handleWebhookVerification(req: Request): Response {
    const url = new URL(req.url);
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === config.verifyToken) {
        console.log('Webhook verified successfully');
        return new Response(challenge, { status: 200 });
    }

    return new Response('Forbidden', { status: 403 });
}

/**
 * POST /api/webhook - Receive incoming messages
 */
export async function handleIncomingMessage(req: Request): Promise<Response> {
    try {
        const payload: WebhookPayload = await req.json();

        // Validate it's a WhatsApp message webhook
        if (payload.object !== 'whatsapp_business_account') {
            return new Response('Not a WhatsApp webhook', { status: 400 });
        }

        // Process each entry
        for (const entry of payload.entry) {
            for (const change of entry.changes) {
                const value = change.value;

                // Handle incoming messages
                if (value.messages) {
                    for (const message of value.messages) {
                        await processIncomingMessage(message, value.contacts?.[0]);
                    }
                }

                // Handle message status updates (delivered, read, etc.)
                if (value.statuses) {
                    for (const status of value.statuses) {
                        await processStatusUpdate(status);
                    }
                }
            }
        }

        // Always return 200 quickly (WhatsApp requires fast response)
        return new Response('OK', { status: 200 });

    } catch (error) {
        console.error('Webhook processing error:', error);
        // Still return 200 to prevent WhatsApp from retrying
        return new Response('OK', { status: 200 });
    }
}

/**
 * Process an incoming customer message
 */
async function processIncomingMessage(
    message: WhatsAppMessage,
    contact?: { profile: { name: string }; wa_id: string }
) {
    const customerPhone = message.from;
    const customerName = contact?.profile.name || 'Customer';
    const messageId = message.id;
    const timestamp = new Date(parseInt(message.timestamp) * 1000);

    // Extract message content based on type
    let content = '';
    let attachments: any[] = [];

    switch (message.type) {
        case 'text':
            content = message.text?.body || '';
            break;
        case 'image':
            content = message.image?.caption || '[Image sent]';
            attachments.push({ type: 'image', mediaId: message.image?.id });
            break;
        case 'audio':
            content = '[Voice message]';
            attachments.push({ type: 'audio', mediaId: message.audio?.id });
            break;
        case 'location':
            content = `[Location: ${message.location?.name || 'Shared location'}]`;
            break;
        case 'interactive':
            content = message.interactive?.button_reply?.title || '[Button clicked]';
            break;
        default:
            content = `[${message.type} message]`;
    }

    // Store in conversation
    await conversationStore.addMessage({
        conversationId: customerPhone,
        messageId,
        role: 'customer',
        content,
        timestamp,
        customerName,
        customerPhone,
        attachments,
        status: 'received',
    });

    // Emit event for dashboard notification (implement based on your setup)
    emitNewMessageEvent(customerPhone, customerName, content);

    console.log(`[${customerPhone}] ${customerName}: ${content}`);
}

/**
 * Process message status update (delivered, read, etc.)
 */
async function processStatusUpdate(status: MessageStatus) {
    await conversationStore.updateMessageStatus(
        status.id,
        status.status,
        new Date(parseInt(status.timestamp) * 1000)
    );
}

/**
 * Send a message to customer via WhatsApp Cloud API
 */
export async function sendWhatsAppMessage(
    to: string,
    text: string,
    conversationId?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
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

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to send message');
        }

        const messageId = data.messages?.[0]?.id;

        // Store agent's outgoing message in conversation
        if (conversationId || to) {
            await conversationStore.addMessage({
                conversationId: conversationId || to,
                messageId: messageId || `agent_${Date.now()}`,
                role: 'agent',
                content: text,
                timestamp: new Date(),
                status: 'sent',
            });
        }

        return { success: true, messageId };

    } catch (error) {
        console.error('Send message error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

/**
 * Get conversation history for AI context
 */
export async function getConversationForAI(customerPhone: string) {
    const conversation = await conversationStore.getConversation(customerPhone);

    if (!conversation) {
        return { messages: [], customerName: null };
    }

    // Format for AI consumption
    const messages = conversation.messages.map(msg => ({
        role: msg.role as 'customer' | 'agent',
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
    }));

    return {
        messages,
        customerName: conversation.customerName,
        customerPhone: conversation.customerPhone,
        firstContact: conversation.createdAt,
        messageCount: messages.length,
    };
}

/**
 * Emit event for real-time dashboard updates
 * (Implement based on your WebSocket/SSE setup)
 */
function emitNewMessageEvent(
    customerPhone: string,
    customerName: string,
    preview: string
) {
    // This would connect to your real-time system
    // Examples: WebSocket, Server-Sent Events, Pusher, Socket.io
    console.log(`[NEW MESSAGE EVENT] ${customerPhone} - ${preview.substring(0, 50)}`);

    // TODO: Implement based on your dashboard architecture
    // globalEventEmitter.emit('new_message', { customerPhone, customerName, preview });
}

// Export handlers for routing
export default {
    verify: handleWebhookVerification,
    receive: handleIncomingMessage,
    send: sendWhatsAppMessage,
    getConversation: getConversationForAI,
};
