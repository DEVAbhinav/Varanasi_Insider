/**
 * SuggestedReply Component
 * 
 * Displays AI-generated response for agent review.
 * Allows edit, regenerate, refine, and send actions.
 */

import React, { useState, useEffect } from 'react';

interface SuggestedReplyProps {
  suggestion: string;
  metadata: {
    llmUsed: string;
    tokensUsed: number;
    cached: boolean;
  };
  onSend: (text: string) => void;
  onRegenerate: () => void;
  onDiscard: () => void;
}

type RefineOption = 'shorten' | 'formalize' | 'casual' | 'add_urgency' | 'remove_emoji' | 'hindi_touch' | 'focus_price' | 'focus_trust';

export function SuggestedReply({
  suggestion,
  metadata,
  onSend,
  onRegenerate,
  onDiscard,
}: SuggestedReplyProps) {
  const [editedText, setEditedText] = useState(suggestion);
  const [isEditing, setIsEditing] = useState(false);
  const [refining, setRefining] = useState(false);

  // Update edited text when new suggestion comes in
  useEffect(() => {
    setEditedText(suggestion);
    setIsEditing(false);
  }, [suggestion]);

  const handleRefine = async (option: RefineOption) => {
    setRefining(true);
    try {
      const response = await fetch('/api/assistant/refine-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originalResponse: editedText,
          instruction: option,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setEditedText(data.refined);
      }
    } catch (err) {
      console.error('Refine failed:', err);
    } finally {
      setRefining(false);
    }
  };

  const charCount = editedText.length;
  const wordCount = editedText.trim().split(/\s+/).length;

  return (
    <div className="suggested-reply">
      {/* Header */}
      <div className="header">
        <div className="title">
          <span className="icon">✨</span>
          AI Suggestion
        </div>
        <div className="meta">
          <span className="badge">{metadata.llmUsed}</span>
          {metadata.cached && <span className="badge cached">⚡ cached</span>}
        </div>
      </div>

      {/* Text Area */}
      <div className="content">
        {isEditing ? (
          <textarea
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="edit-area"
            rows={6}
            autoFocus
          />
        ) : (
          <div
            className="preview"
            onClick={() => setIsEditing(true)}
          >
            {editedText}
          </div>
        )}
      </div>

      {/* Character Counter */}
      <div className="counter">
        {charCount} chars · {wordCount} words
        {charCount > 500 && <span className="warning"> ⚠️ Long message</span>}
      </div>

      {/* Refine Options */}
      <div className="refine-row">
        <span className="refine-label">Quick edit:</span>
        <div className="refine-buttons">
          <button onClick={() => handleRefine('shorten')} disabled={refining}>
            ✂️ Shorter
          </button>
          <button onClick={() => handleRefine('hindi_touch')} disabled={refining}>
            🇮🇳 Add Hindi
          </button>
          <button onClick={() => handleRefine('focus_price')} disabled={refining}>
            💰 Focus Price
          </button>
          <button onClick={() => handleRefine('focus_trust')} disabled={refining}>
            🤝 Add Trust
          </button>
          <button onClick={() => handleRefine('casual')} disabled={refining}>
            😊 More Casual
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="actions">
        <button className="btn-discard" onClick={onDiscard}>
          ✕ Discard
        </button>
        <button className="btn-regenerate" onClick={onRegenerate}>
          ↻ Regenerate
        </button>
        <button
          className="btn-send"
          onClick={() => onSend(editedText)}
        >
          ✓ Use This Reply
        </button>
      </div>

      <style jsx>{`
        .suggested-reply {
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 16px;
          margin: 16px 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .title {
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #334155;
        }

        .icon {
          font-size: 20px;
        }

        .meta {
          display: flex;
          gap: 6px;
        }

        .badge {
          padding: 2px 8px;
          background: #e2e8f0;
          border-radius: 4px;
          font-size: 11px;
          color: #64748b;
        }

        .badge.cached {
          background: #dcfce7;
          color: #166534;
        }

        .content {
          margin-bottom: 8px;
        }

        .preview {
          padding: 12px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          white-space: pre-wrap;
          cursor: text;
          min-height: 100px;
          line-height: 1.6;
        }

        .preview:hover {
          border-color: #25d366;
        }

        .edit-area {
          width: 100%;
          padding: 12px;
          border: 2px solid #25d366;
          border-radius: 8px;
          font-size: 14px;
          line-height: 1.6;
          resize: vertical;
          font-family: inherit;
        }

        .counter {
          font-size: 12px;
          color: #94a3b8;
          text-align: right;
          margin-bottom: 12px;
        }

        .warning {
          color: #f59e0b;
        }

        .refine-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 16px;
          flex-wrap: wrap;
        }

        .refine-label {
          font-size: 12px;
          color: #64748b;
        }

        .refine-buttons {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }

        .refine-buttons button {
          padding: 4px 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .refine-buttons button:hover:not(:disabled) {
          background: #f1f5f9;
          border-color: #94a3b8;
        }

        .refine-buttons button:disabled {
          opacity: 0.5;
          cursor: wait;
        }

        .actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .actions button {
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s;
        }

        .btn-discard {
          background: white;
          border: 1px solid #e2e8f0;
          color: #64748b;
        }

        .btn-discard:hover {
          background: #fee2e2;
          border-color: #fca5a5;
          color: #dc2626;
        }

        .btn-regenerate {
          background: white;
          border: 1px solid #e2e8f0;
          color: #334155;
        }

        .btn-regenerate:hover {
          background: #f1f5f9;
        }

        .btn-send {
          background: linear-gradient(135deg, #25d366 0%, #128C7E 100%);
          border: none;
          color: white;
        }

        .btn-send:hover {
          box-shadow: 0 4px 12px rgba(37, 211, 102, 0.3);
        }
      `}</style>
    </div>
  );
}

export default SuggestedReply;
