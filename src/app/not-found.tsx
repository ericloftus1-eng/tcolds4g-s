'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Church } from 'lucide-react';
import Link from 'next/link';

export default function NotFound() {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      window.history?.back();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ backgroundColor: 'var(--background)' }}
    >
      {/* Ambient blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 blob-gold opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 blob-crimson opacity-20 pointer-events-none" />

      <div className="relative text-center max-w-md">
        {/* 404 number */}
        <div className="relative mb-6">
          <p
            className="text-[8rem] font-800 leading-none font-mono-data select-none"
            style={{ color: 'var(--primary)', opacity: 0.15 }}
          >
            404
          </p>
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <Church size={36} style={{ color: 'var(--primary-foreground)' }} />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-800 mb-2" style={{ color: 'var(--foreground)' }}>
          This Sermon Doesn&apos;t Exist
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--muted-foreground)' }}>
          The page you&apos;re looking for has ascended to a higher plane — or was never ordained in the first place.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleGoBack}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 hover:bg-muted border"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)' }}
          >
            <ArrowLeft size={15} />
            Go Back
          </button>

          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 gold-gradient"
            style={{ color: 'var(--primary-foreground)' }}
          >
            <Home size={15} />
            Back to The Pulpit
          </Link>
        </div>

        <p className="text-xs mt-6" style={{ color: 'var(--muted-foreground)' }}>
          Lost? Try the{' '}
          <Link href="/entrance" className="hover:underline" style={{ color: 'var(--primary)' }}>
            Church Entrance
          </Link>
          .
        </p>
      </div>
    </div>
  );
}