/**
 * CustomerInsights Component
 * 
 * Sidebar showing AI-detected customer profile and recommendations.
 * Helps agent understand customer psychology.
 */

import React from 'react';

interface CustomerProfile {
    group_type: string;
    group_size: number | null;
    has_elderly: boolean;
    has_children: boolean;
    traveler_origin: string | null;
    purpose: string;
    occasion: string | null;
    travel_dates: string | null;
    flexibility: string;
    budget_sensitivity: string;
    booking_stage: string;
    detected_fears: string[];
    detected_desires: string[];
    key_questions_unanswered: string[];
    emotional_state: string;
    recommended_approach: string;
}

interface CustomerInsightsProps {
    profile: CustomerProfile | null;
    topics: string[];
}

export function CustomerInsights({ profile, topics }: CustomerInsightsProps) {
    if (!profile) {
        return (
            <div className="insights-empty">
                <p>💡 Customer insights will appear after conversation starts</p>
            </div>
        );
    }

    const getEmotionEmoji = (state: string) => {
        const map: Record<string, string> = {
            excited: '😊',
            anxious: '😟',
            confused: '🤔',
            frustrated: '😤',
            neutral: '😐',
        };
        return map[state] || '😐';
    };

    const getStageColor = (stage: string) => {
        const map: Record<string, string> = {
            exploring: '#94a3b8',
            comparing: '#f59e0b',
            ready: '#22c55e',
            booked: '#3b82f6',
        };
        return map[stage] || '#94a3b8';
    };

    return (
        <div className="customer-insights">
            <h3 className="header">
                <span>🧠</span> Customer Insights
            </h3>

            {/* Profile Summary */}
            <div className="section">
                <div className="label">Profile</div>
                <div className="profile-grid">
                    <div className="item">
                        <span className="emoji">👥</span>
                        <span>{profile.group_type || 'Unknown'}</span>
                        {profile.group_size && <span className="detail">({profile.group_size} pax)</span>}
                    </div>
                    {profile.has_elderly && (
                        <div className="item flag">
                            <span className="emoji">👴</span>
                            <span>Elderly</span>
                        </div>
                    )}
                    {profile.has_children && (
                        <div className="item flag">
                            <span className="emoji">👶</span>
                            <span>Children</span>
                        </div>
                    )}
                    {profile.purpose && (
                        <div className="item">
                            <span className="emoji">🎯</span>
                            <span>{profile.purpose}</span>
                        </div>
                    )}
                    {profile.travel_dates && (
                        <div className="item">
                            <span className="emoji">📅</span>
                            <span>{profile.travel_dates}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Emotional State & Stage */}
            <div className="section">
                <div className="stage-row">
                    <div className="emotion">
                        <span className="big-emoji">{getEmotionEmoji(profile.emotional_state)}</span>
                        <span className="emotion-label">{profile.emotional_state}</span>
                    </div>
                    <div
                        className="stage-badge"
                        style={{ backgroundColor: getStageColor(profile.booking_stage) }}
                    >
                        {profile.booking_stage}
                    </div>
                </div>
            </div>

            {/* Detected Fears */}
            {profile.detected_fears?.length > 0 && (
                <div className="section">
                    <div className="label">⚠️ Address These Fears</div>
                    <ul className="tag-list fears">
                        {profile.detected_fears.map((fear, i) => (
                            <li key={i}>{fear}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Detected Desires */}
            {profile.detected_desires?.length > 0 && (
                <div className="section">
                    <div className="label">💫 What They Want</div>
                    <ul className="tag-list desires">
                        {profile.detected_desires.map((desire, i) => (
                            <li key={i}>{desire}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Missing Info */}
            {profile.key_questions_unanswered?.length > 0 && (
                <div className="section">
                    <div className="label">❓ Still Need to Ask</div>
                    <ul className="checklist">
                        {profile.key_questions_unanswered.map((q, i) => (
                            <li key={i}>□ {q}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Topics Detected */}
            {topics?.length > 0 && (
                <div className="section">
                    <div className="label">📌 Topics</div>
                    <div className="topic-tags">
                        {topics.map((topic, i) => (
                            <span key={i} className="topic">{topic}</span>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Approach */}
            {profile.recommended_approach && (
                <div className="section approach">
                    <div className="label">💡 Suggested Approach</div>
                    <p>{profile.recommended_approach}</p>
                </div>
            )}

            <style jsx>{`
        .customer-insights {
          background: #fefce8;
          border: 1px solid #fef08a;
          border-radius: 12px;
          padding: 16px;
          font-size: 13px;
        }

        .insights-empty {
          padding: 24px;
          text-align: center;
          color: #94a3b8;
        }

        .header {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 600;
          color: #713f12;
          margin-bottom: 16px;
        }

        .section {
          margin-bottom: 14px;
          padding-bottom: 14px;
          border-bottom: 1px solid #fef08a;
        }

        .section:last-child {
          border-bottom: none;
          margin-bottom: 0;
          padding-bottom: 0;
        }

        .label {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 8px;
          font-size: 12px;
        }

        .profile-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 4px;
          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
        }

        .item.flag {
          background: #fef3c7;
        }

        .detail {
          color: #94a3b8;
        }

        .emoji {
          font-size: 14px;
        }

        .stage-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .emotion {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .big-emoji {
          font-size: 24px;
        }

        .emotion-label {
          text-transform: capitalize;
          color: #64748b;
        }

        .stage-badge {
          padding: 4px 10px;
          border-radius: 12px;
          color: white;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
        }

        .tag-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .tag-list li {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 11px;
        }

        .fears li {
          background: #fee2e2;
          color: #dc2626;
        }

        .desires li {
          background: #dcfce7;
          color: #166534;
        }

        .checklist {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .checklist li {
          padding: 2px 0;
          color: #64748b;
        }

        .topic-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }

        .topic {
          background: #e0e7ff;
          color: #4338ca;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 11px;
        }

        .approach {
          background: #fffbeb;
          margin: 0 -16px -16px;
          padding: 12px 16px;
          border-radius: 0 0 12px 12px;
        }

        .approach p {
          margin: 0;
          line-height: 1.5;
          color: #92400e;
        }
      `}</style>
        </div>
    );
}

export default CustomerInsights;
