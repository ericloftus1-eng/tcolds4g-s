'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { CheddarCoinDisplay } from '@/components/ui/CheddarCoinWidget';
import {
  Heart,
  Coins,
  Church,
  Users,
  CheckCircle,
  Clock,
  Star,
  ArrowRight,
  HandHeart,
  Sparkles,
  Target,
  Globe,
} from 'lucide-react';

interface CharityDrive {
  id: string;
  title: string;
  description: string;
  emoji: string;
  goal: number;
  pledged: number;
  backers: number;
  daysLeft: number | null;
  status: 'active' | 'funded' | 'completed';
  color: string;
  impact: string;
}

interface PastImpact {
  id: string;
  title: string;
  emoji: string;
  coinsRaised: string;
  people: string;
  date: string;
  color: string;
}

const charityDrives: CharityDrive[] = [
  {
    id: 'cd1',
    title: 'The Holy Clothing Drive',
    description:
      'Comedians pledge their Cheddar Coins toward a real clothing donation. When we hit the threshold, TCoLDS converts the community pledge into a bulk donation to a local shelter.',
    emoji: '👕',
    goal: 500000,
    pledged: 312400,
    backers: 847,
    daysLeft: 14,
    status: 'active',
    color: '#52B788',
    impact: '~200 families clothed',
  },
  {
    id: 'cd2',
    title: 'Blessed Be the Backpacks',
    description:
      'Back-to-school supply drive. Every 1,000 CC pledged fills one backpack with supplies for a child in need. Congregation members vote on the school district each cycle.',
    emoji: '🎒',
    goal: 300000,
    pledged: 300000,
    backers: 1204,
    daysLeft: null,
    status: 'funded',
    color: '#D4AF37',
    impact: '300 backpacks ready',
  },
  {
    id: 'cd3',
    title: 'The Soup Kitchen Sermon',
    description:
      'Monthly food drive powered by the congregation. Pledged coins fund a catered meal service at a local community kitchen — one hot meal per 500 CC.',
    emoji: '🍲',
    goal: 200000,
    pledged: 88600,
    backers: 391,
    daysLeft: 28,
    status: 'active',
    color: '#E07B39',
    impact: '~177 meals served',
  },
];

const pastImpact: PastImpact[] = [
  {
    id: 'pi1',
    title: 'Winter Coat Collection',
    emoji: '🧥',
    coinsRaised: '420,000 CC',
    people: '180 families',
    date: 'Dec 2024',
    color: '#7B4EA0',
  },
  {
    id: 'pi2',
    title: 'Holiday Toy Drive',
    emoji: '🎁',
    coinsRaised: '610,000 CC',
    people: '250 children',
    date: 'Nov 2024',
    color: '#D4AF37',
  },
  {
    id: 'pi3',
    title: 'Community Garden Seed Fund',
    emoji: '🌱',
    coinsRaised: '185,000 CC',
    people: '3 community gardens',
    date: 'Sep 2024',
    color: '#52B788',
  },
  {
    id: 'pi4',
    title: 'School Supplies Sprint',
    emoji: '✏️',
    coinsRaised: '290,000 CC',
    people: '120 students',
    date: 'Aug 2024',
    color: '#E07B39',
  },
];

const howItWorks = [
  {
    icon: Coins,
    title: 'Earn Cheddar Coins',
    desc: 'CC is earned through likes, views, followers, and tips on the platform. No real-world purchase needed.',
    color: '#D4AF37',
  },
  {
    icon: HandHeart,
    title: 'Pledge to a Drive',
    desc: 'Choose an active charity drive and pledge any amount of your CC balance toward the community goal.',
    color: '#52B788',
  },
  {
    icon: Target,
    title: 'Hit the Threshold',
    desc: 'When the pooled community pledges reach the goal, TCoLDS converts that into a real-world charitable action.',
    color: '#E07B39',
  },
  {
    icon: Globe,
    title: 'Real-World Impact',
    desc: 'TCoLDS coordinates the donation, documents the impact, and shares the results with the congregation.',
    color: '#7B4EA0',
  },
];

function ProgressBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{
          width: `${pct}%`,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          boxShadow: `0 0 8px ${color}55`,
        }}
      />
    </div>
  );
}

export default function GivebackPage() {
  const [pledgeOpen, setPledgeOpen] = useState<string | null>(null);
  const [pledgeAmount, setPledgeAmount] = useState('');
  const [pledged, setPledged] = useState<Record<string, boolean>>({});

  const totalPledged = charityDrives.reduce((sum, d) => sum + d.pledged, 0);
  const totalBackers = charityDrives.reduce((sum, d) => sum + d.backers, 0);

  const handlePledge = (driveId: string) => {
    if (!pledgeAmount || isNaN(Number(pledgeAmount)) || Number(pledgeAmount) <= 0) return;
    setPledged((prev) => ({ ...prev, [driveId]: true }));
    setPledgeOpen(null);
    setPledgeAmount('');
  };

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Hero */}
        <div
          className="relative rounded-2xl overflow-hidden border mb-10"
          style={{ borderColor: 'rgba(82,183,136,0.5)', minHeight: '260px' }}
        >
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #001a0d 50%, #0a0a14 100%)' }}
          />
          <div className="absolute top-0 right-0 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(82,183,136,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <Heart size={18} style={{ color: '#52B788' }} />
                <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(82,183,136,0.15)', color: '#52B788' }}>
                  Community Giveback
                </span>
              </div>
              <h1 className="text-hero-xl mb-3" style={{ color: 'var(--foreground)' }}>
                Laugh. Give. <span style={{ color: '#52B788' }}>Lift.</span>
              </h1>
              <p className="text-base font-500 max-w-lg mb-5" style={{ color: 'var(--foreground)', opacity: 0.85 }}>
                Cheddar Coin has no real-world monetary value — but it carries real-world weight. When the congregation pools their CC toward a charity drive, TCoLDS converts that collective pledge into a tangible act of service.
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ borderColor: 'rgba(82,183,136,0.4)', background: 'rgba(82,183,136,0.08)' }}>
                  <Users size={14} style={{ color: '#52B788' }} />
                  <span className="text-sm font-700" style={{ color: '#52B788' }}>{totalBackers.toLocaleString()} pledgers</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.08)' }}>
                  <CheddarCoinDisplay size={18} />
                  <span className="text-sm font-700 text-gold">{totalPledged.toLocaleString()} CC pledged</span>
                </div>
              </div>
            </div>

            {/* Stats cluster */}
            <div className="flex-shrink-0 grid grid-cols-2 gap-3">
              {[
                { label: 'Active Drives', value: '3', color: '#52B788' },
                { label: 'Drives Funded', value: '6', color: '#D4AF37' },
                { label: 'Families Helped', value: '750+', color: '#E07B39' },
                { label: 'CC Pledged Total', value: '1.5M+', color: '#7B4EA0' },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border p-3 text-center"
                  style={{ background: `${stat.color}0d`, borderColor: `${stat.color}33` }}
                >
                  <p className="font-mono-data font-800 text-xl" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs font-500 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Sparkles size={20} style={{ color: 'var(--primary)' }} />
            How Cheddar Coin Giving Works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {howItWorks.map((step, idx) => (
              <div
                key={step.title}
                className="rounded-2xl border p-5 relative overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div
                  className="absolute top-3 right-4 text-5xl font-900 font-mono-data opacity-[0.07] select-none"
                  style={{ color: step.color }}
                >
                  {idx + 1}
                </div>
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${step.color}18`, border: `1px solid ${step.color}33` }}
                >
                  <step.icon size={18} style={{ color: step.color }} />
                </div>
                <h3 className="font-700 text-sm mb-1.5" style={{ color: 'var(--foreground)' }}>{step.title}</h3>
                <p className="text-xs font-500 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Active Charity Drives */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <Heart size={20} style={{ color: '#52B788' }} />
            Active Charity Drives
          </h2>

          <div className="flex flex-col gap-5">
            {charityDrives.map((drive) => {
              const pct = Math.min(100, Math.round((drive.pledged / drive.goal) * 100));
              const isFunded = drive.status === 'funded';
              const hasPledged = pledged[drive.id];

              return (
                <div
                  key={drive.id}
                  className="rounded-2xl border overflow-hidden"
                  style={{
                    background: 'var(--card)',
                    borderColor: isFunded ? `${drive.color}55` : 'var(--border)',
                    boxShadow: isFunded ? `0 0 24px ${drive.color}18` : 'none',
                  }}
                >
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Left */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{drive.emoji}</span>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-700 text-lg" style={{ color: 'var(--foreground)' }}>{drive.title}</h3>
                              {isFunded && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-700 flex items-center gap-1"
                                  style={{ background: `${drive.color}22`, color: drive.color }}
                                >
                                  <CheckCircle size={10} />
                                  Goal Reached!
                                </span>
                              )}
                              {drive.daysLeft !== null && !isFunded && (
                                <span
                                  className="text-xs px-2 py-0.5 rounded-full font-600 flex items-center gap-1"
                                  style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--muted-foreground)' }}
                                >
                                  <Clock size={10} />
                                  {drive.daysLeft}d left
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm font-500 leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                          {drive.description}
                        </p>

                        {/* Progress */}
                        <div className="mb-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-700 font-mono-data" style={{ color: drive.color }}>
                              {drive.pledged.toLocaleString()} CC pledged
                            </span>
                            <span className="text-xs font-600 font-mono-data" style={{ color: 'var(--muted-foreground)' }}>
                              {pct}% of {drive.goal.toLocaleString()} CC goal
                            </span>
                          </div>
                          <ProgressBar value={drive.pledged} max={drive.goal} color={drive.color} />
                        </div>

                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-1.5">
                            <Users size={13} style={{ color: 'var(--muted-foreground)' }} />
                            <span className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
                              {drive.backers.toLocaleString()} pledgers
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Star size={13} style={{ color: drive.color }} />
                            <span className="text-xs font-600" style={{ color: drive.color }}>
                              Impact: {drive.impact}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Right — pledge action */}
                      <div className="flex-shrink-0 flex flex-col items-end gap-2 min-w-[160px]">
                        {isFunded ? (
                          <div
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700"
                            style={{ background: `${drive.color}18`, color: drive.color, border: `1px solid ${drive.color}44` }}
                          >
                            <CheckCircle size={14} />
                            Fully Funded
                          </div>
                        ) : hasPledged ? (
                          <div
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700"
                            style={{ background: 'rgba(82,183,136,0.12)', color: '#52B788', border: '1px solid rgba(82,183,136,0.3)' }}
                          >
                            <CheckCircle size={14} />
                            Pledged!
                          </div>
                        ) : (
                          <button
                            onClick={() => setPledgeOpen(drive.id)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90 active:scale-95"
                            style={{ background: drive.color, color: '#0A0A0A' }}
                          >
                            <HandHeart size={14} />
                            Pledge CC
                          </button>
                        )}
                        <p className="text-xs text-right" style={{ color: 'var(--muted-foreground)' }}>
                          Your CC balance:<br />
                          <span className="font-mono-data font-700 text-gold">1,240 CC</span>
                        </p>
                      </div>
                    </div>

                    {/* Pledge input panel */}
                    {pledgeOpen === drive.id && (
                      <div
                        className="mt-4 p-4 rounded-xl border"
                        style={{ background: 'var(--muted)', borderColor: `${drive.color}44` }}
                      >
                        <p className="text-sm font-700 mb-3" style={{ color: 'var(--foreground)' }}>
                          How many CC would you like to pledge?
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {[100, 250, 500, 1000].map((amt) => (
                            <button
                              key={amt}
                              onClick={() => setPledgeAmount(String(amt))}
                              className="px-3 py-1.5 rounded-lg text-xs font-700 border transition-all duration-150"
                              style={{
                                borderColor: pledgeAmount === String(amt) ? drive.color : 'var(--border)',
                                background: pledgeAmount === String(amt) ? `${drive.color}18` : 'transparent',
                                color: pledgeAmount === String(amt) ? drive.color : 'var(--muted-foreground)',
                              }}
                            >
                              {amt} CC
                            </button>
                          ))}
                          <input
                            type="number"
                            placeholder="Custom amount"
                            value={pledgeAmount}
                            onChange={(e) => setPledgeAmount(e.target.value)}
                            className="flex-1 min-w-[120px] px-3 py-1.5 rounded-lg text-xs font-600 border outline-none"
                            style={{
                              background: 'var(--input)',
                              borderColor: 'var(--border)',
                              color: 'var(--foreground)',
                            }}
                          />
                        </div>
                        <div className="flex items-center gap-2 mt-3">
                          <button
                            onClick={() => handlePledge(drive.id)}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-700 transition-all duration-150 hover:opacity-90 active:scale-95"
                            style={{ background: drive.color, color: '#0A0A0A' }}
                          >
                            <Heart size={13} />
                            Confirm Pledge
                          </button>
                          <button
                            onClick={() => { setPledgeOpen(null); setPledgeAmount(''); }}
                            className="px-4 py-2 rounded-xl text-sm font-600 transition-all duration-150 hover:bg-muted border"
                            style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
                          >
                            Cancel
                          </button>
                        </div>
                        <p className="text-xs mt-2" style={{ color: 'var(--muted-foreground)' }}>
                          Pledging CC does not reduce your balance — it signals your commitment to the drive. TCoLDS tracks the community total and acts when the threshold is reached.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Past Impact */}
        <div className="mb-10">
          <h2 className="text-display-lg mb-6 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
            <CheckCircle size={20} style={{ color: 'var(--primary)' }} />
            Past Impact
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {pastImpact.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border p-5 relative overflow-hidden"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div
                  className="absolute top-0 right-0 w-20 h-20 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top right, ${item.color}18 0%, transparent 70%)` }}
                />
                <span className="text-3xl mb-3 block">{item.emoji}</span>
                <h3 className="font-700 text-sm mb-1" style={{ color: 'var(--foreground)' }}>{item.title}</h3>
                <p className="text-xs font-600 font-mono-data mb-0.5" style={{ color: item.color }}>{item.coinsRaised}</p>
                <p className="text-xs font-600 mb-2" style={{ color: '#52B788' }}>
                  <CheckCircle size={10} className="inline mr-1" />
                  {item.people} helped
                </p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{item.date}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission / Nonprofit Statement */}
        <div
          className="rounded-2xl border p-8 md:p-12 relative overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'rgba(212,175,55,0.3)' }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.04) 0%, transparent 60%)' }} />
          <div className="relative flex flex-col md:flex-row gap-8 items-start">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.3)' }}
            >
              <Church size={28} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: 'var(--primary)' }}>
                  Our Mission
                </span>
              </div>
              <h2 className="text-display-lg mb-4 text-gold">The Church of Laughterday Saints</h2>
              <p className="text-base font-500 leading-relaxed mb-4" style={{ color: 'var(--foreground)', opacity: 0.9 }}>
                TCoLDS is more than a comedy platform — it is a congregation. We believe laughter is a form of ministry, and that a community built on joy has a responsibility to extend that joy beyond the screen.
              </p>
              <p className="text-sm font-500 leading-relaxed mb-4" style={{ color: 'var(--muted-foreground)' }}>
                The Cheddar Coin Giveback Program is our way of giving weight to the coin. CC has no real-world monetary value — but when the congregation pools their pledges, TCoLDS converts that collective signal into a real charitable act. A clothing drive. A meal. A backpack for a child. The coin becomes a vote for something good.
              </p>
              <p className="text-sm font-500 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                As TCoLDS grows toward formal nonprofit status, the Giveback Program will be a cornerstone of our charitable identity — demonstrating that a church built on comedy can still do the work of a church.
              </p>
              <div className="mt-6 flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ borderColor: 'rgba(212,175,55,0.3)', background: 'rgba(212,175,55,0.06)' }}>
                  <Heart size={13} style={{ color: 'var(--primary)' }} />
                  <span className="text-xs font-600 text-gold">Community-powered giving</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.03)' }}>
                  <ArrowRight size={13} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>Pursuing 501(c)(3) nonprofit status</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}
