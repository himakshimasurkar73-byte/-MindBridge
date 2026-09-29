import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, Wind, Music, Gamepad2, Heart, Smile } from 'lucide-react';

export default function TakeABreakModal({ onNavigate, openDailyCheckIn }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeBreathing, setActiveBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale');
  const [breathSecs, setBreathSecs] = useState(60);

  // Web Audio Rain Sound state
  const [isRainPlaying, setIsRainPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);

  const toggleRainSound = () => {
    if (isRainPlaying) {
      stopRainSound();
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;

        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          let white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
          output[i] *= 0.11;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.15, ctx.currentTime);

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start();

        noiseNodeRef.current = whiteNoise;
        setIsRainPlaying(true);
      } catch (e) {}
    }
  };

  const stopRainSound = () => {
    if (noiseNodeRef.current) {
      try { noiseNodeRef.current.stop(); } catch (e) {}
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
    setIsRainPlaying(false);
  };

  useEffect(() => {
    let timer, phaseTimer;
    if (activeBreathing) {
      timer = setInterval(() => {
        setBreathSecs(prev => {
          if (prev <= 1) {
            setActiveBreathing(false);
            return 60;
          }
          return prev - 1;
        });
      }, 1000);

      phaseTimer = setInterval(() => {
        setBreathPhase(prev => (prev === 'Inhale' ? 'Exhale' : 'Inhale'));
      }, 4000);
    }
    return () => {
      clearInterval(timer);
      clearInterval(phaseTimer);
    };
  }, [activeBreathing]);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="animate-pulse-glow"
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 150,
          background: 'linear-gradient(135deg, var(--lavender-500), var(--blue-500))',
          color: '#FFFFFF',
          padding: '0.85rem 1.4rem',
          borderRadius: 'var(--radius-full)',
          border: 'none',
          boxShadow: '0 10px 25px rgba(139, 92, 246, 0.4)',
          fontWeight: 700,
          fontSize: '0.95rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
      >
        <span style={{ fontSize: '1.2rem' }}>🌿</span>
        <span>Take a Break</span>
      </button>

      {/* Break Options Modal Popup */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 220,
          background: 'rgba(15, 23, 42, 0.65)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '480px',
            width: '100%',
            padding: '2.2rem',
            background: '#FFFFFF',
            position: 'relative',
            textAlign: 'center'
          }}>
            <button
              onClick={() => {
                setIsOpen(false);
                setActiveBreathing(false);
                stopRainSound();
              }}
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

            <div style={{ fontSize: '2.5rem', marginBottom: '0.4rem' }}>🌿</div>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
              What do you need right now? 💭
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.8rem' }}>
              Choose a fast 1-minute mindfulness activity to pause and reset.
            </p>

            {activeBreathing ? (
              <div style={{ padding: '1.5rem 1rem', background: 'var(--lavender-50)', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{
                  width: breathPhase === 'Inhale' ? '140px' : '90px',
                  height: breathPhase === 'Inhale' ? '140px' : '90px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--lavender-200), var(--blue-200))',
                  margin: '0 auto 1rem auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--lavender-700)',
                  fontWeight: 800,
                  transition: 'all 4s ease-in-out'
                }}>
                  {breathPhase}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
                  Time remaining: {breathSecs}s
                </div>
                <button
                  onClick={() => setActiveBreathing(false)}
                  className="btn-outline"
                  style={{ marginTop: '1rem', fontSize: '0.82rem' }}
                >
                  Stop Breathing
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                
                {/* 1. 1-minute breathing */}
                <button
                  onClick={() => setActiveBreathing(true)}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'var(--lavender-50)',
                    color: 'var(--lavender-700)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>🌬️</span>
                    <span>1-Minute Breathing Exercise</span>
                  </span>
                  <span>→</span>
                </button>

                {/* 2. Play calming sound */}
                <button
                  onClick={toggleRainSound}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: isRainPlaying ? '2px solid var(--blue-500)' : '1px solid var(--border-light)',
                    background: isRainPlaying ? 'var(--blue-50)' : 'rgba(240, 249, 255, 0.7)',
                    color: 'var(--blue-700)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>🎵</span>
                    <span>{isRainPlaying ? 'Stop Calming Rain Sound' : 'Play Calming Rain Sound'}</span>
                  </span>
                  <span>{isRainPlaying ? '🔊' : '▶'}</span>
                </button>

                {/* 3. Play a quick game */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('games');
                  }}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(236, 253, 245, 0.7)',
                    color: '#065F46',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>🎮</span>
                    <span>Play a Quick Mini-Game</span>
                  </span>
                  <span>→</span>
                </button>

                {/* 4. Start meditation */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    onNavigate('meditation');
                  }}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(255, 241, 242, 0.7)',
                    color: 'var(--rose-500)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>🧘</span>
                    <span>Start Guided Meditation</span>
                  </span>
                  <span>→</span>
                </button>

                {/* 5. Update mood */}
                <button
                  onClick={() => {
                    setIsOpen(false);
                    if (openDailyCheckIn) openDailyCheckIn();
                  }}
                  style={{
                    padding: '0.9rem 1.2rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)',
                    background: 'rgba(254, 243, 199, 0.7)',
                    color: '#B45309',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span>😊</span>
                    <span>Record Today's Mood</span>
                  </span>
                  <span>→</span>
                </button>

              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
