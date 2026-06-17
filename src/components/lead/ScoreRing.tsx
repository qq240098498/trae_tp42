import { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LeadGrade } from '@/types';

interface ScoreRingProps {
  score: number;
  grade?: LeadGrade;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  className?: string;
  animate?: boolean;
}

const gradeColorMap: Record<LeadGrade, { from: string; to: string; text: string; glow: string }> = {
  A: {
    from: '#fbbf24',
    to: '#d97706',
    text: 'text-warm-gold-600 dark:text-warm-gold-400',
    glow: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.4))',
  },
  B: {
    from: '#2dd4bf',
    to: '#0d9488',
    text: 'text-teal-green-600 dark:text-teal-green-400',
    glow: 'drop-shadow(0 0 8px rgba(45, 212, 191, 0.4))',
  },
  C: {
    from: '#60a5fa',
    to: '#1d4ed8',
    text: 'text-deep-sea-600 dark:text-deep-sea-400',
    glow: 'drop-shadow(0 0 8px rgba(96, 165, 250, 0.4))',
  },
  D: {
    from: '#f87171',
    to: '#dc2626',
    text: 'text-coral-orange-600 dark:text-coral-orange-400',
    glow: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.4))',
  },
};

const getGradeFromScore = (score: number): LeadGrade => {
  if (score >= 80) return 'A';
  if (score >= 60) return 'B';
  if (score >= 40) return 'C';
  return 'D';
};

function AnimatedScore({ score, textClass }: { score: number; textClass: string }) {
  const spring = useSpring(0, { stiffness: 60, damping: 20, mass: 0.8 });
  const display = useTransform(spring, (val) => Math.round(val).toString());

  useEffect(() => {
    spring.set(score);
  }, [score, spring]);

  return (
    <motion.span
      className={cn('font-bold tabular-nums', textClass)}
      style={{ fontSize: 'inherit' }}
    >
      {display}
    </motion.span>
  );
}

export default function ScoreRing({
  score,
  grade,
  size = 120,
  strokeWidth = 10,
  showLabel = true,
  label,
  className,
  animate = true,
}: ScoreRingProps) {
  const [progress, setProgress] = useState(animate ? 0 : score);
  const effectiveGrade = grade || getGradeFromScore(score);
  const colors = gradeColorMap[effectiveGrade];

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const offset = circumference - (clampedProgress / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => setProgress(score), 100);
      return () => clearTimeout(timer);
    } else {
      setProgress(score);
    }
  }, [score, animate]);

  const gradientId = `score-gradient-${effectiveGrade}-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className={cn('relative inline-flex flex-col items-center', className)}>
      <div
        className="relative"
        style={{ width: size, height: size }}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={colors.from} />
              <stop offset="100%" stopColor={colors.to} />
            </linearGradient>
          </defs>

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-slate-100 dark:text-slate-700"
          />

          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            fill="none"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ filter: colors.glow }}
          />
        </svg>

        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ fontSize: size * 0.28 }}
        >
          <div className="flex items-baseline leading-none">
            <AnimatedScore score={score} textClass={colors.text} />
            <span className={cn('ml-0.5 font-medium', colors.text)} style={{ fontSize: size * 0.12 }}>
              /100
            </span>
          </div>
          {showLabel && (
            <span
              className={cn('mt-1 font-medium', colors.text)}
              style={{ fontSize: size * 0.14 }}
            >
              {label || `等级 ${effectiveGrade}`}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
