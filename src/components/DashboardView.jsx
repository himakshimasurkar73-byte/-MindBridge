import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar, Radar, Line } from 'react-chartjs-2';
import { Sparkles, ArrowRight, ShieldCheck, Heart, Moon, Zap, BookOpen, Users, Compass } from 'lucide-react';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Title
);

export default function DashboardView({ userProfile, assessmentResults, moodLogs, onGoToRecommendations, onRetakeQuiz, onNavigate }) {
  const name = userProfile?.name || 'Friend';
  const results = assessmentResults || {
    overallScore: 72,
    category: 'GOOD WELLNESS',
    statusBadge: '🟢 GOOD WELLNESS',
    statusColor: '#10B981',
    tagline: 'You are maintaining a strong, positive equilibrium in your daily life.',
    breakdown: {
      emotional: 80,
      sleep: 60,
      energy: 70,
      workStress: 50,
      social: 80
    },
    disclaimer: 'This result reflects your responses in this assessment and is not a medical diagnosis.'
  };

  const { overallScore, statusBadge, statusColor, tagline, breakdown, disclaimer } = results;

  // Chart Data Configurations
  const doughnutData = {
    labels: ['Wellness Score', 'Remaining'],
    datasets: [
      {
        data: [overallScore, 100 - overallScore],
        backgroundColor: [statusColor, '#E2E8F0'],
        borderWidth: 0,
        hoverOffset: 4,
      },
    ],
  };

  const barData = {
    labels: ['Emotional Balance', 'Sleep & Rest', 'Energy', 'Work/Study Stress', 'Social Support'],
    datasets: [
      {
        label: 'Wellness %',
        data: [
          breakdown.emotional,
          breakdown.sleep,
          breakdown.energy,
          breakdown.workStress,
          breakdown.social
        ],
        backgroundColor: [
          'rgba(139, 92, 246, 0.75)',
          'rgba(14, 165, 233, 0.75)',
          'rgba(245, 158, 11, 0.75)',
          'rgba(244, 63, 94, 0.75)',
          'rgba(16, 185, 129, 0.75)'
        ],
        borderRadius: 8,
      },
    ],
  };

  const radarData = {
    labels: ['Emotional', 'Sleep', 'Energy', 'Stress Mgmt', 'Social Support'],
    datasets: [
      {
        label: 'Your Balance Profile',
        data: [
          breakdown.emotional,
          breakdown.sleep,
          breakdown.energy,
          breakdown.workStress,
          breakdown.social
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.25)',
        borderColor: 'rgba(139, 92, 246, 0.9)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
      },
    ],
  };

  // Line chart from recent mood logs or mock trend
  const recentLogs = (moodLogs && moodLogs.length > 0) ? [...moodLogs].reverse().slice(-7) : [
    { date: 'Mon', moodScore: 4 },
    { date: 'Tue', moodScore: 3 },
    { date: 'Wed', moodScore: 5 },
    { date: 'Thu', moodScore: 2 },
    { date: 'Fri', moodScore: 4 },
    { date: 'Sat', moodScore: 5 },
    { date: 'Sun', moodScore: 4 }
  ];

  const lineData = {
    labels: recentLogs.map(l => l.date ? (typeof l.date === 'string' ? l.date.slice(5) : l.date) : 'Day'),
    datasets: [
      {
        label: 'Mood Rating (1-5)',
        data: recentLogs.map(l => l.moodScore || 3),
        borderColor: 'rgba(14, 165, 233, 1)',
        backgroundColor: 'rgba(14, 165, 233, 0.15)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#0EA5E9'
      }
    ]
  };

  const dimensionList = [
    { label: 'Emotional Balance', icon: '😌', pct: breakdown.emotional, color: '#8B5CF6' },
    { label: 'Sleep & Rest', icon: '😴', pct: breakdown.sleep, color: '#0EA5E9' },
    { label: 'Energy', icon: '⚡', pct: breakdown.energy, color: '#F59E0B' },
    { label: 'Work/Study Stress', icon: '📚', pct: breakdown.workStress, color: '#F43F5E' },
    { label: 'Social Support', icon: '❤️', pct: breakdown.social, color: '#10B981' }
  ];

  // Dynamic "✨ Recommended for You" items based on results (Requirement 11)
  const getDynamicRecommendations = () => {
    if (overallScore < 50) {
      return [
        { icon: '🧘', title: 'Guided Meditation', desc: '5-min deep breathing to ground stress', tab: 'meditation' },
        { icon: '🌬️', title: 'Box Breathing', desc: 'Instant vagus nerve calming', tab: 'meditation' },
        { icon: '🌧️', title: 'Rain Sounds', desc: 'Soothing rain soundscape', tab: 'music' },
        { icon: '🌱', title: 'Breathing Garden', desc: 'Guided lotus breathing break', tab: 'games' }
      ];
    } else if (overallScore < 70) {
      return [
        { icon: '😊', title: 'Mood Tracking', desc: 'Observe subtle daily feelings', tab: 'mood' },
        { icon: '🧘', title: 'Gentle Yoga', desc: '10-min neck & shoulder release', tab: 'exercise' },
        { icon: '🚶', title: 'Short Walking Break', desc: 'Fresh air & gentle pace', tab: 'exercise' },
        { icon: '🧠', title: 'Memory Match', desc: 'Relaxing card pairing break', tab: 'games' }
      ];
    } else {
      return [
        { icon: '🌱', title: 'Continue Healthy Habits', desc: 'Maintain positive routines', tab: 'progress' },
        { icon: '🎯', title: 'Focus Music', desc: 'Calm ambient focus sound', tab: 'music' },
        { icon: '🏃', title: 'Energizing Stretch', desc: 'Keep momentum going strong', tab: 'exercise' },
        { icon: '✨', title: 'Calm Clicker', desc: 'Daily affirmations & joy', tab: 'games' }
      ];
    }
  };

  const recommendations = getDynamicRecommendations();

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Banner */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(224, 242, 254, 0.6))',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', color: 'var(--text-dark)' }}>
            Hi, {name} 👋
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>
            Here’s your MindBridge wellness snapshot.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem' }}>
          <button onClick={onRetakeQuiz} className="btn-secondary">
            Retake Assessment
          </button>
          <button onClick={onGoToRecommendations} className="btn-primary">
            <span>View Personalized Plan</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Main Score Circular Gauge Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Large Circular Score / Gauge Card */}
        <div className="glass-card" style={{
          padding: '2.5rem 2rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>🧠</div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Overall Wellness Level
          </h3>

          {/* Gauge Center */}
          <div style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto 1.5rem auto' }}>
            <Doughnut 
              data={doughnutData} 
              options={{ 
                cutout: '78%', 
                plugins: { legend: { display: false }, tooltip: { enabled: false } } 
              }} 
            />
            <div style={{
              position: 'absolute',
              top: 50,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--text-dark)' }}>
                {overallScore}%
              </span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 700,
                color: statusColor,
                background: `${statusColor}15`,
                padding: '0.2rem 0.75rem',
                borderRadius: 'var(--radius-full)'
              }}>
                {statusBadge}
              </span>
            </div>
          </div>

          <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)', maxWidth: '280px' }}>
            {tagline}
          </p>

          <p style={{ fontSize: '0.78rem', color: 'var(--text-light)', marginTop: '1rem' }}>
            ℹ️ {disclaimer}
          </p>
        </div>

        {/* Breakdown Progress Bars Card */}
        <div className="glass-card" style={{ padding: '2rem 1.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.3rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>
            Wellness Area Breakdown
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            {dimensionList.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.92rem', fontWeight: 600 }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </span>
                  <span style={{ color: item.color }}>{item.pct}%</span>
                </div>

                <div style={{
                  width: '100%',
                  height: '10px',
                  background: 'var(--lavender-50)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${item.pct}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Dynamic "✨ Recommended for You" Card (Requirement 11) */}
      <div className="glass-card" style={{ padding: '2rem 1.8rem', background: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem' }}>
          <Sparkles color="var(--lavender-600)" size={22} />
          <h3 style={{ fontSize: '1.4rem', color: 'var(--text-dark)' }}>
            ✨ Recommended for You
          </h3>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
          Tailored suggestions matching your current wellness level ({statusBadge}):
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.2rem'
        }}>
          {recommendations.map((rec, idx) => (
            <div key={idx} style={{
              background: 'var(--lavender-50)',
              padding: '1.25rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-light)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>{rec.icon}</div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>{rec.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{rec.desc}</p>
              </div>

              {onNavigate && (
                <button
                  onClick={() => onNavigate(rec.tab)}
                  className="btn-primary"
                  style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem', width: '100%', justifyContent: 'center' }}
                >
                  <span>Open Tool →</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 4 Interactive Charts Grid */}
      <div>
        <h3 style={{ fontSize: '1.5rem', marginBottom: '1.2rem', color: 'var(--text-dark)' }}>
          Detailed Visual Analytics
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem'
        }}>
          
          {/* Chart 1: Bar Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              1. Wellness Area Comparison (Bar Chart)
            </h4>
            <div style={{ height: '240px' }}>
              <Bar 
                data={barData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: { y: { min: 0, max: 100 } } 
                }} 
              />
            </div>
          </div>

          {/* Chart 2: Radar Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              2. Balance Profile (Radar Chart)
            </h4>
            <div style={{ height: '240px' }}>
              <Radar 
                data={radarData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: { r: { min: 0, max: 100 } } 
                }} 
              />
            </div>
          </div>

          {/* Chart 3: Line Chart */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              3. Recent Mood Trend (Line Graph)
            </h4>
            <div style={{ height: '240px' }}>
              <Line 
                data={lineData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: false,
                  scales: { y: { min: 1, max: 5 } } 
                }} 
              />
            </div>
          </div>

          {/* Chart 4: Doughnut Overview */}
          <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
              4. Overall Wellness Proportion
            </h4>
            <div style={{ height: '200px', width: '200px' }}>
              <Doughnut 
                data={doughnutData} 
                options={{ responsive: true, maintainAspectRatio: false }} 
              />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
