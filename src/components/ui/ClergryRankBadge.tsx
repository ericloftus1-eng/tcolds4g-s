import React from 'react';
import { Crown, Star, Zap, Shield, Leaf, BookOpen, User } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


export type ClergryRank =
  | 'Saint' |'Cardinal' |'Archbishop' |'Bishop' |'Minister' |'Deacon' |'Layperson';

const rankConfig: Record<
  ClergryRank,
  { icon: React.ElementType; badgeClass: string; label: string }
> = {
  Saint: { icon: Crown, badgeClass: 'rank-badge-saint', label: '✦ Saint' },
  Cardinal: { icon: Star, badgeClass: 'rank-badge-cardinal', label: '✦ Cardinal' },
  Archbishop: { icon: Zap, badgeClass: 'rank-badge-archbishop', label: '✦ Archbishop' },
  Bishop: { icon: Shield, badgeClass: 'rank-badge-bishop', label: '✦ Bishop' },
  Minister: { icon: Leaf, badgeClass: 'rank-badge-minister', label: '✦ Minister' },
  Deacon: { icon: BookOpen, badgeClass: 'rank-badge-deacon', label: '✦ Deacon' },
  Layperson: { icon: User, badgeClass: 'rank-badge-layperson', label: 'Layperson' },
};

interface ClergryRankBadgeProps {
  rank: ClergryRank;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export default function ClergryRankBadge({
  rank,
  size = 'md',
  showIcon = true,
}: ClergryRankBadgeProps) {
  const config = rankConfig[rank];
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-xs gap-1',
    md: 'px-2 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-600 ${config.badgeClass} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon size={size === 'sm' ? 10 : size === 'md' ? 12 : 14} />}
      {config.label}
    </span>
  );
}