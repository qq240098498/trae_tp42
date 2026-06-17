import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  className?: string;
  text?: string;
}

const dotVariants = {
  initial: {
    y: 0,
    scale: 1,
    opacity: 0.6,
  },
  animate: (i: number) => ({
    y: [0, -8, 0],
    scale: [1, 1.2, 1],
    opacity: [0.6, 1, 0.6],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: 'loop' as const,
      ease: 'easeInOut',
      delay: i * 0.15,
    },
  }),
};

export default function TypingIndicator({
  className,
  text = '正在输入',
}: TypingIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn('flex gap-3', className)}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white shadow-md">
        <Bot className="h-5 w-5" />
      </div>
      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md border border-slate-100 bg-white px-4 py-3 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              custom={i}
              variants={dotVariants}
              initial="initial"
              animate="animate"
              className={cn(
                'inline-block h-2 w-2 rounded-full',
                i === 0 && 'bg-primary/60',
                i === 1 && 'bg-secondary/60',
                i === 2 && 'bg-warm-gold-500/60',
              )}
            />
          ))}
        </div>
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="ml-1 text-xs text-slate-500 dark:text-slate-400"
        >
          {text}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            ...
          </motion.span>
        </motion.span>
      </div>
    </motion.div>
  );
}
