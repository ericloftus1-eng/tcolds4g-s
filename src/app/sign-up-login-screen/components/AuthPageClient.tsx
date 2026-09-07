'use client';
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import AppLogo from '@/components/ui/AppLogo';


import { useRouter } from 'next/navigation';
import { UserCheck } from 'lucide-react';
import GuestRegistryModal, {
  getGuestSigninCount,
  incrementGuestSignin,
  isGuestRegistered,
  getGuestName,
  GUEST_MAX_SIGNINS,
} from '@/components/GuestRegistryModal';
import { toast } from 'sonner';

export default function AuthPageClient() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [guestModalOpen, setGuestModalOpen] = useState(false);
  const [guestModalMode, setGuestModalMode] = useState<'registry' | 'limit_reached' | 'action_gate'>('registry');
  const router = useRouter();

  const handleGuestClick = () => {
    const count = getGuestSigninCount();
    if (count >= GUEST_MAX_SIGNINS) {
      setGuestModalMode('limit_reached');
      setGuestModalOpen(true);
      return;
    }
    if (isGuestRegistered()) {
      const newCount = incrementGuestSignin();
      toast.success(`Welcome back, ${getGuestName()}! ${GUEST_MAX_SIGNINS - newCount} guest visits remaining.`);
      router.push('/');
      return;
    }
    setGuestModalMode('registry');
    setGuestModalOpen(true);
  };

  const handleGuestSuccess = (name: string) => {
    const newCount = incrementGuestSignin();
    toast.success(`Welcome, ${name}! You have ${GUEST_MAX_SIGNINS - newCount} guest visits remaining.`);
    router.push('/');
  };

  return (
    <div
      className="min-h-screen flex relative"
      style={{ backgroundColor: 'var(--background)', overflowX: 'hidden' }}
    >
      <GuestRegistryModal
        isOpen={guestModalOpen}
        onClose={() => setGuestModalOpen(false)}
        mode={guestModalMode}
        onSuccess={handleGuestSuccess}
      />

      {/* Left — Masks Panel */}
      <div
        className="hidden lg:flex lg:w-[52%] xl:w-[55%] flex-col relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a0a 40%, #0a0a1a 100%)' }}
      >
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-96 h-96 blob-gold opacity-25 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-96 h-96 blob-crimson opacity-35 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 blob-gold opacity-10 pointer-events-none -translate-x-1/2 -translate-y-1/2" />

        {/* Logo top-left */}
        <div className="relative flex items-center gap-3 p-6 xl:p-8 pb-0">
          <AppLogo size={36} />
          <div className="flex flex-col leading-none">
            <span className="font-sans font-800 text-lg tracking-tight text-gold">TCoLDS</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              A Community of Comedy
            </span>
          </div>
        </div>

        {/* Masks composition — fills the panel */}
        <div className="relative flex-1" style={{ minHeight: '500px' }}>

          {/* Mask 1 — plain laughing, background far left, centered vertically */}
          <div
            className="absolute"
            style={{
              left: '-4%',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '62%',
              maxWidth: '380px',
              zIndex: 1,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/image-1788524868867.png"
              alt="Plain laughing comedy mask — background left"
              style={{
                width: '100%',
                height: 'auto',
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 8px 32px rgba(212,175,55,0.3)) sepia(0.2) saturate(1.3) brightness(0.75) hue-rotate(5deg)',
              }}
            />
          </div>

          {/* Mask 2 — manic crazy laughing, middle, offset right, tilted */}
          <div
            className="absolute"
            style={{
              left: '22%',
              top: '56%',
              transform: 'translateY(-50%) rotate(9deg)',
              width: '60%',
              maxWidth: '370px',
              zIndex: 2,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/image-1788525128539.png"
              alt="Manic crazy laughing comedy mask — middle tilted"
              style={{
                width: '100%',
                height: 'auto',
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 12px 40px rgba(139,26,26,0.5)) sepia(0.25) saturate(1.5) contrast(1.1) brightness(0.72) hue-rotate(10deg)',
              }}
            />
          </div>

          {/* Mask 3 — cry-laughing, front right, slightly higher */}
          <div
            className="absolute"
            style={{
              right: '-3%',
              top: '34%',
              transform: 'translateY(-50%)',
              width: '58%',
              maxWidth: '360px',
              zIndex: 3,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/images/image-1788525147722.png"
              alt="Cry-laughing comedy mask — front right"
              style={{
                width: '100%',
                height: 'auto',
                mixBlendMode: 'screen',
                filter: 'drop-shadow(0 16px 48px rgba(212,175,55,0.4)) sepia(0.15) saturate(1.3) contrast(1.08) brightness(0.78) hue-rotate(-5deg)',
              }}
            />
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative px-6 xl:px-8 pb-6 pt-2">
          <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>
            &ldquo;No comedy is bad comedy.&rdquo;
          </p>
          <p className="text-xs mt-0.5 font-600 text-gold">— TCoLDS</p>
        </div>
      </div>

      {/* Right — Auth Form */}
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto" style={{ minWidth: 0 }}>
        <div className="flex flex-col items-center justify-start lg:justify-center px-5 sm:px-8 py-8 lg:py-10 w-full min-h-full">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <AppLogo size={32} />
            <span className="font-sans font-800 text-lg text-gold">TCoLDS</span>
          </div>

          <div className="w-full max-w-md">
            {/* Tab toggle */}
            <div
              className="flex p-1 rounded-2xl mb-6"
              style={{ background: 'var(--card)', border: '1px solid var(--border)' }}
            >
              <button
                onClick={() => setTab('login')}
                className="flex-1 py-3 rounded-xl text-sm font-700 transition-all duration-200"
                style={{
                  background: tab === 'login' ? 'var(--primary)' : 'transparent',
                  color: tab === 'login' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  minHeight: '44px',
                }}
              >
                Sign In
              </button>
              <button
                onClick={() => setTab('signup')}
                className="flex-1 py-3 rounded-xl text-sm font-700 transition-all duration-200"
                style={{
                  background: tab === 'signup' ? 'var(--primary)' : 'transparent',
                  color: tab === 'signup' ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                  minHeight: '44px',
                }}
              >
                Sign Up
              </button>
            </div>

            {tab === 'login' ? <LoginForm /> : <SignupForm />}

            {/* Continue as Guest */}
            <div className="mt-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>or</span>
                <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
              </div>
              <button
                onClick={handleGuestClick}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-600 border transition-all duration-150 hover:bg-muted active:scale-95"
                style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', background: 'var(--card)', minHeight: '48px' }}
              >
                <UserCheck size={16} />
                Continue as Guest
              </button>
            </div>

            <p className="text-center text-xs mt-4" style={{ color: 'var(--muted-foreground)' }}>
              {tab === 'login' ? (
                <>
                  New to TCoLDS?{' '}
                  <button
                    onClick={() => setTab('signup')}
                    className="font-600 hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button
                    onClick={() => setTab('login')}
                    className="font-600 hover:underline"
                    style={{ color: 'var(--primary)' }}
                  >
                    Sign in
                  </button>
                </>
              )}
            </p>

            <p className="text-center mt-3 pb-8" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
              By joining, you accept our{' '}
              <button className="underline hover:text-gold transition-colors">Terms of Service</button>{' '}
              and{' '}
              <button className="underline hover:text-gold transition-colors">Privacy Policy</button>.
              <br />
              No comedy is bad comedy. Everyone is welcome.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}