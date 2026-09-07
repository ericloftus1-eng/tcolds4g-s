'use client';
import React, { useState, useEffect, useRef } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  Moon,
  Skull,
  Eye,
  Play,
  Radio,
  Lock,
  Flame,
  ChevronRight,
  AlertTriangle,
  Mic,
  BookOpen,
  PenLine,
} from 'lucide-react';
import { toast } from 'sonner';

const featuredSet = {
  id: 'bsmt-live-001',
  title: 'Confessional Roast: No Saints Allowed',
  host: 'Bishop Filthy McNasty',
  rank: 'Bishop',
  viewers: 1284,
  isLive: true,
  tag: 'DARK MASS',
};

const basementShows = [
  {
    id: 'bsmt-001',
    title: 'Unholy Roast: The Pope\'s Playlist',
    host: 'Rev. Sacrilege Snortley',
    views: '22.4k',
    duration: '18:32',
    tag: 'Roast',
    gradient: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)',
  },
  {
    id: 'bsmt-002',
    title: 'Dark Parables: Vol. 6 — The Cursed Deacon',
    host: 'Cardinal Chuckles McSacrilege',
    views: '14.1k',
    duration: '24:07',
    tag: 'Dark Skit',
    gradient: 'linear-gradient(135deg, #0d0a0a, #2e0a0a)',
  },
  {
    id: 'bsmt-003',
    title: 'Midnight Confessions (Uncut)',
    host: 'Sister Blasphema',
    views: '31.8k',
    duration: '11:55',
    tag: 'Stand-Up',
    gradient: 'linear-gradient(135deg, #0a0d0a, #0a2e1a)',
  },
  {
    id: 'bsmt-004',
    title: 'The Exorcism Comedy Hour',
    host: 'Archbishop Raucous Thunderpants',
    views: '9.7k',
    duration: '29:14',
    tag: 'Live Set',
    gradient: 'linear-gradient(135deg, #0a0a0d, #1a1a2e)',
  },
  {
    id: 'bsmt-005',
    title: 'Purgatory Open Mic Night',
    host: 'Deacon Darkside',
    views: '6.3k',
    duration: '45:00',
    tag: 'Open Mic',
    gradient: 'linear-gradient(135deg, #0d0a0d, #2e0a2e)',
  },
  {
    id: 'bsmt-006',
    title: 'Hellfire Hecklers: Season 2',
    host: 'Rev. Cacklesworth',
    views: '18.2k',
    duration: '33:20',
    tag: 'Series',
    gradient: 'linear-gradient(135deg, #1a0a00, #2e1400)',
  },
];

const guestRegistryEntries = [
  { name: 'Damien Hellsworth', time: '2 min ago', note: 'Sold my soul for a front-row pew' },
  { name: 'Lucinda Darkmore', time: '11 min ago', note: 'The devil made me click' },
  { name: 'Rev. Shadowbane', time: '34 min ago', note: 'First time descending. Not the last.' },
  { name: 'Morticia Snortley', time: '1 hr ago', note: 'Bless this unholy mess' },
  { name: 'Cornelius Vex', time: '2 hrs ago', note: 'Came for the blasphemy, stayed for the bits' },
  { name: 'Sister Grimoire', time: '3 hrs ago', note: 'My therapist said no. I said yes.' },
];

export default function BasementPage() {
  const [warningDismissed, setWarningDismissed] = useState(false);
  const [joining, setJoining] = useState(false);
  const [registryName, setRegistryName] = useState('');
  const [registryNote, setRegistryNote] = useState('');
  const [registryEntries, setRegistryEntries] = useState(guestRegistryEntries);
  const [registrySigned, setRegistrySigned] = useState(false);

  const handleJoinLive = async () => {
    setJoining(true);
    await new Promise((r) => setTimeout(r, 700));
    setJoining(false);
    toast?.success('💀 You\'ve descended into The Basement. No refunds on your soul.');
  };

  const handleSignRegistry = () => {
    if (!registryName?.trim()) {
      toast?.error('You must leave your mark to enter the registry.');
      return;
    }
    const newEntry = {
      name: registryName?.trim(),
      time: 'just now',
      note: registryNote?.trim() || 'Descended into The Basement.',
    };
    setRegistryEntries([newEntry, ...registryEntries]);
    setRegistryName('');
    setRegistryNote('');
    setRegistrySigned(true);
    toast?.success('🩸 Your name is written. The Basement remembers.');
  };

  if (!warningDismissed) {
    return (
      <AppLayout>
        <div className="min-h-[80vh] flex items-center justify-center px-4">
          <div
            className="max-w-md w-full rounded-2xl border p-8 text-center"
            style={{ background: 'var(--card)', borderColor: '#7B4EA0' }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #1a0a2e, #3d0c3d)' }}
            >
              <Skull size={28} style={{ color: '#A855F7' }} />
            </div>
            <div
              className="flex items-center justify-center gap-2 mb-3"
              style={{ color: '#A855F7' }}
            >
              <AlertTriangle size={16} />
              <span className="text-xs font-700 tracking-widest uppercase">Descending into The Basement</span>
            </div>
            <h2 className="text-2xl font-800 mb-3" style={{ color: 'var(--foreground)' }}>
              Dark Comedy Zone
            </h2>
            <p className="text-sm mb-6" style={{ color: 'var(--muted-foreground)' }}>
              The Basement hosts unfiltered, adult dark comedy. Content may be vulgar, blasphemous,
              and deliberately offensive. No comedy is bad comedy — but this is the deep end.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setWarningDismissed(true)}
                className="w-full py-3 rounded-xl font-700 text-sm transition-all duration-200 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7B4EA0, #A855F7)',
                  color: '#fff',
                }}
              >
                I understand — Take me down
              </button>
              <a
                href="/"
                className="w-full py-3 rounded-xl font-600 text-sm text-center transition-all duration-200 hover:bg-muted block"
                style={{ color: 'var(--muted-foreground)', border: '1px solid var(--border)' }}
              >
                Back to the Pulpit
              </a>
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #7B4EA0, #A855F7)' }}
          >
            <Moon size={20} style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 className="text-2xl font-800" style={{ color: 'var(--foreground)' }}>
              The Basement
            </h1>
            <p className="text-xs" style={{ color: '#A855F7' }}>
              Dark Comedy · No Filter · Clergy-Curated
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-700"
              style={{ background: 'rgba(139,26,26,0.25)', color: 'var(--secondary)', border: '1px solid var(--secondary)' }}
            >
              <Lock size={11} />
              18+ Content
            </span>
          </div>
        </div>

        {/* Live Featured */}
        <div
          className="relative rounded-2xl overflow-hidden border mb-8"
          style={{ borderColor: '#7B4EA0', minHeight: '200px' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0a0a1a 0%, #1a0a2e 50%, #0d0a0a 100%)' }}
          />
          <div className="absolute top-0 right-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(123,78,160,0.2) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none blob-crimson opacity-30" />

          <div className="relative p-6 md:p-8 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700 live-pulse"
                  style={{ background: 'var(--secondary)', color: '#fff' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  DARK MASS LIVE
                </span>
                <span
                  className="flex items-center gap-1 text-xs font-mono-data"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <Eye size={11} />
                  {featuredSet?.viewers?.toLocaleString()} watching
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-800 mb-1" style={{ color: 'var(--foreground)' }}>
                {featuredSet?.title}
              </h2>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {featuredSet?.host} · {featuredSet?.rank}
              </p>
            </div>
            <button
              onClick={handleJoinLive}
              disabled={joining}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-sm transition-all duration-200 hover:scale-105 flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #7B4EA0, #A855F7)', color: '#fff' }}
            >
              {joining ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Radio size={15} />
              )}
              Join Dark Mass
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>
            <Flame size={16} className="inline mr-2" style={{ color: '#A855F7' }} />
            Basement Sermons
          </h3>
          <button
            className="flex items-center gap-1 text-xs font-600 transition-colors hover:text-gold"
            style={{ color: 'var(--muted-foreground)' }}
          >
            View all <ChevronRight size={13} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {basementShows?.map((show) => (
            <div
              key={show?.id}
              className="group relative rounded-xl overflow-hidden border card-hover cursor-pointer"
              style={{ background: 'var(--card)', borderColor: 'rgba(123,78,160,0.3)' }}
            >
              {/* Thumbnail */}
              <div
                className="relative aspect-video flex items-center justify-center"
                style={{ background: show?.gradient }}
              >
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.7)' }}
                  >
                    <Play size={16} fill="white" style={{ color: '#fff' }} />
                  </div>
                </div>
                <span
                  className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-700"
                  style={{ background: 'rgba(123,78,160,0.7)', color: '#fff', fontSize: '10px' }}
                >
                  {show?.tag}
                </span>
                <span
                  className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono-data"
                  style={{ background: 'rgba(0,0,0,0.8)', color: '#fff', fontSize: '10px' }}
                >
                  {show?.duration}
                </span>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-sm font-600 line-clamp-1 mb-0.5" style={{ color: 'var(--foreground)' }}>
                  {show?.title}
                </p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{show?.host}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Eye size={10} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs font-mono-data" style={{ color: 'var(--muted-foreground)' }}>{show?.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Submit CTA */}
        <div
          className="mt-8 rounded-2xl border p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ background: 'linear-gradient(135deg, #0a0a1a, #1a0a2e)', borderColor: 'rgba(123,78,160,0.4)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(123,78,160,0.3)', border: '1px solid #7B4EA0' }}
            >
              <Mic size={18} style={{ color: '#A855F7' }} />
            </div>
            <div>
              <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Submit to The Basement</p>
              <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Dark comedy, unfiltered sets, and blasphemous content welcome.</p>
            </div>
          </div>
          <a
            href="/submit"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #7B4EA0, #A855F7)', color: '#fff' }}
          >
            <Mic size={14} />
            Submit a Set
          </a>
        </div>

        {/* Guest Registry — Blood Signatures */}
        <div
          className="mt-8 rounded-2xl border p-6"
          style={{
            background: 'linear-gradient(135deg, #0d0000, #1a0000, #0a0000)',
            borderColor: 'rgba(139,0,0,0.6)',
            boxShadow: '0 0 40px rgba(139,0,0,0.15) inset',
          }}
        >
          {/* Registry Header */}
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(139,0,0,0.4)', border: '1px solid rgba(180,0,0,0.6)' }}
            >
              <BookOpen size={18} style={{ color: '#cc0000' }} />
            </div>
            <div>
              <h3 className="font-800 text-base" style={{ color: '#cc2200' }}>The Guest Registry</h3>
              <p className="text-xs" style={{ color: 'rgba(200,50,50,0.7)' }}>Sign your name. The Basement keeps records.</p>
            </div>
            <div className="ml-auto">
              <span
                className="text-xs px-2.5 py-1 rounded-full font-700"
                style={{ background: 'rgba(139,0,0,0.3)', color: '#cc0000', border: '1px solid rgba(139,0,0,0.5)' }}
              >
                🩸 {registryEntries?.length} Signed
              </span>
            </div>
          </div>

          {/* Sign Form */}
          {!registrySigned ? (
            <div
              className="rounded-xl p-4 mb-5 border"
              style={{ background: 'rgba(80,0,0,0.25)', borderColor: 'rgba(139,0,0,0.4)' }}
            >
              <div className="flex items-center gap-2 mb-3">
                <PenLine size={14} style={{ color: '#cc0000' }} />
                <span className="text-xs font-700" style={{ color: '#cc2200' }}>Leave Your Mark</span>
              </div>
              <input
                type="text"
                value={registryName}
                onChange={(e) => setRegistryName(e?.target?.value)}
                placeholder="Your name (or alias)..."
                className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-2"
                style={{
                  background: 'rgba(20,0,0,0.6)',
                  border: '1px solid rgba(139,0,0,0.5)',
                  color: '#cc2200',
                  fontFamily: '"Palatino Linotype", Palatino, serif',
                  caretColor: '#cc0000',
                }}
              />
              <input
                type="text"
                value={registryNote}
                onChange={(e) => setRegistryNote(e?.target?.value)}
                placeholder="A note for the damned... (optional)"
                className="w-full px-3 py-2 rounded-lg text-sm outline-none mb-3"
                style={{
                  background: 'rgba(20,0,0,0.6)',
                  border: '1px solid rgba(139,0,0,0.4)',
                  color: '#cc2200',
                  fontFamily: '"Palatino Linotype", Palatino, serif',
                  caretColor: '#cc0000',
                }}
              />
              <button
                onClick={handleSignRegistry}
                className="flex items-center gap-2 px-4 py-2 rounded-lg font-700 text-sm transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: 'linear-gradient(135deg, #7a0000, #cc0000)', color: '#fff' }}
              >
                <PenLine size={13} />
                Sign in Blood
              </button>
            </div>
          ) : (
            <div
              className="rounded-xl p-3 mb-5 border flex items-center gap-2"
              style={{ background: 'rgba(80,0,0,0.2)', borderColor: 'rgba(139,0,0,0.4)' }}
            >
              <span style={{ color: '#cc0000' }}>🩸</span>
              <span className="text-xs font-600" style={{ color: '#cc2200' }}>Your name is written in the registry. The Basement remembers.</span>
            </div>
          )}

          {/* Signatures List */}
          <div className="space-y-3">
            {registryEntries?.map((entry, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b"
                style={{ borderColor: 'rgba(139,0,0,0.2)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: 'rgba(100,0,0,0.4)', border: '1px solid rgba(139,0,0,0.5)' }}
                >
                  <span style={{ fontSize: '14px' }}>🩸</span>
                </div>
                <div className="flex-1 min-w-0">
                  {/* Blood signature name */}
                  <p
                    className="font-700 leading-tight mb-0.5"
                    style={{
                      color: '#cc1100',
                      fontFamily: '"Palatino Linotype", Palatino, "Book Antiqua", serif',
                      fontSize: '17px',
                      textShadow: '0 0 8px rgba(180,0,0,0.6), 0 1px 3px rgba(0,0,0,0.8)',
                      letterSpacing: '0.02em',
                      filter: 'drop-shadow(0 0 4px rgba(200,0,0,0.4))',
                    }}
                  >
                    {entry?.name}
                  </p>
                  {entry?.note && (
                    <p
                      className="text-xs italic"
                      style={{
                        color: 'rgba(180,40,40,0.75)',
                        fontFamily: '"Palatino Linotype", Palatino, serif',
                        textShadow: '0 0 4px rgba(139,0,0,0.4)',
                      }}
                    >
                      &ldquo;{entry?.note}&rdquo;
                    </p>
                  )}
                </div>
                <span
                  className="text-xs flex-shrink-0 font-mono-data"
                  style={{ color: 'rgba(139,0,0,0.5)', fontSize: '10px' }}
                >
                  {entry?.time}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
