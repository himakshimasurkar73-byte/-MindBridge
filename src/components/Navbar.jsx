import React from 'react';
import { 
  Heart, 
  Sparkles, 
  Smile, 
  Activity, 
  Wind, 
  BarChart3, 
  Gamepad2,
  Music,
  ShieldAlert,
  Sun,
  UserCheck,
  User,
  LogOut
} from 'lucide-react';

export default function Navbar({ currentTab, setCurrentTab, openCrisisModal, openDailyCheckIn, userProfile, openOnboarding, onLogout }) {
  const isRegistered = Boolean(userProfile && (userProfile.isRegistered || userProfile.name));

  const navItems = [
    { id: 'landing', label: 'Home', icon: Sparkles },
    { id: 'member-dashboard', label: '👤 Member Dashboard', icon: UserCheck },
    { id: 'assessment', label: 'Assessment', icon: Heart },
    { id: 'mood', label: 'Mood', icon: Smile },
    { id: 'exercise', label: 'Activities', icon: Activity },
    { id: 'meditation', label: 'Meditation', icon: Wind },
    { id: 'games', label: '🎮 Relax & Play', icon: Gamepad2 },
    { id: 'music', label: '🎵 Mind Refresh', icon: Music },
    { id: 'progress', label: 'Progress', icon: BarChart3 },
  ];

  return (
    <>
      {/* Top Header Navigation */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.88)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-light)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}>
          {/* Logo */}
          <div 
            onClick={() => setCurrentTab('landing')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              cursor: 'pointer'
            }}
          >
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--lavender-500), var(--blue-500))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFF',
              fontSize: '1.4rem',
              boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
            }}>
              🧠
            </div>
            <div>
              <h1 style={{ 
                fontSize: '1.35rem', 
                fontWeight: 800, 
                letterSpacing: '0.5px',
                background: 'linear-gradient(135deg, var(--text-dark), var(--lavender-700))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                MINDBRIDGE
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500, margin: '-2px 0 0 0' }}>
                A bridge to a better state of mind
              </p>
            </div>
          </div>

          {/* Desktop Navigation Items */}
          <nav className="desktop-nav" style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem 0.85rem',
                    borderRadius: 'var(--radius-full)',
                    border: 'none',
                    background: isActive ? 'var(--lavender-100)' : 'transparent',
                    color: isActive ? 'var(--lavender-700)' : 'var(--text-main)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Header Actions */}
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <button
              onClick={() => {
                if (isRegistered) {
                  setCurrentTab('member-dashboard');
                } else if (openOnboarding) {
                  openOnboarding();
                } else {
                  setCurrentTab('member-dashboard');
                }
              }}
              style={{
                background: isRegistered ? 'var(--lavender-50)' : 'linear-gradient(135deg, var(--lavender-500), var(--blue-500))',
                color: isRegistered ? 'var(--lavender-700)' : '#FFFFFF',
                border: isRegistered ? '1px solid var(--border-lavender)' : 'none',
                padding: '0.5rem 0.95rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap',
                boxShadow: isRegistered ? 'none' : '0 4px 10px rgba(139, 92, 246, 0.25)'
              }}
            >
              <UserCheck size={15} />
              <span>{isRegistered ? `👤 ${userProfile?.name || 'Member'}` : '✨ Sign In / Register'}</span>
            </button>

            {isRegistered && onLogout && (
              <button
                onClick={onLogout}
                title="Logout from active session"
                style={{
                  background: 'var(--rose-50)',
                  color: 'var(--rose-500)',
                  border: '1px solid var(--rose-100)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  whiteSpace: 'nowrap'
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            )}

            <button
              onClick={openDailyCheckIn}
              style={{
                background: 'linear-gradient(135deg, #FEF3C7, #D1FAE5)',
                color: '#065F46',
                border: '1px solid #A7F3D0',
                padding: '0.5rem 0.9rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                whiteSpace: 'nowrap'
              }}
            >
              <Sun size={15} color="#D97706" />
              <span>Daily Check-in</span>
            </button>

            <button
              onClick={openCrisisModal}
              title="Immediate Support & Resources"
              style={{
                background: 'var(--rose-50)',
                color: 'var(--rose-500)',
                border: '1px solid var(--rose-100)',
                padding: '0.5rem 0.75rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                whiteSpace: 'nowrap'
              }}
            >
              <ShieldAlert size={15} />
              <span>Help</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav" style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--border-light)',
        display: 'flex',
        justifyContent: 'space-around',
        padding: '0.5rem 0.1rem',
        boxShadow: '0 -4px 15px rgba(0,0,0,0.05)'
      }}>
        {[
          { id: 'landing', label: 'Home', icon: Sparkles },
          { id: 'member-dashboard', label: 'Dashboard', icon: UserCheck },
          { id: 'assessment', label: 'Quiz', icon: Heart },
          { id: 'mood', label: 'Mood', icon: Smile },
          { id: 'games', label: 'Play', icon: Gamepad2 },
          { id: 'music', label: 'Music', icon: Music },
          { id: 'progress', label: 'Progress', icon: BarChart3 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.15rem',
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--lavender-600)' : 'var(--text-muted)',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.72rem',
                cursor: 'pointer',
                flex: 1
              }}
            >
              <Icon size={17} color={isActive ? 'var(--lavender-600)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 900px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-bottom-nav {
            display: flex !important;
          }
        }
        @media (min-width: 901px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}
