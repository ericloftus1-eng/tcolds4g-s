'use client';

import { createClient } from '@/lib/supabase/client';

export interface CoinTransaction {
  id: string;
  user_id: string;
  tx_type: 'tip' | 'mint' | 'earn' | 'spend' | 'bonus' | 'election_reward' | 'heckler_award';
  amount: number;
  balance_after: number;
  description: string;
  from_user_id: string | null;
  to_user_id: string | null;
  metadata: Record<string, any>;
  created_at: string;
  from_user?: { full_name: string; handle: string | null } | null;
  to_user?: { full_name: string; handle: string | null } | null;
}

export const coinService = {
  async getTransactions(userId: string, limit = 50): Promise<CoinTransaction[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('coin_transactions')
        .select(`
          *,
          from_user:user_profiles!coin_transactions_from_user_id_fkey(full_name, handle),
          to_user:user_profiles!coin_transactions_to_user_id_fkey(full_name, handle)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.log('Coin transactions fetch error:', error.message);
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  },

  async getBalance(userId: string): Promise<number> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('cc_balance')
        .eq('id', userId)
        .single();

      if (error) return 0;
      return data?.cc_balance ?? 0;
    } catch {
      return 0;
    }
  },
};
