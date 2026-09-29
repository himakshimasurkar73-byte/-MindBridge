import React from 'react';
import { User, Edit3, ShieldCheck, Moon, Activity, Briefcase, LogOut } from 'lucide-react';

export default function ProfileView({ userProfile, onEditProfile, onLogout }) {
  const profile = userProfile || {
    name: 'Alex',
    age: '22',
    occupation: 'Student',
    height: '172 cm',
    weight: '64 kg',
    sleepDuration: '7-8 hours',
    activityLevel: 'Moderate',
    workload: 'Moderate'
  };

  return (
    <div className="animate-fade-in" style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Profile Card */}
      <div className="glass-card" style={{
        padding: '2.5rem 2rem',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #FFFFFF 0%, #F3E8FF 100%)'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--lavender-500), var(--blue-500))',
          color: '#FFF',
          fontSize: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem auto',
          boxShadow: 'var(--shadow-glow)'
        }}>
          👤
        </div>

        <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)', marginBottom: '0.2rem' }}>
          {profile.name}
        </h2>
        <p style={{ color: 'var(--lavender-700)', fontWeight: 600, fontSize: '1rem', marginBottom: '1.2rem' }}>
          {profile.occupation} • Age {profile.age}
        </p>

        <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={onEditProfile} className="btn-secondary">
            <Edit3 size={16} />
            <span>Update Profile Info</span>
          </button>

          {onLogout && (
            <button 
              onClick={onLogout} 
              className="btn-secondary" 
              style={{ background: 'var(--rose-50)', color: 'var(--rose-500)', borderColor: 'var(--rose-100)' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Profile Details List */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.3rem', marginBottom: '1.2rem', color: 'var(--text-dark)' }}>
          Personalized Routine Preferences
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div style={{ background: 'var(--lavender-50)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Daily Role</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{profile.occupation}</h4>
          </div>

          <div style={{ background: 'var(--blue-50)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Average Sleep</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{profile.sleepDuration}</h4>
          </div>

          <div style={{ background: 'var(--mint-50)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Physical Activity</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{profile.activityLevel}</h4>
          </div>

          <div style={{ background: 'var(--amber-100)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Typical Workload</span>
            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{profile.workload}</h4>
          </div>

          {profile.height && (
            <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Height</span>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{profile.height}</h4>
            </div>
          )}

          {profile.weight && (
            <div style={{ background: 'rgba(248, 250, 252, 0.8)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Weight</span>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--text-dark)', marginTop: '0.2rem' }}>{profile.weight}</h4>
            </div>
          )}
        </div>
      </div>

      {/* Data Reassurance Banner */}
      <div style={{
        background: 'var(--mint-50)',
        border: '1px solid var(--mint-200)',
        padding: '1.2rem',
        borderRadius: 'var(--radius-md)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.8rem',
        color: 'var(--mint-600)',
        fontSize: '0.88rem'
      }}>
        <ShieldCheck size={22} style={{ flexShrink: 0 }} />
        <span>
          Your information is saved locally in your browser and used only to personalize your wellness snapshot and gentle daily plan.
        </span>
      </div>

    </div>
  );
}
