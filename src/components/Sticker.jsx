import React from 'react';

export default function Sticker({ 
  text, 
  icon = '🌸', 
  bg = '#F5F3FF', 
  color = '#4C1D95', 
  borderColor = '#DDD6FE', 
  rotate = '0deg', 
  float = false,
  className = '',
  style = {}
}) {
  return (
    <div 
      className={`pastel-sticker ${float ? 'animate-float-slow' : ''} ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.6rem 1.1rem',
        background: bg,
        color: color,
        border: `2px dashed ${borderColor}`,
        borderRadius: '20px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.04), inset 0 0 10px rgba(255, 255, 255, 0.6)',
        fontFamily: "'Outfit', 'Handlee', sans-serif",
        fontWeight: 600,
        fontSize: '0.88rem',
        lineHeight: 1.3,
        transform: `rotate(${rotate})`,
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        cursor: 'default',
        userSelect: 'none',
        position: 'relative',
        zIndex: 2,
        maxWidth: '240px',
        ...style
      }}
    >
      <span style={{ fontSize: '1.2rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
        {icon}
      </span>
      <span>{text}</span>
    </div>
  );
}
