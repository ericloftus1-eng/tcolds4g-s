'use client';
import React, { useState } from 'react';
import {
  UserPlus,
  Bell,
  Share2,
  MoreHorizontal,
  MapPin,
  LinkIcon,
  Calendar,
  CheckCircle,
} from 'lucide-react';
import ClergryRankBadge from '@/components/ui/ClergryRankBadge';
import CheddarCoinWidget from '@/components/ui/CheddarCoinWidget';
import { toast } from 'sonner';

export default function ProfileHero() {
  const [following, setFollowing] = useState(false);
  const [notifOn, setNotifOn] = useState(false);

  const handleFollow = () => {
    setFollowing(!following);
    // BACKEND: POST /api/users/cardinal-chuckles/follow
    if (!following) {
      toast?.success('🙏 You have joined the congregation of Cardinal Chuckles McSacrilege!');
    }
  };

  return (
    <div className="relative">
      {/* Banner */}
      <div
        className="w-full h-48 md:h-64 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #2e0a0a 0%, #0a0a2e 40%, #1a0a2e 70%, #2e1a0a 100%)',
        }}
      >
        <div className="absolute top-0 left-0 w-full h-full opacity-40"
          style={{
            background: 'radial-gradient(ellipse at 20% 50%, rgba(139,26,26,0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 50%, rgba(212,175,55,0.3) 0%, transparent 60%)',
          }}
        />
        {/* Decorative stained glass effect */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg, var(--border) 0px, var(--border) 1px, transparent 1px, transparent 20px)',
          }}
        />
        {/* Edit banner button */}
        <button
          className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-600 transition-all duration-150 hover:bg-muted border"
          style={{ background: 'rgba(0,0,0,0.5)', borderColor: 'var(--border)', color: 'var(--muted-foreground)', backdropFilter: 'blur(8px)' }}
        >
          Edit Banner
        </button>
      </div>
      {/* Avatar + info row */}
      <div className="max-w-screen-2xl mx-auto px-4 lg:px-8 xl:px-10 2xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12 md:-mt-16 relative z-10">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div
              className="w-24 h-24 md:w-32 md:h-32 rounded-2xl flex items-center justify-center text-3xl md:text-4xl font-800 border-4 ordination-glow"
              style={{
                background: 'linear-gradient(135deg, #2e0a0a, #8B1A1A)',
                borderColor: 'var(--background)',
                color: 'var(--primary)',
              }}
            >
              CC
            </div>
            {/* Ordained checkmark */}
            <div
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: 'var(--primary)' }}
            >
              <CheckCircle size={14} style={{ color: 'var(--primary-foreground)' }} fill="currentColor" />
            </div>
          </div>

          {/* Name + rank + meta */}
          <div className="flex-1 min-w-0 pb-2">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-800 leading-none">
                Cardinal Chuckles McSacrilege
              </h1>
              <ClergryRankBadge rank="Cardinal" size="lg" />
            </div>
            <p className="text-sm font-500 mb-2" style={{ color: 'var(--muted-foreground)' }}>
              @chucklesmcsac
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
              <span className="flex items-center gap-1">
                <MapPin size={11} />
                Vatican City, NJ
              </span>
              <span className="flex items-center gap-1">
                <LinkIcon size={11} />
                <button className="hover:text-gold transition-colors">tcolds.org/chucklesmcsac</button>
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={11} />
                Ordained March 2024
              </span>
            </div>
            <p className="text-sm mt-2 max-w-xl leading-relaxed" style={{ color: 'var(--foreground)' }}>
              Professional blasphemer. Amateur theologian. I have 14 years of stand-up and one very disappointed mother.
              Currently touring &ldquo;The Gospel According to My Ex.&rdquo; 🎙️
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 pb-2 flex-shrink-0 flex-wrap">
            <button
              onClick={handleFollow}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95"
              style={{
                background: following ? 'var(--muted)' : 'var(--primary)',
                color: following ? 'var(--muted-foreground)' : 'var(--primary-foreground)',
                border: following ? '1px solid var(--border)' : 'none',
              }}
            >
              {following ? (
                <>
                  <CheckCircle size={14} />
                  In Your Flock
                </>
              ) : (
                <>
                  <UserPlus size={14} />
                  Join Congregation
                </>
              )}
            </button>
            <button
              onClick={() => setNotifOn(!notifOn)}
              className="p-2 rounded-xl transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{
                borderColor: notifOn ? 'var(--primary)' : 'var(--border)',
                color: notifOn ? 'var(--primary)' : 'var(--muted-foreground)',
                background: 'var(--card)',
              }}
            >
              <Bell size={16} fill={notifOn ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={() => {
                toast?.success('Profile link copied to clipboard!');
              }}
              className="p-2 rounded-xl transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', background: 'var(--card)' }}
            >
              <Share2 size={16} />
            </button>
            <button
              className="p-2 rounded-xl transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)', background: 'var(--card)' }}
            >
              <MoreHorizontal size={16} />
            </button>
            <CheddarCoinWidget recipientName="Cardinal Chuckles McSacrilege" recipientRank="Cardinal" compact />
          </div>
        </div>
      </div>
    </div>
  );
}