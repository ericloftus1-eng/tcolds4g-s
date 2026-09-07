'use client';
import React, { useState } from 'react';
import { Radio, Users, Eye, ChevronRight, Calendar, Zap } from 'lucide-react';
import { toast } from 'sonner';

const liveEvents = [
  {
    id: 'mass-001',
    title: 'Sunday Massacre Mass',
    host: 'Archbishop Raucous Thunderpants',
    handle: 'thunderpants',
    rank: 'Archbishop',
    viewers: 3847,
    startedAt: '42 min ago',
    thumbnailGradient: 'linear-gradient(135deg, #1a0a2e 0%, #3d0c0c 50%, #0a1a2e 100%)',
    isLive: true,
  },
];

const upcomingEvents = [
  {
    id: 'mass-002',
    title: 'The Midnight Vespers Roast',
    host: 'Cardinal Chuckles McSacrilege',
    time: 'Tonight 9:00 PM EST',
    registered: 1204,
  },
  {
    id: 'mass-003',
    title: 'Basement Confessional Live',
    host: 'Bishop Filthy McNasty',
    time: 'Tomorrow 8:00 PM EST',
    registered: 876,
  },
];

export default function HomeFeedHero() {
  const [joining, setJoining] = useState(false);
  const event = liveEvents[0];

  const handleJoin = async () => {
    setJoining(true);
    // BACKEND: POST /api/mass/{event.id}/join
    await new Promise((r) => setTimeout(r, 800));
    setJoining(false);
    toast.success('🎙️ You\'ve entered the sanctuary. Praise the punchline!');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Live Mass Hero — spans 2 cols */}
      <div
        className="lg:col-span-2 relative rounded-2xl overflow-hidden border"
        style={{ borderColor: 'var(--secondary)', minHeight: '220px' }}
      >
        <div
          className="absolute inset-0"
          style={{ background: event.thumbnailGradient }}
        />
        {/* Ambient blobs */}
        <div className="absolute top-0 left-0 w-48 h-48 blob-crimson opacity-60" />
        <div className="absolute bottom-0 right-0 w-48 h-48 blob-gold opacity-40" />

        <div className="relative p-6 h-full flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-700 live-pulse"
                  style={{ background: 'var(--secondary)', color: '#fff' }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                  LIVE MASS
                </span>
                <span
                  className="flex items-center gap-1 text-xs font-mono-data"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <Eye size={11} />
                  {event.viewers.toLocaleString()} watching
                </span>
              </div>
              <h2
                className="text-display-lg font-800 leading-tight"
                style={{ color: 'var(--foreground)' }}
              >
                {event.title}
              </h2>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Hosted by{' '}
                <span style={{ color: 'var(--primary)' }} className="font-600">
                  {event.host}
                </span>{' '}
                · Started {event.startedAt}
              </p>
            </div>
            <Radio size={32} className="opacity-30 flex-shrink-0 mt-1" style={{ color: 'var(--primary)' }} />
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleJoin}
              disabled={joining}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-700 text-sm transition-all duration-150 active:scale-95 disabled:opacity-70"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              {joining ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Entering...
                </>
              ) : (
                <>
                  <Zap size={15} />
                  Enter the Sanctuary
                </>
              )}
            </button>
            <button
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-600 text-sm transition-all duration-150 active:scale-95 hover:bg-muted border"
              style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
            >
              <Users size={14} />
              {event.viewers.toLocaleString()} congregation
            </button>
          </div>
        </div>
      </div>

      {/* Upcoming events */}
      <div
        className="rounded-2xl border p-4 flex flex-col gap-3"
        style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-700 flex items-center gap-2">
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            Upcoming Mass
          </h3>
          <button
            className="text-xs font-500 hover:underline"
            style={{ color: 'var(--primary)' }}
          >
            View all
          </button>
        </div>

        {upcomingEvents.map((ev) => (
          <div
            key={ev.id}
            className="rounded-xl p-3 border card-hover cursor-pointer"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)' }}
          >
            <p className="text-sm font-600 leading-tight" style={{ color: 'var(--foreground)' }}>
              {ev.title}
            </p>
            <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
              {ev.host}
            </p>
            <div className="flex items-center justify-between mt-2">
              <span
                className="text-xs font-mono-data"
                style={{ color: 'var(--primary)' }}
              >
                {ev.time}
              </span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                {ev.registered.toLocaleString()} RSVPs
              </span>
            </div>
          </div>
        ))}

        <button
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-600 transition-all duration-150 hover:bg-muted border"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          Schedule a Mass
          <ChevronRight size={12} />
        </button>
      </div>
    </div>
  );
}