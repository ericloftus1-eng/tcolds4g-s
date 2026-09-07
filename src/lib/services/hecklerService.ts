'use client';

import { createClient } from '@/lib/supabase/client';

export interface HecklerWeek {
  id: string;
  week_label: string;
  week_start: string;
  week_end: string;
  is_active: boolean;
  winner_id: string | null;
  winner_quote: string | null;
  created_at: string;
  winner?: { full_name: string; handle: string | null; rank: string } | null;
}

export interface HecklerNomination {
  id: string;
  week_id: string;
  nominee_id: string;
  nominated_by: string;
  savage_quote: string;
  context: string | null;
  vote_count: number;
  nomination_status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  nominee?: { full_name: string; handle: string | null; rank: string } | null;
  nominator?: { full_name: string; handle: string | null } | null;
}

export const hecklerService = {
  async getActiveWeek(): Promise<HecklerWeek | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('heckler_award_weeks')
        .select(`*, winner:user_profiles!heckler_award_weeks_winner_id_fkey(full_name, handle, rank)`)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.log('Active week fetch error:', error.message);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  async getPastWeeks(limit = 5): Promise<HecklerWeek[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('heckler_award_weeks')
        .select(`*, winner:user_profiles!heckler_award_weeks_winner_id_fkey(full_name, handle, rank)`)
        .eq('is_active', false)
        .order('week_start', { ascending: false })
        .limit(limit);

      if (error) return [];
      return data || [];
    } catch {
      return [];
    }
  },

  async getNominations(weekId: string): Promise<HecklerNomination[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('heckler_nominations')
        .select(`
          *,
          nominee:user_profiles!heckler_nominations_nominee_id_fkey(full_name, handle, rank),
          nominator:user_profiles!heckler_nominations_nominated_by_fkey(full_name, handle)
        `)
        .eq('week_id', weekId)
        .eq('nomination_status', 'approved')
        .order('vote_count', { ascending: false });

      if (error) {
        console.log('Nominations fetch error:', error.message);
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  },

  async getUserVote(weekId: string, userId: string): Promise<string | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('heckler_votes')
        .select('nomination_id')
        .eq('week_id', weekId)
        .eq('voter_id', userId)
        .maybeSingle();

      if (error) return null;
      return data?.nomination_id ?? null;
    } catch {
      return null;
    }
  },

  async castVote(nominationId: string, weekId: string, userId: string): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('heckler_votes').insert({
        nomination_id: nominationId,
        week_id: weekId,
        voter_id: userId,
      });

      if (error) {
        console.log('Vote error:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  async submitNomination(
    weekId: string,
    nomineeId: string,
    nominatedBy: string,
    savageQuote: string,
    context: string
  ): Promise<boolean> {
    const supabase = createClient();
    try {
      const { error } = await supabase.from('heckler_nominations').insert({
        week_id: weekId,
        nominee_id: nomineeId,
        nominated_by: nominatedBy,
        savage_quote: savageQuote,
        context,
        nomination_status: 'pending',
      });

      if (error) {
        console.log('Nomination error:', error.message);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  },

  subscribeToNominations(weekId: string, onUpdate: () => void) {
    const supabase = createClient();
    const channel = supabase
      .channel(`heckler_nominations:${weekId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'heckler_nominations', filter: `week_id=eq.${weekId}` },
        () => onUpdate()
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'heckler_votes', filter: `week_id=eq.${weekId}` },
        () => onUpdate()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
