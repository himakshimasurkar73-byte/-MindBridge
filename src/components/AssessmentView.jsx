import React, { useState } from 'react';
import { 
  WELLNESS_ASSESSMENT_QUESTIONS, 
  LIKERT_OPTIONS 
} from '../data/questions';
import { ArrowLeft, ArrowRight, CheckCircle, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function AssessmentView({ userProfile, onCompleteQuiz, openOnboarding }) {
  const occupation = userProfile?.occupation || 'Student';

  // 5 questions total covering stress, sleep, mood, energy, and life balance
  const allQuestions = WELLNESS_ASSESSMENT_QUESTIONS;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  const currentQ = allQuestions[currentIndex];
  const totalQuestions = allQuestions.length;
  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  const handleSelectOption = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQ.id]: value }));
  };

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Finished quiz!
      try {
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
      onCompleteQuiz(answers, allQuestions);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const isCurrentAnswered = answers[currentQ?.id] !== undefined;

  return (
    <div className="animate-fade-in" style={{ maxWidth: '720px', margin: '0 auto' }}>
      
      {/* Assessment Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.4rem 1rem',
          borderRadius: 'var(--radius-full)',
          background: 'var(--lavender-100)',
          color: 'var(--lavender-700)',
          fontSize: '0.85rem',
          fontWeight: 600,
          marginBottom: '0.75rem'
        }}>
          <span>Personalized Wellness Reflection</span>
        </div>
        <h2 style={{ fontSize: '2rem', color: 'var(--text-dark)' }}>MindBridge Wellness Assessment</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Reflecting as <strong>{userProfile?.name || 'Friend'}</strong> ({occupation})
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="glass-card" style={{ padding: '1.2rem 1.8rem', marginBottom: '1.8rem' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.6rem',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>
          <span style={{ color: 'var(--lavender-700)' }}>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>
            {progressPercent}% Complete
          </span>
        </div>

        {/* Progress Bar Track */}
        <div style={{
          width: '100%',
          height: '10px',
          background: 'var(--lavender-100)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercent}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--lavender-500), var(--blue-500))',
            borderRadius: 'var(--radius-full)',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Question Card */}
      <div className="glass-card" style={{ padding: '2.5rem 2rem', marginBottom: '1.5rem', background: '#FFFFFF' }}>
        {/* Category Label */}
        <div style={{
          fontSize: '0.82rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          color: 'var(--blue-600)',
          marginBottom: '1rem'
        }}>
          {currentQ.category}
        </div>

        {/* Question Text */}
        <h3 style={{
          fontSize: '1.4rem',
          fontWeight: 600,
          color: 'var(--text-dark)',
          lineHeight: 1.35,
          marginBottom: '2rem'
        }}>
          “{currentQ.text}”
        </h3>

        {/* Likert Scale Options */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '2rem' }}>
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = answers[currentQ.id] === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleSelectOption(opt.value)}
                style={{
                  width: '100%',
                  padding: '1rem 1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: isSelected ? '2px solid var(--lavender-500)' : '1px solid var(--border-light)',
                  background: isSelected ? 'var(--lavender-50)' : 'rgba(248, 250, 252, 0.7)',
                  color: isSelected ? 'var(--lavender-700)' : 'var(--text-main)',
                  fontWeight: isSelected ? 600 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease'
                }}
              >
                <span>{opt.label}</span>
                {isSelected && <CheckCircle size={20} color="var(--lavender-600)" />}
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="btn-secondary"
            style={{
              opacity: currentIndex === 0 ? 0.4 : 1,
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            <ArrowLeft size={18} />
            <span>Previous</span>
          </button>

          <button
            onClick={handleNext}
            disabled={!isCurrentAnswered}
            className="btn-primary"
            style={{
              opacity: !isCurrentAnswered ? 0.5 : 1,
              cursor: !isCurrentAnswered ? 'not-allowed' : 'pointer'
            }}
          >
            <span>{currentIndex === totalQuestions - 1 ? 'Finish & See Snapshot' : 'Next Question'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Safety Notice Footer */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.7)',
        border: '1px solid var(--border-light)',
        borderRadius: 'var(--radius-md)',
        padding: '1rem',
        textAlign: 'center',
        fontSize: '0.82rem',
        color: 'var(--text-muted)'
      }}>
        🔒 <strong>MindBridge Safety Commitment:</strong> MindBridge is a wellness-awareness platform and does not provide medical diagnosis or treatment. Your quiz results are not a diagnosis of depression, anxiety, or any other mental-health condition.
      </div>
    </div>
  );
}
