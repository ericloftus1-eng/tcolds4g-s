'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { hecklerService, HecklerWeek, HecklerNomination } from '@/lib/services/hecklerService';
import { Flame, Trophy, Zap, Crown, Vote, Clock, Loader2, AlertCircle, MessageSquare, CheckCircle, RefreshCw,  } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


function VoteBar({ votes, max, color }: { votes: number; max: number; color: string }) {
  const pct = max > 0 ? Math.min(100, Math.round((votes / max) * 100)) : 0;
  return (
    <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}88` }}
      />
    </div>
  );
}

const RANK_COLORS: Record<string, string> = {
  Reverend: '#D4AF37',
  Bishop: '#D4AF37',
  Archbishop: '#E07B39',
  Deacon: '#7B4EA0',
  Sister: '#52B788',
  Friar: '#4EA0C0',
  Pastor: '#52B788',
  Layperson: '#8A8070',
};

export default function HecklerAwardPage() {
  const { user, loading: authLoading } = useAuth();
  const [activeWeek, setActiveWeek] = useState<HecklerWeek | null>(null);
  const [nominations, setNominations] = useState<HecklerNomination[]>([]);
  const [pastWeeks, setPastWeeks] = useState<HecklerWeek[]>([]);
  const [userVote, setUserVote] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'vote' | 'hall-of-shame'>('vote');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [week, past] = await Promise.all([
        hecklerService.getActiveWeek(),
        hecklerService.getPastWeeks(),
      ]);
      setActiveWeek(week);
      setPastWeeks(past);

      if (week) {
        const noms = await hecklerService.getNominations(week.id);
        setNominations(noms);

        if (user) {
          const vote = await hecklerService.getUserVote(week.id, user.id);
          setUserVote(vote);
        }
      }
    } catch {
      setError('The heckler award committee is currently heckling each other. Try again.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading, loadData]);

  // Real-time subscription
  useEffect(() => {
    if (!activeWeek) return;
    const unsub = hecklerService.subscribeToNominations(activeWeek.id, () => {
      hecklerService.getNominations(activeWeek.id).then(setNominations);
    });
    return unsub;
  }, [activeWeek]);

  const handleVote = async (nominationId: string) => {
    if (!user || userVote || voting) return;
    if (!activeWeek) return;
    setVoting(nominationId);
    const ok = await hecklerService.castVote(nominationId, activeWeek.id, user.id);
    if (ok) {
      setUserVote(nominationId);
      setNominations((prev) =>
        prev.map((n) => n.id === nominationId ? { ...n, vote_count: n.vote_count + 1 } : n)
      );
    }
    setVoting(null);
  };

  const maxVotes = nominations.length > 0 ? Math.max(...nominations.map((n) => n.vote_count)) : 1;
  const leader = nominations[0] ?? null;

  return (
    <AppLayout>
      <div className="min-h-screen pt-20 pb-16 px-4" style={{ background: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto">

          {/* Hero Header */}
          <div
            className="rounded-3xl p-8 mb-8 text-center relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(255,68,68,0.12) 0%, rgba(212,175,55,0.08) 100%)',
              border: '1.5px solid rgba(255,68,68,0.25)',
            }}
          >
            <div className="absolute top-0 left-0 w-full h-full opacity-5" style={{ background: 'radial-gradient(circle at 20% 50%, #FF4444 0%, transparent 60%), radial-gradient(circle at 80% 50%, #D4AF37 0%, transparent 60%)' }} />
            <div className="relative">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(255,68,68,0.15)', border: '2px solid rgba(255,68,68,0.4)' }}
              >
                <Flame size={28} style={{ color: '#FF4444' }} />
              </div>
              <h1 className="font-800 text-3xl mb-2" style={{ color: 'var(--foreground)' }}>
                Most Savage Heckler
              </h1>
              <p className="font-600 text-lg mb-1" style={{ color: '#FF4444' }}>Weekly Award</p>
              <p className="text-sm font-500 max-w-md mx-auto" style={{ color: 'var(--muted-foreground)' }}>
                For those who can't help themselves. The congregation recognizes your chaos. You've earned this.
              </p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-2xl mb-6" style={{ background: 'var(--muted)' }}>
            {([
              { id: 'vote', label: 'Vote This Week', icon: Vote },
              { id: 'hall-of-shame', label: 'Hall of Shame', icon: Trophy },
            ] as const).map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-700 transition-all"
                style={{
                  background: tab === id ? 'var(--card)' : 'transparent',
                  color: tab === id ? 'var(--foreground)' : 'var(--muted-foreground)',
                  boxShadow: tab === id ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                }}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}>
              <AlertCircle size={14} style={{ color: '#FF4444' }} />
              <p className="text-xs font-500" style={{ color: '#FF4444' }}>{error}</p>
              <button onClick={loadData} className="ml-auto flex items-center gap-1 text-xs font-600" style={{ color: '#FF4444' }}>
                <RefreshCw size={11} /> Retry
              </button>
            </div>
          )}

          {/* VOTE TAB */}
          {tab === 'vote' && (
            <div>
              {loading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-sm font-500" style={{ color: 'var(--muted-foreground)' }}>Summoning the hecklers...</p>
                </div>
              ) : !activeWeek ? (
                <div className="py-16 text-center rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                  <Clock size={28} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
                  <p className="font-700 text-base" style={{ color: 'var(--foreground)' }}>No active week right now</p>
                  <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>Check back Sunday when the new week opens.</p>
                </div>
              ) : (
                <div>
                  {/* Week header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="font-700 text-base" style={{ color: 'var(--foreground)' }}>{activeWeek.week_label}</p>
                      <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>
                        {nominations.length} nomination{nominations.length !== 1 ? 's' : ''} · Voting open
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.2)' }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs font-700" style={{ color: '#52B788' }}>Live</span>
                    </div>
                  </div>

                  {/* Auth notice */}
                  {!user && (
                    <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.2)' }}>
                      <Zap size={13} style={{ color: '#D4AF37' }} />
                      <p className="text-xs font-500" style={{ color: '#D4AF37' }}>Sign in to cast your vote for this week's Most Savage Heckler.</p>
                    </div>
                  )}

                  {/* Already voted */}
                  {userVote && (
                    <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(82,183,136,0.08)', border: '1px solid rgba(82,183,136,0.2)' }}>
                      <CheckCircle size={13} style={{ color: '#52B788' }} />
                      <p className="text-xs font-600" style={{ color: '#52B788' }}>Your vote has been cast. The congregation has spoken.</p>
                    </div>
                  )}

                  {/* Nominations */}
                  <div className="space-y-3">
                    {nominations.map((nom, idx) => {
                      const isVoted = userVote === nom.id;
                      const isLeader = idx === 0;
                      const rankColor = RANK_COLORS[nom.nominee?.rank ?? 'Layperson'] ?? '#8A8070';
                      const initials = (nom.nominee?.full_name ?? 'UN').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();

                      return (
                        <div
                          key={nom.id}
                          className="rounded-2xl p-5 transition-all duration-200 relative overflow-hidden"
                          style={{
                            background: isVoted ? 'rgba(255,68,68,0.06)' : 'var(--card)',
                            border: `1.5px solid ${isVoted ? 'rgba(255,68,68,0.4)' : isLeader ? 'rgba(212,175,55,0.3)' : 'var(--border)'}`,
                            boxShadow: isVoted ? '0 0 20px rgba(255,68,68,0.1)' : 'none',
                          }}
                        >
                          {isLeader && (
                            <div
                              className="absolute top-3 right-3 flex items-center gap-1 px-2 py-0.5 rounded-full"
                              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)' }}
                            >
                              <Crown size={10} style={{ color: '#D4AF37' }} />
                              <span className="text-xs font-700" style={{ color: '#D4AF37', fontSize: '10px' }}>Leading</span>
                            </div>
                          )}

                          {/* Nominee info */}
                          <div className="flex items-start gap-3 mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-800 text-sm flex-shrink-0"
                              style={{ background: `${rankColor}18`, color: rankColor, border: `1.5px solid ${rankColor}44` }}
                            >
                              {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>
                                  {nom.nominee?.full_name ?? 'Unknown Heckler'}
                                </p>
                                <span className="text-xs font-600 px-1.5 py-0.5 rounded-full" style={{ background: `${rankColor}18`, color: rankColor, fontSize: '10px' }}>
                                  {nom.nominee?.rank ?? 'Layperson'}
                                </span>
                              </div>
                              {nom.nominee?.handle && (
                                <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>@{nom.nominee.handle}</p>
                              )}
                            </div>
                          </div>

                          {/* Savage quote */}
                          <div
                            className="rounded-xl p-3 mb-3 relative"
                            style={{ background: 'rgba(255,68,68,0.06)', border: '1px solid rgba(255,68,68,0.15)' }}
                          >
                            <MessageSquare size={11} className="absolute top-2.5 left-3" style={{ color: 'rgba(255,68,68,0.5)' }} />
                            <p className="text-sm font-600 italic pl-5 leading-relaxed" style={{ color: 'var(--foreground)' }}>
                              &ldquo;{nom.savage_quote}&rdquo;
                            </p>
                          </div>

                          {nom.context && (
                            <p className="text-xs font-500 mb-3 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                              {nom.context}
                            </p>
                          )}

                          {/* Vote bar + count */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-600" style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>
                                {nom.vote_count} vote{nom.vote_count !== 1 ? 's' : ''}
                              </span>
                              <span className="text-xs font-700" style={{ color: '#FF4444', fontSize: '11px' }}>
                                {maxVotes > 0 ? Math.round((nom.vote_count / maxVotes) * 100) : 0}%
                              </span>
                            </div>
                            <VoteBar votes={nom.vote_count} max={maxVotes} color="#FF4444" />
                          </div>

                          {/* Vote button */}
                          <button
                            onClick={() => handleVote(nom.id)}
                            disabled={!user || !!userVote || voting === nom.id}
                            className="w-full py-2.5 rounded-xl text-sm font-700 transition-all flex items-center justify-center gap-2"
                            style={{
                              background: isVoted
                                ? 'rgba(255,68,68,0.15)'
                                : !user || userVote
                                ? 'var(--muted)'
                                : 'rgba(255,68,68,0.12)',
                              color: isVoted ? '#FF4444' : !user || userVote ? 'var(--muted-foreground)' : '#FF4444',
                              border: `1.5px solid ${isVoted ? 'rgba(255,68,68,0.4)' : !user || userVote ? 'var(--border)' : 'rgba(255,68,68,0.25)'}`,
                              cursor: !user || userVote ? 'not-allowed' : 'pointer',
                            }}
                          >
                            {voting === nom.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : isVoted ? (
                              <>
                                <CheckCircle size={14} />
                                You voted for this heckler
                              </>
                            ) : (
                              <>
                                <Flame size={14} />
                                {!user ? 'Sign in to vote' : userVote ? 'Already voted' : 'Crown This Heckler'}
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {nominations.length === 0 && (
                    <div className="py-12 text-center rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                      <Flame size={28} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.4 }} />
                      <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>No nominations yet this week</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>The congregation is being suspiciously well-behaved.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* HALL OF SHAME TAB */}
          {tab === 'hall-of-shame' && (
            <div>
              {loading ? (
                <div className="py-16 flex flex-col items-center gap-3">
                  <Loader2 size={24} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
                  <p className="text-sm font-500" style={{ color: 'var(--muted-foreground)' }}>Digging through the archives...</p>
                </div>
              ) : pastWeeks.length === 0 ? (
                <div className="py-16 text-center rounded-2xl" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
                  <Trophy size={28} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
                  <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>The Hall of Shame is empty</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>No past winners yet. History is being made.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pastWeeks.map((week, idx) => {
                    const rankColor = RANK_COLORS[week.winner?.rank ?? 'Layperson'] ?? '#8A8070';
                    const initials = (week.winner?.full_name ?? 'UN').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={week.id}
                        className="rounded-2xl p-5"
                        style={{ background: 'var(--card)', border: '1.5px solid var(--border)' }}
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-7 h-7 rounded-lg flex items-center justify-center"
                              style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.25)' }}
                            >
                              <Trophy size={13} style={{ color: '#D4AF37' }} />
                            </div>
                            <span className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>{week.week_label}</span>
                          </div>
                          {idx === 0 && (
                            <span className="text-xs font-700 px-2 py-0.5 rounded-full" style={{ background: 'rgba(212,175,55,0.12)', color: '#D4AF37', fontSize: '10px' }}>
                              Most Recent
                            </span>
                          )}
                        </div>

                        {week.winner ? (
                          <div className="flex items-start gap-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center font-800 text-sm flex-shrink-0"
                              style={{ background: `${rankColor}18`, color: rankColor, border: `1.5px solid ${rankColor}44` }}
                            >
                              {initials}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>{week.winner.full_name}</p>
                                <Crown size={12} style={{ color: '#D4AF37' }} />
                              </div>
                              {week.winner_quote && (
                                <p className="text-xs font-500 italic leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                                  &ldquo;{week.winner_quote}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>No winner recorded for this week.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
              The Most Savage Heckler Award is a sacred TCoLDS tradition. Winners receive 500 CC and eternal notoriety.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
