import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import MemberDashboardView from './components/MemberDashboardView';
import OnboardingModal from './components/OnboardingModal';
import AssessmentView from './components/AssessmentView';
import DashboardView from './components/DashboardView';
import RecommendationsView from './components/RecommendationsView';
import ExerciseView from './components/ExerciseView';
import MeditationView from './components/MeditationView';
import GamesView from './components/GamesView';
import MusicView from './components/MusicView';
import MoodTrackerView from './components/MoodTrackerView';
import DailyCheckInModal from './components/DailyCheckInModal';
import ProgressView from './components/ProgressView';
import ProfileView from './components/ProfileView';
import CrisisModal from './components/CrisisModal';
import TakeABreakModal from './components/TakeABreakModal';

import { 
  getStoredProfile, 
  saveStoredProfile, 
  getStoredAssessment, 
  saveStoredAssessment, 
  getStoredMoodLogs, 
  saveMoodLog,
  getStoredCheckIns,
  saveCheckIn,
  getCompletedActivities,
  saveCompletedActivity,
  getUserId,
  saveUserMoodLog,
  updateUserStreak,
  unlockUserAchievement
} from './utils/storage';
import { calculateWellnessScore } from './utils/scoring';

export default function App() {
  const [currentTab, setCurrentTab] = useState('landing');
  
  // App State
  const [userProfile, setUserProfile] = useState(() => getStoredProfile());
  const [assessmentResults, setAssessmentResults] = useState(() => getStoredAssessment());
  const [moodLogs, setMoodLogs] = useState(() => getStoredMoodLogs());
  const [checkIns, setCheckIns] = useState(() => getStoredCheckIns());
  const [activities, setActivities] = useState(() => getCompletedActivities());

  // Modals
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCrisisOpen, setIsCrisisOpen] = useState(false);

  // Scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentTab]);

  // If user profile doesn't exist when starting journey, prompt onboarding
  const handleStartJourney = () => {
    if (!userProfile) {
      setIsOnboardingOpen(true);
    } else {
      setCurrentTab('assessment');
    }
  };

  const handleSaveProfile = (profile) => {
    const registeredProfile = {
      ...profile,
      isRegistered: true,
      id: profile.id || profile.email || `user_${Date.now()}`
    };
    setUserProfile(registeredProfile);
    saveStoredProfile(registeredProfile);
    setIsOnboardingOpen(false);
    setCurrentTab('member-dashboard');
  };

  const handleCompleteQuiz = (answers, questions) => {
    const calculated = calculateWellnessScore(answers, questions);
    setAssessmentResults(calculated);
    saveStoredAssessment(calculated);
    setCurrentTab('dashboard');
  };

  const handleSaveMood = (newLog) => {
    const updated = saveMoodLog(newLog);
    setMoodLogs(updated);
    
    const userId = getUserId(userProfile);
    if (userId) {
      saveUserMoodLog(userId, newLog);
    }
  };

  const handleSaveCheckIn = (entry) => {
    const updated = saveCheckIn(entry);
    setCheckIns(updated);
  };

  const handleCompleteActivity = (type) => {
    const updated = saveCompletedActivity(type);
    setActivities(updated);

    const userId = getUserId(userProfile);
    if (userId) {
      updateUserStreak(userId);
      unlockUserAchievement(userId, 'relaxation_beginner');
    }
  };

  const handleHowItWorks = () => {
    const el = document.getElementById('how-it-works-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('mindbridge_user_profile');
    } catch (e) {
      console.error(e);
    }
    setUserProfile(null);
    setCurrentTab('landing');
  };

  return (
    <div className="app-container">
      {/* Navbar Header */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        openCrisisModal={() => setIsCrisisOpen(true)}
        openDailyCheckIn={() => setIsCheckInOpen(true)}
        userProfile={userProfile}
        openOnboarding={() => setIsOnboardingOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="main-content">
        {currentTab === 'landing' && (
          <LandingPage
            onStartJourney={handleStartJourney}
            onHowItWorks={handleHowItWorks}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSaveMoodLog={handleSaveMood}
            userProfile={userProfile}
          />
        )}

        {currentTab === 'member-dashboard' && (
          <MemberDashboardView
            userProfile={userProfile}
            onOpenRegistration={() => setIsOnboardingOpen(true)}
            onNavigate={(tab) => setCurrentTab(tab)}
            onLogout={handleLogout}
          />
        )}

        {currentTab === 'assessment' && (
          <AssessmentView
            userProfile={userProfile}
            onCompleteQuiz={handleCompleteQuiz}
            openOnboarding={() => setIsOnboardingOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <DashboardView
            userProfile={userProfile}
            assessmentResults={assessmentResults}
            moodLogs={moodLogs}
            onGoToRecommendations={() => setCurrentTab('recommendations')}
            onRetakeQuiz={() => setCurrentTab('assessment')}
            onNavigate={(tab) => setCurrentTab(tab)}
          />
        )}

        {currentTab === 'recommendations' && (
          <RecommendationsView
            assessmentResults={assessmentResults}
            userProfile={userProfile}
            onGoToActivities={() => setCurrentTab('exercise')}
            onGoToMeditation={() => setCurrentTab('meditation')}
          />
        )}

        {currentTab === 'exercise' && (
          <ExerciseView
            onCompleteActivity={handleCompleteActivity}
          />
        )}

        {currentTab === 'meditation' && (
          <MeditationView
            onCompleteActivity={handleCompleteActivity}
          />
        )}

        {currentTab === 'games' && (
          <GamesView
            onCompleteActivity={handleCompleteActivity}
          />
        )}

        {currentTab === 'music' && (
          <MusicView
            onCompleteActivity={handleCompleteActivity}
          />
        )}

        {currentTab === 'mood' && (
          <MoodTrackerView
            moodLogs={moodLogs}
            onSaveMoodLog={handleSaveMood}
          />
        )}

        {currentTab === 'progress' && (
          <ProgressView
            moodLogs={moodLogs}
            checkIns={checkIns}
            completedActivities={activities}
            assessmentResults={assessmentResults}
          />
        )}

        {currentTab === 'profile' && (
          <ProfileView
            userProfile={userProfile}
            onEditProfile={() => setIsOnboardingOpen(true)}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Floating Take a Break Button & Quick Modal */}
      <TakeABreakModal
        onNavigate={(tab) => setCurrentTab(tab)}
        openDailyCheckIn={() => setIsCheckInOpen(true)}
      />

      {/* Footer */}
      <footer style={{
        textAlign: 'center',
        padding: '2.5rem 1rem',
        borderTop: '1px solid var(--border-light)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem',
        background: 'rgba(255, 255, 255, 0.7)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <p style={{ fontWeight: 700, color: 'var(--text-dark)', fontSize: '1rem' }}>
            🧠 MINDBRIDGE — “A bridge to a better state of mind”
          </p>
          <p style={{ marginTop: '0.4rem', fontSize: '0.82rem', maxWidth: '700px', margin: '0.4rem auto 0 auto' }}>
            MindBridge is a wellness-awareness tool and does not provide a medical diagnosis. If you are experiencing serious or persistent difficulties, consider speaking with a qualified professional or trusted person.
          </p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.78rem', color: 'var(--text-light)' }}>
            Designed for college project presentation & digital wellness companion.
          </p>
        </div>
      </footer>

      {/* Modals */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        onSaveProfile={handleSaveProfile}
        initialProfile={userProfile}
      />

      <DailyCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        onSaveCheckIn={handleSaveCheckIn}
      />

      <CrisisModal
        isOpen={isCrisisOpen}
        onClose={() => setIsCrisisOpen(false)}
      />
    </div>
  );
}
