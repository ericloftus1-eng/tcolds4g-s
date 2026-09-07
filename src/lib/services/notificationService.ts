'use client';

import { createClient } from '@/lib/supabase/client';

export interface DBNotification {
  id: string;
  user_id: string;
  notification_type: 'blessing' | 'coins' | 'live' | 'lottery' | 'ordination' | 'follow' | 'election' | 'system' | 'heckler';
  title: string;
  body: string;
  is_read: boolean;
  color: string;
  metadata: Record<string, any>;
  created_at: string;
}

export const notificationService = {
  async getAll(userId: string): Promise<DBNotification[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.log('Notifications fetch error:', error.message);
        return [];
      }
      return data || [];
    } catch {
      return [];
    }
  },

  async markRead(id: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
    } catch {}
  },

  async markAllRead(userId: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('notifications').update({ is_read: true }).eq('user_id', userId).eq('is_read', false);
    } catch {}
  },

  async dismiss(id: string): Promise<void> {
    const supabase = createClient();
    try {
      await supabase.from('notifications').delete().eq('id', id);
    } catch {}
  },

  subscribeToNotifications(
    userId: string,
    onInsert: (notification: DBNotification) => void
  ) {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          onInsert(payload.new as DBNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
};
