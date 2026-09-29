import React, { useState, useEffect, useRef } from 'react';
import { MEDITATIONS, AMBIENT_SOUNDS } from '../data/meditations';
import { Play, Pause, Volume2, VolumeX, Sparkles, X, Wind } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MeditationView({ onCompleteActivity }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSession, setActiveSession] = useState(null);
  const [activeSound, setActiveSound] = useState(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  // Web Audio API ambient noise synthesizer
  const audioCtxRef = useRef(null);
  const soundNodeRef = useRef(null);

  const categories = ['All', 'Breathing', 'Relaxation', 'Sleep', 'Focus', 'Mindfulness'];

  const filtered = selectedCategory === 'All'
    ? MEDITATIONS
    : MEDITATIONS.filter(m => m.category === selectedCategory);

  // Ambient sound synthesis using Web Audio API
  const toggleAmbientSound = (soundId) => {
    if (activeSound === soundId && isPlayingAudio) {
      stopAudio();
      setActiveSound(null);
      setIsPlayingAudio(false);
      return;
    }

    stopAudio();
    setActiveSound(soundId);
    setIsPlayingAudio(true);

    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Pink noise generator for Rain / Ocean
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
      gainNode.gain.value = 0.15;

      whiteNoise.connect(gainNode);
      gainNode.connect(ctx.destination);
      whiteNoise.start();

      soundNodeRef.current = whiteNoise;
    } catch (e) {
      console.log('Web audio initialized', e);
    }
  };

  const stopAudio = () => {
    if (soundNodeRef.current) {
      try { soundNodeRef.current.stop(); } catch (e) {}
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
    }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%)'
      }}>
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
          <Wind size={16} />
          <span>Mindful Sanctuary</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', color: 'var(--lavender-700)' }}>
          🧘 Calm Space
        </h2>
        <p style={{ color: '#581C87', fontSize: '1.05rem', maxWidth: '650px' }}>
          Immerse yourself in gentle guided meditations, ambient soundscapes, and calming box-breathing exercises.
        </p>
      </div>

      {/* Guided Breathing Circle Widget */}
      <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>
          🌬️ Guided Breathing Circle (4-7-8 Technique)
        </h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Inhale slowly as the circle expands (4s), hold (7s), then gently exhale as it contracts (8s).
        </p>

        <div className="breathing-circle">
          Breathe
        </div>
      </div>

      {/* Ambient Sound Generators Bar */}
      <div className="glass-card" style={{ padding: '1.5rem 1.8rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.8rem', color: 'var(--text-dark)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Volume2 size={18} color="var(--lavender-600)" />
          <span>Instant Ambient Soundscapes</span>
        </h3>
        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          {AMBIENT_SOUNDS.map((snd) => {
            const isActive = activeSound === snd.id && isPlayingAudio;
            return (
              <button
                key={snd.id}
                onClick={() => toggleAmbientSound(snd.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                  background: isActive ? 'var(--lavender-500)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-dark)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{snd.icon}</span>
                <span>{snd.name}</span>
                {isActive ? <Volume2 size={16} /> : <VolumeX size={16} style={{ opacity: 0.5 }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: isActive ? 'var(--lavender-600)' : 'rgba(255, 255, 255, 0.8)',
                color: isActive ? '#FFFFFF' : 'var(--text-main)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Meditation Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {filtered.map((med) => (
          <div 
            key={med.id} 
            className="glass-card"
            style={{
              padding: '1.8rem',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: med.bgGradient,
              color: med.isDark ? '#FFF' : 'inherit'
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '2.2rem' }}>{med.categoryIcon}</span>
                <span style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  background: 'rgba(255, 255, 255, 0.85)',
                  color: 'var(--text-dark)'
                }}>
                  {med.difficulty} • {med.duration}
                </span>
              </div>

              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', color: med.isDark ? '#FFF' : 'var(--text-dark)' }}>
                {med.title}
              </h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.9, lineHeight: 1.4, marginBottom: '1.5rem' }}>
                {med.description}
              </p>
            </div>

            <button 
              onClick={() => {
                setActiveSession(med);
                if (onCompleteActivity) onCompleteActivity('meditation');
              }}
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <Play size={16} />
              <span>Play Meditation</span>
            </button>
          </div>
        ))}
      </div>

      {/* Video / Audio Session Player Modal */}
      {activeSession && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          zIndex: 200,
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="glass-card animate-fade-in" style={{
            maxWidth: '680px',
            width: '100%',
            padding: '2.2rem',
            background: '#FFFFFF',
            position: 'relative'
          }}>
            <button
              onClick={() => setActiveSession(null)}
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

            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.5rem', color: 'var(--text-dark)' }}>
              {activeSession.categoryIcon} {activeSession.title}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Duration: {activeSession.duration} • Category: {activeSession.category}
            </p>

            {/* Embedded YouTube Relaxation Video */}
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
              overflow: 'hidden',
              borderRadius: 'var(--radius-md)',
              background: '#000',
              marginBottom: '1.2rem'
            }}>
              <iframe
                src={`${activeSession.videoUrl}?autoplay=1`}
                title={activeSession.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 0
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
