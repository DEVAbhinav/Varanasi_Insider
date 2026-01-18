/**
 * ChatPanel Component - WhatsApp Clone UI
 * 
 * Pixel-accurate WhatsApp Web styling for agent dashboard.
 */

import React, { useState, useEffect, useRef } from 'react';
import { GetResponseButton } from '@/components/assistant/GetResponseButton';
import { SuggestedReply } from '@/components/assistant/SuggestedReply';
import { CustomerInsights } from '@/components/assistant/CustomerInsights';
import { QuickResponses } from '@/components/assistant/QuickResponses';

interface Message {
  id: string;
  role: 'customer' | 'agent';
  content: string;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  customerPhone: string;
  customerName: string;
  messages: Message[];
}

interface ChatPanelProps {
  conversationId: string;
}

export function ChatPanel({ conversationId }: ChatPanelProps) {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [manualReply, setManualReply] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversation();
    const interval = setInterval(fetchConversation, 3000);
    return () => clearInterval(interval);
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  const fetchConversation = async () => {
    try {
      const res = await fetch(`/api/assistant/conversations?id=${conversationId}`);
      const data = await res.json();
      setConversation(data);
    } catch (err) {
      console.error('Failed to fetch conversation:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch('/api/assistant/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId,
          to: conversation?.customerPhone,
          text: text.trim(),
        }),
      });

      if (res.ok) {
        setSuggestion(null);
        setManualReply('');
        fetchConversation();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  if (loading) {
    return (
      <div className="wa-loading">
        <div className="wa-spinner"></div>
        <p>Loading chat...</p>
      </div>
    );
  }

  if (!conversation) {
    return <div className="wa-error">Conversation not found</div>;
  }

  return (
    <div className="wa-container">
      {/* WhatsApp Header */}
      <header className="wa-header">
        <div className="wa-header-left">
          <div className="wa-avatar">
            {conversation.customerName.charAt(0).toUpperCase()}
          </div>
          <div className="wa-contact-info">
            <div className="wa-contact-name">{conversation.customerName}</div>
            <div className="wa-contact-status">
              {conversation.customerPhone}
            </div>
          </div>
        </div>
        <div className="wa-header-actions">
          <button className="wa-icon-btn" title="Search">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z" />
            </svg>
          </button>
          <button className="wa-icon-btn" title="Menu">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="wa-main">
        {/* Chat Area */}
        <div className="wa-chat-area">
          {/* Messages */}
          <div className="wa-messages">
            {conversation.messages.map((msg) => (
              <div key={msg.id} className={`wa-message ${msg.role}`}>
                <div className="wa-bubble">
                  <span className="wa-text">{msg.content}</span>
                  <span className="wa-meta">
                    <span className="wa-time">{formatTime(msg.timestamp)}</span>
                    {msg.role === 'agent' && (
                      <span className={`wa-status ${msg.status || 'sent'}`}>
                        {msg.status === 'read' ? (
                          <svg viewBox="0 0 16 11" width="16" height="11">
                            <path fill="#53bdeb" d="M11.07.29l-6.25 6.2-2.62-2.6L1 5.09l3.82 3.82L12.27 1.5z" />
                            <path fill="#53bdeb" d="M6.07.29L5 1.29l4.25 4.2 1-1z" />
                          </svg>
                        ) : msg.status === 'delivered' ? (
                          <svg viewBox="0 0 16 11" width="16" height="11">
                            <path fill="#8696a0" d="M11.07.29l-6.25 6.2-2.62-2.6L1 5.09l3.82 3.82L12.27 1.5z" />
                            <path fill="#8696a0" d="M6.07.29L5 1.29l4.25 4.2 1-1z" />
                          </svg>
                        ) : (
                          <svg viewBox="0 0 12 11" width="12" height="11">
                            <path fill="#8696a0" d="M11.15.29l-7.39 7.34-2.63-2.61L0 6.15l3.76 3.76L12.27 1.4z" />
                          </svg>
                        )}
                      </span>
                    )}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* AI Suggestion */}
          {suggestion && (
            <div className="wa-suggestion-wrapper">
              <SuggestedReply
                suggestion={suggestion.content}
                metadata={suggestion.metadata}
                onSend={(text) => handleSendMessage(text)}
                onRegenerate={() => { }}
                onDiscard={() => setSuggestion(null)}
              />
            </div>
          )}

          {/* Input Area */}
          <div className="wa-input-area">
            <button className="wa-icon-btn emoji">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M9.153 11.603c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zm5.694 0c.795 0 1.439-.879 1.439-1.962s-.644-1.962-1.439-1.962-1.439.879-1.439 1.962.644 1.962 1.439 1.962zM12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm0-3.5c-1.93 0-3.5-1.57-3.5-3.5h7c0 1.93-1.57 3.5-3.5 3.5z" />
              </svg>
            </button>
            <button className="wa-icon-btn attach">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 003.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.501.501 1.134.756 1.727.756.694 0 1.266-.298 1.533-.564l5.468-5.469-1.414-1.414-5.467 5.467c-.186.187-.556.126-.943-.261-.385-.386-.447-.757-.262-.942l7.916-7.916c.559-.558 1.831-.469 2.698.398.442.441.725.915.766 1.378.045.509-.196.985-.576 1.365l-9.548 9.549c-.756.757-1.761 1.171-2.829 1.171s-2.073-.414-2.829-1.171-1.174-1.763-1.174-2.828c0-1.071.415-2.076 1.173-2.828l9.549-9.549 1.414-1.414-9.548 9.547A5.573 5.573 0 001.816 15.556z" />
              </svg>
            </button>
            <div className="wa-input-wrapper">
              <textarea
                value={manualReply}
                onChange={(e) => setManualReply(e.target.value)}
                placeholder="Type a message"
                rows={1}
                className="wa-input"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(manualReply);
                  }
                }}
              />
            </div>
            <GetResponseButton
              conversationId={conversationId}
              messages={conversation.messages}
              onSuggestionReceived={setSuggestion}
            />
            <button
              className="wa-send-btn"
              onClick={() => handleSendMessage(manualReply)}
              disabled={!manualReply.trim() || sending}
            >
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M1.101 21.757L23.8 12.028 1.101 2.3l.011 7.912 13.623 1.816-13.623 1.817-.011 7.912z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="wa-sidebar">
          <CustomerInsights
            profile={suggestion?.customerProfile}
            topics={suggestion?.topics || []}
          />
          <QuickResponses onSelect={setManualReply} />
        </div>
      </div>

      <style jsx>{`
        /* WhatsApp Colors */
        :root {
          --wa-teal-dark: #075E54;
          --wa-teal-light: #128C7E;
          --wa-green: #25D366;
          --wa-blue: #34B7F1;
          --wa-blue-check: #53bdeb;
          --wa-bg: #efeae2;
          --wa-bg-pattern: #d1d7db;
          --wa-incoming: #ffffff;
          --wa-outgoing: #d9fdd3;
          --wa-text: #111b21;
          --wa-text-secondary: #667781;
          --wa-border: #e9edef;
          --wa-input-bg: #f0f2f5;
        }

        .wa-container {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--wa-bg);
          font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
        }

        /* Header */
        .wa-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 16px;
          background: #075E54; /* Direct hex for reliability */
          color: #ffffff;
          min-height: 59px;
          z-index: 10;
        }

        .wa-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .wa-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #00a884;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 500;
          color: white;
        }

        .wa-contact-name {
          font-size: 16px;
          font-weight: 500;
        }

        .wa-contact-status {
          font-size: 13px;
          color: rgba(255,255,255,0.8);
        }

        .wa-header-actions {
          display: flex;
          gap: 8px;
        }

        .wa-icon-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #aebac1;
          transition: background 0.2s;
        }

        .wa-icon-btn:hover {
          background: rgba(255,255,255,0.1);
        }

        /* Main Area */
        .wa-main {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .wa-chat-area {
          flex: 1;
          display: flex;
          flex-direction: column;
          background-image: url("/images/whatsapp_bg.png");
          background-repeat: repeat;
          background-size: 400px;
          background-color: var(--wa-bg);
          position: relative;
        }

        .wa-chat-area::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(239, 234, 226, 0.4); /* Slight beige overlay to make it subtler */
          pointer-events: none;
        }

        /* Messages */
        .wa-messages {
          flex: 1;
          overflow-y: auto;
          padding: 20px 60px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .wa-message {
          display: flex;
          margin-bottom: 2px;
        }

        .wa-message.customer {
          justify-content: flex-start;
        }

        .wa-message.agent {
          justify-content: flex-end;
        }

        .wa-bubble {
          max-width: 65%;
          padding: 6px 7px 8px 9px;
          border-radius: 7.5px;
          position: relative;
          box-shadow: 0 1px 0.5px rgba(0,0,0,0.13);
        }

        .wa-message.customer .wa-bubble {
          background: var(--wa-incoming);
          border-top-left-radius: 0;
        }

        .wa-message.agent .wa-bubble {
          background: var(--wa-outgoing);
          border-top-right-radius: 0;
        }

        /* Bubble tail */
        .wa-message.customer .wa-bubble::before {
          content: '';
          position: absolute;
          top: 0;
          left: -8px;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 13px solid transparent;
          border-right: 8px solid var(--wa-incoming);
        }

        .wa-message.agent .wa-bubble::before {
          content: '';
          position: absolute;
          top: 0;
          right: -8px;
          width: 0;
          height: 0;
          border-top: 0 solid transparent;
          border-bottom: 13px solid transparent;
          border-left: 8px solid var(--wa-outgoing);
        }

        .wa-text {
          font-size: 14.2px;
          line-height: 19px;
          color: var(--wa-text);
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .wa-meta {
          float: right;
          margin: 3px 0 0 12px;
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .wa-time {
          font-size: 11px;
          color: var(--wa-text-secondary);
        }

        .wa-status {
          margin-left: 2px;
        }

        /* Input Area */
        .wa-input-area {
          display: flex;
          align-items: flex-end;
          padding: 10px 16px;
          background: var(--wa-input-bg);
          gap: 8px;
        }

        .wa-input-wrapper {
          flex: 1;
          background: white;
          border-radius: 8px;
          padding: 9px 12px;
        }

        .wa-input {
          width: 100%;
          border: none;
          outline: none;
          font-size: 15px;
          line-height: 20px;
          resize: none;
          font-family: inherit;
          background: transparent;
        }

        .wa-input::placeholder {
          color: var(--wa-text-secondary);
        }

        .wa-input-area .wa-icon-btn {
          color: #54656f;
        }

        .wa-send-btn {
          width: 40px;
          height: 40px;
          border: none;
          background: var(--wa-teal-light);
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          transition: background 0.2s;
        }

        .wa-send-btn:hover {
          background: var(--wa-teal-dark);
        }

        .wa-send-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Suggestion wrapper */
        .wa-suggestion-wrapper {
          padding: 0 60px 10px;
        }

        /* Sidebar */
        .wa-sidebar {
          width: 340px;
          background: white;
          border-left: 1px solid var(--wa-border);
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        /* Loading */
        .wa-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100vh;
          background: var(--wa-bg);
          color: var(--wa-text-secondary);
        }

        .wa-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--wa-border);
          border-top-color: var(--wa-teal-light);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 16px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .wa-error {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
          color: var(--wa-text-secondary);
        }

        @media (max-width: 1024px) {
          .wa-sidebar {
            display: none;
          }
          .wa-messages {
            padding: 16px 16px;
          }
        }
      `}</style>
    </div>
  );
}

export default ChatPanel;
