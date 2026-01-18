/**
 * GetResponseButton Component
 * 
 * Main trigger for AI-assisted response generation.
 * Agent clicks this to get AI suggestion for the current conversation.
 */

import React, { useState } from 'react';

interface GetResponseButtonProps {
    conversationId: string;
    messages: Array<{
        role: 'customer' | 'agent';
        content: string;
        timestamp: string;
    }>;
    onSuggestionReceived: (suggestion: SuggestionResult) => void;
    disabled?: boolean;
}

interface SuggestionResult {
    content: string;
    customerProfile: any;
    topics: string[];
    metadata: {
        llmUsed: string;
        tokensUsed: number;
        cached: boolean;
    };
}

export function GetResponseButton({
    conversationId,
    messages,
    onSuggestionReceived,
    disabled = false,
}: GetResponseButtonProps) {
    const [loading, setLoading] = useState(false);
    const [selectedLLM, setSelectedLLM] = useState<'gemini' | 'gpt' | 'auto'>('auto');
    const [error, setError] = useState<string | null>(null);

    const handleGetResponse = async () => {
        if (messages.length === 0) {
            setError('No messages to respond to');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/assistant/generate-response', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    conversationId,
                    messages,
                    preferredLLM: selectedLLM === 'auto' ? undefined : selectedLLM,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to generate response');
            }

            const data = await response.json();

            if (data.success) {
                onSuggestionReceived({
                    content: data.suggestion,
                    customerProfile: data.customerProfile,
                    topics: data.topics,
                    metadata: data.metadata,
                });
            } else {
                throw new Error(data.error || 'Unknown error');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="get-response-container">
            {/* LLM Selector */}
            <div className="llm-selector">
                <label className="llm-label">AI Model:</label>
                <select
                    value={selectedLLM}
                    onChange={(e) => setSelectedLLM(e.target.value as any)}
                    disabled={loading || disabled}
                    className="llm-select"
                >
                    <option value="auto">Auto (Recommended)</option>
                    <option value="gemini">Gemini 3 Flash (Fast)</option>
                    <option value="gpt">GPT 5.2 (Premium)</option>
                </select>
            </div>

            {/* Main Button */}
            <button
                onClick={handleGetResponse}
                disabled={loading || disabled || messages.length === 0}
                className={`get-response-btn ${loading ? 'loading' : ''}`}
            >
                {loading ? (
                    <>
                        <span className="spinner"></span>
                        Generating...
                    </>
                ) : (
                    <>
                        <span className="icon">✨</span>
                        Get AI Response
                    </>
                )}
            </button>

            {/* Error Display */}
            {error && (
                <div className="error-message">
                    ⚠️ {error}
                </div>
            )}

            <style jsx>{`
        .get-response-container {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .llm-selector {
          display: none; /* Hidden by default, show on hover */
        }

        .get-response-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 14px;
          background: linear-gradient(135deg, #00a884 0%, #075E54 100%);
          color: white;
          border: none;
          border-radius: 20px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
        }

        .get-response-btn:hover:not(:disabled) {
          background: linear-gradient(135deg, #075E54 0%, #054640 100%);
          box-shadow: 0 2px 8px rgba(0, 168, 132, 0.3);
        }

        .get-response-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .get-response-btn.loading {
          background: #667781;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid transparent;
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .icon {
          font-size: 14px;
        }

        .error-message {
          padding: 6px 10px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 4px;
          font-size: 11px;
        }
      `}</style>
        </div>
    );
}

export default GetResponseButton;
