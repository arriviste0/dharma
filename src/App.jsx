import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStorage } from './hooks/useStorage';
import { getCurrentStreak } from './utils/streakUtils';
import { DEFAULT_PILLARS } from './data/defaultPillars';
import BottomNav, { SideNav } from './components/BottomNav';
import MilestoneScreen from './components/MilestoneScreen';

import Onboarding from './pages/Onboarding';
import Home from './pages/Home';
import Sadhana from './pages/Sadhana';
import Manan from './pages/Manan';
import Drishti from './pages/Drishti';
import Gyaan from './pages/Gyaan';
import Settings from './pages/Settings';

function AppShell({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <SideNav />
      <div className="flex-1 min-w-0 relative">
        {children}
        <BottomNav />
      </div>
    </div>
  );
}

export default function App() {
  const { state, updateSettings } = useStorage();
  const { settings } = state;
  const pillars = state.pillars || DEFAULT_PILLARS;
  const [milestone, setMilestone] = useState(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings.theme]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  useEffect(() => {
    const streak = getCurrentStreak(state.logs, pillars);
    const milestones = [30, 90, 180, 365];
    if (milestones.includes(streak)) {
      const seenKey = `milestone_seen_${streak}`;
      if (!sessionStorage.getItem(seenKey)) {
        setMilestone(streak);
        sessionStorage.setItem(seenKey, '1');
      }
    }
  }, [state.logs]);

  const handleOnboardingComplete = () => {
    updateSettings({ onboardingComplete: true });
  };

  return (
    <BrowserRouter>
      {milestone && (
        <MilestoneScreen days={milestone} onClose={() => setMilestone(null)} />
      )}
      <Routes>
        <Route path="/onboarding" element={<Onboarding onComplete={handleOnboardingComplete} />} />
        <Route
          path="/"
          element={
            settings.onboardingComplete
              ? <Navigate to="/home" replace />
              : <Navigate to="/onboarding" replace />
          }
        />
        <Route path="/home"     element={<AppShell><Home /></AppShell>} />
        <Route path="/sadhana"  element={<AppShell><Sadhana /></AppShell>} />
        <Route path="/manan"    element={<AppShell><Manan /></AppShell>} />
        <Route path="/drishti"  element={<AppShell><Drishti /></AppShell>} />
        <Route path="/gyaan"    element={<AppShell><Gyaan /></AppShell>} />
        <Route path="/settings" element={<AppShell><Settings /></AppShell>} />
        <Route path="*"         element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
