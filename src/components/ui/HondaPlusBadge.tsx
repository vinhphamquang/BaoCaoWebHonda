import React from 'react';
import { Crown, Sparkles, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HondaPlusBadgeProps {
  variant?: 'default' | 'premium' | 'vip' | 'exclusive';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const HondaPlusBadge: React.FC<HondaPlusBadgeProps> = ({
  variant = 'default',
  size = 'md',
  animated = true,
  className,
  children
}) => {
  const variants = {
    default: {
      bg: 'bg-gradient-to-r from-red-600 to-red-700',
      text: 'text-white',
      icon: Sparkles,
      border: 'border-red-500/30'
    },
    premium: {
      bg: 'bg-gradient-to-r from-yellow-400 to-amber-500',
      text: 'text-gray-900',
      icon: Crown,
      border: 'border-yellow-400/30'
    },
    vip: {
      bg: 'bg-gradient-to-r from-purple-600 to-indigo-600',
      text: 'text-white',
      icon: Crown,
      border: 'border-purple-500/30'
    },
    exclusive: {
      bg: 'bg-gradient-to-r from-gray-800 to-black',
      text: 'text-white',
      icon: Star,
      border: 'border-gray-600/30'
    }
  };

  const sizes = {
    sm: {
      padding: 'px-3 py-1',
      text: 'text-xs',
      icon: 'h-3 w-3'
    },
    md: {
      padding: 'px-4 py-2',
      text: 'text-sm',
      icon: 'h-4 w-4'
    },
    lg: {
      padding: 'px-6 py-3',
      text: 'text-base',
      icon: 'h-5 w-5'
    }
  };

  const currentVariant = variants[variant];
  const currentSize = sizes[size];
  const Icon = currentVariant.icon;

  return (
    <div
      className={cn(
        'inline-flex items-center font-bold rounded-full shadow-lg border backdrop-blur-sm',
        currentVariant.bg,
        currentVariant.text,
        currentVariant.border,
        currentSize.padding,
        currentSize.text,
        animated && 'hover:scale-105 transition-all duration-300',
        className
      )}
    >
      <Icon className={cn('mr-2', currentSize.icon, animated && 'animate-pulse')} />
      {children || 'Honda Plus'}
      {animated && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer rounded-full"></div>
      )}
    </div>
  );
};

// Predefined Honda Plus badges
export const HondaPlusDefault = () => (
  <HondaPlusBadge>Honda Plus</HondaPlusBadge>
);

export const HondaPlusPremium = () => (
  <HondaPlusBadge variant="premium">Premium Member</HondaPlusBadge>
);

export const HondaPlusVIP = () => (
  <HondaPlusBadge variant="vip">VIP Member</HondaPlusBadge>
);

export const HondaPlusExclusive = () => (
  <HondaPlusBadge variant="exclusive">Exclusive</HondaPlusBadge>
);

// Special animated badge for hero sections
export const HondaPlusHero: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('relative inline-block', className)}>
    <HondaPlusBadge 
      variant="premium" 
      size="lg" 
      animated={true}
      className="relative z-10"
    >
      Honda Plus Experience
    </HondaPlusBadge>
    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full blur-lg opacity-50 animate-pulse"></div>
  </div>
);

export default HondaPlusBadge;
