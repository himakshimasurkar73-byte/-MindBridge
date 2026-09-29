import React from 'react';
import { getPersonalizedRecommendations } from '../utils/recommendations';
import { Sparkles, Calendar, Clock, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export default function RecommendationsView({ assessmentResults, userProfile, onGoToActivities, onGoToMeditation }) {
  const recs = getPersonalizedRecommendations(assessmentResults, userProfile);
  const name = userProfile?.name || 'Friend';

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Title Header */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: recs.categoryTheme === 'good'
          ? 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
          : recs.categoryTheme === 'attention'
          ? 'linear-gradient(135deg, #FFE4E6 0%, #EDE9FE 100%)'
          : 'linear-gradient(135deg, #E0F2FE 0%, #F3E8FF 100%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.8rem'
        }}>
          <Sparkles size={16} />
          <span>Tailored For {name}</span>
        </div>

        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
          {recs.title}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px' }}>
          Based on your assessment score, here are gentle, supportive activities to foster clarity, calm, and daily energy.
        </p>
      </div>

      {/* Recommended Action Cards */}
      <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: 'var(--text-dark)' }}>
          Suggested Wellness Focus Areas
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.25rem'
        }}>
          {recs.items.map((item, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                fontSize: '2.2rem',
                lineHeight: 1,
                padding: '0.6rem',
                background: 'var(--lavender-50)',
                borderRadius: '16px',
                flexShrink: 0
              }}>
                {item.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1.1rem', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalized Daily Plan (Section 12) */}
      <div className="glass-card" style={{ padding: '2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>
              🗓️ Your Gentle Daily Wellness Plan
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Achievable steps tailored for your role as a {userProfile?.occupation || 'Student'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button onClick={onGoToActivities} className="btn-secondary" style={{ fontSize: '0.88rem', padding: '0.6rem 1.2rem' }}>
              Exercise Routines
            </button>
            <button onClick={onGoToMeditation} className="btn-primary" style={{ fontSize: '0.88rem', padding: '0.6rem 1.2rem' }}>
              Meditation Space
            </button>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem'
        }}>
          {Object.values(recs.dailyPlan).map((slot, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.85)',
              padding: '1.4rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--lavender-700)',
                marginBottom: '0.5rem'
              }}>
                {slot.time}
              </div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
                {slot.activity}
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                {slot.detail}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Care Notice */}
      <div style={{
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
        border: '1px solid var(--blue-200)',
        padding: '1.5rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '1rem'
      }}>
        <ShieldAlert size={24} style={{ color: 'var(--blue-600)', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '1.05rem', color: 'var(--blue-700)', marginBottom: '0.3rem' }}>
            Support Notice
          </h4>
          <p style={{ fontSize: '0.9rem', color: '#0369A1', lineHeight: 1.5 }}>
            {recs.safetyNotice}
          </p>
        </div>
      </div>

    </div>
  );
}
