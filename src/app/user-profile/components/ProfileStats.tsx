import React from 'react';
import { Users, Eye, Heart, Coins, Crown } from 'lucide-react';

const stats = [
  {
    id: 'stat-followers',
    label: 'Congregation',
    value: '284K',
    subLabel: '+3.2K this week',
    icon: Users,
    color: 'var(--primary)',
    trend: 'up',
  },
  {
    id: 'stat-views',
    label: 'Total Sermon Views',
    value: '12.4M',
    subLabel: '+94K this week',
    icon: Eye,
    color: '#38BDF8',
    trend: 'up',
  },
  {
    id: 'stat-likes',
    label: 'Blessings Received',
    value: '847K',
    subLabel: '+8.1K this week',
    icon: Heart,
    color: 'var(--secondary)',
    trend: 'up',
  },
  {
    id: 'stat-coin',
    label: 'Holy Offerings',
    value: '94,220 CC',
    subLabel: 'Total tithes received',
    icon: Coins,
    color: 'var(--primary)',
    trend: 'up',
  },
  {
    id: 'stat-rank',
    label: 'Clergy Rank',
    value: 'Cardinal',
    subLabel: '2nd highest rank',
    icon: Crown,
    color: '#CC2222',
    trend: 'neutral',
  },
];

export default function ProfileStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-6">
      {stats?.map((stat) => (
        <div
          key={stat?.id}
          className="rounded-xl border p-4 card-hover"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-500 tracking-wide" style={{ color: 'var(--muted-foreground)' }}>
              {stat?.label}
            </span>
            <stat.icon size={14} style={{ color: stat?.color }} />
          </div>
          <p className="font-mono-data font-700 text-lg leading-none" style={{ color: 'var(--foreground)' }}>
            {stat?.value}
          </p>
          <p className="text-xs mt-1" style={{ color: stat?.trend === 'up' ? '#52B788' : 'var(--muted-foreground)' }}>
            {stat?.subLabel}
          </p>
        </div>
      ))}
    </div>
  );
}