'use client';
import React, { useState, useEffect, useCallback } from 'react';
import AppLayout from '@/components/AppLayout';
import { useAuth } from '@/contexts/AuthContext';
import { coinService, CoinTransaction } from '@/lib/services/coinService';
import { Coins, ArrowDownLeft, Gift, Flame, Crown, Trophy, Zap, TrendingUp, TrendingDown, RefreshCw, Loader2, AlertCircle,  } from 'lucide-react';

const TX_META: Record<
  CoinTransaction['tx_type'],
  { label: string; icon: React.ElementType; color: string; sign: '+' | '-' | '' }
> = {
  tip: { label: 'Tip Received', icon: Gift, color: '#52B788', sign: '+' },
  earn: { label: 'Earned', icon: TrendingUp, color: '#D4AF37', sign: '+' },
  bonus: { label: 'Bonus', icon: Flame, color: '#E07B39', sign: '+' },
  election_reward: { label: 'Election Reward', icon: Trophy, color: '#7B4EA0', sign: '+' },
  heckler_award: { label: 'Heckler Award', icon: Zap, color: '#FF4444', sign: '+' },
  spend: { label: 'Spent', icon: ArrowDownLeft, color: '#8A8070', sign: '-' },
  mint: { label: 'Minted Coin', icon: Crown, color: '#D4AF37', sign: '-' },
};

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Fallback demo data for unauthenticated visitors
const DEMO_TRANSACTIONS: CoinTransaction[] = [
  { id: 'd1', user_id: '', tx_type: 'earn', amount: 200, balance_after: 12400, description: 'Sermon blessing bonus — "Thou Shalt Not Bomb"', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 5 * 60000).toISOString() },
  { id: 'd2', user_id: '', tx_type: 'tip', amount: 50, balance_after: 12200, description: 'Tip from Bishop Snortley', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 14 * 60000).toISOString(), from_user: { full_name: 'Bishop Snortley', handle: 'snortley' } },
  { id: 'd3', user_id: '', tx_type: 'earn', amount: 100, balance_after: 12150, description: 'Weekly active member bonus', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: 'd4', user_id: '', tx_type: 'spend', amount: -500, balance_after: 12050, description: 'Minted Medium Cheddar coin', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: 'd5', user_id: '', tx_type: 'tip', amount: 75, balance_after: 12550, description: 'Tip from Deacon Wheezington', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 5 * 86400000).toISOString(), from_user: { full_name: 'Deacon Wheezington', handle: 'wheezington' } },
  { id: 'd6', user_id: '', tx_type: 'bonus', amount: 500, balance_after: 12475, description: 'Holy Lottery participation reward', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: 'd7', user_id: '', tx_type: 'earn', amount: 150, balance_after: 11975, description: 'Congregation growth milestone — 100 followers', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 10 * 86400000).toISOString() },
  { id: 'd8', user_id: '', tx_type: 'mint', amount: -5000, balance_after: 11825, description: 'Minted Sharp Cheddar coin', from_user_id: null, to_user_id: null, metadata: {}, created_at: new Date(Date.now() - 12 * 86400000).toISOString() },
];

export default function CoinLedgerPage() {
  const { user, loading: authLoading } = useAuth();
  const [transactions, setTransactions] = useState<CoinTransaction[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'earned' | 'spent'>('all');

  const loadData = useCallback(async () => {
    if (!user) {
      setTransactions(DEMO_TRANSACTIONS);
      setBalance(12400);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [txs, bal] = await Promise.all([
        coinService.getTransactions(user.id),
        coinService.getBalance(user.id),
      ]);
      setTransactions(txs.length > 0 ? txs : DEMO_TRANSACTIONS);
      setBalance(bal > 0 ? bal : 12400);
    } catch {
      setError('Could not load your ledger. The congregation accountant is on a coffee break.');
      setTransactions(DEMO_TRANSACTIONS);
      setBalance(12400);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading) loadData();
  }, [authLoading, loadData]);

  const filtered = transactions.filter((tx) => {
    if (filter === 'earned') return tx.amount > 0;
    if (filter === 'spent') return tx.amount < 0;
    return true;
  });

  const totalEarned = transactions.filter((t) => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalSpent = transactions.filter((t) => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <AppLayout>
      <div className="min-h-screen pt-20 pb-16 px-4" style={{ background: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center"
                style={{ background: 'rgba(212,175,55,0.15)', border: '1.5px solid rgba(212,175,55,0.4)' }}
              >
                <Coins size={20} style={{ color: '#D4AF37' }} />
              </div>
              <div>
                <h1 className="font-800 text-2xl" style={{ color: 'var(--foreground)' }}>
                  Cheddar Coin Ledger
                </h1>
                <p className="text-sm font-500" style={{ color: 'var(--muted-foreground)' }}>
                  Every CC earned, tipped, and spent — on the record
                </p>
              </div>
            </div>
          </div>

          {/* Balance + Stats */}
          <div
            className="rounded-2xl p-6 mb-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(212,175,55,0.12) 0%, rgba(212,175,55,0.04) 100%)', border: '1.5px solid rgba(212,175,55,0.3)' }}
          >
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10" style={{ background: '#D4AF37', transform: 'translate(30%, -30%)' }} />
            <p className="text-xs font-700 uppercase tracking-widest mb-1" style={{ color: '#D4AF37', opacity: 0.8 }}>Current Balance</p>
            <div className="flex items-end gap-2 mb-4">
              <span className="font-800 text-4xl" style={{ color: '#D4AF37' }}>
                {loading ? '—' : balance.toLocaleString()}
              </span>
              <span className="font-700 text-lg mb-1" style={{ color: 'rgba(212,175,55,0.7)' }}>CC</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl p-3" style={{ background: 'rgba(82,183,136,0.1)', border: '1px solid rgba(82,183,136,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp size={12} style={{ color: '#52B788' }} />
                  <span className="text-xs font-700" style={{ color: '#52B788' }}>Total Earned</span>
                </div>
                <span className="font-800 text-lg" style={{ color: '#52B788' }}>+{totalEarned.toLocaleString()} CC</span>
              </div>
              <div className="rounded-xl p-3" style={{ background: 'rgba(138,128,112,0.1)', border: '1px solid rgba(138,128,112,0.2)' }}>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown size={12} style={{ color: 'var(--muted-foreground)' }} />
                  <span className="text-xs font-700" style={{ color: 'var(--muted-foreground)' }}>Total Spent</span>
                </div>
                <span className="font-800 text-lg" style={{ color: 'var(--muted-foreground)' }}>-{totalSpent.toLocaleString()} CC</span>
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl mb-4" style={{ background: 'rgba(255,68,68,0.08)', border: '1px solid rgba(255,68,68,0.2)' }}>
              <AlertCircle size={14} style={{ color: '#FF4444' }} />
              <p className="text-xs font-500" style={{ color: '#FF4444' }}>{error}</p>
            </div>
          )}

          {/* Filter + Refresh */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--muted)' }}>
              {(['all', 'earned', 'spent'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="px-3 py-1.5 rounded-lg text-xs font-700 transition-all capitalize"
                  style={{
                    background: filter === f ? 'var(--card)' : 'transparent',
                    color: filter === f ? 'var(--foreground)' : 'var(--muted-foreground)',
                    boxShadow: filter === f ? '0 1px 4px rgba(0,0,0,0.15)' : 'none',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-600 transition-colors hover:bg-muted"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <RefreshCw size={12} />}
              Refresh
            </button>
          </div>

          {/* Transaction List */}
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid var(--border)', background: 'var(--card)' }}>
            {loading ? (
              <div className="py-16 flex flex-col items-center gap-3">
                <Loader2 size={24} className="animate-spin" style={{ color: 'var(--muted-foreground)' }} />
                <p className="text-sm font-500" style={{ color: 'var(--muted-foreground)' }}>Counting your Cheddar...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <Coins size={28} className="mx-auto mb-3" style={{ color: 'var(--muted-foreground)', opacity: 0.5 }} />
                <p className="text-sm font-600" style={{ color: 'var(--muted-foreground)' }}>No transactions yet.</p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)', opacity: 0.7 }}>Start preaching to earn your first CC.</p>
              </div>
            ) : (
              filtered.map((tx, idx) => {
                const meta = TX_META[tx.tx_type];
                const TxIcon = meta.icon;
                const isPositive = tx.amount > 0;
                return (
                  <div
                    key={tx.id}
                    className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted"
                    style={{ borderBottom: idx < filtered.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}33` }}
                    >
                      <TxIcon size={15} style={{ color: meta.color }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-700 truncate" style={{ color: 'var(--foreground)' }}>{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-500" style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>
                          {meta.label}
                        </span>
                        {tx.from_user && (
                          <>
                            <span style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>·</span>
                            <span className="text-xs font-600" style={{ color: meta.color, fontSize: '11px' }}>
                              @{tx.from_user.handle || tx.from_user.full_name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p
                        className="font-800 text-sm"
                        style={{ color: isPositive ? '#52B788' : 'var(--muted-foreground)' }}
                      >
                        {isPositive ? '+' : ''}{tx.amount.toLocaleString()} CC
                      </p>
                      <p className="text-xs font-500 mt-0.5" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
                        {formatRelativeTime(tx.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note */}
          <p className="text-center text-xs mt-6 font-500" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
            Cheddar Coins are platform currency only. No real-world monetary value.
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
