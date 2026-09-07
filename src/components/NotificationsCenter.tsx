'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Heart, Coins, Radio, Trophy, Crown, Users, X, CheckCheck, Flame, Vote, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { notificationService, DBNotification } from '@/lib/services/notificationService';

interface Notification {
  id: string;
  type: 'blessing' | 'coins' | 'live' | 'lottery' | 'ordination' | 'follow' | 'election' | 'system' | 'heckler';
  title: string;
  body: string;
  time: string;
  read: boolean;
  color: string;
  isNew?: boolean;
}

const FALLBACK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', type: 'blessing', title: 'Rev. Cacklesworth blessed your sermon', body: '"Thou Shalt Not Bomb" received a Holy Blessing from Rev. Cacklesworth.', time: '2m ago', read: false, color: '#D4AF37' },
  { id: 'n2', type: 'coins', title: 'You received 50 Cheddar Coins', body: 'The congregation tipped you 50 CC for your latest set. Keep preaching.', time: '14m ago', read: false, color: '#D4AF37' },
  { id: 'n3', type: 'live', title: 'Mass starts in 30 minutes', body: 'Bishop Snortley is hosting Sunday Massacre Mass. 2,841 already tuned in.', time: '28m ago', read: false, color: '#52B788' },
  { id: 'n4', type: 'election', title: 'Summer Elections are OPEN', body: 'Vote for the Patron Saint of Laughterday and the Groan Reaper before Sunday.', time: '1h ago', read: false, color: '#7B4EA0' },
  { id: 'n5', type: 'ordination', title: "Rank Up: You're now a Deacon!", body: 'Your congregation blessings crossed the threshold. Welcome to the clergy.', time: '3h ago', read: true, color: '#D4AF37' },
  { id: 'n6', type: 'system', title: 'Soft Launch: Welcome to TCoLDS', body: "You're among the first congregation members. Your feedback shapes the church.", time: '1d ago', read: true, color: '#8A8070' },
];

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

function dbToNotification(n: DBNotification, isNew = false): Notification {
  return {
    id: n.id,
    type: n.notification_type,
    title: n.title,
    body: n.body,
    time: formatRelativeTime(n.created_at),
    read: n.is_read,
    color: n.color || '#D4AF37',
    isNew,
  };
}

const typeIcon: Record<Notification['type'], React.ElementType> = {
  blessing: Heart,
  coins: Coins,
  live: Radio,
  lottery: Trophy,
  ordination: Crown,
  follow: Users,
  election: Vote,
  system: Bell,
  heckler: Flame,
};

interface NotificationsCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationsCenter({ isOpen, onClose }: NotificationsCenterProps) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(FALLBACK_NOTIFICATIONS);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pulse, setPulse] = useState(false);

  const loadNotifications = useCallback(async () => {
    if (!user) {
      setNotifications(FALLBACK_NOTIFICATIONS);
      return;
    }
    const data = await notificationService.getAll(user.id);
    if (data.length > 0) {
      setNotifications(data.map((n) => dbToNotification(n)));
    } else {
      setNotifications(FALLBACK_NOTIFICATIONS);
    }
  }, [user]);

  useEffect(() => {
    if (isOpen) loadNotifications();
  }, [isOpen, loadNotifications]);

  // Real-time subscription
  useEffect(() => {
    if (!user) return;
    const unsub = notificationService.subscribeToNotifications(user.id, (incoming) => {
      const newNotif = dbToNotification(incoming, true);
      setNotifications((prev) => [newNotif, ...prev]);
      setPulse(true);
      setTimeout(() => setPulse(false), 600);
    });
    return unsub;
  }, [user]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (user) await notificationService.markAllRead(user.id);
  };

  const markRead = async (id: string) => {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
    if (user) await notificationService.markRead(id);
  };

  const dismiss = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (user) await notificationService.dismiss(id);
  };

  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  if (!isOpen) return null;

  return (
    <div
      className="absolute right-0 top-11 w-80 rounded-2xl border shadow-2xl z-50 overflow-hidden"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-2">
          <Bell size={15} style={{ color: 'var(--primary)' }} />
          <span className="font-700 text-sm" style={{ color: 'var(--foreground)' }}>Holy Notifications</span>
          {unreadCount > 0 && (
            <span
              className="text-xs font-700 px-1.5 py-0.5 rounded-full transition-all duration-300"
              style={{
                background: pulse ? '#52B788' : 'var(--secondary)',
                color: '#F5F0E8',
                fontSize: '10px',
                transform: pulse ? 'scale(1.2)' : 'scale(1)',
              }}
            >
              {unreadCount}
            </span>
          )}
          {/* Live indicator */}
          <div className="flex items-center gap-1 ml-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-600" style={{ color: '#52B788', fontSize: '10px' }}>Live</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-xs font-600 px-2 py-1 rounded-lg transition-colors hover:bg-muted"
              style={{ color: 'var(--primary)' }}
              title="Mark all read"
            >
              <CheckCheck size={12} />
              All read
            </button>
          )}
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted transition-colors" style={{ color: 'var(--muted-foreground)' }}>
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex border-b" style={{ borderColor: 'var(--border)' }}>
        {(['all', 'unread'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className="flex-1 py-2 text-xs font-700 transition-colors capitalize"
            style={{
              color: filter === tab ? 'var(--primary)' : 'var(--muted-foreground)',
              borderBottom: filter === tab ? '2px solid var(--primary)' : '2px solid transparent',
            }}
          >
            {tab === 'unread' ? `Unread (${unreadCount})` : 'All'}
          </button>
        ))}
      </div>

      {/* Notification list */}
      <div className="max-h-80 overflow-y-auto scrollbar-thin">
        {filtered.length === 0 ? (
          <div className="py-10 text-center">
            <Flame size={24} className="mx-auto mb-2" style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)' }}>
              {filter === 'unread' ? 'All caught up. The congregation is pleased.' : 'No notifications yet.'}
            </p>
          </div>
        ) : (
          filtered.map((n, idx) => {
            const NIcon = typeIcon[n.type] ?? Bell;
            return (
              <div
                key={n.id}
                className="group relative px-4 py-3 border-b transition-all duration-300 hover:bg-muted cursor-pointer"
                style={{
                  borderColor: 'var(--border)',
                  background: n.isNew
                    ? `${n.color}12`
                    : n.read ? 'transparent' : `${n.color}08`,
                  animation: n.isNew && idx === 0 ? 'slideInNotif 0.35s ease-out' : undefined,
                }}
                onClick={() => markRead(n.id)}
              >
                {!n.read && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{ background: n.color }} />
                )}
                {n.isNew && (
                  <span
                    className="absolute top-2 right-8 text-xs font-700 px-1.5 py-0.5 rounded-full"
                    style={{ background: `${n.color}22`, color: n.color, fontSize: '9px' }}
                  >
                    NEW
                  </span>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${n.color}18`, border: `1px solid ${n.color}33` }}>
                    <NIcon size={13} style={{ color: n.color }} />
                  </div>
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-xs font-700 leading-snug" style={{ color: 'var(--foreground)' }}>{n.title}</p>
                    <p className="text-xs font-400 mt-0.5 leading-relaxed" style={{ color: 'var(--muted-foreground)', fontSize: '11px' }}>{n.body}</p>
                    <p className="text-xs mt-1 font-500" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>{n.time}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); dismiss(n.id); }}
                  className="absolute top-2 right-2 p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  <X size={11} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t flex items-center justify-between" style={{ borderColor: 'var(--border)' }}>
        <p className="text-xs font-500" style={{ color: 'var(--muted-foreground)', fontSize: '10px' }}>
          Notifications are sacred. Handle with reverence.
        </p>
        <div className="flex items-center gap-1">
          <Zap size={10} style={{ color: '#52B788' }} />
          <span className="text-xs font-600" style={{ color: '#52B788', fontSize: '10px' }}>Real-time</span>
        </div>
      </div>
    </div>
  );
}
