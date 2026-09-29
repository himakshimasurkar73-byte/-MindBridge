import React, { useState } from 'react';
import { X, CheckCircle, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function DailyCheckInModal({ isOpen, onClose, onSaveCheckIn }) {
  if (!isOpen) return null;

  const [scores, setScores] = useState({
    stress: 2,
    sleep: 4,
    energy: 3,
    relax: 4,
    social: 4
  });

  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { key: 'stress', label: '1. How stressed do you feel today?', emojis: ['😌', '😐', '😬', '😣', '🤯'], labels: ['Low', 'Mild', 'Moderate', 'High', 'Extreme'] },
    { key: 'sleep', label: '2. How well did you sleep?', emojis: ['🥱', '😴', '😐', '🙂', '🌟'], labels: ['Poor', 'Fair', 'Okay', 'Good', 'Restful'] },
    { key: 'energy', label: '3. How energetic do you feel?', emojis: ['🪫', '🥱', '😐', '⚡', '🔥'], labels: ['Drained', 'Low', 'Moderate', 'Energetic', 'Vibrant'] },
    { key: 'relax', label: '4. Did you get time to relax?', emojis: ['❌', '🤏', '😐', '🧘', '✨'], labels: ['None', 'Very little', 'Some', 'Good rest', 'Plenty'] },
    { key: 'social', label: '5. Did you connect with someone today?', emojis: ['👤', '💬', '👥', '❤️', '🤗'], labels: ['Isolated', 'Briefly', 'Spoke', 'Good chat', 'Felt loved'] },
  ];

  const handleSliderChange = (key, val) => {
    setScores((prev) => ({ ...prev, [key]: Number(val) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const entry = {
      date: new Date().toISOString().split('T')[0],
      ...scores
    };
    onSaveCheckIn(entry);
    setSubmitted(true);
    try {
      confetti({ particleCount: 50, spread: 40 });
    } catch (err) {}
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 210,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.2rem',
        background: '#FFFFFF',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.2rem',
            right: '1.2rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={20} />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>💜</div>
            <h2 style={{ fontSize: '2rem', color: 'var(--lavender-700)', marginBottom: '0.5rem' }}>
              Thanks for checking in 💜
            </h2>
            <p style={{ color: 'var(--text-muted)' }}>
              Your responses have been recorded in your progress log.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '0.3rem' }}>🌞</div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>
                Daily MindBridge Check-in
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
                How are you feeling today?
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {questions.map((q) => {
                const val = scores[q.key];
                return (
                  <div key={q.key} style={{ background: 'var(--lavender-50)', padding: '1rem 1.25rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-dark)' }}>
                        {q.label}
                      </span>
                      <span style={{ fontSize: '1.2rem' }}>
                        {q.emojis[val - 1]} <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--lavender-700)' }}>{q.labels[val - 1]}</span>
                      </span>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={val}
                      onChange={(e) => handleSliderChange(q.key, e.target.value)}
                      style={{
                        width: '100%',
                        accentColor: 'var(--lavender-600)',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                );
              })}

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
              >
                <span>Submit Daily Check-in</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
