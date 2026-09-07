'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
  remember: boolean;
}

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ defaultValues: { remember: false } });

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      await signIn(data.email, data.password);
      toast.success('Welcome back! Ready to watch some comedy.');
      router.push('/members/home');
    } catch (err: any) {
      const msg = err?.message || 'Login failed. Check your credentials.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      {/* Social auth */}
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95 hover:bg-muted border"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)', minHeight: '44px' }}
        >
          <span className="text-xs">Google</span>
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95 hover:bg-muted border"
          style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)', minHeight: '44px' }}
        >
          <span className="text-xs">GitHub</span>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          or sign in with email
        </span>
        <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-600" htmlFor="login-email">
          Email Address
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="reverend@tcolds.org"
          className="w-full px-4 rounded-xl text-sm transition-all duration-150 outline-none focus:ring-2"
          style={{
            background: 'var(--input)',
            border: `1px solid ${errors.email ? 'var(--secondary)' : 'var(--border)'}`,
            color: 'var(--foreground)',
            minHeight: '48px',
          }}
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

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-sm font-600" htmlFor="login-password">
            Password
          </label>
          <button
            type="button"
            className="text-xs hover:underline transition-colors"
            style={{ color: 'var(--primary)' }}
          >
            Forgot password?
          </button>
        </div>
        <div className="relative">
          <input
            id="login-password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="••••••••••••"
            className="w-full px-4 pr-12 rounded-xl text-sm transition-all duration-150 outline-none focus:ring-2"
            style={{
              background: 'var(--input)',
              border: `1px solid ${errors.password ? 'var(--secondary)' : 'var(--border)'}`,
              color: 'var(--foreground)',
              minHeight: '48px',
            }}
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Password must be at least 6 characters' },
            })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded transition-colors hover:bg-muted"
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

      {/* Remember me */}
      <div className="flex items-center gap-3">
        <input
          id="login-remember"
          type="checkbox"
          className="w-5 h-5 rounded accent-primary cursor-pointer"
          {...register('remember')}
        />
        <label htmlFor="login-remember" className="text-sm cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
          Remember me
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 disabled:opacity-60 mt-1"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', minHeight: '52px' }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            <LogIn size={16} />
            Sign In
          </>
        )}
      </button>
    </form>
  );
}