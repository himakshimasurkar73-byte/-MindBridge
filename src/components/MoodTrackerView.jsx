import React, { useState } from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Save, Calendar as CalendarIcon, TrendingUp, Info, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function MoodTrackerView({ moodLogs, onSaveMoodLog }) {
  const [selectedMood, setSelectedMood] = useState(null);
  const [selectedTag, setSelectedTag] = useState('Nothing specific');
  const [note, setNote] = useState('');
  const [range, setRange] = useState(7); // 7 or 30 days
  const [savedSuccess, setSavedSuccess] = useState(false);

  const moodButtons = [
    { label: 'Great', icon: '😄', score: 5, color: '#10B981' },
    { label: 'Good', icon: '🙂', score: 4, color: '#0EA5E9' },
    { label: 'Okay', icon: '😐', score: 3, color: '#8B5CF6' },
    { label: 'Low', icon: '😔', score: 2, color: '#F59E0B' },
    { label: 'Stressed', icon: '😣', score: 1, color: '#F43F5E' },
  ];

  const tagOptions = [
    'Studies/Work',
    'Family',
    'Friends',
    'Sleep',
    'Health',
    'Personal thoughts',
    'Nothing specific',
    'Other'
  ];

  const handleSave = (e) => {
    e.preventDefault();
    if (!selectedMood) return;

    const newEntry = {
      id: `log-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      moodScore: selectedMood.score,
      mood: selectedMood.label,
      icon: selectedMood.icon,
      tag: selectedTag,
      note: note.trim()
    };

    onSaveMoodLog(newEntry);
    setSavedSuccess(true);
    try {
      confetti({ particleCount: 50, spread: 40 });
    } catch (err) {}
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  // Analytics computation
  const logsToDisplay = (moodLogs && moodLogs.length > 0) ? moodLogs : [];
  const slicedLogs = [...logsToDisplay].slice(0, range).reverse();

  // Find most common mood
  const moodCounts = {};
  logsToDisplay.forEach((l) => {
    moodCounts[l.mood] = (moodCounts[l.mood] || 0) + 1;
  });
  let mostCommonMood = 'Good 🙂';
  let maxC = 0;
  Object.keys(moodCounts).forEach((m) => {
    if (moodCounts[m] > maxC) {
      maxC = moodCounts[m];
      mostCommonMood = m;
    }
  });

  const chartData = {
    labels: slicedLogs.map(l => l.date ? l.date.slice(5) : 'Day'),
    datasets: [
      {
        label: 'Mood Level (1 to 5)',
        data: slicedLogs.map(l => l.moodScore || 3),
        borderColor: 'rgba(139, 92, 246, 1)',
        backgroundColor: 'rgba(139, 92, 246, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 6,
        pointBackgroundColor: '#8B5CF6'
      }
    ]
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
      
      {/* Daily Mood Check-In Card */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', background: '#FFFFFF' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
          How are you feeling today?
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.8rem' }}>
          Select the emoji that best captures your emotional state right now.
        </p>

        {/* 5 Emoji Buttons */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {moodButtons.map((btn) => {
            const isSelected = selectedMood?.label === btn.label;
            return (
              <button
                key={btn.label}
                type="button"
                onClick={() => setSelectedMood(btn)}
                style={{
                  padding: '1.2rem 0.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? `2px solid ${btn.color}` : '1px solid var(--border-light)',
                  background: isSelected ? `${btn.color}15` : 'var(--lavender-50)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  transition: 'all 0.2s ease',
                  transform: isSelected ? 'scale(1.05)' : 'scale(1)'
                }}
              >
                <span style={{ fontSize: '2.5rem', lineHeight: 1 }}>{btn.icon}</span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: btn.color }}>
                  {btn.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Optional Questions Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              What affected your mood today?
            </label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {tagOptions.map((tag) => {
                const isTagSelected = selectedTag === tag;
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => setSelectedTag(tag)}
                    style={{
                      padding: '0.4rem 0.9rem',
                      borderRadius: 'var(--radius-full)',
                      border: isTagSelected ? '1px solid var(--lavender-500)' : '1px solid var(--border-light)',
                      background: isTagSelected ? 'var(--lavender-500)' : '#FFF',
                      color: isTagSelected ? '#FFF' : 'var(--text-main)',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      cursor: 'pointer'
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              Add a short private note (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="e.g., Felt relaxed after taking a walk outdoors..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              style={{
                width: '100%',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.92rem'
              }}
            />
          </div>

          {savedSuccess && (
            <div style={{
              background: 'var(--mint-50)',
              color: 'var(--mint-600)',
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 600
            }}>
              <CheckCircle2 size={18} />
              <span>Today's mood saved successfully! 💜</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!selectedMood}
            className="btn-primary"
            style={{
              opacity: !selectedMood ? 0.5 : 1,
              cursor: !selectedMood ? 'not-allowed' : 'pointer',
              justifyContent: 'center'
            }}
          >
            <Save size={18} />
            <span>Save Today's Mood</span>
          </button>
        </form>
      </div>

      {/* Mood History & Analytics */}
      <div className="glass-card" style={{ padding: '2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>
              📈 Mood History & Analytics
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Observe your emotional patterns over time.
            </p>
          </div>

          {/* Range Selector */}
          <div style={{ display: 'flex', gap: '0.4rem', background: 'var(--lavender-50)', padding: '0.25rem', borderRadius: 'var(--radius-full)' }}>
            <button
              onClick={() => setRange(7)}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: range === 7 ? 'var(--lavender-500)' : 'transparent',
                color: range === 7 ? '#FFF' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              7 Days
            </button>

            <button
              onClick={() => setRange(30)}
              style={{
                padding: '0.35rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                background: range === 30 ? 'var(--lavender-500)' : 'transparent',
                color: range === 30 ? '#FFF' : 'var(--text-main)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer'
              }}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Analytics Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Check-ins</span>
            <h4 style={{ fontSize: '1.8rem', color: 'var(--lavender-700)', marginTop: '0.2rem' }}>{logsToDisplay.length}</h4>
          </div>

          <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Most Common Mood</span>
            <h4 style={{ fontSize: '1.4rem', color: 'var(--blue-600)', marginTop: '0.2rem' }}>{mostCommonMood}</h4>
          </div>

          <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '1.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Weekly Trend</span>
            <h4 style={{ fontSize: '1.4rem', color: 'var(--mint-600)', marginTop: '0.2rem' }}>Steady Positive 📈</h4>
          </div>
        </div>

        {/* Mood Graph */}
        <div style={{ height: '260px', marginBottom: '1.5rem' }}>
          <Line
            data={chartData}
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
                      const map = { 5: '😄 Great', 4: '🙂 Good', 3: '😐 Okay', 2: '😔 Low', 1: '😣 Stressed' };
                      return map[val] || val;
                    }
                  }
                }
              }
            }}
          />
        </div>

        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', textAlign: 'center' }}>
          ℹ️ Note: This mood tracker is for personal self-awareness. Avoid making medical conclusions from mood trends.
        </div>
      </div>

    </div>
  );
}
