import React from 'react';
import Topbar from './Topbar';
import OnboardingTour from './OnboardingTour';
import FeedbackWidget from './FeedbackWidget';
import DirectMessaging from './DirectMessaging';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--background)' }}>
      <Topbar />
      <main className="pt-16">{children}</main>
      <OnboardingTour />
      <FeedbackWidget />
      <DirectMessaging />
    </div>
  );
}