'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppLogo from '@/components/ui/AppLogo';
import { Eye, EyeOff, LogIn, Crown, Coins, Radio, Star, Shield, BookOpen, User, ChevronRight, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const rankTiers = [
  { rank: 'Saint', icon: Crown, color: '#D4AF37' },
  { rank: 'Cardinal', icon: Star, color: '#CC2222' },
  { rank: 'Archbishop', icon: Shield, color: '#A855F7' },
  { rank: 'Bishop', icon: Radio, color: '#38BDF8' },
  { rank: 'Minister', icon: BookOpen, color: '#52B788' },
  { rank: 'Deacon', icon: Coins, color: '#C9A227' },
  { rank: 'Layperson', icon: User, color: '#8A8070' },
];

const funnyQuotes = [
  { text: "Blessed are the punchline-givers, for they shall inherit the laughs.", author: "Saint Gigglesworth the Profane" },
  { text: "I tried prayer. Comedy worked faster.", author: "Cardinal Chuckles McSacrilege" },
  { text: "The Lord giveth, and the heckler taketh away.", author: "Archbishop Raucous Thunderpants" },
];

export default function MembersLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [quoteIdx] = useState(0);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('🙏 Welcome back, child. The pulpit awaits.');
      router.push('/members/home');
    } catch (err: any) {
      toast.error(err?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quote = funnyQuotes[quoteIdx];

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--background)' }}>
      {/* Left panel */}
      <div
        className="hidden lg:flex lg:w-[48%] flex-col relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(160deg, #0a0a0a 0%, #1a0800 45%, #0a0a1a 100%)' }}
      >
        <div className="absolute top-0 left-0 w-80 h-80 blob-gold opacity-25 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-72 h-72 blob-crimson opacity-35 pointer-events-none" />

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-3 mb-12">
          <AppLogo size={44} />
          <div className="flex flex-col leading-none">
            <span className="font-sans font-800 text-2xl tracking-tight text-gold">TCoLDS</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              The Church of Laughterday Saints
            </span>
          </div>
        </Link>

        {/* Main copy */}
        <div className="relative flex-1 flex flex-col justify-center">
          <div className="mb-2 flex items-center gap-2">
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            <span className="text-xs font-700 tracking-widest uppercase" style={{ color: 'var(--primary)' }}>
              Members Portal
            </span>
          </div>
          <h1 className="text-4xl xl:text-5xl font-800 leading-tight mb-5">
            Welcome back,
            <br />
            <span className="text-gold">Holy Comedian.</span>
          </h1>
          <p className="text-base leading-relaxed max-w-sm mb-10" style={{ color: 'var(--muted-foreground)' }}>
            Your congregation awaits. The pulpit is warm. The Cheddar Coin is flowing.
          </p>

          {/* Quote card */}
          <div
            className="rounded-2xl p-5 mb-10 border relative overflow-hidden"
            style={{ background: 'rgba(212,175,55,0.06)', borderColor: 'rgba(212,175,55,0.25)' }}
          >
            <div className="text-3xl text-gold opacity-30 font-serif leading-none mb-2">&ldquo;</div>
            <p className="text-sm leading-relaxed italic mb-3" style={{ color: 'var(--foreground)' }}>
              {quote.text}
            </p>
            <p className="text-xs font-700 text-gold">— {quote.author}</p>
          </div>

          {/* Rank ladder */}
          <div>
            <p className="text-xs font-700 mb-3 tracking-widest uppercase" style={{ color: 'var(--muted-foreground)' }}>
              The Clergy Hierarchy
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {rankTiers.map((tier, idx) => (
                <React.Fragment key={`rank-${tier.rank}`}>
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-150 hover:scale-110 cursor-default"
                    style={{ background: `${tier.color}22`, border: `1px solid ${tier.color}55` }}
                    title={tier.rank}
                  >
                    <tier.icon size={15} style={{ color: tier.color }} />
                  </div>
                  {idx < rankTiers.length - 1 && (
                    <ChevronRight size={10} style={{ color: 'var(--muted-foreground)' }} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
              Layperson → Saint. Every joke counts.
            </p>
          </div>
        </div>

        {/* Footer quote */}
        <div className="relative pt-6 border-t" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs italic" style={{ color: 'var(--muted-foreground)' }}>
            &ldquo;No comedy is bad comedy. No sinners turned away.&rdquo;
          </p>
          <p className="text-xs mt-1 font-600 text-gold">— TCoLDS Mission Statement</p>
        </div>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <AppLogo size={32} />
          <span className="font-sans font-800 text-lg text-gold">TCoLDS</span>
        </div>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h2 className="text-2xl font-800 mb-1">Enter the Church</h2>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              Sign in to your members account
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-600" htmlFor="mem-email">
                Email Address
              </label>
              <input
                id="mem-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="reverend@tcolds.org"
                required
                className="w-full px-4 py-3 rounded-xl text-sm transition-all duration-150 outline-none focus:ring-2"
                style={{
                  background: 'var(--input)',
                  border: '1px solid var(--border)',
                  color: 'var(--foreground)',
                }}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-600" htmlFor="mem-password">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs hover:underline transition-colors"
                  style={{ color: 'var(--primary)' }}
                >
                  Forgot thy password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="mem-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm transition-all duration-150 outline-none focus:ring-2"
                  style={{
                    background: 'var(--input)',
                    border: '1px solid var(--border)',
                    color: 'var(--foreground)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded transition-colors hover:bg-muted"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                id="mem-remember"
                type="checkbox"
                className="w-4 h-4 rounded accent-primary cursor-pointer"
              />
              <label htmlFor="mem-remember" className="text-sm cursor-pointer" style={{ color: 'var(--muted-foreground)' }}>
                Keep me in the flock
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 disabled:opacity-60 gold-gradient"
              style={{ color: 'var(--primary-foreground)', minHeight: '48px' }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Blessing your credentials...
                </>
              ) : (
                <>
                  <LogIn size={15} />
                  Enter the Church
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>or</span>
            <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)' }}
            >
              <span className="text-xs">Google</span>
            </button>
            <button
              type="button"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)' }}
            >
              <span className="text-xs">GitHub</span>
            </button>
          </div>

          <p className="text-center text-xs mt-6" style={{ color: 'var(--muted-foreground)' }}>
            New to the church?{' '}
            <Link
              href="/sign-up-login-screen"
              className="font-600 hover:underline"
              style={{ color: 'var(--primary)' }}
            >
              Join the congregation
            </Link>
          </p>

          <p className="text-center text-xs mt-3" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
            By signing in, you accept our{' '}
            <button className="underline hover:text-gold transition-colors">Terms of Congregation</button>{' '}
            and{' '}
            <button className="underline hover:text-gold transition-colors">Privacy Doctrine</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
