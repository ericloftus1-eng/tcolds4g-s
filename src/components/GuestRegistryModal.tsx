'use client';
import React, { useState, useEffect } from 'react';
import { X, UserCheck, AlertTriangle, LogIn } from 'lucide-react';
import Link from 'next/link';

export const GUEST_SIGNIN_KEY = 'tcolds_guest_signins';
export const GUEST_NAME_KEY = 'tcolds_guest_name';
export const GUEST_REGISTRY_KEY = 'tcolds_guest_registered';
export const GUEST_MAX_SIGNINS = 10;

export function getGuestSigninCount(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(GUEST_SIGNIN_KEY) || '0', 10);
}

export function incrementGuestSignin(): number {
  const count = getGuestSigninCount() + 1;
  localStorage.setItem(GUEST_SIGNIN_KEY, String(count));
  return count;
}

export function isGuestRegistered(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(GUEST_REGISTRY_KEY);
}

export function getGuestName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(GUEST_NAME_KEY) || '';
}

interface GuestRegistryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'registry' | 'limit_reached' | 'action_gate';
  onSuccess?: (name: string) => void;
}

export default function GuestRegistryModal({ isOpen, onClose, mode, onSuccess }: GuestRegistryModalProps) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) setError('');
  }, [isOpen]);

  if (!isOpen) return null;

  const handleRegister = () => {
    if (!name.trim()) {
      setError('Please enter your name to continue.');
      return;
    }
    if (name.trim().length < 2) {
      setError('Name must be at least 2 characters.');
      return;
    }
    localStorage.setItem(GUEST_NAME_KEY, name.trim());
    localStorage.setItem(GUEST_REGISTRY_KEY, 'true');
    onSuccess?.(name.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.75)' }}
        onClick={mode !== 'limit_reached' ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md rounded-2xl border shadow-2xl p-6"
        style={{ background: 'var(--card)', borderColor: 'var(--primary)' }}
      >
        {mode !== 'limit_reached' && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg transition-colors hover:bg-muted"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <X size={16} />
          </button>
        )}

        {/* Limit Reached Mode */}
        {mode === 'limit_reached' && (
          <div className="text-center">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <AlertTriangle size={26} style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <h2 className="text-xl font-700 mb-2 text-gold">You&apos;ve Reached the Guest Limit</h2>
            <p className="text-sm mb-1" style={{ color: 'var(--foreground)' }}>
              You&apos;ve used <strong>10 guest sign-ins</strong>. The congregation requires a full account to continue.
            </p>
            <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>
              Creating an account is free and unlocks the full TCoLDS experience — follow clergy, give tithings, and earn Cheddar Coins.
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/sign-up-login-screen"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
              >
                <UserCheck size={16} />
                Create Your Account
              </Link>
              <Link
                href="/members/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-600 text-sm transition-all duration-150 hover:bg-muted"
                style={{ color: 'var(--primary)', border: '1px solid var(--primary)' }}
              >
                <LogIn size={14} />
                Sign In as Member
              </Link>
            </div>
          </div>
        )}

        {/* Registry Mode */}
        {mode === 'registry' && (
          <div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <UserCheck size={22} style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <h2 className="text-lg font-700 mb-1 text-gold">Sign the Guest Registry</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
              Enter your name to watch comedy as a guest. No account needed — just sign in.
            </p>
            <p className="text-xs mb-4 px-3 py-2 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              <strong style={{ color: 'var(--foreground)' }}>Note:</strong> To follow, like, comment, or give tithings you must sign the registry. After 10 guest sign-ins, a full account is required.
            </p>
            <label className="block text-xs font-600 mb-1.5" style={{ color: 'var(--foreground)' }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              placeholder="e.g. Blessed Bystander"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all mb-1"
              style={{
                background: 'var(--muted)',
                border: error ? '1px solid var(--secondary)' : '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
              autoFocus
            />
            {error && (
              <p className="text-xs mb-3" style={{ color: 'var(--secondary)' }}>{error}</p>
            )}
            <button
              onClick={handleRegister}
              className="w-full mt-3 py-2.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
            >
              Enter as Guest
            </button>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
              Already a member?{' '}
              <Link href="/members/login" className="hover:underline" style={{ color: 'var(--primary)' }}>
                Sign in here
              </Link>
            </p>
          </div>
        )}

        {/* Action Gate Mode */}
        {mode === 'action_gate' && (
          <div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))' }}
            >
              <UserCheck size={22} style={{ color: 'var(--primary-foreground)' }} />
            </div>
            <h2 className="text-lg font-700 mb-1 text-gold">Sign the Guest Registry</h2>
            <p className="text-sm mb-4" style={{ color: 'var(--muted-foreground)' }}>
              To follow, like, comment, or give tithings — you must sign the guest registry with your name.
            </p>
            <label className="block text-xs font-600 mb-1.5" style={{ color: 'var(--foreground)' }}>
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setError(''); }}
              onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
              placeholder="e.g. Blessed Bystander"
              className="w-full px-3 py-2.5 rounded-xl text-sm outline-none transition-all mb-1"
              style={{
                background: 'var(--muted)',
                border: error ? '1px solid var(--secondary)' : '1px solid var(--border)',
                color: 'var(--foreground)',
              }}
              autoFocus
            />
            {error && (
              <p className="text-xs mb-3" style={{ color: 'var(--secondary)' }}>{error}</p>
            )}
            <button
              onClick={handleRegister}
              className="w-full mt-3 py-2.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--accent))', color: 'var(--primary-foreground)' }}
            >
              Sign Registry &amp; Continue
            </button>
            <p className="text-center text-xs mt-3" style={{ color: 'var(--muted-foreground)' }}>
              Already a member?{' '}
              <Link href="/members/login" className="hover:underline" style={{ color: 'var(--primary)' }}>
                Sign in here
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
