import React, { useState, useEffect } from 'react';
import { ArrowRight, Info, Heart, Sparkles, CheckCircle2, Gamepad2, Music, Activity, Wind, BarChart3, Smile } from 'lucide-react';
import Sticker from './Sticker';
import { getThoughtForDate } from '../data/thoughts';
import { getDailyWellnessPlan } from '../data/wellnessPlan';
import { getStoredMoodLogs, saveMoodLog, getUserId, saveUserMoodLog } from '../utils/storage';

export default function LandingPage({ onStartJourney, onHowItWorks, onNavigate, onSaveMoodLog, userProfile }) {
  // ----------------------------------------------------
  // Randomized Daily Positive Message (Requirement 22)
  // ----------------------------------------------------
  const dailyReminders = [
    "Small steps still move you forward.",
    "Take a breath. You don't have to do everything at once.",
    "Progress matters more than perfection.",
    "Be kind to your mind today.",
    "It’s okay to take a break.",
    "You are worthy of rest, peace, and self-care."
  ];

  const [todayReminder, setTodayReminder] = useState('');
  const [currentDateFormatted, setCurrentDateFormatted] = useState('');
  const [thoughtData, setThoughtData] = useState(() => getThoughtForDate());

  // ----------------------------------------------------
  // "How are you feeling today? 🌿" State & Options
  // ----------------------------------------------------
  const moodCheckInOptions = [
    { id: 'great', label: 'Great', icon: '😊', score: 5, color: '#10B981', bg: '#ECFDF5' },
    { id: 'good', label: 'Good', icon: '🙂', score: 4, color: '#0EA5E9', bg: '#F0F9FF' },
    { id: 'okay', label: 'Okay', icon: '😐', score: 3, color: '#8B5CF6', bg: '#F5F3FF' },
    { id: 'low', label: 'Low', icon: '😟', score: 2, color: '#F59E0B', bg: '#FFFBEB' },
    { id: 'stressed', label: 'Stressed', icon: '😫', score: 1, color: '#F43F5E', bg: '#FFF1F2' }
  ];

  const [selectedHomepageMood, setSelectedHomepageMood] = useState(null);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // ----------------------------------------------------
  // "Today's Wellness Plan 🌿" State & Logic
  // ----------------------------------------------------
  const [dailyPlan, setDailyPlan] = useState(() => getDailyWellnessPlan());
  const [completedSuggestions, setCompletedSuggestions] = useState({});

  // ----------------------------------------------------
  // "🌿 Take a Break" 60-Second Relaxation Timer State
  // ----------------------------------------------------
  const [timerSecs, setTimerSecs] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerCompleted, setTimerCompleted] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isTimerRunning && timerSecs > 0) {
      interval = setInterval(() => {
        setTimerSecs((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimerCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSecs]);

  const handleStartTimer = () => {
    setTimerCompleted(false);
    if (timerSecs === 0) {
      setTimerSecs(60);
    }
    setIsTimerRunning(true);
  };

  const handlePauseTimer = () => {
    setIsTimerRunning(false);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setTimerSecs(60);
    setTimerCompleted(false);
  };

  const formatTimerDisplay = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const randomMsg = dailyReminders[Math.floor(Math.random() * dailyReminders.length)];
    setTodayReminder(randomMsg);
    setThoughtData(getThoughtForDate());
    setDailyPlan(getDailyWellnessPlan());

    // Load completion state for today from localStorage
    const todayStr = new Date().toISOString().split('T')[0];
    try {
      const saved = localStorage.getItem(`mindbridge_wellness_plan_${todayStr}`);
      if (saved) {
        setCompletedSuggestions(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }

    // Check if user already logged a mood today to visually highlight it
    const logs = getStoredMoodLogs();
    const todayLog = logs && logs.find(l => l.date === todayStr);
    if (todayLog) {
      const match = moodCheckInOptions.find(opt => 
        opt.label.toLowerCase() === todayLog.mood?.toLowerCase() || 
        opt.icon === todayLog.icon
      );
      if (match) {
        setSelectedHomepageMood(match.id);
        setConfirmationMessage('Your mood has been recorded for today.');
      }
    }

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
    const d = new Date();
    const dayName = days[d.getDay()];
    const dayNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();

    setCurrentDateFormatted(`${dayName}, ${dayNum} ${monthName} ${year}`);
  }, []);

  const handleMoodSelect = (opt) => {
    setSelectedHomepageMood(opt.id);
    setConfirmationMessage('Your mood has been recorded.');

    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `log-${Date.now()}`,
      date: todayStr,
      moodScore: opt.score,
      mood: opt.label,
      icon: opt.icon,
      tag: 'Homepage Check-in',
      note: 'Recorded from homepage quick check-in'
    };

    saveMoodLog(newEntry);

    const userId = getUserId(userProfile);
    if (userId) {
      saveUserMoodLog(userId, newEntry);
    }

    if (onSaveMoodLog) {
      onSaveMoodLog(newEntry);
    }
  };

  const toggleSuggestion = (id) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setCompletedSuggestions((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      try {
        localStorage.setItem(`mindbridge_wellness_plan_${todayStr}`, JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  const completedCount = Object.values(completedSuggestions).filter(Boolean).length;

  // ----------------------------------------------------
  // "What do you need right now? 💭" Interactive State (Requirement 7)
  // ----------------------------------------------------
  const [selectedNeed, setSelectedNeed] = useState(null);

  const needsOptions = [
    {
      id: 'stressed',
      label: '😰 Stressed',
      recs: [
        { title: 'Breathing Exercise', desc: '4-7-8 box breathing', icon: '🌬️', action: () => onNavigate('meditation') },
        { title: 'Guided Meditation', desc: '5-min stress relief', icon: '🧘', action: () => onNavigate('meditation') },
        { title: 'Rain Sounds', desc: 'Calming rainfall soundscape', icon: '🌧️', action: () => onNavigate('music') },
        { title: 'Memory Match Game', desc: 'Relaxing symbol matching', icon: '🧠', action: () => onNavigate('games') }
      ]
    },
    {
      id: 'tired',
      label: '😴 Tired',
      recs: [
        { title: 'Short Gentle Stretch', desc: '5-min neck & shoulder un-knot', icon: '🤸', action: () => onNavigate('exercise') },
        { title: 'Relaxing Nature Sounds', desc: 'Gentle forest breeze', icon: '🌲', action: () => onNavigate('music') },
        { title: 'Breathing Garden', desc: 'Animated flower breathing', icon: '🌸', action: () => onNavigate('games') }
      ]
    },
    {
      id: 'low',
      label: '😔 Low',
      recs: [
        { title: 'Gentle Positive Music', desc: 'Soothing upbeat piano', icon: '🎹', action: () => onNavigate('music') },
        { title: 'Calm Clicker', desc: 'Tap for encouraging messages', icon: '✨', action: () => onNavigate('games') },
        { title: 'Daily Check-in', desc: 'Record your feelings gently', icon: '😊', action: () => onNavigate('mood') }
      ]
    },
    {
      id: 'okay',
      label: '😐 Okay',
      recs: [
        { title: 'Mindful Walk', desc: '10-min mindful walking', icon: '🚶', action: () => onNavigate('exercise') },
        { title: 'Memory Match', desc: 'Fun card pairing break', icon: '🧠', action: () => onNavigate('games') },
        { title: 'Focus Music', desc: 'Alpha wave focus flow', icon: '🎯', action: () => onNavigate('music') }
      ]
    },
    {
      id: 'good',
      label: '😄 Good',
      recs: [
        { title: 'Healthy Habit Tracker', desc: 'Log your positive streak', icon: '📊', action: () => onNavigate('progress') },
        { title: 'Focus Ambient', desc: 'Background deep focus', icon: '🎧', action: () => onNavigate('music') },
        { title: 'Light Exercise', desc: '10-min energy boost', icon: '🏃', action: () => onNavigate('exercise') }
      ]
    },
    {
      id: 'focus',
      label: '🎯 Need Focus',
      recs: [
        { title: 'Focus Ambient Music', desc: 'Alpha wave concentration sound', icon: '🎵', action: () => onNavigate('music') },
        { title: 'Calm Clicker', desc: 'Micro-break to reset attention', icon: '✨', action: () => onNavigate('games') },
        { title: 'Short Breathing', desc: '1-min focus breath', icon: '🌬️', action: () => onNavigate('meditation') }
      ]
    },
    {
      id: 'calm',
      label: '😌 Need Calm',
      recs: [
        { title: 'Guided Meditation', desc: 'Mindfulness reflection', icon: '🧘', action: () => onNavigate('meditation') },
        { title: 'Rain & Ocean Sounds', desc: 'Immerse in nature', icon: '🌧️', action: () => onNavigate('music') },
        { title: 'Breathing Garden', desc: 'Interactive lotus breath', icon: '🌱', action: () => onNavigate('games') }
      ]
    }
  ];

  // ----------------------------------------------------
  // MindBridge Feature Symbols / Labels (Requirement 3)
  // ----------------------------------------------------
  const symbols = [
    { icon: '🧠', title: 'Mental Wellness', desc: 'Customized support tailored to your daily routine' },
    { icon: '😊', title: 'Mood Tracking', desc: 'Daily check-ins to observe emotional trends' },
    { icon: '🧘', title: 'Meditation', desc: 'Guided soundscapes & 4-7-8 breathing techniques' },
    { icon: '🏃', title: 'Exercise', desc: 'Gentle physical movement for mental clarity' },
    { icon: '📊', title: 'Progress', desc: 'Visual analytics & transparent wellness scores' },
    { icon: '🌱', title: 'Self Growth', desc: 'Achievable daily plans for balanced living' }
  ];

  // ----------------------------------------------------
  // MindBridge Toolkit Cards (Requirement 6)
  // ----------------------------------------------------
  const toolkitCards = [
    {
      icon: '🧠',
      title: 'Assessment',
      desc: 'Take a wellness assessment and understand your current wellness pattern.',
      tab: 'assessment',
      bg: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)',
      color: '#6D28D9'
    },
    {
      icon: '😊',
      title: 'Mood Tracker',
      desc: 'Record your daily mood and observe changes over time.',
      tab: 'mood',
      bg: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)',
      color: '#0284C7'
    },
    {
      icon: '🎮',
      title: 'Relax & Play',
      desc: 'Take a short mindful break through relaxing mini-games.',
      tab: 'games',
      bg: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)',
      color: '#059669'
    },
    {
      icon: '🎵',
      title: 'Mind Refresh',
      desc: 'Listen to calming sounds and relaxing music.',
      tab: 'music',
      bg: 'linear-gradient(135deg, #FFF1F2, #FFE4E6)',
      color: '#E11D48'
    },
    {
      icon: '🧘',
      title: 'Meditation',
      desc: 'Practice guided meditation and breathing.',
      tab: 'meditation',
      bg: 'linear-gradient(135deg, #F5F3FF, #DDD6FE)',
      color: '#7C3AED'
    },
    {
      icon: '🏃',
      title: 'Activities',
      desc: 'Try simple wellness activities and exercises.',
      tab: 'exercise',
      bg: 'linear-gradient(135deg, #FEF3C7, #FDE68A)',
      color: '#D97706'
    },
    {
      icon: '📊',
      title: 'Progress',
      desc: 'Track your wellness journey.',
      tab: 'progress',
      bg: 'linear-gradient(135deg, #F0F9FF, #BAE6FD)',
      color: '#0EA5E9'
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* ---------------------------------------------------- */}
      {/* 0. Current Date & Day Top Display */}
      {/* ---------------------------------------------------- */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.8rem',
        padding: '0.85rem 1.4rem',
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid var(--border-lavender)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, var(--lavender-200), var(--blue-200))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.3rem',
            boxShadow: '0 4px 10px rgba(139, 92, 246, 0.15)'
          }}>
            📅
          </div>
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--lavender-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Today’s Date & Day
            </span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
              {currentDateFormatted || 'Saturday, 5 September 2026'}
            </h3>
          </div>
        </div>

        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 0.9rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--mint-50)',
          border: '1px solid var(--mint-200)',
          color: 'var(--mint-600)',
          fontSize: '0.82rem',
          fontWeight: 700
        }}>
          <span>🌱 A fresh new day for self-care</span>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 1. Daily Positive Reminder Banner (Requirement 22) */}
      {/* ---------------------------------------------------- */}
      <div style={{
        background: 'linear-gradient(135deg, #FFF1F2 0%, #F5F3FF 50%, #E0F2FE 100%)',
        border: '1.5px solid var(--border-lavender)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '1.5rem' }}>🌷</span>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--lavender-700)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Your Reminder For Today
            </span>
            <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              “{todayReminder}”
            </p>
          </div>
        </div>

        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.7)', padding: '0.3rem 0.8rem', borderRadius: 'var(--radius-full)' }}>
          🔒 Non-Medical Wellness Companion
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Thought of the Day Section */}
      {/* ---------------------------------------------------- */}
      <div className="glass-card" style={{
        padding: '1.6rem 2rem',
        background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(245, 243, 255, 0.95) 50%, rgba(240, 249, 255, 0.95) 100%)',
        border: '1.5px solid var(--mint-200)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.8rem',
          marginBottom: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--mint-100), var(--mint-200))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 3px 8px rgba(16, 185, 129, 0.18)'
            }}>
              🌿
            </div>
            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--mint-600)',
              margin: 0,
              letterSpacing: '-0.2px'
            }}>
              🌿 Thought of the Day
            </h2>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid var(--border-lavender)',
            fontSize: '0.78rem',
            fontWeight: 600,
            color: 'var(--lavender-700)'
          }}>
            <span>🗓️ Day {thoughtData.dayNumber} of {thoughtData.totalCycle} • Daily Rotation</span>
          </div>
        </div>

        <div style={{
          padding: '1.2rem 1.6rem',
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(16, 185, 129, 0.18)',
          boxShadow: 'inset 0 1px 3px rgba(255, 255, 255, 0.8)'
        }}>
          <p style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'var(--text-dark)',
            fontStyle: 'italic',
            lineHeight: 1.5,
            margin: 0
          }}>
            “{thoughtData.thought}”
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* How are you feeling today? 🌿 Section */}
      {/* ---------------------------------------------------- */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 243, 255, 0.9) 50%, rgba(240, 249, 255, 0.9) 100%)',
        border: '1.5px solid var(--border-lavender)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.2rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--lavender-200), var(--blue-200))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 3px 8px rgba(139, 92, 246, 0.18)'
            }}>
              💭
            </div>
            <h2 style={{
              fontSize: '1.35rem',
              fontWeight: 700,
              color: 'var(--text-dark)',
              margin: 0,
              letterSpacing: '-0.2px'
            }}>
              How are you feeling today? 🌿
            </h2>
          </div>

          {confirmationMessage && (
            <div className="animate-fade-in" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.4rem 0.95rem',
              borderRadius: 'var(--radius-full)',
              background: 'var(--mint-50)',
              border: '1.5px solid var(--mint-200)',
              color: 'var(--mint-600)',
              fontSize: '0.82rem',
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.15)'
            }}>
              <CheckCircle2 size={16} />
              <span>{confirmationMessage}</span>
            </div>
          )}
        </div>

        {/* 5 Selectable Options */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.8rem',
          width: '100%'
        }}>
          {moodCheckInOptions.map((opt) => {
            const isSelected = selectedHomepageMood === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleMoodSelect(opt)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.55rem',
                  padding: '0.85rem 1.2rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? `2.5px solid ${opt.color}` : '1.5px solid var(--border-light)',
                  background: isSelected ? opt.bg : 'rgba(255, 255, 255, 0.85)',
                  boxShadow: isSelected ? `0 6px 18px -3px ${opt.color}40` : 'var(--shadow-sm)',
                  transform: isSelected ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '1rem',
                  color: isSelected ? opt.color : 'var(--text-dark)',
                  flex: '1 1 120px',
                  minWidth: '110px'
                }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* Today's Wellness Plan 🌿 Section */}
      {/* ---------------------------------------------------- */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(240, 249, 255, 0.95) 0%, rgba(245, 243, 255, 0.95) 50%, rgba(236, 253, 245, 0.95) 100%)',
        border: '1.5px solid var(--border-lavender)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--blue-200), var(--mint-200))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 3px 8px rgba(14, 165, 233, 0.18)'
            }}>
              🌱
            </div>
            <div>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--text-dark)',
                margin: 0,
                letterSpacing: '-0.2px'
              }}>
                Today's Wellness Plan 🌿
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                3 simple habits automatically refreshed for today
              </span>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: completedCount === 3 ? 'var(--mint-50)' : 'rgba(255, 255, 255, 0.85)',
            border: completedCount === 3 ? '1px solid var(--mint-200)' : '1px solid var(--border-lavender)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: completedCount === 3 ? 'var(--mint-600)' : 'var(--lavender-700)'
          }}>
            <span>{completedCount === 3 ? '🎉 All 3 Completed!' : `${completedCount} of 3 Completed`}</span>
          </div>
        </div>

        {/* 3 Simple Suggestions Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1rem',
          width: '100%'
        }}>
          {dailyPlan.map((item, idx) => {
            const isDone = completedSuggestions[item.id] || false;
            return (
              <div
                key={item.id}
                onClick={() => toggleSuggestion(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.9rem',
                  padding: '1.1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: isDone ? 'rgba(236, 253, 245, 0.92)' : 'rgba(255, 255, 255, 0.88)',
                  border: isDone ? '1.5px solid var(--mint-500)' : '1px solid var(--border-light)',
                  boxShadow: isDone ? '0 4px 14px rgba(16, 185, 129, 0.15)' : 'var(--shadow-sm)',
                  cursor: 'pointer',
                  transition: 'all 0.22s ease',
                  userSelect: 'none'
                }}
              >
                <div style={{
                  width: '44px',
                  height: '44px',
                  minWidth: '44px',
                  borderRadius: '12px',
                  background: isDone ? 'var(--mint-100)' : 'var(--lavender-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.5rem'
                }}>
                  {item.icon}
                </div>

                <div style={{ flex: 1 }}>
                  <span style={{
                    display: 'inline-block',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: isDone ? 'var(--mint-600)' : 'var(--lavender-700)',
                    letterSpacing: '0.04em',
                    marginBottom: '0.15rem'
                  }}>
                    Suggestion {idx + 1} • {item.category}
                  </span>
                  <p style={{
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: isDone ? 'var(--mint-600)' : 'var(--text-dark)',
                    textDecoration: isDone ? 'line-through' : 'none',
                    margin: 0,
                    lineHeight: 1.35
                  }}>
                    {item.text}
                  </p>
                </div>

                <div style={{
                  width: '24px',
                  height: '24px',
                  minWidth: '24px',
                  borderRadius: '50%',
                  border: isDone ? 'none' : '2px solid var(--text-light)',
                  background: isDone ? 'var(--mint-500)' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  fontSize: '0.75rem',
                  fontWeight: 800
                }}>
                  {isDone && '✓'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 🌿 Take a Break Section */}
      {/* ---------------------------------------------------- */}
      <div className="glass-card" style={{
        padding: '1.75rem 2rem',
        background: 'linear-gradient(135deg, rgba(236, 253, 245, 0.95) 0%, rgba(240, 249, 255, 0.95) 50%, rgba(245, 243, 255, 0.95) 100%)',
        border: '1.5px solid var(--mint-200)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, var(--mint-100), var(--mint-200))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
              boxShadow: '0 3px 8px rgba(16, 185, 129, 0.18)'
            }}>
              🌿
            </div>
            <div>
              <h2 style={{
                fontSize: '1.35rem',
                fontWeight: 700,
                color: 'var(--mint-600)',
                margin: 0,
                letterSpacing: '-0.2px'
              }}>
                🌿 Take a Break
              </h2>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', margin: 0 }}>
                Take a moment to pause and breathe.
              </p>
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255, 255, 255, 0.85)',
            border: '1px solid var(--mint-200)',
            fontSize: '0.78rem',
            fontWeight: 700,
            color: 'var(--mint-600)'
          }}>
            <span>⏱️ 60-Second Relaxation Timer</span>
          </div>
        </div>

        {/* Timer Display & Controls Container */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.5rem',
          padding: '1.4rem 1.8rem',
          background: 'rgba(255, 255, 255, 0.88)',
          backdropFilter: 'blur(8px)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid rgba(16, 185, 129, 0.2)'
        }}>
          {/* Left Timer Readout & Calming Message */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', flexWrap: 'wrap' }}>
            <div style={{
              width: '75px',
              height: '75px',
              borderRadius: '50%',
              background: isTimerRunning 
                ? 'linear-gradient(135deg, var(--mint-100), var(--blue-100))'
                : 'var(--lavender-50)',
              border: isTimerRunning ? '2.5px solid var(--mint-500)' : '2px solid var(--border-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.4rem',
              fontWeight: 800,
              color: isTimerRunning ? 'var(--mint-600)' : 'var(--text-dark)',
              boxShadow: isTimerRunning ? '0 0 20px rgba(16, 185, 129, 0.3)' : 'none',
              transition: 'all 0.3s ease'
            }}>
              {formatTimerDisplay(timerSecs)}
            </div>

            <div>
              <p style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-dark)',
                margin: 0
              }}>
                {timerCompleted 
                  ? '✨ Mindful break complete! You restored your balance.' 
                  : isTimerRunning 
                    ? (timerSecs % 8 < 4 ? '🌬️ Inhale slowly...' : '💨 Exhale gently...')
                    : 'Take a moment to pause and breathe.'}
              </p>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                {isTimerRunning ? 'Focus on your breath until the timer ends.' : 'Click Start to begin your 60-second break.'}
              </span>
            </div>
          </div>

          {/* Right Action Buttons: Start, Pause, Reset */}
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            {!isTimerRunning ? (
              <button
                type="button"
                onClick={handleStartTimer}
                className="btn-primary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem' }}
              >
                <span>▶ {timerSecs < 60 && timerSecs > 0 ? 'Resume' : 'Start'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseTimer}
                className="btn-secondary"
                style={{ padding: '0.65rem 1.4rem', fontSize: '0.92rem', color: 'var(--amber-500)', borderColor: 'var(--amber-500)' }}
              >
                <span>⏸ Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetTimer}
              className="btn-outline"
              style={{ padding: '0.65rem 1.2rem', fontSize: '0.92rem' }}
            >
              <span>🔄 Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 2. Hero Section with Motivational Stickers (Requirement 3 & 4) */}
      {/* ---------------------------------------------------- */}
      <div className="hero-container glass-card" style={{
        padding: '4rem 2.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'visible',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.96), rgba(243, 232, 255, 0.65))'
      }}>
        {/* LEFT SIDE FLOATING STICKERS (Desktop) */}
        <div className="left-hero-stickers" style={{
          position: 'absolute',
          left: '15px',
          top: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          alignItems: 'flex-start',
          zIndex: 5
        }}>
          <Sticker
            text="It’s okay to take a break."
            icon="☕"
            bg="#F5F3FF"
            color="#6D28D9"
            borderColor="#DDD6FE"
            rotate="-4deg"
            float={true}
          />
          <Sticker
            text="Small steps every day lead to big changes."
            icon="🌱"
            bg="#ECFDF5"
            color="#047857"
            borderColor="#A7F3D0"
            rotate="3deg"
            float={true}
          />
          <Sticker
            text="You are enough, just as you are."
            icon="💖"
            bg="#FFF1F2"
            color="#BE123C"
            borderColor="#FECDD3"
            rotate="-2deg"
            float={true}
          />
        </div>

        {/* RIGHT SIDE FLOATING STICKERS (Desktop) */}
        <div className="right-hero-stickers" style={{
          position: 'absolute',
          right: '15px',
          top: '30px',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.2rem',
          alignItems: 'flex-end',
          zIndex: 5
        }}>
          <Sticker
            text="Good things take time."
            icon="🌸"
            bg="#FEF3C7"
            color="#B45309"
            borderColor="#FDE68A"
            rotate="4deg"
            float={true}
          />
          <Sticker
            text="Focus on progress, not perfection."
            icon="✨"
            bg="#E0F2FE"
            color="#0369A1"
            borderColor="#BAE6FD"
            rotate="-3deg"
            float={true}
          />
          <Sticker
            text="You’ve got this!"
            icon="🌈"
            bg="#F5F3FF"
            color="#7C3AED"
            borderColor="#C4B5FD"
            rotate="2deg"
            float={true}
          />
        </div>

        {/* Hero Central Content */}
        <div style={{ maxWidth: '640px', margin: '0 auto', position: 'relative', zIndex: 10 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1.1rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--lavender-100)',
            color: 'var(--lavender-700)',
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '1.25rem'
          }}>
            <Sparkles size={16} />
            <span>Digital Mental-Wellness Companion</span>
          </div>

          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '0.8rem',
            letterSpacing: '-0.5px',
            color: 'var(--text-dark)'
          }}>
            🧠 MindBridge
          </h1>

          <p style={{
            fontSize: '1.4rem',
            color: 'var(--text-muted)',
            margin: '0 auto 2.2rem auto',
            fontWeight: 500,
            lineHeight: 1.4
          }}>
            “A bridge to a better state of mind.”
          </p>

          {/* Hero Buttons */}
          <div style={{ display: 'flex', gap: '1.2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button 
              onClick={onStartJourney} 
              className="btn-primary"
              style={{ fontSize: '1.15rem', padding: '1rem 2.4rem' }}
            >
              <span>✨ Start Your Wellness Journey</span>
              <ArrowRight size={20} />
            </button>

            <button 
              onClick={onHowItWorks} 
              className="btn-secondary"
              style={{ fontSize: '1.15rem', padding: '1rem 2.2rem' }}
            >
              <span>ℹ️ How It Works</span>
            </button>
          </div>
        </div>

        {/* LOWER HERO STICKERS BANNER */}
        <div style={{
          marginTop: '3.5rem',
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
          zIndex: 5
        }}>
          <Sticker text="Be kind to your mind." icon="🧠" bg="#F5F3FF" color="#6D28D9" rotate="-2deg" />
          <Sticker text="Every day is a fresh start." icon="🌅" bg="#ECFDF5" color="#047857" rotate="3deg" />
          <Sticker text="Collect moments, not things." icon="🎀" bg="#FFF1F2" color="#BE123C" rotate="-3deg" />
          <Sticker text="Choose happy today." icon="☀️" bg="#FEF3C7" color="#B45309" rotate="2deg" />
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 3. Feature Symbols Grid (Requirement 3) */}
      {/* ---------------------------------------------------- */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>Explore MindBridge Core Features</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gentle, evidence-informed tools designed for your daily routine</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {symbols.map((item, idx) => (
            <div 
              key={idx} 
              className="glass-card" 
              style={{
                padding: '1.8rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '1rem',
                borderRadius: 'var(--radius-md)',
                background: '#FFFFFF'
              }}
            >
              <div style={{
                fontSize: '2.2rem',
                lineHeight: 1,
                padding: '0.6rem',
                background: 'var(--lavender-50)',
                borderRadius: '16px'
              }}>
                {item.icon}
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '0.3rem', color: 'var(--text-dark)' }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 4. "What do you need right now? 💭" Interactive Section (Requirement 7) */}
      {/* ---------------------------------------------------- */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', background: '#FFFFFF' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
            What do you need right now? 💭
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
            Select how you're feeling to receive immediate, tailored activity recommendations.
          </p>
        </div>

        {/* Need Selector Buttons */}
        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {needsOptions.map(opt => {
            const isSelected = selectedNeed?.id === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedNeed(opt)}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: 'var(--radius-full)',
                  border: isSelected ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                  background: isSelected ? 'var(--lavender-500)' : 'var(--lavender-50)',
                  color: isSelected ? '#FFFFFF' : 'var(--text-main)',
                  fontWeight: isSelected ? 700 : 600,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Recommendations Display */}
        {selectedNeed && (
          <div className="animate-fade-in" style={{
            background: 'linear-gradient(135deg, #F8FAFC, #F3E8FF)',
            border: '1px solid var(--border-lavender)',
            borderRadius: 'var(--radius-md)',
            padding: '2rem'
          }}>
            <h3 style={{ fontSize: '1.2rem', color: 'var(--lavender-700)', marginBottom: '1rem', textAlign: 'center' }}>
              ✨ Recommended for when you feel {selectedNeed.label}:
            </h3>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.2rem'
            }}>
              {selectedNeed.recs.map((r, i) => (
                <div key={i} style={{
                  background: '#FFFFFF',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{r.icon}</div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{r.title}</h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{r.desc}</p>
                  </div>

                  <button
                    onClick={r.action}
                    className="btn-primary"
                    style={{ fontSize: '0.85rem', padding: '0.5rem 1rem', width: '100%', justifyContent: 'center' }}
                  >
                    <span>Try Now →</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------- */}
      {/* 5. "🌿 MindBridge Toolkit" Cards (Requirement 6) */}
      {/* ---------------------------------------------------- */}
      <div>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)' }}>🌿 MindBridge Toolkit</h2>
          <p style={{ color: 'var(--text-muted)' }}>Everything you need for your daily mental-wellness routine</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem'
        }}>
          {toolkitCards.map((card, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '2rem 1.8rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                background: '#FFFFFF'
              }}
            >
              <div>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '18px',
                  background: card.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '1rem'
                }}>
                  {card.icon}
                </div>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '1.5rem' }}>
                  {card.desc}
                </p>
              </div>

              <button
                onClick={() => onNavigate(card.tab)}
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  borderColor: card.color,
                  color: card.color
                }}
              >
                <span>Explore →</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 6. "💌 Little Reminders" Sticker Gallery (Requirement 21) */}
      {/* ---------------------------------------------------- */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', background: '#FFFFFF' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.3rem' }}>
            💌 Little Reminders
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Pasteable digital sticker notes to carry through your day.
          </p>
        </div>

        <div style={{
          display: 'flex',
          gap: '1.2rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          <Sticker text="Be kind to your mind." icon="💜" bg="#F5F3FF" color="#6D28D9" rotate="-3deg" float={true} />
          <Sticker text="Small steps every day lead to big changes." icon="🌱" bg="#ECFDF5" color="#047857" rotate="2deg" float={true} />
          <Sticker text="Good things take time." icon="⏳" bg="#FEF3C7" color="#B45309" rotate="-2deg" float={true} />
          <Sticker text="You are enough." icon="🌸" bg="#FFF1F2" color="#BE123C" rotate="4deg" float={true} />
          <Sticker text="Focus on progress, not perfection." icon="✨" bg="#E0F2FE" color="#0369A1" rotate="-4deg" float={true} />
          <Sticker text="It’s okay to take a break." icon="☕" bg="#F5F3FF" color="#7C3AED" rotate="3deg" float={true} />
          <Sticker text="Every day is a fresh start." icon="☀️" bg="#ECFDF5" color="#059669" rotate="-2deg" float={true} />
          <Sticker text="You’ve got this!" icon="🌈" bg="#FEF3C7" color="#D97706" rotate="3deg" float={true} />
          <Sticker text="Choose happy today." icon="🌻" bg="#FFF1F2" color="#E11D48" rotate="-3deg" float={true} />
          <Sticker text="Collect moments, not things." icon="🎀" bg="#E0F2FE" color="#0284C7" rotate="2deg" float={true} />
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* 7. "How It Works" Section */}
      {/* ---------------------------------------------------- */}
      <div id="how-it-works-section" className="glass-card" style={{ padding: '2.5rem', background: '#FFFFFF' }}>
        <h2 style={{ fontSize: '1.8rem', marginBottom: '1.5rem', textAlign: 'center', color: 'var(--text-dark)' }}>
          How MindBridge Supports You 💜
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem'
        }}>
          {[
            { step: '1', title: 'Personalize Profile', desc: 'Tell us about your daily role (student, worker, homemaker) for tailored guidance.' },
            { step: '2', title: 'Take Assessment', desc: 'Complete 10 short reflection questions about stress, sleep, and personal life.' },
            { step: '3', title: 'View Your Analysis', desc: 'Explore clear doughnut, bar, radar, and line charts of your wellness areas.' },
            { step: '4', title: 'Enjoy Mindful Breaks', desc: 'Use box breathing, light movement, calming music, and relaxing mini-games.' }
          ].map((s, i) => (
            <div key={i} style={{
              background: 'var(--lavender-50)',
              padding: '1.5rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--lavender-500), var(--blue-500))',
                color: '#FFF',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.8rem'
              }}>
                {s.step}
              </div>
              <h3 style={{ fontSize: '1.05rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>{s.title}</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Responsive sticker positioning styles */}
      <style>{`
        @media (max-width: 1100px) {
          .left-hero-stickers, .right-hero-stickers {
            display: none !important;
          }
        }
      `}</style>

    </div>
  );
}
