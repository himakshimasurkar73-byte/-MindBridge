import React, { useState, useEffect } from 'react';
import { EXERCISES } from '../data/exercises';
import { Play, Pause, RotateCcw, CheckCircle, Clock, X, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExerciseView({ onCompleteActivity }) {
  const [activeExercise, setActiveExercise] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      try {
        confetti({ particleCount: 60, spread: 50 });
      } catch (e) {}
      if (onCompleteActivity) onCompleteActivity('exercise');
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, onCompleteActivity]);

  const handleStartExercise = (ex) => {
    setActiveExercise(ex);
    setTimeLeft(ex.seconds || 300);
    setIsRunning(true);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.85)',
          color: '#065F46',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.8rem'
        }}>
          <span>Movement For Mental Clarity</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', color: '#064E3B' }}>
          🏃 Move Your Mind
        </h2>
        <p style={{ color: '#047857', fontSize: '1.05rem', maxWidth: '650px' }}>
          Gentle, accessible physical activities designed to release tension, boost mood, and refresh your mind—without strain or intense exertion.
        </p>
      </div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {EXERCISES.map((ex) => (
          <div 
            key={ex.id} 
            className="glass-card"
            style={{
              padding: '1.8rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: ex.bgGradient
            }}
          >
            <div>
              {/* Header row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.8rem', lineHeight: 1 }}>{ex.icon}</span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.8)',
                  color: 'var(--text-dark)'
                }}>
                  {ex.difficulty}
                </span>
              </div>

              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.2rem', color: 'var(--text-dark)' }}>
                {ex.title}
              </h3>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--lavender-700)', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Clock size={14} />
                <span>Recommended: {ex.duration}</span>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1rem', fontStyle: 'italic' }}>
                "{ex.tagline}"
              </p>

              {/* Why it may help */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.85)',
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-sm)',
                marginBottom: '1.2rem',
                fontSize: '0.86rem',
                color: 'var(--text-main)',
                lineHeight: 1.45
              }}>
                <strong>💡 Why it may help:</strong> {ex.whyItHelps}
              </div>
            </div>

            <button 
              onClick={() => handleStartExercise(ex)}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Play size={16} />
              <span>Start Session</span>
            </button>
          </div>
        ))}
      </div>

      {/* Interactive Timer Modal */}
      {activeExercise && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 200,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '2.5rem 2rem',
            background: '#FFFFFF',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button
              onClick={() => setActiveExercise(null)}
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
              <X size={22} />
            </button>

            <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>
              {activeExercise.icon}
            </div>

            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
              {activeExercise.title}
            </h3>

            {/* Countdown Display */}
            <div style={{
              fontSize: '3.5rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              color: 'var(--lavender-700)',
              margin: '1rem 0'
            }}>
              {formatTime(timeLeft)}
            </div>

            {/* Controls */}
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
              <button
                onClick={() => setIsRunning(!isRunning)}
                className="btn-primary"
                style={{ padding: '0.75rem 1.8rem' }}
              >
                {isRunning ? <Pause size={18} /> : <Play size={18} />}
                <span>{isRunning ? 'Pause' : 'Resume'}</span>
              </button>

              <button
                onClick={() => setTimeLeft(activeExercise.seconds || 300)}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.2rem' }}
              >
                <RotateCcw size={18} />
                <span>Reset</span>
              </button>
            </div>

            {/* Guided Steps */}
            <div style={{ textAlign: 'left', background: 'var(--lavender-50)', padding: '1.2rem', borderRadius: 'var(--radius-md)' }}>
              <h4 style={{ fontSize: '0.95rem', marginBottom: '0.6rem', color: 'var(--lavender-700)' }}>
                Guided Steps:
              </h4>
              <ul style={{ paddingLeft: '1.2rem', fontSize: '0.88rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {activeExercise.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
