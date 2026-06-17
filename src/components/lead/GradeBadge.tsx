import { motion } from 'framer-motion';
import { Crown, Star, ThumbsUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LeadGrade } from '@/types';

interface GradeBadgeProps {
  grade: LeadGrade;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

const gradeConfig: Record<LeadGrade, {
  label: string;
  description: string;
  icon: typeof Crown;
  bg: string;
  bgGradient: string;
  border: string;
  text: string;
  ring: string;
  glow: string;
}> = {
  A: {
    label: 'A',
    description: '高意向优质客户',
    icon: Crown,
    bg: 'bg-warm-gold-50 dark:bg-warm-gold-900/20',
    bgGradient: 'bg-gradient-to-br from-warm-gold-400 to-warm-gold-600',
    border: 'border-warm-gold-200 dark:border-warm-gold-700',
    text: 'text-warm-gold-700 dark:text-warm-gold-300',
    ring: 'ring-warm-gold-300/50',
    glow: 'shadow-warm-gold-200/60 dark:shadow-warm-gold-500/20',
  },
  B: {
    label: 'B',
    description: '意向较好需跟进',
    icon: Star,
    bg: 'bg-teal-green-50 dark:bg-teal-green-900/20',
    bgGradient: 'bg-gradient-to-br from-teal-green-400 to-teal-green-600',
    border: 'border-teal-green-200 dark:border-teal-green-700',
    text: 'text-teal-green-700 dark:text-teal-green-300',
    ring: 'ring-teal-green-300/50',
    glow: 'shadow-teal-green-200/60 dark:shadow-teal-green-500/20',
  },
  C: {
    label: 'C',
    description: '一般意向待培育',
    icon: ThumbsUp,
    bg: 'bg-deep-sea-50 dark:bg-deep-sea-900/20',
    bgGradient: 'bg-gradient-to-br from-deep-sea-400 to-deep-sea-600',
    border: 'border-deep-sea-200 dark:border-deep-sea-700',
    text: 'text-deep-sea-700 dark:text-deep-sea-300',
    ring: 'ring-deep-sea-300/50',
    glow: 'shadow-deep-sea-200/60 dark:shadow-deep-sea-500/20',
  },
  D: {
    label: 'D',
    description: '低意向或无效',
    icon: AlertCircle,
    bg: 'bg-coral-orange-50 dark:bg-coral-orange-900/20',
    bgGradient: 'bg-gradient-to-br from-coral-orange-400 to-coral-orange-600',
    border: 'border-coral-orange-200 dark:border-coral-orange-700',
    text: 'text-coral-orange-700 dark:text-coral-orange-300',
    ring: 'ring-coral-orange-300/50',
    glow: 'shadow-coral-orange-200/60 dark:shadow-coral-orange-500/20',
  },
};

const sizeConfig = {
  sm: {
    container: 'px-2 py-0.5 gap-1',
    icon: 'h-3 w-3',
    text: 'text-xs',
    dot: 'h-1.5 w-1.5',
  },
  md: {
    container: 'px-3 py-1 gap-1.5',
    icon: 'h-3.5 w-3.5',
    text: 'text-sm',
    dot: 'h-2 w-2',
  },
  lg: {
    container: 'px-4 py-1.5 gap-2',
    icon: 'h-4.5 w-4.5',
    text: 'text-base',
    dot: 'h-2.5 w-2.5',
  },
};

export default function GradeBadge({
  grade,
  size = 'md',
  showLabel = true,
  showIcon = true,
  animated = true,
  className,
}: GradeBadgeProps) {
  const config = gradeConfig[grade];
  const sizeCls = sizeConfig[size];
  const Icon = config.icon;

  const content = (
    <div
      className={cn(
        'inline-flex items-center rounded-full border backdrop-blur-sm transition-all duration-300',
        config.bg,
        config.border,
        sizeCls.container,
        className,
      )}
    >
      <span
        className={cn(
          'relative inline-flex items-center justify-center rounded-full text-white',
          config.bgGradient,
          size === 'sm' ? 'h-4 w-4' : size === 'md' ? 'h-5 w-5' : 'h-6 w-6',
        )}
      >
        {showIcon ? (
          <Icon className={sizeCls.icon} />
        ) : (
          <span className={cn('font-bold', sizeCls.text)}>{config.label}</span>
        )}
        {animated && (
          <span
            className={cn(
              'absolute -right-0.5 -top-0.5 rounded-full ring-2 ring-white dark:ring-slate-800',
              sizeCls.dot,
              config.bgGradient,
            )}
            style={{ animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}
          />
        )}
      </span>
      {showLabel && (
        <span className={cn('font-bold tracking-tight', config.text, sizeCls.text)}>
          等级 {config.label}
        </span>
      )}
    </div>
  );

  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05, y: -1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="inline-block"
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
