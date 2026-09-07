'use client';

import { createClient } from '@/lib/supabase/client';

export interface DirectMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  is_read: boolean;
  created_at: string;
  sender?: { full_name: string; handle: string | null; rank: string } | null;
  recipient?: { full_name: string; handle: string | null; rank: string } | null;
}

export interface Conversation {
  partner_id: string;
  partner_name: string;
  partner_handle: string | null;
  partner_rank: string;
  last_message: string;
  last_at: string;
  unread_count: number;
}

export const messagingService = {
  async getConversations(userId: string): Promise<Conversation[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          id, sender_id, recipient_id, body, is_read, created_at,
          sender:user_profiles!direct_messages_sender_id_fkey(full_name, handle, rank),
          recipient:user_profiles!direct_messages_recipient_id_fkey(full_name, handle, rank)
        `)
        .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.log('DM fetch error:', error.message);
        return getDemoConversations();
      }

      if (!data || data.length === 0) return getDemoConversations();

      // Group by conversation partner
      const convMap = new Map<string, Conversation>();
      for (const msg of data) {
        const isMe = msg.sender_id === userId;
        const partner = isMe ? msg.recipient : msg.sender;
        const partnerId = isMe ? msg.recipient_id : msg.sender_id;
        if (!partner || !partnerId) continue;

        if (!convMap.has(partnerId)) {
          convMap.set(partnerId, {
            partner_id: partnerId,
            partner_name: (partner as any).full_name || 'Member',
            partner_handle: (partner as any).handle || null,
            partner_rank: (partner as any).rank || 'Layperson',
            last_message: msg.body,
            last_at: msg.created_at,
            unread_count: !isMe && !msg.is_read ? 1 : 0,
          });
        } else {
          const conv = convMap.get(partnerId)!;
          if (!isMe && !msg.is_read) conv.unread_count++;
        }
      }

      return Array.from(convMap.values());
    } catch {
      return getDemoConversations();
    }
  },

  async getMessages(userId: string, partnerId: string): Promise<DirectMessage[]> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .select(`
          *,
          sender:user_profiles!direct_messages_sender_id_fkey(full_name, handle, rank),
          recipient:user_profiles!direct_messages_recipient_id_fkey(full_name, handle, rank)
        `)
        .or(
          `and(sender_id.eq.${userId},recipient_id.eq.${partnerId}),and(sender_id.eq.${partnerId},recipient_id.eq.${userId})`
        )
        .order('created_at', { ascending: true })
        .limit(100);

      if (error) {
        console.log('DM messages fetch error:', error.message);
        return getDemoMessages(userId, partnerId);
      }

      // Mark unread messages as read
      const unreadIds = (data || [])
        .filter((m) => m.recipient_id === userId && !m.is_read)
        .map((m) => m.id);

      if (unreadIds.length > 0) {
        await supabase
          .from('direct_messages')
          .update({ is_read: true })
          .in('id', unreadIds);
      }

      return data || getDemoMessages(userId, partnerId);
    } catch {
      return getDemoMessages(userId, partnerId);
    }
  },

  async sendMessage(senderId: string, recipientId: string, body: string): Promise<DirectMessage | null> {
    const supabase = createClient();
    try {
      const { data, error } = await supabase
        .from('direct_messages')
        .insert({ sender_id: senderId, recipient_id: recipientId, body })
        .select()
        .single();

      if (error) {
        console.log('DM send error:', error.message);
        return null;
      }
      return data;
    } catch {
      return null;
    }
  },

  async getUnreadCount(userId: string): Promise<number> {
    const supabase = createClient();
    try {
      const { count, error } = await supabase
        .from('direct_messages')
        .select('id', { count: 'exact', head: true })
        .eq('recipient_id', userId)
        .eq('is_read', false);

      if (error) return 0;
      return count ?? 0;
    } catch {
      return 0;
    }
  },

  subscribeToMessages(
    userId: string,
    onMessage: (msg: DirectMessage) => void
  ) {
    const supabase = createClient();
    return supabase
      .channel(`dm:${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'direct_messages',
          filter: `recipient_id=eq.${userId}`,
        },
        (payload) => onMessage(payload.new as DirectMessage)
      )
      .subscribe();
  },
};

// ─── Demo fallback data ───────────────────────────────────────────────────────

function getDemoConversations(): Conversation[] {
  return [
    {
      partner_id: 'demo-1',
      partner_name: 'Bishop Snortley',
      partner_handle: 'snortley',
      partner_rank: 'Bishop',
      last_message: 'You deserved every single one of them lmao',
      last_at: new Date(Date.now() - 3600000).toISOString(),
      unread_count: 0,
    },
    {
      partner_id: 'demo-2',
      partner_name: 'Deacon Wheezington',
      partner_handle: 'wheezington',
      partner_rank: 'Deacon',
      last_message: 'I got a new bit about the collection plate I need to test',
      last_at: new Date(Date.now() - 1800000).toISOString(),
      unread_count: 2,
    },
    {
      partner_id: 'demo-3',
      partner_name: 'Sister Snickerdoodle',
      partner_handle: 'snickerdoodle',
      partner_rank: 'Sister',
      last_message: 'Are you coming to the open mic Thursday?',
      last_at: new Date(Date.now() - 86400000).toISOString(),
      unread_count: 1,
    },
  ];
}

function getDemoMessages(userId: string, partnerId: string): DirectMessage[] {
  const now = Date.now();
  return [
    {
      id: 'dm-demo-1',
      sender_id: partnerId,
      recipient_id: userId,
      body: 'Bro your Sunday set was absolutely unhinged. I spit out my communion wine 😂',
      is_read: true,
      created_at: new Date(now - 7200000).toISOString(),
    },
    {
      id: 'dm-demo-2',
      sender_id: userId,
      recipient_id: partnerId,
      body: 'Haha I was going off!! Did you see the Bishop in the front row losing it?',
      is_read: true,
      created_at: new Date(now - 6900000).toISOString(),
    },
    {
      id: 'dm-demo-3',
      sender_id: partnerId,
      recipient_id: userId,
      body: 'That was ME losing it 💀 You roasted me by name three times',
      is_read: true,
      created_at: new Date(now - 6600000).toISOString(),
    },
    {
      id: 'dm-demo-4',
      sender_id: userId,
      recipient_id: partnerId,
      body: 'You deserved every single one of them lmao',
      is_read: false,
      created_at: new Date(now - 3600000).toISOString(),
    },
  ];
}
