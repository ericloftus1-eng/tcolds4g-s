'use client';
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { day: 'Mar 10', followers: 198000 },
  { day: 'Mar 24', followers: 210000 },
  { day: 'Apr 7', followers: 218000 },
  { day: 'Apr 21', followers: 224000 },
  { day: 'May 5', followers: 238000 },
  { day: 'May 19', followers: 251000 },
  { day: 'Jun 2', followers: 268000 },
  { day: 'Jun 8', followers: 284000 },
];

function formatFollowers(v: number) {
  return `${(v / 1000).toFixed(0)}K`;
}

interface TooltipPayload {
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="rounded-lg px-3 py-2 text-xs border shadow-xl"
      style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
    >
      <p style={{ color: 'var(--muted-foreground)' }}>{label}</p>
      <p className="font-mono-data font-700" style={{ color: 'var(--primary)' }}>
        {(payload[0].value / 1000).toFixed(0)}K congregation
      </p>
    </div>
  );
}

export default function OrdinationChart() {
  return (
    <ResponsiveContainer width="100%" height={100}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="ordination-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.4} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="day"
          tick={{ fontSize: 9, fill: 'var(--muted-foreground)' }}
          axisLine={false}
          tickLine={false}
          interval={2}
        />
        <YAxis hide domain={['dataMin - 10000', 'dataMax + 10000']} />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="followers"
          stroke="var(--primary)"
          strokeWidth={2}
          fill="url(#ordination-gradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}