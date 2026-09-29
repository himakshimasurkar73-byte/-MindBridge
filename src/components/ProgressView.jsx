import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { Flame, Wind, Activity, Award, TrendingUp, Sparkles, Heart } from 'lucide-react';
import Sticker from './Sticker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

export default function ProgressView({ moodLogs, checkIns, completedActivities, assessmentResults }) {
  const streak = completedActivities?.streak || 5;
  const meditationCount = completedActivities?.meditationCount || 4;
  const exerciseCount = completedActivities?.exerciseCount || 3;
  const gamesCount = completedActivities?.gamesCount || 6;
  const musicCount = completedActivities?.musicCount || 8;
  const currentScore = assessmentResults ? assessmentResults.overallScore : 72;

  // Chart data for Wellness Score Trend (Mon to Sun)
  const wellnessTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Wellness Score Trend (%)',
        data: [42, 60, 68, 75, 72, 80, currentScore],
        borderColor: 'rgba(16, 185, 129, 1)',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 6,
        pointBackgroundColor: '#10B981',
      },
    ],
  };

  // Stress Level Trend (Mon to Sun)
  const stressTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Stress Level (Lower = Better)',
        data: [4, 3, 2, 3, 2, 1, 2],
        borderColor: 'rgba(244, 63, 94, 1)',
        backgroundColor: 'rgba(244, 63, 94, 0.15)',
        fill: true,
        tension: 0.35,
        pointRadius: 5,
        pointBackgroundColor: '#F43F5E',
      },
    ],
  };

  // Activity Completion Bar Chart
  const activityData = {
    labels: ['Meditation', 'Exercise', 'Games Played', 'Music Sessions', 'Daily Check-ins'],
    datasets: [
      {
        label: 'Completed Sessions',
        data: [meditationCount, exerciseCount, gamesCount, musicCount, checkIns?.length || 7],
        backgroundColor: [
          'rgba(139, 92, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(244, 63, 94, 0.8)',
          'rgba(14, 165, 233, 0.8)',
        ],
        borderRadius: 8,
      },
    ],
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.2rem' }}>
      
      {/* Header */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        background: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)'
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
          <TrendingUp size={16} />
          <span>Long-Term Wellness Journey</span>
        </div>
        <h2 style={{ fontSize: '2.2rem', marginBottom: '0.4rem', color: 'var(--blue-700)' }}>
          📊 My Progress
        </h2>
        <p style={{ color: '#0369A1', fontSize: '1.05rem', maxWidth: '650px' }}>
          Track your wellness evolution, habit consistency, stress reduction trends, and activity milestones over time.
        </p>
      </div>

      {/* Encouragement Sticker Badges (Requirement 24) */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Sticker text="🌱 Keep going!" icon="🌿" bg="#ECFDF5" color="#047857" rotate="-2deg" float={true} />
        <Sticker text="✨ You’re building healthy habits." icon="🌟" bg="#FEF3C7" color="#B45309" rotate="3deg" float={true} />
        <Sticker text="💜 Every small step counts." icon="💖" bg="#F5F3FF" color="#6D28D9" rotate="-3deg" float={true} />
      </div>

      {/* Streaks & Milestone Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* Streak Card */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.4rem', padding: '0.6rem', background: 'var(--amber-100)', borderRadius: '16px' }}>
            🔥
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-in Streak</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--amber-500)' }}>{streak} Days</h3>
          </div>
        </div>

        {/* Meditation Sessions */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.4rem', padding: '0.6rem', background: 'var(--lavender-100)', borderRadius: '16px' }}>
            🧘
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Meditation</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--lavender-700)' }}>{meditationCount} Done</h3>
          </div>
        </div>

        {/* Exercise Sessions */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.4rem', padding: '0.6rem', background: 'var(--mint-100)', borderRadius: '16px' }}>
            🏃
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Move Sessions</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--mint-600)' }}>{exerciseCount} Done</h3>
          </div>
        </div>

        {/* Mini-Games Played */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.4rem', padding: '0.6rem', background: 'var(--rose-100)', borderRadius: '16px' }}>
            🎮
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Games Played</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--rose-500)' }}>{gamesCount} Played</h3>
          </div>
        </div>

        {/* Music Sessions */}
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ fontSize: '2.4rem', padding: '0.6rem', background: 'var(--blue-100)', borderRadius: '16px' }}>
            🎵
          </div>
          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Music Sessions</span>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--blue-600)' }}>{musicCount} Sessions</h3>
          </div>
        </div>

      </div>

      {/* Wellness Score & Stress Trend Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Wellness Score Trend Line */}
        <div className="glass-card" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
            🌱 Wellness Score Trend (%)
          </h3>
          <div style={{ height: '250px' }}>
            <Line
              data={wellnessTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { min: 0, max: 100 } }
              }}
            />
          </div>
        </div>

        {/* Stress Trend Line */}
        <div className="glass-card" style={{ padding: '1.8rem' }}>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
            📉 Stress Reduction Trend
          </h3>
          <div style={{ height: '250px' }}>
            <Line
              data={stressTrendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: { y: { min: 1, max: 5 } }
              }}
            />
          </div>
        </div>

      </div>

      {/* Activity Breakdown Bar Chart */}
      <div className="glass-card" style={{ padding: '1.8rem' }}>
        <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>
          🎯 Habit Activity Completed Total
        </h3>
        <div style={{ height: '240px' }}>
          <Bar
            data={activityData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } }
            }}
          />
        </div>
      </div>

    </div>
  );
}
