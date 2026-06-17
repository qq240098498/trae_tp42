import { motion } from 'framer-motion';
import { Bot, User, Sparkles, TrendingUp, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message, MessageSender, MessageType, Product as ProductType, Competitor, LeadGrade } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import GradeBadge from '@/components/lead/GradeBadge';

interface MessageBubbleProps {
  message: Message;
}

const SenderAvatar = ({ sender }: { sender: MessageSender }) => {
  const isSystem = sender === 'SYSTEM';
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn(
        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full shadow-md',
        isSystem
          ? 'bg-gradient-to-br from-primary to-secondary text-white'
          : 'bg-gradient-to-br from-warm-gold-400 to-warm-gold-600 text-white',
      )}
    >
      {isSystem ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
    </motion.div>
  );
};

const TextContent = ({ content }: { content: string }) => (
  <div className="whitespace-pre-wrap break-words text-sm leading-relaxed">{content}</div>
);

interface ProductCardPayload {
  product: ProductType;
  matchScore: number;
}

const ProductCardContent = ({ payload }: { payload?: Record<string, any> }) => {
  const data = payload as ProductCardPayload;
  if (!data?.product) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-2"
    >
      <ProductCard product={data.product} matchScore={data.matchScore} />
    </motion.div>
  );
};

interface CompetitorPayload {
  competitor: Competitor;
}

const CompetitorComparisonContent = ({ payload }: { payload?: Record<string, any> }) => {
  const data = payload as CompetitorPayload;
  if (!data?.competitor) return null;
  const { competitor } = data;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="mt-3 space-y-3"
    >
      <div className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-coral-orange-50 to-coral-orange-100 p-3 dark:from-coral-orange-900/20 dark:to-coral-orange-800/20">
        <TrendingUp className="h-5 w-5 text-coral-orange-500" />
        <span className="text-sm font-semibold text-coral-orange-700 dark:text-coral-orange-300">
          竞品对比分析：{competitor.name}
        </span>
      </div>
      <div className="space-y-2">
        {competitor.diffPoints.map((point, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              {point.dimension}
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                <span className="text-slate-700 dark:text-slate-200">
                  <span className="font-medium">我方优势：</span>
                  {point.ourAdvantage}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <TrendingUp className="mt-0.5 h-4 w-4 shrink-0 text-coral-orange-500" />
                <span className="text-slate-600 dark:text-slate-400">
                  <span className="font-medium">竞品短板：</span>
                  {point.competitorWeakness}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

interface GradeUpdatePayload {
  previousGrade: LeadGrade;
  newGrade: LeadGrade;
  reason: string;
}

const GradeUpdateContent = ({ payload }: { payload?: Record<string, any> }) => {
  const data = payload as GradeUpdatePayload;
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className="mt-2 rounded-xl border border-warm-gold-200 bg-gradient-to-br from-warm-gold-50 to-warm-gold-100 p-4 dark:border-warm-gold-700 dark:from-warm-gold-900/30 dark:to-warm-gold-800/20"
    >
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-warm-gold-500" />
        <span className="text-sm font-semibold text-warm-gold-700 dark:text-warm-gold-300">
          线索等级已更新
        </span>
      </div>
      <div className="mb-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">原等级</span>
          <GradeBadge grade={data.previousGrade} size="sm" />
        </div>
        <motion.div
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <svg className="h-4 w-4 text-warm-gold-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">新等级</span>
          <GradeBadge grade={data.newGrade} size="sm" />
        </div>
      </div>
      {data.reason && (
        <p className="text-xs text-slate-600 dark:text-slate-300">{data.reason}</p>
      )}
    </motion.div>
  );
};

const renderContent = (type: MessageType, content: string, payload?: Record<string, any>) => {
  switch (type) {
    case 'TEXT':
      return <TextContent content={content} />;
    case 'PRODUCT_CARD':
      return (
        <>
          {content && <TextContent content={content} />}
          <ProductCardContent payload={payload} />
        </>
      );
    case 'COMPETITOR_COMPARISON':
      return (
        <>
          {content && <TextContent content={content} />}
          <CompetitorComparisonContent payload={payload} />
        </>
      );
    case 'GRADE_UPDATE':
      return (
        <>
          {content && <TextContent content={content} />}
          <GradeUpdateContent payload={payload} />
        </>
      );
    case 'ACTION_INVITE':
      return <TextContent content={content} />;
    default:
      return <TextContent content={content} />;
  }
};

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isSystem = message.sender === 'SYSTEM';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cn('flex gap-3', isSystem ? 'justify-start' : 'justify-end')}
    >
      {isSystem && <SenderAvatar sender={message.sender} />}
      <div
        className={cn(
          'group relative max-w-[85%]',
          isSystem ? 'pr-4' : 'pl-4',
        )}
      >
        {isSystem && (
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
              AI 销售助理
            </span>
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
        <motion.div
          layout
          className={cn(
            'rounded-2xl px-4 py-3 shadow-sm transition-shadow duration-200 hover:shadow-md',
            isSystem
              ? 'rounded-tl-md bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700'
              : 'rounded-tr-md bg-gradient-to-br from-primary to-primary-light text-white',
          )}
        >
          {renderContent(message.type, message.content, message.payload)}
        </motion.div>
        {!isSystem && (
          <div className="mt-1.5 flex justify-end gap-2">
            <span className="text-[10px] text-slate-400 dark:text-slate-500">
              {new Date(message.timestamp).toLocaleTimeString('zh-CN', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
        )}
      </div>
      {!isSystem && <SenderAvatar sender={message.sender} />}
    </motion.div>
  );
}
