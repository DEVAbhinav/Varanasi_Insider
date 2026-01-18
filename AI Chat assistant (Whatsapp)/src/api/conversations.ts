/**
 * Conversations API - Dashboard endpoints
 * 
 * Get conversation list and individual conversations for the agent dashboard.
 */

import { conversationStore } from '../services/conversation-store';
import { sendWhatsAppMessage } from './whatsapp-webhook';

/**
 * GET /api/conversations
 * List all active conversations for dashboard
 */
export async function handleGetConversations(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const filter = url.searchParams.get('filter'); // 'active' | 'unread' | 'all'

    let conversations;

    switch (filter) {
        case 'unread':
            conversations = await conversationStore.getUnreadConversations();
            break;
        case 'active':
        default:
            conversations = await conversationStore.getActiveConversations();
            break;
    }

    // Format for dashboard display
    const formatted = conversations.map(conv => ({
        id: conv.id,
        customerPhone: conv.customerPhone,
        customerName: conv.customerName,
        lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
        lastMessageTime: conv.updatedAt.toISOString(),
        unreadCount: conv.messages.filter(
            m => m.role === 'customer' && m.status === 'received'
        ).length,
        status: conv.status,
        assignedAgent: conv.assignedAgent,
    }));

    return Response.json({
        conversations: formatted,
        stats: await conversationStore.getStats(),
    });
}

/**
 * GET /api/conversations/:id
 * Get single conversation with full message history
 */
export async function handleGetConversation(
    req: Request,
    conversationId: string
): Promise<Response> {
    const conversation = await conversationStore.getConversation(conversationId);

    if (!conversation) {
        return Response.json({ error: 'Conversation not found' }, { status: 404 });
    }

    return Response.json({
        id: conversation.id,
        customerPhone: conversation.customerPhone,
        customerName: conversation.customerName,
        messages: conversation.messages.map(m => ({
            id: m.messageId,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp.toISOString(),
            status: m.status,
            attachments: m.attachments,
        })),
        createdAt: conversation.createdAt.toISOString(),
        updatedAt: conversation.updatedAt.toISOString(),
        status: conversation.status,
        tags: conversation.tags,
    });
}

/**
 * POST /api/send-message
 * Send a message from agent to customer
 */
export async function handleSendMessage(req: Request): Promise<Response> {
    try {
        const body = await req.json();
        const { conversationId, to, text } = body;

        if (!to || !text) {
            return Response.json({ error: 'Missing to or text' }, { status: 400 });
        }

        const result = await sendWhatsAppMessage(to, text, conversationId);

        if (result.success) {
            return Response.json({
                success: true,
                messageId: result.messageId,
            });
        } else {
            return Response.json({
                success: false,
                error: result.error,
            }, { status: 500 });
        }

    } catch (error) {
        return Response.json({
            error: 'Failed to send message',
            details: String(error),
        }, { status: 500 });
    }
}

/**
 * POST /api/conversations/:id/resolve
 * Mark conversation as resolved
 */
export async function handleResolveConversation(
    req: Request,
    conversationId: string
): Promise<Response> {
    await conversationStore.resolveConversation(conversationId);
    return Response.json({ success: true });
}

/**
 * POST /api/conversations/:id/assign
 * Assign conversation to an agent
 */
export async function handleAssignConversation(
    req: Request,
    conversationId: string
): Promise<Response> {
    const body = await req.json();
    const { agentId } = body;

    if (!agentId) {
        return Response.json({ error: 'Missing agentId' }, { status: 400 });
    }

    await conversationStore.assignAgent(conversationId, agentId);
    return Response.json({ success: true });
}

/**
 * GET /api/stats
 * Get dashboard statistics
 */
export async function handleGetStats(): Promise<Response> {
    const stats = await conversationStore.getStats();
    return Response.json(stats);
}

export default {
    getConversations: handleGetConversations,
    getConversation: handleGetConversation,
    sendMessage: handleSendMessage,
    resolveConversation: handleResolveConversation,
    assignConversation: handleAssignConversation,
    getStats: handleGetStats,
};
