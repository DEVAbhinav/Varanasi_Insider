/**
 * QuickResponses Component
 * 
 * Grid of pre-built response templates for common scenarios.
 * Agent can quickly select and customize.
 */

import React, { useState, useMemo } from 'react';
import quickResponsesData from '../../data/quick_responses.json';

interface QuickResponse {
    id: string;
    label: string;
    template: string;
    use_when: string;
}

interface QuickResponsesProps {
    onSelect: (template: string) => void;
}

type Category = keyof typeof quickResponsesData;

const categoryMeta: Record<string, { icon: string; label: string }> = {
    greetings: { icon: '👋', label: 'Greetings' },
    availability: { icon: '📅', label: 'Availability' },
    pricing: { icon: '💰', label: 'Pricing' },
    trust_building: { icon: '🤝', label: 'Trust' },
    handoffs: { icon: '📞', label: 'Handoffs' },
    delays: { icon: '⏳', label: 'Delays' },
    closers: { icon: '✅', label: 'Closers' },
    objection_handlers: { icon: '💬', label: 'Objections' },
    specialized: { icon: '⭐', label: 'Special' },
};

export function QuickResponses({ onSelect }: QuickResponsesProps) {
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const categories = useMemo(() => {
        return Object.keys(quickResponsesData).filter(
            (key) => key !== '_metadata'
        ) as Category[];
    }, []);

    const filteredResponses = useMemo(() => {
        if (!activeCategory) return [];

        const responses = (quickResponsesData as any)[activeCategory] as QuickResponse[];
        if (!searchQuery) return responses;

        const query = searchQuery.toLowerCase();
        return responses.filter(
            (r) =>
                r.label.toLowerCase().includes(query) ||
                r.template.toLowerCase().includes(query)
        );
    }, [activeCategory, searchQuery]);

    return (
        <div className="quick-responses">
            <h4 className="title">⚡ Quick Responses</h4>

            {/* Search */}
            <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search"
            />

            {/* Category Tabs */}
            <div className="categories">
                {categories.map((cat) => {
                    const meta = categoryMeta[cat] || { icon: '📝', label: cat };
                    return (
                        <button
                            key={cat}
                            className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                            onClick={() =>
                                setActiveCategory(activeCategory === cat ? null : cat)
                            }
                        >
                            <span>{meta.icon}</span>
                            <span>{meta.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* Response List */}
            {activeCategory && (
                <div className="response-list">
                    {filteredResponses.map((resp) => (
                        <div
                            key={resp.id}
                            className="response-item"
                            onClick={() => onSelect(resp.template)}
                        >
                            <div className="resp-header">
                                <span className="resp-label">{resp.label}</span>
                                <span className="use-btn">Use →</span>
                            </div>
                            <p className="resp-preview">{resp.template}</p>
                            <span className="resp-hint">{resp.use_when}</span>
                        </div>
                    ))}
                    {filteredResponses.length === 0 && (
                        <p className="no-results">No templates match your search</p>
                    )}
                </div>
            )}

            <style jsx>{`
        .quick-responses {
          background: #f1f5f9;
          border-radius: 8px;
          padding: 12px;
        }

        .title {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: #334155;
        }

        .search {
          width: 100%;
          padding: 8px 12px;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          font-size: 13px;
          margin-bottom: 12px;
        }

        .search:focus {
          outline: none;
          border-color: #25d366;
        }

        .categories {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
          margin-bottom: 12px;
        }

        .cat-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
          font-size: 11px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .cat-btn:hover {
          background: #f8fafc;
        }

        .cat-btn.active {
          background: #25d366;
          color: white;
          border-color: #25d366;
        }

        .response-list {
          max-height: 300px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .response-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.15s;
        }

        .response-item:hover {
          border-color: #25d366;
          box-shadow: 0 2px 8px rgba(37, 211, 102, 0.1);
        }

        .resp-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .resp-label {
          font-weight: 600;
          font-size: 12px;
          color: #334155;
        }

        .use-btn {
          font-size: 11px;
          color: #25d366;
          opacity: 0;
          transition: opacity 0.15s;
        }

        .response-item:hover .use-btn {
          opacity: 1;
        }

        .resp-preview {
          margin: 0 0 6px 0;
          font-size: 12px;
          color: #64748b;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .resp-hint {
          font-size: 10px;
          color: #94a3b8;
          font-style: italic;
        }

        .no-results {
          text-align: center;
          color: #94a3b8;
          font-size: 12px;
          padding: 16px;
        }
      `}</style>
        </div>
    );
}

export default QuickResponses;
