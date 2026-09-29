import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  Lock, 
  Flame, 
  Award, 
  Target, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  UserCheck, 
  Smile, 
  Zap, 
  BookOpen, 
  Play, 
  Pause, 
  RotateCcw,
  Check,
  LogOut
} from 'lucide-react';
import { 
  getUserId, 
  getUserMoodLogs, 
  saveUserMoodLog, 
  getUserStreak, 
  updateUserStreak, 
  getUserAchievements, 
  unlockUserAchievement, 
  getUserFocusData, 
  saveUserFocusSession 
} from '../utils/storage';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function MemberDashboardView({ userProfile, onOpenRegistration, onNavigate, onLogout }) {
  const isRegistered = Boolean(userProfile && (userProfile.isRegistered || userProfile.name));
  const userId = getUserId(userProfile);

  // States for user data
  const [moodLogs, setMoodLogs] = useState([]);
  const [streakData, setStreakData] = useState({ count: 0, lastActiveDate: null });
  const [achievements, setAchievements] = useState({});
  const [focusData, setFocusData] = useState({ completedSessions: 0, totalMinutes: 0 });
  const [quickMoodMsg, setQuickMoodMsg] = useState('');

  // ----------------------------------------------------
  // Focus Mode State (25-min focus / 5-min break)
  // ----------------------------------------------------
  const [focusMode, setFocusMode] = useState('focus'); // 'focus' (25m) or 'break' (5m)
  const [focusSecs, setFocusSecs] = useState(25 * 60);
  const [isFocusRunning, setIsFocusRunning] = useState(false);
  const [focusCompletedMsg, setFocusCompletedMsg] = useState('');

  // Load user data on mount / user change
  useEffect(() => {
    if (isRegistered && userId) {
      const logs = getUserMoodLogs(userId);
      setMoodLogs(logs);

      const streak = getUserStreak(userId);
      setStreakData(streak);

      const achs = getUserAchievements(userId);
      setAchievements(achs);

      const fData = getUserFocusData(userId);
      setFocusData(fData);

      // Evaluate achievements automatically
      if (logs.length > 0) unlockUserAchievement(userId, 'first_checkin');
      if (streak.count >= 7) unlockUserAchievement(userId, 'seven_day_wellness');
      if (fData.completedSessions > 0) unlockUserAchievement(userId, 'focus_starter');
      
      // Auto check Wellness Explorer if logs + focus > 0
      if (logs.length > 0 && fData.completedSessions > 0) {
        unlockUserAchievement(userId, 'wellness_explorer');
      }

      setAchievements(getUserAchievements(userId));
    }
  }, [isRegistered, userId]);

  // Focus Timer countdown effect
  useEffect(() => {
    let interval = null;
    if (isFocusRunning && focusSecs > 0) {
      interval = setInterval(() => {
        setFocusSecs((prev) => {
          if (prev <= 1) {
            setIsFocusRunning(false);
            if (focusMode === 'focus') {
              const updated = saveUserFocusSession(userId, 25);
              setFocusData(updated);
              setStreakData(getUserStreak(userId));
              setAchievements(getUserAchievements(userId));
              setFocusCompletedMsg('🎉 25-Minute Focus Session Completed! Great job!');
            } else {
              setFocusCompletedMsg('☕ Short break completed! Ready for your next focus session?');
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isFocusRunning, focusSecs, focusMode, userId]);

  const handleStartFocus = () => {
    setFocusCompletedMsg('');
    if (focusSecs === 0) {
      setFocusSecs(focusMode === 'focus' ? 25 * 60 : 5 * 60);
    }
    setIsFocusRunning(true);
  };

  const handlePauseFocus = () => {
    setIsFocusRunning(false);
  };

  const handleResetFocus = () => {
    setIsFocusRunning(false);
    setFocusSecs(focusMode === 'focus' ? 25 * 60 : 5 * 60);
    setFocusCompletedMsg('');
  };

  const handleSwitchFocusMode = (mode) => {
    setIsFocusRunning(false);
    setFocusMode(mode);
    setFocusSecs(mode === 'focus' ? 25 * 60 : 5 * 60);
    setFocusCompletedMsg('');
  };

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleQuickLogMood = (score, label, icon) => {
    if (!userId) return;
    const todayStr = new Date().toISOString().split('T')[0];
    const newEntry = {
      id: `user-log-${Date.now()}`,
      date: todayStr,
      moodScore: score,
      mood: label,
      icon: icon,
      tag: 'Dashboard Quick Log',
      note: 'Logged from Member Dashboard'
    };

    const updated = saveUserMoodLog(userId, newEntry);
    setMoodLogs(updated);
    setStreakData(getUserStreak(userId));
    setAchievements(getUserAchievements(userId));
    setQuickMoodMsg(`Recorded "${label}" for today!`);
  };

  // Render Lock Screen if visitor is NOT registered
  if (!isRegistered) {
    return (
      <div className="animate-fade-in" style={{ maxWidth: '800px', margin: '2rem auto' }}>
        <div className="glass-card" style={{
          padding: '3.5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(243,232,255,0.7))',
          border: '1.5px solid var(--border-lavender)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, var(--lavender-200), var(--blue-200))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.2)'
          }}>
            <Lock size={32} color="var(--lavender-700)" />
          </div>

          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.8rem' }}>
            Registered Members Only 🔒
          </h2>

          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', maxWidth: '560px', margin: '0 auto 2rem auto', lineHeight: 1.5 }}>
            To protect user privacy and deliver personalized insights, the <strong>Weekly Mood Chart</strong>, <strong>Wellness Streak</strong>, <strong>Achievements/Badges</strong>, and <strong>Focus Mode</strong> are reserved for registered MindBridge members.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem auto'
          }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '1.4rem' }}>📊</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.3rem' }}>Weekly Mood Chart</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '1.4rem' }}>🔥</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.3rem' }}>Wellness Streak</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '1.4rem' }}>🏆</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.3rem' }}>Achievements</div>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.8)', borderRadius: '12px', border: '1px solid var(--border-light)' }}>
              <span style={{ fontSize: '1.4rem' }}>🎯</span>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-dark)', marginTop: '0.3rem' }}>Focus Mode</div>
            </div>
          </div>

          <button
            onClick={onOpenRegistration}
            className="btn-primary"
            style={{ fontSize: '1.15rem', padding: '1rem 2.4rem' }}
          >
            <UserCheck size={20} />
            <span>✨ Register / Sign In to Unlock Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Compute Weekly Mood Chart Data for Registered User
  // ----------------------------------------------------
  const getWeeklyChartData = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Get dates for current week
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
    const distanceToMon = (dayOfWeek + 6) % 7;
    const monday = new Date(now);
    monday.setDate(now.getDate() - distanceToMon);

    const weekScores = days.map((dayLabel, index) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + index);
      const dateStr = d.toISOString().split('T')[0];
      const match = moodLogs.find(l => l.date === dateStr);
      return match ? match.moodScore : null;
    });

    return {
      labels: days,
      datasets: [
        {
          label: `${userProfile?.name || 'User'}'s Mood Rating (1-5)`,
          data: weekScores,
          borderColor: 'rgba(139, 92, 246, 1)',
          backgroundColor: 'rgba(139, 92, 246, 0.15)',
          fill: true,
          tension: 0.35,
          pointRadius: 6,
          pointBackgroundColor: '#8B5CF6',
          spanGaps: true
        }
      ]
    };
  };

  const weeklyChartData = getWeeklyChartData();
  const hasMoodData = moodLogs.length > 0;

  // ----------------------------------------------------
  // Achievements Master Definitions
  // ----------------------------------------------------
  const badgeList = [
    {
      id: 'first_checkin',
      icon: '🌱',
      title: 'First Check-in',
      desc: 'Record your first mood entry.',
      isUnlocked: Boolean(achievements.first_checkin?.unlocked || moodLogs.length > 0)
    },
    {
      id: 'relaxation_beginner',
      icon: '🧘',
      title: 'Relaxation Beginner',
      desc: 'Complete your first relaxation or breathing activity.',
      isUnlocked: Boolean(achievements.relaxation_beginner?.unlocked)
    },
    {
      id: 'focus_starter',
      icon: '🎯',
      title: 'Focus Starter',
      desc: 'Complete your first 25-min Focus Mode session.',
      isUnlocked: Boolean(achievements.focus_starter?.unlocked || focusData.completedSessions > 0)
    },
    {
      id: 'seven_day_wellness',
      icon: '🔥',
      title: '7-Day Wellness',
      desc: 'Maintain a 7-day active wellness streak.',
      isUnlocked: Boolean(achievements.seven_day_wellness?.unlocked || streakData.count >= 7)
    },
    {
      id: 'wellness_explorer',
      icon: '🏆',
      title: 'Wellness Explorer',
      desc: 'Explore and use multiple MindBridge features.',
      isUnlocked: Boolean(achievements.wellness_explorer?.unlocked || (moodLogs.length > 0 && focusData.completedSessions > 0))
    }
  ];

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Registered User Header Banner */}
      <div className="glass-card" style={{
        padding: '2rem 2.2rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(236, 253, 245, 0.7))',
        border: '1.5px solid var(--mint-200)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, var(--mint-100), var(--blue-200))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.8rem',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)'
          }}>
            👤
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-dark)', margin: 0 }}>
                Welcome, {userProfile?.name || 'Member'} 👋
              </h2>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--mint-600)',
                background: 'var(--mint-50)',
                border: '1px solid var(--mint-200)',
                padding: '0.2rem 0.6rem',
                borderRadius: 'var(--radius-full)'
              }}>
                ✓ Registered Member
              </span>
            </div>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Your private personal wellness dashboard & focus tracker.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flexWrap: 'wrap' }}>
          {/* Wellness Streak Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.8rem',
            padding: '0.8rem 1.4rem',
            borderRadius: 'var(--radius-md)',
            background: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)',
            border: '1.5px solid #FDE68A',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
          }}>
            <span style={{ fontSize: '2rem' }}>🔥</span>
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#B45309', margin: 0 }}>
                {streakData.count} Day Wellness Streak
              </div>
              <div style={{ fontSize: '0.78rem', color: '#D97706', fontWeight: 600 }}>
                {streakData.count > 0 ? 'Active & updating automatically!' : 'Log an activity to start your streak!'}
              </div>
            </div>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="btn-secondary"
              style={{
                background: 'var(--rose-50)',
                color: 'var(--rose-500)',
                borderColor: 'var(--rose-100)',
                padding: '0.75rem 1.2rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer'
              }}
              title="End current active session"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid Row 1: Weekly Mood Chart & Quick Logger */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* 1. WEEKLY MOOD CHART */}
        <div className="glass-card" style={{
          padding: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>📊</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                  Weekly Mood Chart
                </h3>
              </div>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--lavender-50)', padding: '0.25rem 0.65rem', borderRadius: 'var(--radius-full)' }}>
                🔒 Private User Data
              </span>
            </div>

            {hasMoodData ? (
              <div style={{ height: '220px', marginTop: '1rem' }}>
                <Line 
                  data={weeklyChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        min: 1,
                        max: 5,
                        ticks: {
                          stepSize: 1,
                          callback: (val) => {
                            const map = { 5: '😄 Great', 4: '🙂 Good', 3: '😐 Okay', 2: '😟 Low', 1: '😫 Stressed' };
                            return map[val] || val;
                          }
                        }
                      }
                    },
                    plugins: {
                      legend: { display: false }
                    }
                  }}
                />
              </div>
            ) : (
              <div style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                background: 'rgba(248, 250, 252, 0.8)',
                borderRadius: 'var(--radius-md)',
                border: '1.5px dashed var(--border-light)',
                margin: '1rem 0'
              }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>📈</div>
                <p style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '0.4rem' }}>
                  Start recording your mood to build your weekly chart.
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Log how you're feeling today to generate your private weekly mood trend.
                </p>
              </div>
            )}
          </div>

          {/* Quick Mood Logging Bar inside Chart Card */}
          <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-dark)' }}>
                Quick Log Today's Mood:
              </span>
              {quickMoodMsg && (
                <span style={{ fontSize: '0.78rem', color: 'var(--mint-600)', fontWeight: 700 }}>
                  ✓ {quickMoodMsg}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
              {[
                { score: 5, label: 'Great', icon: '😄' },
                { score: 4, label: 'Good', icon: '🙂' },
                { score: 3, label: 'Okay', icon: '😐' },
                { score: 2, label: 'Low', icon: '😟' },
                { score: 1, label: 'Stressed', icon: '😫' }
              ].map((m) => (
                <button
                  key={m.score}
                  type="button"
                  onClick={() => handleQuickLogMood(m.score, m.label, m.icon)}
                  style={{
                    flex: 1,
                    padding: '0.5rem 0.2rem',
                    borderRadius: 'var(--radius-sm)',
                    border: '1px solid var(--border-light)',
                    background: '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.1rem'
                  }}
                  title={`Log ${m.label}`}
                >
                  <span>{m.icon}</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>{m.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 4. FOCUS MODE SECTION */}
        <div className="glass-card" style={{
          padding: '1.8rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 249, 255, 0.8))'
        }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.4rem' }}>🎯</span>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                  Focus Mode
                </h3>
              </div>
              <div style={{ display: 'flex', gap: '0.4rem' }}>
                <button
                  onClick={() => handleSwitchFocusMode('focus')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    background: focusMode === 'focus' ? 'var(--blue-500)' : 'var(--blue-50)',
                    color: focusMode === 'focus' ? '#FFF' : 'var(--blue-600)',
                    cursor: 'pointer'
                  }}
                >
                  25m Focus
                </button>
                <button
                  onClick={() => handleSwitchFocusMode('break')}
                  style={{
                    padding: '0.3rem 0.75rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: 'none',
                    background: focusMode === 'break' ? 'var(--mint-500)' : 'var(--mint-50)',
                    color: focusMode === 'break' ? '#FFF' : 'var(--mint-600)',
                    cursor: 'pointer'
                  }}
                >
                  5m Break
                </button>
              </div>
            </div>

            {/* Timer Display */}
            <div style={{
              textAlign: 'center',
              padding: '1.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.85)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                fontFamily: 'monospace',
                color: isFocusRunning ? 'var(--blue-600)' : 'var(--text-dark)',
                letterSpacing: '2px',
                lineHeight: 1
              }}>
                {formatTimer(focusSecs)}
              </div>

              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-muted)', marginTop: '0.6rem' }}>
                {focusMode === 'focus' ? '🧠 Deep Work & Study Session (25 min)' : '☕ Rest & Refresh Break (5 min)'}
              </div>

              {focusCompletedMsg && (
                <div className="animate-fade-in" style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  color: 'var(--mint-600)',
                  marginTop: '0.5rem'
                }}>
                  {focusCompletedMsg}
                </div>
              )}
            </div>
          </div>

          {/* Controls: Start, Pause, Reset */}
          <div style={{ marginTop: '1.2rem', display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            {!isFocusRunning ? (
              <button
                type="button"
                onClick={handleStartFocus}
                className="btn-primary"
                style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem', flex: 1 }}
              >
                <Play size={16} />
                <span>{focusSecs < (focusMode === 'focus' ? 25 * 60 : 5 * 60) && focusSecs > 0 ? 'Resume' : 'Start Focus'}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePauseFocus}
                className="btn-secondary"
                style={{ padding: '0.75rem 1.8rem', fontSize: '0.95rem', flex: 1, color: 'var(--amber-500)', borderColor: 'var(--amber-500)' }}
              >
                <Pause size={16} />
                <span>Pause</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleResetFocus}
              className="btn-outline"
              style={{ padding: '0.75rem 1.2rem', fontSize: '0.95rem' }}
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. ACHIEVEMENTS & BADGES SECTION */}
      <div className="glass-card" style={{ padding: '1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem', marginBottom: '1.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '1.6rem' }}>🏆</span>
            <div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                Achievements & Badges
              </h3>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Personal milestones saved for {userProfile?.name || 'you'}
              </span>
            </div>
          </div>

          <div style={{
            padding: '0.35rem 0.85rem',
            borderRadius: 'var(--radius-full)',
            background: 'var(--lavender-100)',
            color: 'var(--lavender-700)',
            fontSize: '0.82rem',
            fontWeight: 700
          }}>
            {badgeList.filter(b => b.isUnlocked).length} of {badgeList.length} Badges Unlocked
          </div>
        </div>

        {/* Badge Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          {badgeList.map((badge) => {
            const unlocked = badge.isUnlocked;
            return (
              <div
                key={badge.id}
                style={{
                  padding: '1.25rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  background: unlocked 
                    ? 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(236,253,245,0.9))'
                    : 'rgba(248, 250, 252, 0.6)',
                  border: unlocked ? '1.5px solid var(--mint-500)' : '1px solid var(--border-light)',
                  boxShadow: unlocked ? '0 6px 18px rgba(16, 185, 129, 0.15)' : 'none',
                  opacity: unlocked ? 1 : 0.65,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '16px',
                  background: unlocked ? 'var(--mint-100)' : 'var(--border-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  marginBottom: '0.75rem',
                  boxShadow: unlocked ? '0 4px 10px rgba(16, 185, 129, 0.2)' : 'none'
                }}>
                  {badge.icon}
                </div>

                <div style={{ fontSize: '1rem', fontWeight: 700, color: unlocked ? 'var(--text-dark)' : 'var(--text-muted)', marginBottom: '0.2rem' }}>
                  {badge.title}
                </div>

                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.3, marginBottom: '0.8rem' }}>
                  {badge.desc}
                </div>

                <div style={{
                  marginTop: 'auto',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  padding: '0.25rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  background: unlocked ? 'var(--mint-50)' : 'rgba(203, 213, 225, 0.4)',
                  color: unlocked ? 'var(--mint-600)' : 'var(--text-muted)',
                  border: unlocked ? '1px solid var(--mint-200)' : 'none'
                }}>
                  {unlocked ? (
                    <>
                      <Check size={13} />
                      <span>Unlocked</span>
                    </>
                  ) : (
                    <>
                      <Lock size={12} />
                      <span>Locked</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
