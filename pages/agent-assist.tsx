import React, { useState } from 'react';
import Head from 'next/head';
import { ChatPanel } from '@/components/assistant/ChatPanel';

export default function AgentAssistPage() {
    const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
    const [conversations, setConversations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    React.useEffect(() => {
        fetch('/api/assistant/conversations')
            .then(res => res.json())
            .then(data => {
                setConversations(data.conversations || []);
                if (data.conversations?.length > 0) {
                    setSelectedConvId(data.conversations[0].id);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch conversations:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="admin-container">
            <Head>
                <title>Agent Assist | Varanasi Insider</title>
            </Head>

            <div className="dashboard-layout">
                {/* Sidebar for conversation list */}
                <aside className="conv-sidebar">
                    <div className="sidebar-header">
                        <h2>Chats</h2>
                        <div className="status-badge">Online</div>
                    </div>

                    <div className="conv-list">
                        {loading ? (
                            <div className="p-4 text-center">Loading chats...</div>
                        ) : conversations.length === 0 ? (
                            <div className="p-4 text-center text-gray-500">No active chats</div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`conv-item ${selectedConvId === conv.id ? 'active' : ''}`}
                                    onClick={() => setSelectedConvId(conv.id)}
                                >
                                    <div className="avatar">{conv.customerName.charAt(0)}</div>
                                    <div className="info">
                                        <div className="name">{conv.customerName}</div>
                                        <div className="last-msg">{conv.lastMessage}</div>
                                    </div>
                                    {conv.unreadCount > 0 && <div className="unread">{conv.unreadCount}</div>}
                                </div>
                            ))
                        )}
                    </div>
                </aside>

                {/* Chat Panel */}
                <main className="chat-main">
                    {selectedConvId ? (
                        <ChatPanel conversationId={selectedConvId} />
                    ) : (
                        <div className="empty-state">
                            <div className="icon">💬</div>
                            <h3>Select a conversation to start</h3>
                            <p>AI suggestions will appear here once a message is selected.</p>
                        </div>
                    )}
                </main>
            </div>

            <style jsx>{`
        .admin-container {
          height: 100vh;
          overflow: hidden;
          background: #f0f2f5;
        }

        .dashboard-layout {
          display: flex;
          height: 100%;
        }

        .conv-sidebar {
          width: 350px;
          background: white;
          border-right: 1px solid #e9edef;
          display: flex;
          flex-direction: column;
        }

        .sidebar-header {
          padding: 20px;
          border-bottom: 1px solid #e9edef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-header h2 {
          margin: 0;
          font-size: 20px;
        }

        .status-badge {
          font-size: 12px;
          background: #d9fdd3;
          color: #128c7e;
          padding: 2px 8px;
          border-radius: 10px;
          font-weight: 500;
        }

        .conv-list {
          flex: 1;
          overflow-y: auto;
        }

        .conv-item {
          display: flex;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          transition: background 0.2s;
          border-bottom: 1px solid #f5f6f6;
          gap: 12px;
        }

        .conv-item:hover {
          background: #f5f6f6;
        }

        .conv-item.active {
          background: #f0f2f5;
        }

        .avatar {
          width: 45px;
          height: 45px;
          background: #00a884;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .info {
          flex: 1;
          overflow: hidden;
        }

        .name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .last-msg {
          font-size: 13px;
          color: #667781;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .unread {
          background: #25d366;
          color: white;
          font-size: 12px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .chat-main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .empty-state {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #667781;
          text-align: center;
          padding: 40px;
        }

        .empty-state .icon {
          font-size: 64px;
          margin-bottom: 20px;
        }

        .empty-state h3 {
          margin: 0 0 10px;
          color: #41525d;
        }
      `}</style>
        </div>
    );
}
