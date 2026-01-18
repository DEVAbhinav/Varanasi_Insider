import { NextApiRequest, NextApiResponse } from 'next';
import { conversationStore } from '@/lib/assistant/conversation-store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        const { id, filter } = req.query;

        if (id) {
            // Get single conversation
            const conversation = await conversationStore.getConversation(id as string);
            if (!conversation) {
                return res.status(404).json({ error: 'Conversation not found' });
            }
            return res.status(200).json({
                id: conversation.id,
                customerPhone: conversation.customerPhone,
                customerName: conversation.customerName,
                messages: conversation.messages.map(m => ({
                    id: m.messageId,
                    role: m.role,
                    content: m.content,
                    timestamp: m.timestamp.toISOString(),
                    status: m.status,
                })),
                status: conversation.status,
            });
        } else {
            // List conversations
            let conversations;
            if (filter === 'unread') {
                conversations = await conversationStore.getUnreadConversations();
            } else {
                conversations = await conversationStore.getActiveConversations();
            }

            const formatted = conversations.map(conv => ({
                id: conv.id,
                customerPhone: conv.customerPhone,
                customerName: conv.customerName,
                lastMessage: conv.messages[conv.messages.length - 1]?.content || '',
                lastMessageTime: conv.updatedAt.toISOString(),
                unreadCount: conv.messages.filter(m => m.role === 'customer' && m.status === 'received').length,
                status: conv.status,
            }));

            const stats = await conversationStore.getStats();
            return res.status(200).json({ conversations: formatted, stats });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
