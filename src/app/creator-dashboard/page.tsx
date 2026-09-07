'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import Link from 'next/link';
import { BarChart2, Users, Coins, Heart, Eye, Upload, Play, Clock, Crown, Star, ArrowUp, ArrowRight, Mic, Video, FileText, Zap, Calendar, ChevronRight, MoreHorizontal, TrendingUp, MessageCircle, Share2, Globe, Award, Flame, Target, Activity } from 'lucide-react';
import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  Area, AreaChart, LineChart, Line, PieChart, Pie, Cell, RadialBarChart, RadialBar
} from 'recharts';

const weeklyViews = [
  { day: 'Mon', views: 1240, blessings: 88 },
  { day: 'Tue', views: 980, blessings: 62 },
  { day: 'Wed', views: 1850, blessings: 140 },
  { day: 'Thu', views: 2100, blessings: 175 },
  { day: 'Fri', views: 3200, blessings: 260 },
  { day: 'Sat', views: 4100, blessings: 340 },
  { day: 'Sun', views: 3600, blessings: 290 },
];

const ccEarnings = [
  { week: 'W1', cc: 420 },
  { week: 'W2', cc: 680 },
  { week: 'W3', cc: 540 },
  { week: 'W4', cc: 920 },
  { week: 'W5', cc: 1100 },
  { week: 'W6', cc: 860 },
  { week: 'W7', cc: 1240 },
  { week: 'W8', cc: 1580 },
];

const retentionData = [
  { day: 'Day 1', rate: 100 },
  { day: 'Day 3', rate: 72 },
  { day: 'Day 7', rate: 54 },
  { day: 'Day 14', rate: 41 },
  { day: 'Day 30', rate: 33 },
];

const audienceByRank = [
  { name: 'Layperson', value: 1820, color: '#8A8070' },
  { name: 'Deacon', value: 890, color: '#7B4EA0' },
  { name: 'Minister', value: 640, color: '#52B788' },
  { name: 'Bishop+', value: 491, color: '#D4AF37' },
];

const engagementBreakdown = [
  { name: 'Blessings', value: 6120, fill: '#E07B39' },
  { name: 'Shares', value: 2840, fill: '#4EA0C0' },
  { name: 'Comments', value: 1920, fill: '#7B4EA0' },
  { name: 'Saves', value: 980, fill: '#52B788' },
];

const recentContent = [
  { id: 'c1', title: '"Thou Shalt Not Bomb" — Sunday Massacre Set', type: 'Video', views: 14200, blessings: 1140, cc: 570, status: 'live', daysAgo: 2, shares: 340, comments: 89 },
  { id: 'c2', title: 'Holy Roast: Bishop Snortley Edition', type: 'Video', views: 8700, blessings: 690, cc: 345, status: 'live', daysAgo: 5, shares: 210, comments: 54 },
  { id: 'c3', title: 'The Parable of the Open Mic', type: 'Sermon', views: 4200, blessings: 310, cc: 155, status: 'live', daysAgo: 9, shares: 88, comments: 31 },
  { id: 'c4', title: 'Late Night Confessional — Uncut', type: 'Video', views: 0, blessings: 0, cc: 0, status: 'draft', daysAgo: 0, shares: 0, comments: 0 },
  { id: 'c5', title: 'Crowd Work Chronicles Vol. 3', type: 'Video', views: 0, blessings: 0, cc: 0, status: 'scheduled', daysAgo: -2, shares: 0, comments: 0 },
];

const topFans = [
  { id: 'f1', name: 'Rev. Cacklesworth', initials: 'RC', color: '#52B788', rank: 'Minister', cc: 480, blessings: 38 },
  { id: 'f2', name: 'Bishop Snortley', initials: 'BS', color: '#D4AF37', rank: 'Bishop', cc: 320, blessings: 24 },
  { id: 'f3', name: 'Deacon Wheezington', initials: 'DW', color: '#7B4EA0', rank: 'Deacon', cc: 210, blessings: 18 },
  { id: 'f4', name: 'Sister Snickerdoodle', initials: 'SS', color: '#E07B39', rank: 'Sister', cc: 160, blessings: 12 },
];

const statCards = [
  { label: 'Total Views', value: '47.2K', delta: '+18%', icon: Eye, color: '#4EA0C0', sub: 'this month' },
  { label: 'Congregation', value: '3,841', delta: '+124', icon: Users, color: '#52B788', sub: 'new this week' },
  { label: 'CC Earned', value: '8,240', delta: '+1,580', icon: Coins, color: '#D4AF37', sub: 'this month' },
  { label: 'Blessings', value: '6,120', delta: '+340', icon: Heart, color: '#E07B39', sub: 'this week' },
];

const contentTypeIcon: Record<string, React.ElementType> = {
  Video: Video,
  Sermon: Mic,
  Draft: FileText,
};

const statusStyle: Record<string, { bg: string; color: string; label: string }> = {
  live: { bg: 'rgba(82,183,136,0.15)', color: '#52B788', label: 'Live' },
  draft: { bg: 'rgba(138,128,112,0.15)', color: '#8A8070', label: 'Draft' },
  scheduled: { bg: 'rgba(78,160,192,0.15)', color: '#4EA0C0', label: 'Scheduled' },
};

const goalData = [
  { name: 'Rank Up', value: 62, fill: '#D4AF37' },
];

export default function CreatorDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'audience' | 'earnings'>('overview');
  const [shareLink] = useState('https://tcolds3821.builtwithrocket.new/entrance');
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(shareLink).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={16} style={{ color: 'var(--primary)' }} />
              <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,26,26,0.25)', color: 'var(--primary)' }}>
                Creator Studio
              </span>
            </div>
            <h1 className="text-hero-xl text-gold">Your Dashboard</h1>
            <p className="text-sm font-500 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>
              Deacon Thunderpants · Rank 14 in The Basement
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Share link CTA */}
            <button
              onClick={copyLink}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 border transition-all duration-150 active:scale-95 hover:bg-muted"
              style={{ borderColor: 'rgba(212,175,55,0.4)', color: '#D4AF37' }}
            >
              <Share2 size={14} />
              {copied ? 'Copied!' : 'Share Your Link'}
            </button>
            <Link
              href="/upload-studio"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 hover:opacity-90"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <Upload size={14} />
              Upload Studio
            </Link>
          </div>
        </div>

        {/* Soft-launch share banner */}
        <div
          className="rounded-2xl border p-4 mb-6 flex items-center gap-4 flex-wrap"
          style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(139,26,26,0.08) 100%)', borderColor: 'rgba(212,175,55,0.3)' }}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
              <Globe size={15} style={{ color: '#D4AF37' }} />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-700 text-gold">Ready to send your link?</p>
              <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)' }}>{shareLink}</p>
            </div>
          </div>
          <button
            onClick={copyLink}
            className="px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 active:scale-95 flex-shrink-0"
            style={{ background: copied ? '#52B788' : '#D4AF37', color: '#0a0a0a' }}
          >
            {copied ? '✓ Copied!' : 'Copy Link'}
          </button>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto mb-6">
          <div className="flex gap-1 p-1 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)', width: 'fit-content', minWidth: '100%' }}>
            {(['overview', 'content', 'audience', 'earnings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="px-3 sm:px-4 py-1.5 rounded-lg text-sm font-600 capitalize transition-all duration-150 flex-1 whitespace-nowrap"
                style={{
                  background: activeTab === tab ? 'var(--primary)' : 'transparent',
                  color: activeTab === tab ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border p-4 relative overflow-hidden"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div
                className="absolute top-0 right-0 w-20 h-20 rounded-full opacity-10 pointer-events-none"
                style={{ background: card.color, transform: 'translate(30%, -30%)' }}
              />
              <div className="flex items-center justify-between mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: `${card.color}18`, border: `1px solid ${card.color}33` }}
                >
                  <card.icon size={15} style={{ color: card.color }} />
                </div>
                <div className="flex items-center gap-1 text-xs font-700" style={{ color: '#52B788' }}>
                  <ArrowUp size={11} />
                  {card.delta}
                </div>
              </div>
              <p className="text-2xl font-900 font-mono-data" style={{ color: 'var(--foreground)' }}>{card.value}</p>
              <p className="text-xs font-600 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{card.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Views Chart — spans 2 cols */}
          <div
            className="lg:col-span-2 rounded-2xl border p-5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-700 text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <BarChart2 size={15} style={{ color: 'var(--primary)' }} />
                Weekly Views &amp; Blessings
              </h2>
              <span className="text-xs font-600 px-2 py-0.5 rounded-lg" style={{ background: 'var(--muted)', color: 'var(--muted-foreground)' }}>
                Last 7 days
              </span>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyViews} barGap={4}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={36} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }}
                  labelStyle={{ color: 'var(--foreground)', fontWeight: 700 }}
                />
                <Bar dataKey="views" fill="#8B1A1A" radius={[4, 4, 0, 0]} name="Views" />
                <Bar dataKey="blessings" fill="#D4AF37" radius={[4, 4, 0, 0]} name="Blessings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* CC Earnings trend */}
          <div
            className="rounded-2xl border p-5"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-700 text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Coins size={15} style={{ color: '#D4AF37' }} />
                CC Earnings
              </h2>
              <CheddarCoinDisplay size={20} />
            </div>
            <p className="text-3xl font-900 font-mono-data text-gold mb-1">8,240</p>
            <p className="text-xs font-600 mb-4 flex items-center gap-1" style={{ color: '#52B788' }}>
              <ArrowUp size={11} />
              +1,580 this month
            </p>
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart data={ccEarnings}>
                <defs>
                  <linearGradient id="ccGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="week" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                  labelStyle={{ color: 'var(--foreground)' }}
                />
                <Area type="monotone" dataKey="cc" stroke="#D4AF37" strokeWidth={2} fill="url(#ccGrad)" name="CC" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                CC is platform currency — earned through content, tips &amp; blessings.
              </p>
            </div>
          </div>
        </div>

        {/* Second row — Engagement + Audience + Retention */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

          {/* Engagement breakdown */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-700 text-sm flex items-center gap-2 mb-4" style={{ color: 'var(--foreground)' }}>
              <Activity size={14} style={{ color: '#E07B39' }} />
              Engagement Mix
            </h2>
            <div className="space-y-3">
              {engagementBreakdown.map((item) => {
                const total = engagementBreakdown.reduce((s, i) => s + i.value, 0);
                const pct = Math.round((item.value / total) * 100);
                return (
                  <div key={item.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-600" style={{ color: 'var(--foreground)' }}>{item.name}</span>
                      <span className="text-xs font-700 font-mono-data" style={{ color: item.fill }}>{item.value.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: item.fill }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t flex items-center gap-2" style={{ borderColor: 'var(--border)' }}>
              <TrendingUp size={12} style={{ color: '#52B788' }} />
              <span className="text-xs font-600" style={{ color: '#52B788' }}>+22% engagement rate vs last month</span>
            </div>
          </div>

          {/* Audience by rank */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-700 text-sm flex items-center gap-2 mb-4" style={{ color: 'var(--foreground)' }}>
              <Users size={14} style={{ color: '#52B788' }} />
              Congregation Ranks
            </h2>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={90} height={90}>
                <PieChart>
                  <Pie data={audienceByRank} cx="50%" cy="50%" innerRadius={28} outerRadius={42} dataKey="value" strokeWidth={0}>
                    {audienceByRank.map((entry, idx) => (
                      <Cell key={idx} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-1.5">
                {audienceByRank.map((item) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: item.color }} />
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.name}</span>
                    </div>
                    <span className="text-xs font-700 font-mono-data" style={{ color: 'var(--foreground)' }}>{item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                <span className="text-gold font-700">13%</span> are Bishop+ — your highest-value fans
              </p>
            </div>
          </div>

          {/* Retention curve */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-700 text-sm flex items-center gap-2 mb-1" style={{ color: 'var(--foreground)' }}>
              <Target size={14} style={{ color: '#4EA0C0' }} />
              Audience Retention
            </h2>
            <p className="text-xs mb-3" style={{ color: 'var(--muted-foreground)' }}>% still watching after N days</p>
            <ResponsiveContainer width="100%" height={110}>
              <LineChart data={retentionData}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--muted-foreground)' }} axisLine={false} tickLine={false} width={28} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 11 }}
                  formatter={(v: any) => [`${v}%`, 'Retention']}
                />
                <Line type="monotone" dataKey="rate" stroke="#4EA0C0" strokeWidth={2} dot={{ fill: '#4EA0C0', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                <div className="h-full rounded-full" style={{ width: '33%', background: '#4EA0C0' }} />
              </div>
              <span className="text-xs font-700" style={{ color: '#4EA0C0' }}>33% Day-30</span>
            </div>
          </div>
        </div>

        {/* Rank progress + quick insight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Rank progress */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-700 text-sm flex items-center gap-2 mb-4" style={{ color: 'var(--foreground)' }}>
              <Award size={14} style={{ color: '#D4AF37' }} />
              Path to Bishop
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <ResponsiveContainer width={80} height={80}>
                  <RadialBarChart cx="50%" cy="50%" innerRadius={24} outerRadius={36} startAngle={90} endAngle={-270} data={goalData}>
                    <RadialBar dataKey="value" cornerRadius={6} fill="#D4AF37" background={{ fill: 'rgba(212,175,55,0.1)' }} />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-900 text-gold">62%</span>
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm font-700" style={{ color: 'var(--foreground)' }}>Deacon → Bishop</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Need 2,400 more CC and 15 more sermons</p>
                <div className="mt-2 space-y-1">
                  {[
                    { label: 'CC Balance', pct: 72 },
                    { label: 'Sermons', pct: 54 },
                    { label: 'Blessings', pct: 68 },
                  ].map((r) => (
                    <div key={r.label} className="flex items-center gap-2">
                      <span className="text-xs w-16 flex-shrink-0" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>{r.label}</span>
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                        <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: '#D4AF37' }} />
                      </div>
                      <span className="text-xs font-700" style={{ color: '#D4AF37', fontSize: 10 }}>{r.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Top content insight */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-700 text-sm flex items-center gap-2 mb-3" style={{ color: 'var(--foreground)' }}>
              <Flame size={14} style={{ color: 'var(--primary)' }} />
              Top Performing
            </h2>
            <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(139,26,26,0.1)', border: '1px solid rgba(139,26,26,0.2)' }}>
              <p className="text-xs font-700 mb-1" style={{ color: 'var(--foreground)' }}>"Thou Shalt Not Bomb"</p>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                  <Eye size={10} /> 14.2K
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: '#E07B39' }}>
                  <Heart size={10} /> 1,140
                </span>
                <span className="text-xs flex items-center gap-1" style={{ color: '#4EA0C0' }}>
                  <Share2 size={10} /> 340
                </span>
                <span className="text-xs flex items-center gap-1 font-700" style={{ color: '#D4AF37' }}>
                  <Coins size={10} /> 570 CC
                </span>
              </div>
            </div>
            <p className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
              🔥 Your Sunday sets get <span className="text-gold font-700">3.2×</span> more blessings than weekday content
            </p>
          </div>

          {/* Messages quick stat */}
          <div className="rounded-2xl border p-5" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h2 className="font-700 text-sm flex items-center gap-2 mb-3" style={{ color: 'var(--foreground)' }}>
              <MessageCircle size={14} style={{ color: '#7B4EA0' }} />
              Direct Messages
            </h2>
            <div className="space-y-2">
              {[
                { name: 'Bishop Snortley', msg: 'You deserved every single one...', time: '1h', unread: false, color: '#D4AF37', initials: 'BS' },
                { name: 'Deacon Wheezington', msg: 'I got a new bit about the collection plate', time: '30m', unread: true, color: '#7B4EA0', initials: 'DW' },
                { name: 'Sister Snickerdoodle', msg: 'Are you coming to the open mic?', time: '1d', unread: true, color: '#52B788', initials: 'SS' },
              ].map((dm) => (
                <div key={dm.name} className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl hover:bg-muted transition-colors cursor-pointer">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                    style={{ background: `${dm.color}22`, color: dm.color, border: `1.5px solid ${dm.color}55` }}
                  >
                    {dm.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-700 truncate" style={{ color: 'var(--foreground)' }}>{dm.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>{dm.msg}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: 10 }}>{dm.time}</span>
                    {dm.unread && (
                      <span className="w-2 h-2 rounded-full" style={{ background: 'var(--primary)' }} />
                    )}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs mt-3 font-600" style={{ color: 'var(--muted-foreground)' }}>
              Use the 💬 button (bottom right) to reply
            </p>
          </div>
        </div>

        {/* Content + Top Fans */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent Content */}
          <div
            className="lg:col-span-2 rounded-2xl border overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-700 text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Play size={14} style={{ color: 'var(--primary)' }} />
                Your Content
              </h2>
              <Link href="/upload-studio" className="text-xs font-600 flex items-center gap-1" style={{ color: 'var(--primary)' }}>
                Upload New <ChevronRight size={12} />
              </Link>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {recentContent.map((item) => {
                const CIcon = contentTypeIcon[item.type] || FileText;
                const st = statusStyle[item.status];
                return (
                  <div key={item.id} className="px-5 py-3 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer group">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: 'rgba(139,26,26,0.12)', border: '1px solid rgba(139,26,26,0.25)' }}
                    >
                      <CIcon size={15} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-600 truncate" style={{ color: 'var(--foreground)' }}>{item.title}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        {item.status === 'live' && (
                          <>
                            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                              <Eye size={10} /> {item.views.toLocaleString()}
                            </span>
                            <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                              <Heart size={10} /> {item.blessings.toLocaleString()}
                            </span>
                            <span className="text-xs flex items-center gap-1" style={{ color: '#4EA0C0' }}>
                              <Share2 size={10} /> {item.shares}
                            </span>
                            <span className="text-xs flex items-center gap-1 font-700" style={{ color: '#D4AF37' }}>
                              <Coins size={10} /> {item.cc} CC
                            </span>
                          </>
                        )}
                        {item.status === 'scheduled' && (
                          <span className="text-xs flex items-center gap-1" style={{ color: '#4EA0C0' }}>
                            <Calendar size={10} /> Scheduled in 2 days
                          </span>
                        )}
                        {item.status === 'draft' && (
                          <span className="text-xs flex items-center gap-1" style={{ color: 'var(--muted-foreground)' }}>
                            <Clock size={10} /> Draft — not published
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className="text-xs px-2 py-0.5 rounded-full font-600"
                        style={{ background: st.bg, color: st.color }}
                      >
                        {st.label}
                      </span>
                      <button className="p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted" style={{ color: 'var(--muted-foreground)' }}>
                        <MoreHorizontal size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Fans */}
          <div
            className="rounded-2xl border overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h2 className="font-700 text-sm flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <Star size={14} style={{ color: '#D4AF37' }} />
                Top Congregation
              </h2>
            </div>
            <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
              {topFans.map((fan, idx) => (
                <div key={fan.id} className="px-5 py-3 flex items-center gap-3 hover:bg-muted transition-colors cursor-pointer">
                  <span
                    className="w-5 text-center text-xs font-800 font-mono-data flex-shrink-0"
                    style={{ color: idx === 0 ? '#D4AF37' : 'var(--muted-foreground)' }}
                  >
                    #{idx + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-700 flex-shrink-0"
                    style={{ background: `${fan.color}22`, color: fan.color, border: `1.5px solid ${fan.color}55` }}
                  >
                    {fan.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-700 truncate" style={{ color: 'var(--foreground)' }}>{fan.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{fan.rank}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-700 font-mono-data" style={{ color: '#D4AF37' }}>{fan.cc} CC</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{fan.blessings} blessings</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-5 py-3 border-t" style={{ borderColor: 'var(--border)' }}>
              <div
                className="rounded-xl p-3 text-center"
                style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}
              >
                <p className="text-xs font-700 text-gold mb-0.5">Congregation Total</p>
                <p className="text-xl font-900 font-mono-data text-gold">3,841</p>
                <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>members following you</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Upload Video', icon: Video, href: '/submit', color: '#8B1A1A' },
            { label: 'Submit Sermon', icon: Mic, href: '/submit', color: '#7B4EA0' },
            { label: 'View Giveback', icon: Heart, href: '/giveback', color: '#52B788' },
            { label: 'Merch Store', icon: Crown, href: '/merchandise', color: '#D4AF37' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl border transition-all duration-150 hover:border-opacity-60 hover:bg-muted"
              style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: `${action.color}18`, border: `1px solid ${action.color}33` }}
              >
                <action.icon size={15} style={{ color: action.color }} />
              </div>
              <span className="text-sm font-600" style={{ color: 'var(--foreground)' }}>{action.label}</span>
              <ArrowRight size={12} className="ml-auto" style={{ color: 'var(--muted-foreground)' }} />
            </Link>
          ))}
        </div>

      </div>
    </AppLayout>
  );
}
