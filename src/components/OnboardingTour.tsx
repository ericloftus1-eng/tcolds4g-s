'use client';
import { useEffect } from 'react';

const TOUR_KEY = 'tcolds_tour_completed_v1';

export default function OnboardingTour() {
  useEffect(() => {
    // Onboarding tour removed — mark as complete so it never shows
    localStorage.setItem(TOUR_KEY, 'true');
  }, []);

  return null;
}
