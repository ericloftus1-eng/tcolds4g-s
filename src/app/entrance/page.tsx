'use client';
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';

export default function EntrancePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleEnter = () => {
    if (user) {
      router?.push('/members/home');
    } else {
      router?.push('/sign-up-login-screen');
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Ambient background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 blob-gold opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 blob-crimson opacity-15 pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 py-12 max-w-lg mx-auto">

        {/* Logo */}
        <div className="mb-6 relative">
          <div
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-full overflow-hidden mx-auto border-2"
            style={{
              borderColor: 'rgba(212,175,55,0.5)',
              boxShadow: '0 0 40px rgba(212,175,55,0.25), 0 0 80px rgba(139,26,26,0.15)',
            }}
          >
            <Image
              src="/assets/images/IMG_20260902_232338110_HDR-1788522192762.jpg"
              alt="TCoLDS sun moon church logo — golden sun and crescent moon over a church silhouette"
              width={176}
              height={176}
              className="w-full h-full object-cover"
              style={{
                filter: 'saturate(1.3) contrast(1.1) hue-rotate(-5deg)',
                mixBlendMode: 'normal',
              }}
              priority
            />
          </div>
          {/* Glow ring */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(circle, rgba(212,175,55,0.12) 0%, transparent 70%)',
            }}
          />
        </div>

        {/* Title */}
        <h1
          className="text-4xl sm:text-5xl font-800 tracking-tight mb-1"
          style={{ color: '#D4AF37', letterSpacing: '-0.02em' }}
        >
          TCoLDS
        </h1>

        {/* Subtitle */}
        <p
          className="text-base sm:text-lg font-500 mb-8"
          style={{ color: 'var(--muted-foreground)', letterSpacing: '0.04em' }}
        >
          A Community of Comedy
        </p>

        {/* ENTER button */}
        {!loading && (
          <button
            onClick={handleEnter}
            className="px-10 py-4 rounded-2xl font-800 text-base sm:text-lg tracking-widest transition-all duration-200 hover:scale-105 active:scale-95 mb-8"
            style={{
              background: 'linear-gradient(135deg, var(--primary), var(--accent))',
              color: 'var(--primary-foreground)',
              letterSpacing: '0.15em',
              boxShadow: '0 4px 24px rgba(139,26,26,0.4)',
              minWidth: '180px',
            }}
          >
            ENTER
          </button>
        )}

        {loading && (
          <div
            className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mb-8"
            style={{ borderColor: 'var(--primary)' }}
          />
        )}

        {/* Tagline */}
        <p
          className="text-xs sm:text-sm font-500 italic"
          style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}
        >
          No Comedy is Bad Comedy
        </p>
      </div>
    </div>
  );
}
