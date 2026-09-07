import React from 'react';
import AppLayout from '@/components/AppLayout';
import ProfileHero from './components/ProfileHero';
import ProfileStats from './components/ProfileStats';
import ProfileContent from './components/ProfileContent';
import ProfileSidePanels from './components/ProfileSidePanels';
import { Toaster } from 'sonner';

export default function UserProfilePage() {
  return (
    <AppLayout>
      <Toaster position="bottom-right" theme="dark" richColors />
      <ProfileHero />
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16 py-6">
        <ProfileStats />
        <div className="mt-6 flex gap-6 items-start">
          <div className="flex-1 min-w-0">
            <ProfileContent />
          </div>
          <div className="hidden lg:block w-72 xl:w-80 flex-shrink-0">
            <ProfileSidePanels />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}