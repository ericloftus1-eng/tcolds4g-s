'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, UserPlus, Globe, GitBranch, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface SignupFormData {
  displayName: string;
  handle: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
  ageConfirm: boolean;
}

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const router = useRouter();
  const { signUp } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<SignupFormData>();

  const password = watch('password');

  const handleStep1Next = async () => {
    const valid = await trigger(['displayName', 'handle', 'email']);
    if (valid) setStep(2);
  };

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    try {
      await signUp(data.email, data.password, {
        fullName: data.displayName,
      });
      toast.success('Welcome to TCoLDS! Start watching and earning Cheddar Coin.');
      router.push('/members/home');
    } catch (err: any) {
      const msg = err?.message || 'Sign up failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (hasError: boolean) => ({
    background: 'var(--input)',
    border: `1px solid ${hasError ? 'var(--secondary)' : 'var(--border)'}`,
    color: 'var(--foreground)',
    minHeight: '48px',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-1">
        {[1, 2].map((s) => (
          <React.Fragment key={`step-indicator-${s}`}>
            <div
              className="flex items-center gap-1.5 text-xs font-600"
              style={{ color: step >= s ? 'var(--primary)' : 'var(--muted-foreground)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-700"
                style={{
                  background: step >= s ? 'var(--primary)' : 'var(--muted)',
                  color: step >= s ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {step > s ? <CheckCircle size={14} /> : s}
              </div>
              <span className="hidden sm:block">{s === 1 ? 'Your Profile' : 'Set Password'}</span>
            </div>
            {s < 2 && (
              <div
                className="flex-1 h-px"
                style={{ background: step > s ? 'var(--primary)' : 'var(--border)' }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <>
          {/* Social auth */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)', minHeight: '44px' }}
            >
              <Globe size={15} />
              Google
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)', minHeight: '44px' }}
            >
              <GitBranch size={15} />
              GitHub
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              or create your account
            </span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Display name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600" htmlFor="signup-name">
              Display Name
            </label>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Your public name — make it memorable.
            </p>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              placeholder="Your display name"
              className="w-full px-4 rounded-xl text-sm outline-none focus:ring-2 transition-all"
              style={inputStyle(!!errors.displayName)}
              {...register('displayName', {
                required: 'Display name is required',
                minLength: { value: 2, message: 'Name must be at least 2 characters' },
                maxLength: { value: 50, message: 'Name must be under 50 characters' },
              })}
            />
            {errors.displayName && (
              <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* Handle */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600" htmlFor="signup-handle">
              Username
            </label>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Your @username — how others find you.
            </p>
            <div className="relative">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-600"
                style={{ color: 'var(--muted-foreground)' }}
              >
                @
              </span>
              <input
                id="signup-handle"
                type="text"
                autoComplete="username"
                placeholder="yourhandle"
                className="w-full pl-7 pr-4 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={inputStyle(!!errors.handle)}
                {...register('handle', {
                  required: 'Username is required',
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                  minLength: { value: 3, message: 'Username must be at least 3 characters' },
                  maxLength: { value: 30, message: 'Username must be under 30 characters' },
                })}
              />
            </div>
            {errors.handle && (
              <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                {errors.handle.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600" htmlFor="signup-email">
              Email Address
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="you@example.com"
              className="w-full px-4 rounded-xl text-sm outline-none focus:ring-2 transition-all"
              style={inputStyle(!!errors.email)}
              {...register('email', {
                required: 'Email address is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' },
              })}
            />
            {errors.email && (
              <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleStep1Next}
            className="w-full rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 mt-1"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', minHeight: '52px' }}
          >
            Continue →
          </button>
        </>
      )}

      {step === 2 && (
        <>
          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600" htmlFor="signup-password">
              Password
            </label>
            <div className="relative">
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••••••"
                className="w-full px-4 pr-12 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={inputStyle(!!errors.password)}
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Password must be at least 8 characters' },
                  pattern: {
                    value: /^(?=.*[A-Z])(?=.*\d)/,
                    message: 'Include at least one uppercase letter and one number',
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-muted transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-600" htmlFor="signup-confirm">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="signup-confirm"
                type={showConfirm ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="••••••••••••"
                className="w-full px-4 pr-12 rounded-xl text-sm outline-none focus:ring-2 transition-all"
                style={inputStyle(!!errors.confirmPassword)}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (val) => val === password || 'Passwords do not match',
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded hover:bg-muted transition-colors"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs" style={{ color: 'var(--secondary)' }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Age confirmation */}
          <div className="flex items-start gap-3">
            <input
              id="signup-age"
              type="checkbox"
              className="w-5 h-5 mt-0.5 rounded accent-primary cursor-pointer flex-shrink-0"
              {...register('ageConfirm', { required: 'You must confirm your age to access adult content' })}
            />
            <label htmlFor="signup-age" className="text-xs cursor-pointer leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              I am 18+ years old and understand that TCoLDS contains adult comedy content, including The Basement section.
            </label>
          </div>
          {errors.ageConfirm && (
            <p className="text-xs" style={{ color: 'var(--secondary)' }}>
              {errors.ageConfirm.message}
            </p>
          )}

          {/* Terms */}
          <div className="flex items-start gap-3">
            <input
              id="signup-terms"
              type="checkbox"
              className="w-5 h-5 mt-0.5 rounded accent-primary cursor-pointer flex-shrink-0"
              {...register('agreeTerms', { required: 'You must accept the Terms of Service' })}
            />
            <label htmlFor="signup-terms" className="text-xs cursor-pointer leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
              I accept the{' '}
              <button type="button" className="underline hover:text-gold transition-colors">
                Terms of Service
              </button>{' '}
              and{' '}
              <button type="button" className="underline hover:text-gold transition-colors">
                Privacy Policy
              </button>
              .
            </label>
          </div>
          {errors.agreeTerms && (
            <p className="text-xs" style={{ color: 'var(--secondary)' }}>
              {errors.agreeTerms.message}
            </p>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 rounded-xl font-600 text-sm transition-all duration-150 active:scale-95 border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', background: 'var(--card)', minHeight: '52px' }}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 disabled:opacity-60"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', minHeight: '52px' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={15} />
                  Create Account
                </>
              )}
            </button>
          </div>
        </>
      )}
    </form>
  );
}