import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Sparkles, Music, Heart, Info } from 'lucide-react';

export default function MusicView({ onCompleteActivity }) {
  const [selectedMoodFilter, setSelectedMoodFilter] = useState('All');
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.7);
  const [progress, setProgress] = useState(0);

  // Web Audio Synth Engine Reference
  const audioCtxRef = useRef(null);
  const soundNodeRef = useRef(null);
  const gainNodeRef = useRef(null);
  const timerRef = useRef(null);

  const tracks = [
    {
      id: 'rain-1',
      title: 'Gentle Rain on Leaves',
      category: '🌧️ Rain Sounds',
      moods: ['Stressed', 'Calm', 'Tired'],
      duration: 180,
      desc: 'Soft, steady rainfall for stress relief and quiet contemplation.'
    },
    {
      id: 'ocean-1',
      title: 'Ocean Wave Swells',
      category: '🌊 Ocean Waves',
      moods: ['Stressed', 'Calm'],
      duration: 240,
      desc: 'Rhythmic oceanic tides to harmonize breathing and soothe tension.'
    },
    {
      id: 'forest-1',
      title: 'Pine Forest Breeze',
      category: '🌲 Forest Sounds',
      moods: ['Calm', 'Tired', 'Low'],
      duration: 200,
      desc: 'Rustling leaves and distant birdsong for grounded mental peace.'
    },
    {
      id: 'fire-1',
      title: 'Cozy Hearth Fireplace',
      category: '🔥 Fireplace',
      moods: ['Calm', 'Low'],
      duration: 210,
      desc: 'Warm crackling embers providing warmth and emotional comfort.'
    },
    {
      id: 'piano-1',
      title: 'Midnight Calm Piano',
      category: '🎹 Calm Piano',
      moods: ['Stressed', 'Focus', 'Low'],
      duration: 195,
      desc: 'Soft, minimalist piano chords designed for deep relaxation.'
    },
    {
      id: 'nature-1',
      title: 'Morning Meadow Dew',
      category: '🌿 Nature Sounds',
      moods: ['Tired', 'Low', 'Calm'],
      duration: 180,
      desc: 'Gentle morning ambiance to awaken energy with soft optimism.'
    },
    {
      id: 'ambient-1',
      title: 'Celestial Ambient Pad',
      category: '🌌 Ambient Relaxation',
      moods: ['Tired', 'Calm'],
      duration: 300,
      desc: 'Warm synthesizer drone pads creating an immersive peaceful bubble.'
    },
    {
      id: 'focus-1',
      title: 'Alpha Wave Focus Flow',
      category: '🎯 Focus Sounds',
      moods: ['Focus', 'Stressed'],
      duration: 240,
      desc: 'Calibrated frequency drones that support study and uninterrupted work.'
    }
  ];

  const filteredTracks = selectedMoodFilter === 'All'
    ? tracks
    : tracks.filter(t => t.moods.includes(selectedMoodFilter));

  const currentTrack = filteredTracks[activeTrackIndex] || filteredTracks[0];

  // ----------------------------------------------------
  // Web Audio Synth Engine for High Quality Soundscapes
  // ----------------------------------------------------
  // ----------------------------------------------------
  // Web Audio Synth Engine for High Quality Soundscapes
  // ----------------------------------------------------
  const startAudioSynth = (trackId) => {
    stopAudioSynth();
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume, ctx.currentTime);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      let cleanupFns = [];

      // Helper: Generate Pink / Brown Noise Buffer
      const createNoiseBuffer = (type = 'pink') => {
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
        let lastOut = 0.0;

        for (let i = 0; i < bufferSize; i++) {
          let white = Math.random() * 2 - 1;
          if (type === 'brown') {
            output[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = output[i];
            output[i] *= 3.5;
          } else {
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
        }
        return noiseBuffer;
      };

      if (trackId.includes('rain')) {
        // 🌧️ 1. RAIN SOUNDS: Lowpass pink noise + randomized droplet pops
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer('pink');
        noiseSrc.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1000, ctx.currentTime);

        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.25, ctx.currentTime);

        noiseSrc.connect(filter);
        filter.connect(noiseGain);
        noiseGain.connect(masterGain);
        noiseSrc.start();
        cleanupFns.push(() => { try { noiseSrc.stop(); } catch(e){} });

        // Raindrops
        const dropInterval = setInterval(() => {
          if (!audioCtxRef.current || ctx.state === 'closed') return;
          try {
            const dropOsc = ctx.createOscillator();
            const dropGain = ctx.createGain();
            const freq = 1400 + Math.random() * 900;
            dropOsc.type = 'sine';
            dropOsc.frequency.setValueAtTime(freq, ctx.currentTime);
            dropGain.gain.setValueAtTime(0.04 + Math.random() * 0.04, ctx.currentTime);
            dropGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            dropOsc.connect(dropGain);
            dropGain.connect(masterGain);
            dropOsc.start();
            dropOsc.stop(ctx.currentTime + 0.03);
          } catch(e){}
        }, 110);
        cleanupFns.push(() => clearInterval(dropInterval));

      } else if (trackId.includes('ocean')) {
        // 🌊 2. OCEAN WAVES: Deep brown noise with 11-second LFO wave swells
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer('brown');
        noiseSrc.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        const waveGain = ctx.createGain();
        waveGain.gain.setValueAtTime(0.2, ctx.currentTime);

        // LFO oscillator for swell
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.setValueAtTime(0.09, ctx.currentTime); // ~11s period

        const lfoGain = ctx.createGain();
        lfoGain.gain.setValueAtTime(240, ctx.currentTime); // Filter modulation range

        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        noiseSrc.connect(filter);
        filter.connect(waveGain);
        waveGain.connect(masterGain);
        noiseSrc.start();
        lfo.start();
        cleanupFns.push(() => { try { noiseSrc.stop(); lfo.stop(); } catch(e){} });

      } else if (trackId.includes('forest')) {
        // 🌲 3. FOREST SOUNDS: Bandpass wind rustle + randomized bird chirps
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer('pink');
        noiseSrc.loop = true;

        const bandpass = ctx.createBiquadFilter();
        bandpass.type = 'bandpass';
        bandpass.frequency.setValueAtTime(650, ctx.currentTime);
        bandpass.Q.setValueAtTime(1.8, ctx.currentTime);

        const forestGain = ctx.createGain();
        forestGain.gain.setValueAtTime(0.22, ctx.currentTime);

        noiseSrc.connect(bandpass);
        bandpass.connect(forestGain);
        forestGain.connect(masterGain);
        noiseSrc.start();
        cleanupFns.push(() => { try { noiseSrc.stop(); } catch(e){} });

        // Bird chirps
        const birdTimer = setInterval(() => {
          if (!audioCtxRef.current || ctx.state === 'closed') return;
          try {
            const birdOsc = ctx.createOscillator();
            const birdGain = ctx.createGain();
            const now = ctx.currentTime;
            birdOsc.type = 'sine';
            birdOsc.frequency.setValueAtTime(2600 + Math.random() * 300, now);
            birdOsc.frequency.exponentialRampToValueAtTime(3400 + Math.random() * 400, now + 0.08);
            birdOsc.frequency.exponentialRampToValueAtTime(2800, now + 0.16);

            birdGain.gain.setValueAtTime(0.01, now);
            birdGain.gain.linearRampToValueAtTime(0.05, now + 0.04);
            birdGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

            birdOsc.connect(birdGain);
            birdGain.connect(masterGain);
            birdOsc.start(now);
            birdOsc.stop(now + 0.18);
          } catch(e){}
        }, 2200);
        cleanupFns.push(() => clearInterval(birdTimer));

      } else if (trackId.includes('fire')) {
        // 🔥 4. FIREPLACE: Warm low-end rumble + snapping crackling pops
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer('brown');
        noiseSrc.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, ctx.currentTime);

        const fireGain = ctx.createGain();
        fireGain.gain.setValueAtTime(0.35, ctx.currentTime);

        noiseSrc.connect(filter);
        filter.connect(fireGain);
        fireGain.connect(masterGain);
        noiseSrc.start();
        cleanupFns.push(() => { try { noiseSrc.stop(); } catch(e){} });

        // Crackling wood snapping pops
        const crackleTimer = setInterval(() => {
          if (!audioCtxRef.current || ctx.state === 'closed') return;
          if (Math.random() > 0.4) {
            try {
              const popBuffer = ctx.createBuffer(1, 200, ctx.sampleRate);
              const data = popBuffer.getChannelData(0);
              for (let i = 0; i < 200; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 30);
              const popSrc = ctx.createBufferSource();
              popSrc.buffer = popBuffer;
              const popGain = ctx.createGain();
              popGain.gain.setValueAtTime(0.08 + Math.random() * 0.08, ctx.currentTime);
              popSrc.connect(popGain);
              popGain.connect(masterGain);
              popSrc.start();
            } catch(e){}
          }
        }, 140);
        cleanupFns.push(() => clearInterval(crackleTimer));

      } else if (trackId.includes('piano')) {
        // 🎹 5. CALM PIANO: Soft pentatonic piano chord arpeggios
        const chordNotes = [
          [261.63, 329.63, 392.00, 493.88], // C maj7
          [220.00, 261.63, 329.63, 392.00], // A min7
          [174.61, 220.00, 261.63, 329.63], // F maj7
          [196.00, 246.94, 293.66, 392.00]  // G6
        ];
        let chordIdx = 0;

        const playPianoChord = () => {
          if (!audioCtxRef.current || ctx.state === 'closed') return;
          const notes = chordNotes[chordIdx % chordNotes.length];
          chordIdx++;
          notes.forEach((freq, i) => {
            try {
              const now = ctx.currentTime + (i * 0.15);
              const osc = ctx.createOscillator();
              const gain = ctx.createGain();
              osc.type = 'sine';
              osc.frequency.setValueAtTime(freq, now);

              gain.gain.setValueAtTime(0.001, now);
              gain.gain.linearRampToValueAtTime(0.12, now + 0.03);
              gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.2);

              osc.connect(gain);
              gain.connect(masterGain);
              osc.start(now);
              osc.stop(now + 2.2);
            } catch(e){}
          });
        };

        playPianoChord();
        const pianoInterval = setInterval(playPianoChord, 2800);
        cleanupFns.push(() => clearInterval(pianoInterval));

      } else if (trackId.includes('nature')) {
        // 🌿 6. NATURE SOUNDS: Soft meadow wind + gentle cricket chirping
        const noiseSrc = ctx.createBufferSource();
        noiseSrc.buffer = createNoiseBuffer('pink');
        noiseSrc.loop = true;

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, ctx.currentTime);

        const meadowGain = ctx.createGain();
        meadowGain.gain.setValueAtTime(0.18, ctx.currentTime);

        noiseSrc.connect(filter);
        filter.connect(meadowGain);
        meadowGain.connect(masterGain);
        noiseSrc.start();
        cleanupFns.push(() => { try { noiseSrc.stop(); } catch(e){} });

        // Gentle crickets
        const cricketInterval = setInterval(() => {
          if (!audioCtxRef.current || ctx.state === 'closed') return;
          try {
            const cOsc1 = ctx.createOscillator();
            const cOsc2 = ctx.createOscillator();
            const cGain = ctx.createGain();
            const now = ctx.currentTime;

            cOsc1.type = 'sine';
            cOsc2.type = 'sine';
            cOsc1.frequency.setValueAtTime(4400, now);
            cOsc2.frequency.setValueAtTime(4800, now);

            cGain.gain.setValueAtTime(0.02, now);
            cGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

            cOsc1.connect(cGain);
            cOsc2.connect(cGain);
            cGain.connect(masterGain);

            cOsc1.start(now);
            cOsc2.start(now);
            cOsc1.stop(now + 0.12);
            cOsc2.stop(now + 0.12);
          } catch(e){}
        }, 1600);
        cleanupFns.push(() => clearInterval(cricketInterval));

      } else if (trackId.includes('ambient')) {
        // 🌌 7. AMBIENT RELAXATION: Lush detuned synth pad
        const freqs = [174.61, 261.63, 392.00, 523.25]; // F3, C4, G4, C5
        const oscs = [];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq + (idx * 0.4), ctx.currentTime); // detune
          gain.gain.setValueAtTime(0.06, ctx.currentTime);

          osc.connect(gain);
          gain.connect(masterGain);
          osc.start();
          oscs.push(osc);
        });

        cleanupFns.push(() => { oscs.forEach(o => { try{ o.stop(); }catch(e){} }); });

      } else {
        // 🎯 8. FOCUS SOUNDS: 432Hz harmonic tone + 10Hz alpha binaural beat
        const baseFreq = 432;
        const binauralBeat = 10; // 10Hz Alpha wave state

        const oscL = ctx.createOscillator();
        const oscR = ctx.createOscillator();
        const subOsc = ctx.createOscillator();

        oscL.type = 'sine';
        oscR.type = 'sine';
        subOsc.type = 'sine';

        oscL.frequency.setValueAtTime(baseFreq, ctx.currentTime);
        oscR.frequency.setValueAtTime(baseFreq + binauralBeat, ctx.currentTime);
        subOsc.frequency.setValueAtTime(108, ctx.currentTime);

        const focusGain = ctx.createGain();
        focusGain.gain.setValueAtTime(0.12, ctx.currentTime);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.06, ctx.currentTime);

        oscL.connect(focusGain);
        oscR.connect(focusGain);
        subOsc.connect(subGain);

        focusGain.connect(masterGain);
        subGain.connect(masterGain);

        oscL.start();
        oscR.start();
        subOsc.start();

        cleanupFns.push(() => { try { oscL.stop(); oscR.stop(); subOsc.stop(); } catch(e){} });
      }

      soundNodeRef.current = {
        stop: () => {
          cleanupFns.forEach(fn => fn());
        }
      };
    } catch (e) {
      console.log('Audio synth init', e);
    }
  };

  const stopAudioSynth = () => {
    if (soundNodeRef.current) {
      try { soundNodeRef.current.stop(); } catch (e) {}
      soundNodeRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      stopAudioSynth();
      setIsPlaying(false);
    } else {
      startAudioSynth(currentTrack.id);
      setIsPlaying(true);
      if (onCompleteActivity) onCompleteActivity('music');
    }
  };

  const handleNextTrack = () => {
    const nextIdx = (activeTrackIndex + 1) % filteredTracks.length;
    setActiveTrackIndex(nextIdx);
    if (isPlaying) {
      startAudioSynth(filteredTracks[nextIdx].id);
    }
  };

  const handlePrevTrack = () => {
    const prevIdx = (activeTrackIndex - 1 + filteredTracks.length) % filteredTracks.length;
    setActiveTrackIndex(prevIdx);
    if (isPlaying) {
      startAudioSynth(filteredTracks[prevIdx].id);
    }
  };

  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      } catch (e) {}
    }
  }, [volume]);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= currentTrack.duration) {
            handleNextTrack();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    return () => stopAudioSynth();
  }, []);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #E0F2FE 0%, #F3E8FF 100%)'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          background: 'rgba(255, 255, 255, 0.85)',
          color: 'var(--blue-700)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.8rem'
        }}>
          <Music size={16} />
          <span>Sound Therapy & Calm Ambience</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
          🎵 Mind Refresh
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '650px' }}>
          Choose a sound that matches your mood. Listen to royalty-free ambient soundscapes, rain, ocean waves, and calm piano.
        </p>
      </div>

      {/* Mood Filter Bar */}
      <div className="glass-card" style={{ padding: '1.2rem 1.8rem' }}>
        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-muted)', display: 'block', marginBottom: '0.6rem' }}>
          SELECT MUSIC BY MOOD:
        </span>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: '✨ All Tracks' },
            { id: 'Stressed', label: '😰 Stressed' },
            { id: 'Tired', label: '😴 Tired' },
            { id: 'Low', label: '😔 Low' },
            { id: 'Focus', label: '🎯 Need Focus' },
            { id: 'Calm', label: '😌 Need Calm' },
          ].map(m => {
            const isActive = selectedMoodFilter === m.id;
            return (
              <button
                key={m.id}
                onClick={() => {
                  setSelectedMoodFilter(m.id);
                  setActiveTrackIndex(0);
                  setProgress(0);
                }}
                style={{
                  padding: '0.5rem 1.1rem',
                  borderRadius: 'var(--radius-full)',
                  border: isActive ? '1px solid var(--lavender-500)' : '1px solid var(--border-light)',
                  background: isActive ? 'var(--lavender-500)' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Mini Music Player Component */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #FFFFFF, #F5F3FF)',
        border: '1px solid var(--border-lavender)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          alignItems: 'center'
        }}>
          
          {/* Track Details & Visualiser Icon */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{
              width: '85px',
              height: '85px',
              borderRadius: '20px',
              background: 'linear-gradient(135deg, var(--lavender-500), var(--blue-500))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              color: '#FFF',
              boxShadow: '0 8px 25px rgba(139, 92, 246, 0.35)',
              flexShrink: 0
            }}>
              {currentTrack.category.split(' ')[0]}
            </div>

            <div>
              <span style={{
                fontSize: '0.78rem',
                fontWeight: 700,
                color: 'var(--lavender-700)',
                background: 'var(--lavender-100)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {currentTrack.category}
              </span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', margin: '0.4rem 0 0.2rem 0' }}>
                {currentTrack.title}
              </h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
                {currentTrack.desc}
              </p>
            </div>
          </div>

          {/* Player Controls & Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
                <span>{formatTime(progress)}</span>
                <span>{formatTime(currentTrack.duration)}</span>
              </div>

              <div style={{
                width: '100%',
                height: '8px',
                background: 'var(--lavender-100)',
                borderRadius: 'var(--radius-full)',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(progress / currentTrack.duration) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, var(--lavender-500), var(--blue-500))',
                  borderRadius: 'var(--radius-full)',
                  transition: 'width 0.3s linear'
                }} />
              </div>
            </div>

            {/* Buttons Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.2rem' }}>
              <button
                onClick={handlePrevTrack}
                style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', padding: '0.4rem' }}
              >
                <SkipBack size={22} />
              </button>

              <button
                onClick={handleTogglePlay}
                className="btn-primary"
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.4rem'
                }}
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} style={{ marginLeft: '3px' }} />}
              </button>

              <button
                onClick={handleNextTrack}
                style={{ background: 'none', border: 'none', color: 'var(--text-dark)', cursor: 'pointer', padding: '0.4rem' }}
              >
                <SkipForward size={22} />
              </button>

              {/* Volume Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '1rem' }}>
                <Volume2 size={18} color="var(--text-muted)" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{ width: '80px', accentColor: 'var(--lavender-600)', cursor: 'pointer' }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Sound Library Grid */}
      <div>
        <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Explore Soundscapes Library
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}>
          {filteredTracks.map((t, idx) => {
            const isThisPlaying = isPlaying && activeTrackIndex === idx;
            return (
              <div
                key={t.id}
                className="glass-card"
                style={{
                  padding: '1.4rem',
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  border: isThisPlaying ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                  background: isThisPlaying ? 'var(--lavender-50)' : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ fontSize: '2rem' }}>{t.category.split(' ')[0]}</div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>
                      {t.title}
                    </h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatTime(t.duration)} • {t.category}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveTrackIndex(idx);
                    if (!isThisPlaying) {
                      startAudioSynth(t.id);
                      setIsPlaying(true);
                    } else {
                      stopAudioSynth();
                      setIsPlaying(false);
                    }
                  }}
                  className={isThisPlaying ? 'btn-primary' : 'btn-secondary'}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {isThisPlaying ? <Pause size={16} /> : <Play size={16} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Copyright Disclaimer Note (Requirement 18) */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.8)',
        border: '1px solid var(--border-light)',
        padding: '1rem 1.25rem',
        borderRadius: 'var(--radius-md)',
        fontSize: '0.84rem',
        color: 'var(--text-muted)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.6rem'
      }}>
        <Info size={18} color="var(--blue-500)" style={{ flexShrink: 0 }} />
        <span>
          🎧 Audio is provided for relaxation, focus and mindful breaks. Please check the original creator/license when using external audio.
        </span>
      </div>

    </div>
  );
}
