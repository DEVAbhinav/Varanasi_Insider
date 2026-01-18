/**
 * Conversation Store
 * 
 * Persists and retrieves conversation history.
 * Currently uses in-memory storage with optional Redis/DB backend.
 */

export interface StoredMessage {
    conversationId: string;
    messageId: string;
    role: 'customer' | 'agent';
    content: string;
    timestamp: Date;
    customerName?: string;
    customerPhone?: string;
    attachments?: Array<{ type: string; mediaId?: string; url?: string }>;
    status: 'received' | 'sent' | 'delivered' | 'read' | 'failed';
}

export interface Conversation {
    id: string;
    customerPhone: string;
    customerName: string;
    messages: StoredMessage[];
    createdAt: Date;
    updatedAt: Date;
    status: 'active' | 'resolved' | 'pending';
    assignedAgent?: string;
    tags?: string[];
}

/**
 * In-memory conversation store
 * 
 * For production, replace with:
 * - Redis for fast access + TTL
 * - PostgreSQL/MongoDB for persistence
 */
export class ConversationStore {
    private conversations: Map<string, Conversation> = new Map();
    private messageIndex: Map<string, { convId: string; msgIndex: number }> = new Map();

    /**
     * Add a message to a conversation
     */
    async addMessage(message: StoredMessage): Promise<void> {
        const convId = message.conversationId;

        let conversation = this.conversations.get(convId);

        if (!conversation) {
            // Create new conversation
            conversation = {
                id: convId,
                customerPhone: message.customerPhone || convId,
                customerName: message.customerName || 'Customer',
                messages: [],
                createdAt: new Date(),
                updatedAt: new Date(),
                status: 'active',
            };
            this.conversations.set(convId, conversation);
        }

        // Update customer name if provided
        if (message.customerName && message.customerName !== 'Customer') {
            conversation.customerName = message.customerName;
        }

        // Add message
        conversation.messages.push(message);
        conversation.updatedAt = new Date();

        // Index message by ID for status updates
        this.messageIndex.set(message.messageId, {
            convId,
            msgIndex: conversation.messages.length - 1,
        });

        // Keep only last 100 messages per conversation (memory limit)
        if (conversation.messages.length > 100) {
            const removed = conversation.messages.shift();
            if (removed) {
                this.messageIndex.delete(removed.messageId);
            }
        }
    }

    /**
     * Update message status (sent → delivered → read)
     */
    async updateMessageStatus(
        messageId: string,
        status: StoredMessage['status'],
        timestamp: Date
    ): Promise<void> {
        const index = this.messageIndex.get(messageId);
        if (!index) return;

        const conversation = this.conversations.get(index.convId);
        if (!conversation) return;

        const message = conversation.messages[index.msgIndex];
        if (message) {
            message.status = status;
        }
    }

    /**
     * Get a conversation by ID (customer phone)
     */
    async getConversation(conversationId: string): Promise<Conversation | null> {
        return this.conversations.get(conversationId) || null;
    }

    /**
     * Get all active conversations (for dashboard)
     */
    async getActiveConversations(): Promise<Conversation[]> {
        const all = Array.from(this.conversations.values());
        return all
            .filter(c => c.status === 'active')
            .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
    }

    /**
     * Get recent conversations with unread messages
     */
    async getUnreadConversations(): Promise<Conversation[]> {
        const all = Array.from(this.conversations.values());
        return all.filter(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            return lastMsg?.role === 'customer' && lastMsg?.status === 'received';
        });
    }

    /**
     * Mark conversation as resolved
     */
    async resolveConversation(conversationId: string): Promise<void> {
        const conv = this.conversations.get(conversationId);
        if (conv) {
            conv.status = 'resolved';
        }
    }

    /**
     * Assign conversation to an agent
     */
    async assignAgent(conversationId: string, agentId: string): Promise<void> {
        const conv = this.conversations.get(conversationId);
        if (conv) {
            conv.assignedAgent = agentId;
        }
    }

    /**
     * Add tags to conversation (for categorization)
     */
    async addTags(conversationId: string, tags: string[]): Promise<void> {
        const conv = this.conversations.get(conversationId);
        if (conv) {
            conv.tags = [...(conv.tags || []), ...tags];
        }
    }

    /**
     * Get conversation stats
     */
    async getStats(): Promise<{
        total: number;
        active: number;
        unread: number;
        todayMessages: number;
    }> {
        const all = Array.from(this.conversations.values());
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todayMessages = all.reduce((count, conv) => {
            return count + conv.messages.filter(m => m.timestamp >= today).length;
        }, 0);

        return {
            total: all.length,
            active: all.filter(c => c.status === 'active').length,
            unread: (await this.getUnreadConversations()).length,
            todayMessages,
        };
    }

    /**
     * Export conversation for backup/analysis
     */
    async exportConversation(conversationId: string): Promise<string> {
        const conv = await this.getConversation(conversationId);
        if (!conv) return '';

        return conv.messages
            .map(m => `[${m.timestamp.toISOString()}] ${m.role.toUpperCase()}: ${m.content}`)
            .join('\n');
    }

    /**
     * Clear old conversations (cleanup)
     */
    async cleanupOldConversations(daysOld: number = 90): Promise<number> {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - daysOld);

        let removed = 0;
        for (const [id, conv] of this.conversations) {
            if (conv.updatedAt < cutoff) {
                this.conversations.delete(id);
                removed++;
            }
        }

        return removed;
    }
}

// Singleton instance for app-wide use
export const conversationStore = new ConversationStore();

export default ConversationStore;
