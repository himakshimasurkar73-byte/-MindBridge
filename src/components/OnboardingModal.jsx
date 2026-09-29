import React, { useState } from 'react';
import { User, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function OnboardingModal({ isOpen, onClose, onSaveProfile, initialProfile }) {
  if (!isOpen) return null;

  const [formData, setFormData] = useState(initialProfile || {
    name: '',
    age: '',
    height: '',
    weight: '',
    occupation: 'Student',
    sleepDuration: '7-8 hours',
    activityLevel: 'Moderate',
    workload: 'Moderate'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSaveProfile(formData);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 200,
      background: 'rgba(15, 23, 42, 0.55)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '560px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '2.2rem',
        background: '#FFFFFF',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
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
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
          <div style={{
            fontSize: '2.5rem',
            marginBottom: '0.4rem'
          }}>
            👋
          </div>
          <h2 style={{ fontSize: '1.8rem', color: 'var(--text-dark)' }}>Let’s get to know you</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            We customize your reflection questions and wellness plan based on your daily routine.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          
          {/* Name & Age */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Name / Nickname *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Alex"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Age *
              </label>
              <input
                type="number"
                name="age"
                required
                min="1"
                max="120"
                placeholder="20"
                value={formData.age}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Occupation / Role */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
              Occupation / Daily Role *
            </label>
            <select
              name="occupation"
              value={formData.occupation}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-light)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.95rem',
                background: '#FFF'
              }}
            >
              <option value="Student">Student</option>
              <option value="Office Worker">Office Worker</option>
              <option value="Homemaker">Homemaker</option>
              <option value="Business Owner">Business Owner</option>
              <option value="Teacher">Teacher</option>
              <option value="Healthcare Worker">Healthcare Worker</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Height & Weight (Optional) */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Height (Optional)
              </label>
              <input
                type="text"
                name="height"
                placeholder="e.g. 170 cm"
                value={formData.height}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Weight (Optional)
              </label>
              <input
                type="text"
                name="weight"
                placeholder="e.g. 65 kg"
                value={formData.weight}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem'
                }}
              />
            </div>
          </div>

          {/* Sleep, Activity & Workload */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Average Sleep
              </label>
              <select
                name="sleepDuration"
                value={formData.sleepDuration}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.85rem',
                  background: '#FFF'
                }}
              >
                <option value="Less than 5 hrs">&lt; 5 hrs</option>
                <option value="5-6 hours">5-6 hrs</option>
                <option value="7-8 hours">7-8 hrs</option>
                <option value="9+ hours">9+ hrs</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Activity Level
              </label>
              <select
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.85rem',
                  background: '#FFF'
                }}
              >
                <option value="Low">Low</option>
                <option value="Moderate">Moderate</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Daily Workload
              </label>
              <select
                name="workload"
                value={formData.workload}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.5rem',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-light)',
                  fontSize: '0.85rem',
                  background: '#FFF'
                }}
              >
                <option value="Light">Light</option>
                <option value="Moderate">Moderate</option>
                <option value="Heavy">Heavy</option>
              </select>
            </div>
          </div>

          {/* Privacy Note */}
          <div style={{
            background: 'var(--mint-50)',
            border: '1px solid var(--mint-200)',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.5rem',
            fontSize: '0.82rem',
            color: 'var(--mint-600)'
          }}>
            <ShieldCheck size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span>
              This information is used strictly to personalize wellness suggestions. MindBridge does not use height or weight to judge appearance or mental health.
            </span>
          </div>

          <button 
            type="submit" 
            className="btn-primary"
            style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}
          >
            <span>Continue →</span>
          </button>
        </form>
      </div>
    </div>
  );
}
