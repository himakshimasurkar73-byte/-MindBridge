import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, RotateCcw, Volume2, VolumeX, Heart, Trophy, Wind, Smile, Play, Pause } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function GamesView({ onCompleteActivity }) {
  const [activeTab, setActiveTab] = useState('memory'); // 'memory', 'breathing', 'clicker'
  const [soundEnabled, setSoundEnabled] = useState(false);

  // ----------------------------------------------------
  // Web Audio Pop Sound Generator
  // ----------------------------------------------------
  const playPopSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch (e) {}
  };



  // ----------------------------------------------------
  // GAME 2: MEMORY MATCH
  // ----------------------------------------------------
  const memoryIcons = ['🌸', '🌿', '⭐', '🌙', '💜', '🌈', '☁️', '🌷'];
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedIds, setMatchedIds] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isMemoryComplete, setIsMemoryComplete] = useState(false);

  const initMemoryGame = () => {
    const deck = [...memoryIcons, ...memoryIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({ id: index, icon, isFlipped: false }));
    setCards(deck);
    setFlippedCards([]);
    setMatchedIds([]);
    setMoves(0);
    setIsMemoryComplete(false);
  };

  useEffect(() => {
    initMemoryGame();
  }, []);

  const handleCardClick = (index) => {
    if (flippedCards.length === 2 || flippedCards.includes(index) || matchedIds.includes(index)) return;

    playPopSound();
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIndex, secondIndex] = newFlipped;
      if (cards[firstIndex].icon === cards[secondIndex].icon) {
        // Match!
        const newMatched = [...matchedIds, firstIndex, secondIndex];
        setMatchedIds(newMatched);
        setFlippedCards([]);
        if (newMatched.length === cards.length) {
          setIsMemoryComplete(true);
          try { confetti({ particleCount: 70, spread: 60 }); } catch (e) {}
          if (onCompleteActivity) onCompleteActivity('games');
        }
      } else {
        // No match
        setTimeout(() => setFlippedCards([]), 900);
      }
    }
  };

  // ----------------------------------------------------
  // GAME 3: BREATHING GARDEN
  // ----------------------------------------------------
  const [breathPhase, setBreathPhase] = useState('Inhale'); // 'Inhale', 'Hold', 'Exhale'
  const [breathTimer, setBreathTimer] = useState(4);
  const [breathMode, setBreathMode] = useState(60); // 60s or 180s
  const [isBreathingActive, setIsBreathingActive] = useState(false);
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(60);

  useEffect(() => {
    let phaseInterval, totalInterval;
    if (isBreathingActive) {
      totalInterval = setInterval(() => {
        setBreathSecondsLeft(prev => {
          if (prev <= 1) {
            setIsBreathingActive(false);
            try { confetti({ particleCount: 40 }); } catch (e) {}
            if (onCompleteActivity) onCompleteActivity('games');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      phaseInterval = setInterval(() => {
        setBreathPhase(prev => {
          if (prev === 'Inhale') return 'Hold';
          if (prev === 'Hold') return 'Exhale';
          return 'Inhale';
        });
      }, 4000);
    }
    return () => {
      clearInterval(phaseInterval);
      clearInterval(totalInterval);
    };
  }, [isBreathingActive]);

  const startBreathingGarden = (duration) => {
    setBreathMode(duration);
    setBreathSecondsLeft(duration);
    setBreathPhase('Inhale');
    setIsBreathingActive(true);
  };

  // ----------------------------------------------------
  // GAME 4: CALM CLICKER
  // ----------------------------------------------------
  const [clickerScore, setClickerScore] = useState(0);
  const [floatingNotes, setFloatingNotes] = useState([]);

  const positiveQuotes = [
    "Take a breath 🌿",
    "You're doing okay 💜",
    "One small step at a time 🌱",
    "Be kind to your mind 🌸",
    "Choose happy today ✨",
    "Good things take time ☁️",
    "You are enough, just as you are 🌷",
    "Focus on progress 🎀",
    "Every day is a fresh start 🌈"
  ];

  const handleCalmClick = (e) => {
    playPopSound();
    setClickerScore(prev => prev + 1);

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const text = positiveQuotes[Math.floor(Math.random() * positiveQuotes.length)];
    const id = Date.now() + Math.random();

    setFloatingNotes(prev => [...prev.slice(-6), { id, x, y, text }]);

    setTimeout(() => {
      setFloatingNotes(prev => prev.filter(n => n.id !== id));
    }, 1600);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Section Header */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #F5F3FF 0%, #E0F2FE 100%)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.9rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.85)',
            color: 'var(--lavender-700)',
            fontSize: '0.85rem',
            fontWeight: 600,
            marginBottom: '0.8rem'
          }}>
            <Sparkles size={16} />
            <span>Mindful Micro-Breaks</span>
          </div>
          <h2 style={{ fontSize: '2.2rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
            🎮 Relax & Play
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px' }}>
            Take a short break. Play something simple. Reset your mind.
          </p>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.6rem 1.2rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-light)',
            background: soundEnabled ? 'var(--lavender-100)' : '#FFFFFF',
            color: soundEnabled ? 'var(--lavender-700)' : 'var(--text-muted)',
            fontWeight: 600,
            fontSize: '0.88rem',
            cursor: 'pointer'
          }}
        >
          {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span>{soundEnabled ? 'Pop Sounds ON' : 'Pop Sounds Muted'}</span>
        </button>
      </div>

      {/* Game Selector Tabs */}
      <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
        {[
          { id: 'memory', label: '🧠 Memory Match', desc: 'Pair pastel symbols' },
          { id: 'breathing', label: '🌱 Breathing Garden', desc: 'Guided lotus breath' },
          { id: 'clicker', label: '✨ Calm Clicker', desc: 'Tap for affirmations' },
        ].map(g => {
          const isActive = activeTab === g.id;
          return (
            <button
              key={g.id}
              onClick={() => setActiveTab(g.id)}
              style={{
                padding: '0.7rem 1.3rem',
                borderRadius: 'var(--radius-md)',
                border: isActive ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                background: isActive ? 'var(--lavender-50)' : '#FFFFFF',
                color: isActive ? 'var(--lavender-700)' : 'var(--text-main)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <span>{g.label}</span>
            </button>
          );
        })}
      </div>



      {/* ---------------------------------------------------- */}
      {/* TAB 2: MEMORY MATCH */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'memory' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)' }}>🧠 Memory Match</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Find matching pairs of cute wellness symbols.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
              <div style={{ background: 'var(--lavender-50)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, color: 'var(--lavender-700)' }}>
                Moves: {moves}
              </div>
              <div style={{ background: 'var(--mint-50)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-full)', fontWeight: 700, color: 'var(--mint-600)' }}>
                Matched: {matchedIds.length / 2} / 8
              </div>
              <button onClick={initMemoryGame} className="btn-secondary" style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}>
                <RotateCcw size={16} />
                <span>Reset Deck</span>
              </button>
            </div>
          </div>

          {isMemoryComplete && (
            <div style={{
              background: 'var(--mint-50)',
              border: '1px solid var(--mint-200)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              textAlign: 'center',
              marginBottom: '1.5rem',
              color: 'var(--mint-600)',
              fontWeight: 700
            }}>
              🎉 Congratulations! You cleared the board in {moves} moves! 💜
            </div>
          )}

          {/* Card Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1rem',
            maxWidth: '520px',
            margin: '0 auto'
          }}>
            {cards.map((card, index) => {
              const isFlipped = flippedCards.includes(index) || matchedIds.includes(index);
              return (
                <button
                  key={index}
                  onClick={() => handleCardClick(index)}
                  style={{
                    height: '95px',
                    borderRadius: 'var(--radius-md)',
                    border: isFlipped ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                    background: isFlipped ? 'linear-gradient(135deg, #F5F3FF, #E0F2FE)' : 'linear-gradient(135deg, #8B5CF6, #0EA5E9)',
                    color: isFlipped ? 'var(--text-dark)' : '#FFF',
                    fontSize: isFlipped ? '2.5rem' : '1.4rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.3s ease, background 0.3s ease',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {isFlipped ? card.icon : '🧠'}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 3: BREATHING GARDEN */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'breathing' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2.5rem 2rem', background: '#FFFFFF', textAlign: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
            🌱 Breathing Garden
          </h3>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto 2rem auto' }}>
            Follow the growing and shrinking lotus blossom to rhythmically pace your breathing.
          </p>

          {/* Animated Flower Lotus */}
          <div style={{
            position: 'relative',
            width: '240px',
            height: '240px',
            margin: '0 auto 2rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: isBreathingActive && breathPhase === 'Inhale' ? '220px' : isBreathingActive && breathPhase === 'Hold' ? '220px' : '130px',
              height: isBreathingActive && breathPhase === 'Inhale' ? '220px' : isBreathingActive && breathPhase === 'Hold' ? '220px' : '130px',
              borderRadius: '50%',
              background: breathPhase === 'Inhale' ? 'linear-gradient(135deg, #DDD6FE, #BAE6FD)' : breathPhase === 'Hold' ? 'linear-gradient(135deg, #FEF3C7, #A7F3D0)' : 'linear-gradient(135deg, #FBCFE8, #DDD6FE)',
              boxShadow: '0 0 35px rgba(139, 92, 246, 0.35)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 4s ease-in-out',
              color: 'var(--lavender-700)',
              fontWeight: 800
            }}>
              <span style={{ fontSize: '3rem', marginBottom: '0.2rem' }}>🌸</span>
              <span style={{ fontSize: '1.2rem', letterSpacing: '1px' }}>{isBreathingActive ? breathPhase.toUpperCase() : 'BREATHE'}</span>
            </div>
          </div>

          {/* Controls */}
          {isBreathingActive ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--lavender-700)' }}>
                Session Remaining: {breathSecondsLeft}s
              </div>
              <button onClick={() => setIsBreathingActive(false)} className="btn-secondary">
                <Pause size={18} />
                <span>Pause Session</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button onClick={() => startBreathingGarden(60)} className="btn-primary">
                <Play size={18} />
                <span>1-Minute Garden</span>
              </button>

              <button onClick={() => startBreathingGarden(180)} className="btn-secondary">
                <Play size={18} />
                <span>3-Minute Garden</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* TAB 4: CALM CLICKER */}
      {/* ---------------------------------------------------- */}
      {activeTab === 'clicker' && (
        <div className="glass-card animate-fade-in" style={{ padding: '2rem', background: '#FFFFFF' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)' }}>✨ Calm Clicker</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Tap anywhere on the canvas to bloom positive reminders and affirmations.
              </p>
            </div>

            <div style={{ background: 'var(--lavender-50)', padding: '0.5rem 1.2rem', borderRadius: 'var(--radius-full)', fontWeight: 700, color: 'var(--lavender-700)' }}>
              Affirmations Bloomed: {clickerScore}
            </div>
          </div>

          <div
            onClick={handleCalmClick}
            style={{
              position: 'relative',
              height: '360px',
              background: 'linear-gradient(135deg, #F8FAFC 0%, #F3E8FF 50%, #E0F2FE 100%)',
              borderRadius: 'var(--radius-md)',
              border: '2px dashed var(--lavender-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              overflow: 'hidden',
              userSelect: 'none'
            }}
          >
            {clickerScore === 0 && (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>✨</div>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Click anywhere on this canvas 💜</p>
              </div>
            )}

            {floatingNotes.map(n => (
              <div
                key={n.id}
                style={{
                  position: 'absolute',
                  left: `${n.x - 70}px`,
                  top: `${n.y - 20}px`,
                  background: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid var(--lavender-200)',
                  padding: '0.5rem 1rem',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-md)',
                  color: 'var(--lavender-700)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  pointerEvents: 'none',
                  animation: 'floatNote 1.6s ease-out forwards'
                }}
              >
                {n.text}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Animation Styles */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) scale(0.8); opacity: 0.9; }
          100% { transform: translateY(-480px) scale(1.1); opacity: 0; }
        }
        @keyframes floatNote {
          0% { opacity: 1; transform: translateY(0) scale(0.8); }
          100% { opacity: 0; transform: translateY(-60px) scale(1.05); }
        }
      `}</style>

    </div>
  );
}
