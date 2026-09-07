'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import { Crown, Skull, Star, Vote, Trophy, Flame, Sparkles, ChevronRight, Heart, Laugh, Zap, Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface Candidate {
  id: string;
  name: string;
  handle: string;
  initials: string;
  color: string;
  rank: string;
  votes: number;
  bio: string;
  platform: string;
}

const saintCandidates: Candidate[] = [
  { id: 's1', name: 'Rev. Cacklesworth', handle: 'cacklesworth', initials: 'RC', color: '#D4AF37', rank: 'Reverend', votes: 4821, bio: 'Three-time Holy Lottery winner. Once made a bishop cry-laugh for 40 minutes straight.', platform: '"I will bless every punchline, no matter how bad."' },
  { id: 's2', name: 'Archbishop Thunderpants', handle: 'thunderpants', initials: 'AT', color: '#52B788', rank: 'Archbishop', votes: 3940, bio: 'Holds the record for most congregation blessings in a single sermon. 142K likes and counting.', platform: '"Laughter is the gospel. I am the gospel."' },
  { id: 's3', name: 'Sister Snickerdoodle', handle: 'snickerdoodle', initials: 'SS', color: '#7B4EA0', rank: 'Sister', votes: 2107, bio: 'Beloved for her "Confessions of a Punchline" series. Ordained three bishops with a single roast.', platform: '"The congregation deserves a saint who actually shows up."' },
];

const nemesisCandidates: Candidate[] = [
  { id: 'n1', name: 'The Groan Reaper', handle: 'groanreaper', initials: 'GR', color: '#8B1A1A', rank: 'Nemesis', votes: 5102, bio: 'Appears at open mics to deliver devastating silence. Collects groans like Cheddar Coins.', platform: '"I don\'t kill jokes. I give them a proper burial."' },
  { id: 'n2', name: 'Deacon Buzzkill', handle: 'buzzkill', initials: 'DB', color: '#4A4A4A', rank: 'Deacon', votes: 2889, bio: 'Notorious for explaining punchlines after they land. The congregation fears him.', platform: '"Actually, the humor derives from the subverted expectation of—"' },
  { id: 'n3', name: 'Bishop Crickets', handle: 'crickets', initials: 'BC', color: '#5C3A1E', rank: 'Bishop', votes: 1654, bio: 'His presence alone causes awkward silence. Has never laughed. Not once. Not ever.', platform: '"..."' },
];

const electionHistory = [
  { cycle: 'Spring 2025', saint: 'Rev. Punchline McGee', nemesis: 'The Groan Reaper', emoji: '🏆' },
  { cycle: 'Winter 2024', saint: 'Archbishop Thunderpants', nemesis: 'Deacon Buzzkill', emoji: '❄️' },
  { cycle: 'Fall 2024', saint: 'Sister Snickerdoodle', nemesis: 'Bishop Crickets', emoji: '🍂' },
];

function VoteBar({ votes, max, color }: { votes: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((votes / max) * 100));
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}88` }} />
    </div>
  );
}

function CandidateCard({ candidate, role, voted, onVote, maxVotes }: { candidate: Candidate; role: 'saint' | 'nemesis'; voted: string | null; onVote: (id: string) => void; maxVotes: number }) {
  const isVoted = voted === candidate.id;
  const isSaint = role === 'saint';
  const accentColor = isSaint ? '#D4AF37' : '#8B1A1A';
  const isLeading = candidate.votes === maxVotes;

  return (
    <div
      className="rounded-2xl border p-5 transition-all duration-200 cursor-pointer relative overflow-hidden"
      style={{
        background: isVoted ? `${accentColor}0d` : 'var(--card)',
        borderColor: isVoted ? accentColor : isLeading ? `${accentColor}55` : 'var(--border)',
        boxShadow: isVoted ? `0 0 20px ${accentColor}22` : 'none',
      }}
      onClick={() => !voted && onVote(candidate.id)}
    >
      {isLeading && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-700" style={{ background: `${accentColor}22`, color: accentColor }}>
          <Trophy size={10} />
          Leading
        </div>
      )}
      {isVoted && (
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-700" style={{ background: `${accentColor}22`, color: accentColor }}>
          <CheckCircle size={10} />
          Your Vote
        </div>
      )}

      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-800 flex-shrink-0" style={{ background: `${candidate.color}22`, color: candidate.color, border: `2px solid ${candidate.color}44` }}>
          {candidate.initials}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>{candidate.name}</p>
          <p className="text-xs font-500 mt-0.5" style={{ color: candidate.color }}>{candidate.rank}</p>
          <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>{candidate.bio}</p>
        </div>
      </div>

      <div className="rounded-xl p-3 mb-4" style={{ background: 'var(--muted)' }}>
        <p className="text-xs italic font-500" style={{ color: 'var(--foreground)', opacity: 0.9 }}>{candidate.platform}</p>
      </div>

      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-600" style={{ color: 'var(--muted-foreground)' }}>
          {candidate.votes.toLocaleString()} votes
        </span>
        <span className="text-xs font-700" style={{ color: accentColor }}>
          {Math.round((candidate.votes / maxVotes) * 100)}%
        </span>
      </div>
      <VoteBar votes={candidate.votes} max={maxVotes} color={candidate.color} />

      {!voted && (
        <button
          className="mt-4 w-full py-2 rounded-xl text-xs font-700 transition-all duration-150 hover:opacity-90"
          style={{ background: `${accentColor}22`, color: accentColor, border: `1px solid ${accentColor}44` }}
          onClick={(e) => { e.stopPropagation(); onVote(candidate.id); }}
        >
          <Vote size={12} className="inline mr-1.5" />
          Cast Vote
        </button>
      )}
    </div>
  );
}

export default function LorePage() {
  const [saintVote, setSaintVote] = useState<string | null>(null);
  const [nemesisVote, setNemesisVote] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'lore' | 'elections'>('lore');

  const maxSaintVotes = Math.max(...saintCandidates.map((c) => c.votes));
  const maxNemesisVotes = Math.max(...nemesisCandidates.map((c) => c.votes));
  const totalSaintVotes = saintCandidates.reduce((s, c) => s + c.votes, 0);
  const totalNemesisVotes = nemesisCandidates.reduce((s, c) => s + c.votes, 0);

  return (
    <AppLayout>
      <div className="max-w-screen-xl mx-auto px-4 lg:px-8 py-8">

        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden border mb-8" style={{ borderColor: 'rgba(212,175,55,0.3)', minHeight: '280px' }}>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a00 40%, #0a000a 100%)' }} />
          <div className="absolute top-0 left-1/4 w-96 h-96 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse at center, rgba(139,26,26,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }} />

          <div className="relative p-8 md:p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Crown size={28} style={{ color: '#D4AF37' }} />
              <span className="text-xs font-700 px-3 py-1 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>Sacred Lore &amp; Community Elections</span>
              <Skull size={28} style={{ color: '#8B1A1A' }} />
            </div>
            <h1 className="text-hero-xl mb-4" style={{ color: 'var(--foreground)' }}>
              The <span style={{ color: '#D4AF37' }}>Patron Saint</span> vs<br />
              The <span style={{ color: '#8B1A1A' }}>Groan Reaper</span>
            </h1>
            <p className="text-base font-500 max-w-2xl mx-auto mb-6" style={{ color: 'var(--foreground)', opacity: 0.8 }}>
              Every congregation needs a hero and a villain. TCoLDS has both — elected by the people, for the people, in the name of comedy. The eternal battle between sacred laughter and the forces of unfunny darkness.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab('lore')}
                className="px-5 py-2 rounded-xl text-sm font-700 transition-all duration-150"
                style={{ background: activeTab === 'lore' ? 'var(--primary)' : 'var(--muted)', color: activeTab === 'lore' ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
              >
                <Sparkles size={14} className="inline mr-1.5" />
                Sacred Lore
              </button>
              <button
                onClick={() => setActiveTab('elections')}
                className="px-5 py-2 rounded-xl text-sm font-700 transition-all duration-150"
                style={{ background: activeTab === 'elections' ? 'var(--primary)' : 'var(--muted)', color: activeTab === 'elections' ? 'var(--primary-foreground)' : 'var(--muted-foreground)' }}
              >
                <Vote size={14} className="inline mr-1.5" />
                Community Elections
              </button>
            </div>
          </div>
        </div>

        {activeTab === 'lore' && (
          <>
            {/* The Two Archetypes */}
            <div className="grid md:grid-cols-2 gap-6 mb-10">
              {/* Patron Saint */}
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'var(--card)' }}>
                <div className="p-6 border-b" style={{ borderColor: 'rgba(212,175,55,0.2)', background: 'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, transparent 100%)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(212,175,55,0.15)', border: '2px solid rgba(212,175,55,0.4)' }}>
                      <Crown size={22} style={{ color: '#D4AF37' }} />
                    </div>
                    <div>
                      <p className="font-800 text-base" style={{ color: '#D4AF37' }}>The Patron Saint</p>
                      <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>of Laughterday</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.9 }}>
                    The Patron Saint is the congregation's chosen champion of comedy. They embody the sacred spirit of TCoLDS — irreverent, joyful, and absolutely unhinged in the best possible way. Elected each season by popular vote, the Saint carries the Holy Microphone and blesses all punchlines delivered in their name.
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-xs font-700 mb-3" style={{ color: 'var(--muted-foreground)' }}>SACRED DUTIES</p>
                  <div className="space-y-2">
                    {[
                      { icon: Laugh, text: 'Bless the congregation\'s funniest sermons each week', color: '#D4AF37' },
                      { icon: Star, text: 'Host the quarterly Holy Roast of the Nemesis', color: '#D4AF37' },
                      { icon: Sparkles, text: 'Award the Golden Microphone to rising comedians', color: '#D4AF37' },
                      { icon: Heart, text: 'Intercede on behalf of comedians who bombed', color: '#D4AF37' },
                    ].map((duty, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <duty.icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: duty.color }} />
                        <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{duty.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* The Nemesis */}
              <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(139,26,26,0.4)', background: 'var(--card)' }}>
                <div className="p-6 border-b" style={{ borderColor: 'rgba(139,26,26,0.2)', background: 'linear-gradient(135deg, rgba(139,26,26,0.08) 0%, transparent 100%)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(139,26,26,0.15)', border: '2px solid rgba(139,26,26,0.4)' }}>
                      <Skull size={22} style={{ color: '#8B1A1A' }} />
                    </div>
                    <div>
                      <p className="font-800 text-base" style={{ color: '#CC2222' }}>The Groan Reaper</p>
                      <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>Nemesis of Laughterday</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground)', opacity: 0.9 }}>
                    Where the Saint brings laughter, the Groan Reaper brings silence. Not malicious — just deeply, profoundly unfunny. The Nemesis is the congregation's beloved villain: the keeper of bad timing, the collector of groans, the explainer of jokes. Also elected by vote. Also beloved. It's complicated.
                  </p>
                </div>
                <div className="p-6">
                  <p className="text-xs font-700 mb-3" style={{ color: 'var(--muted-foreground)' }}>NEMESIS POWERS</p>
                  <div className="space-y-2">
                    {[
                      { icon: Skull, text: 'Deliver the weekly "Sermon That Shall Not Be Repeated"', color: '#CC2222' },
                      { icon: AlertTriangle, text: 'Issue official Groan Warnings to overconfident comedians', color: '#CC2222' },
                      { icon: Shield, text: 'Protect the sacred art of the terrible pun', color: '#CC2222' },
                      { icon: Zap, text: 'Host the annual Bombing Championship (participation trophy only)', color: '#CC2222' },
                    ].map((power, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <power.icon size={14} className="flex-shrink-0 mt-0.5" style={{ color: power.color }} />
                        <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{power.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* The Eternal Conflict */}
            <div className="rounded-2xl border p-6 mb-10" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
              <h2 className="text-display-lg mb-2" style={{ color: 'var(--foreground)' }}>The Eternal Conflict</h2>
              <p className="text-sm font-500 mb-6" style={{ color: 'var(--muted-foreground)' }}>Good vs. Evil. Funny vs. Unfunny. The oldest battle in comedy.</p>
              <div className="grid md:grid-cols-3 gap-4">
                {[
                  { saint: 'Blesses punchlines', nemesis: 'Explains punchlines', label: 'The Punchline' },
                  { saint: 'Arrives on time', nemesis: 'Arrives right after the laugh', label: 'The Timing' },
                  { saint: 'Reads the room', nemesis: 'Is the room', label: 'The Vibe' },
                  { saint: 'Earns standing ovations', nemesis: 'Earns polite applause', label: 'The Reception' },
                  { saint: 'Makes bishops cry-laugh', nemesis: 'Makes bishops cry-cry', label: 'The Effect' },
                  { saint: 'Wins the Holy Lottery', nemesis: 'Wins the Groan Trophy', label: 'The Prize' },
                ].map((row, i) => (
                  <div key={i} className="rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
                    <div className="px-3 py-1.5 text-center" style={{ background: 'var(--muted)' }}>
                      <p className="text-xs font-700" style={{ color: 'var(--muted-foreground)' }}>{row.label}</p>
                    </div>
                    <div className="grid grid-cols-2 divide-x" style={{ borderColor: 'var(--border)' }}>
                      <div className="p-3 text-center">
                        <Crown size={12} className="mx-auto mb-1" style={{ color: '#D4AF37' }} />
                        <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{row.saint}</p>
                      </div>
                      <div className="p-3 text-center">
                        <Skull size={12} className="mx-auto mb-1" style={{ color: '#CC2222' }} />
                        <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{row.nemesis}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Past Election History */}
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-700 text-base" style={{ color: 'var(--foreground)' }}>Election History</h2>
                <button
                  onClick={() => setActiveTab('elections')}
                  className="flex items-center gap-1.5 text-xs font-600 transition-colors hover:opacity-80"
                  style={{ color: 'var(--primary)' }}
                >
                  Vote Now <ChevronRight size={12} />
                </button>
              </div>
              <div className="space-y-3">
                {electionHistory.map((h, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                    <span className="text-xl">{h.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-700" style={{ color: 'var(--muted-foreground)' }}>{h.cycle}</p>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="flex items-center gap-1 text-xs font-600" style={{ color: '#D4AF37' }}>
                          <Crown size={10} /> {h.saint}
                        </span>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>vs</span>
                        <span className="flex items-center gap-1 text-xs font-600" style={{ color: '#CC2222' }}>
                          <Skull size={10} /> {h.nemesis}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'elections' && (
          <>
            {/* Election Banner */}
            <div className="rounded-2xl border p-5 mb-8 flex items-center gap-4" style={{ borderColor: 'rgba(212,175,55,0.4)', background: 'rgba(212,175,55,0.05)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(212,175,55,0.15)' }}>
                <Vote size={20} style={{ color: '#D4AF37' }} />
              </div>
              <div className="flex-1">
                <p className="font-700 text-sm" style={{ color: '#D4AF37' }}>Summer 2025 Elections — OPEN</p>
                <p className="text-xs font-500 mt-0.5" style={{ color: 'var(--muted-foreground)' }}>Voting closes in 6 days. Every congregation member gets one vote per role. Results announced at Sunday Mass.</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="font-mono-data font-800 text-lg" style={{ color: '#D4AF37' }}>{(totalSaintVotes + totalNemesisVotes).toLocaleString()}</p>
                <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>total votes cast</p>
              </div>
            </div>

            {/* Saint Election */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <Crown size={20} style={{ color: '#D4AF37' }} />
                <div>
                  <h2 className="font-800 text-base" style={{ color: '#D4AF37' }}>Patron Saint of Laughterday</h2>
                  <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>{totalSaintVotes.toLocaleString()} votes cast · {saintCandidates.length} candidates</p>
                </div>
                {saintVote && <span className="ml-auto text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.15)', color: '#D4AF37' }}>✓ Voted</span>}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {saintCandidates.map((c) => (
                  <CandidateCard key={c.id} candidate={c} role="saint" voted={saintVote} onVote={setSaintVote} maxVotes={maxSaintVotes} />
                ))}
              </div>
            </div>

            {/* Nemesis Election */}
            <div className="mb-10">
              <div className="flex items-center gap-3 mb-5">
                <Skull size={20} style={{ color: '#CC2222' }} />
                <div>
                  <h2 className="font-800 text-base" style={{ color: '#CC2222' }}>The Groan Reaper — Nemesis Election</h2>
                  <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>{totalNemesisVotes.toLocaleString()} votes cast · {nemesisCandidates.length} candidates</p>
                </div>
                {nemesisVote && <span className="ml-auto text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(139,26,26,0.15)', color: '#CC2222' }}>✓ Voted</span>}
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {nemesisCandidates.map((c) => (
                  <CandidateCard key={c.id} candidate={c} role="nemesis" voted={nemesisVote} onVote={setNemesisVote} maxVotes={maxNemesisVotes} />
                ))}
              </div>
            </div>

            {/* Election Rules */}
            <div className="rounded-2xl border p-6" style={{ borderColor: 'var(--border)', background: 'var(--card)' }}>
              <h3 className="font-700 text-sm mb-4" style={{ color: 'var(--foreground)' }}>Election Rules & Sacred Bylaws</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  'One vote per role per congregation member per election cycle',
                  'Elections run quarterly — Spring, Summer, Fall, Winter',
                  'Any member with Deacon rank or above may run for either role',
                  'The Patron Saint and Groan Reaper serve one season each',
                  'Ties are broken by the Holy Lottery (obviously)',
                  'The outgoing Saint must roast the incoming Saint at the handoff ceremony',
                ].map((rule, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: 'var(--muted)' }}>
                    <Flame size={12} className="flex-shrink-0 mt-0.5" style={{ color: '#D4AF37' }} />
                    <p className="text-xs font-500" style={{ color: 'var(--foreground)', opacity: 0.85 }}>{rule}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
