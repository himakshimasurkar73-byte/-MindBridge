import React from 'react';
import { X, ShieldAlert, Phone, MessageSquare, Heart } from 'lucide-react';

export default function CrisisModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 300,
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem'
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: '540px',
        width: '100%',
        padding: '2.2rem',
        background: '#FFFFFF',
        position: 'relative',
        borderTop: '6px solid var(--rose-500)'
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
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--rose-500)', marginBottom: '0.8rem' }}>
          <ShieldAlert size={26} />
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)' }}>Immediate Support & Safety</h2>
        </div>

        <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.5rem' }}>
          If you or someone you know is in immediate distress, feeling unsafe, or experiencing a crisis, please reach out to trusted professional support right away. You are not alone.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.8rem' }}>
          
          {/* Hotline 1 */}
          <div style={{ background: 'var(--rose-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--rose-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--text-dark)' }}>988 Suicide & Crisis Lifeline</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Free, confidential, available 24/7 (US & Canada)</p>
            </div>
            <a href="tel:988" className="btn-primary" style={{ background: 'var(--rose-500)', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Phone size={14} /> Call 988
            </a>
          </div>

          {/* Hotline 2 */}
          <div style={{ background: 'var(--blue-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--blue-100)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--text-dark)' }}>Crisis Text Line</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Text HOME to 741741 for 24/7 crisis support</p>
            </div>
            <a href="sms:741741?body=HOME" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <MessageSquare size={14} /> Text
            </a>
          </div>

          {/* Hotline 3 */}
          <div style={{ background: 'var(--lavender-50)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-lavender)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong style={{ fontSize: '1rem', color: 'var(--text-dark)' }}>Emergency Services</strong>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Call 911 or visit your nearest emergency room</p>
            </div>
            <a href="tel:911" className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              <Phone size={14} /> Call 911
            </a>
          </div>

        </div>

        <button onClick={onClose} className="btn-outline" style={{ width: '100%' }}>
          Close Safety Notice
        </button>
      </div>
    </div>
  );
}
