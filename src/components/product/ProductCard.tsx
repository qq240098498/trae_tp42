import { motion } from 'framer-motion';
import {
  Sparkles,
  CheckCircle2,
  JapaneseYen,
  Target,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  matchScore?: number;
  compact?: boolean;
  onViewDetails?: (product: Product) => void;
  className?: string;
}

const getMatchColor = (score: number) => {
  if (score >= 90) return { bg: 'from-warm-gold-400 to-warm-gold-600', text: 'text-warm-gold-600 dark:text-warm-gold-400', label: '极佳匹配' };
  if (score >= 75) return { bg: 'from-teal-green-400 to-teal-green-600', text: 'text-teal-green-600 dark:text-teal-green-400', label: '高度匹配' };
  if (score >= 60) return { bg: 'from-deep-sea-400 to-deep-sea-600', text: 'text-deep-sea-600 dark:text-deep-sea-400', label: '良好匹配' };
  if (score >= 40) return { bg: 'from-slate-400 to-slate-600', text: 'text-slate-600 dark:text-slate-400', label: '一般匹配' };
  return { bg: 'from-slate-300 to-slate-500', text: 'text-slate-500 dark:text-slate-400', label: '较低匹配' };
};

export default function ProductCard({
  product,
  matchScore = 85,
  compact = false,
  onViewDetails,
  className,
}: ProductCardProps) {
  const matchColors = getMatchColor(matchScore);
  const features = product.coreFeatures.slice(0, compact ? 3 : 4);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'group relative overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl dark:border-slate-700 dark:bg-slate-800',
        className,
      )}
    >
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <ImageIcon className="h-12 w-12" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {matchScore > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute right-3 top-3"
          >
            <div className="flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 shadow-lg backdrop-blur-sm dark:bg-slate-800/95">
              <div className={cn('flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br text-white', matchColors.bg)}>
                <Sparkles className="h-3 w-3" />
              </div>
              <span className={cn('text-xs font-bold', matchColors.text)}>{matchScore}%</span>
            </div>
          </motion.div>
        )}

        <div className="absolute bottom-3 left-3 right-3">
          <div className="mb-1 flex items-center gap-1.5">
            <Target className="h-3 w-3 text-white/90" />
            <span className="text-[11px] font-medium text-white/90">{matchColors.label}</span>
          </div>
        </div>
      </div>

      <div className={cn('p-4', compact ? 'space-y-3' : 'space-y-4')}>
        <div>
          <h4 className="text-base font-bold text-slate-900 transition-colors group-hover:text-primary dark:text-white dark:group-hover:text-primary-light">
            {product.name}
          </h4>
          <p className={cn(
            'mt-1 text-slate-500 dark:text-slate-400',
            compact ? 'line-clamp-2 text-xs' : 'line-clamp-2 text-sm',
          )}>
            {product.description}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          <JapaneseYen className={cn('shrink-0 text-warm-gold-500', compact ? 'h-3.5 w-3.5' : 'h-4 w-4')} />
          <span className={cn('font-bold text-warm-gold-600 dark:text-warm-gold-400', compact ? 'text-sm' : 'text-base')}>
            {product.priceFrom.toLocaleString()}
          </span>
          <span className={cn('text-slate-400 dark:text-slate-500', compact ? 'text-xs' : 'text-sm')}>
            ~{product.priceTo.toLocaleString()} 元
          </span>
        </div>

        {!compact && (
          <div className="space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              核心卖点
            </div>
            <div className="space-y-1.5">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  className="flex items-start gap-2"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-secondary" />
                  <span className={cn(
                    'text-slate-600 dark:text-slate-300',
                    compact ? 'text-xs' : 'text-sm',
                  )}>
                    {feature.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {!compact && onViewDetails && (
          <motion.button
            whileHover={{ x: 4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(product)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-primary-light px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
          >
            查看产品详情
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </motion.button>
        )}

        {compact && onViewDetails && (
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewDetails(product)}
            className="flex w-full items-center justify-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600 transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-300"
          >
            了解详情
            <ChevronRight className="h-3.5 w-3.5" />
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}
