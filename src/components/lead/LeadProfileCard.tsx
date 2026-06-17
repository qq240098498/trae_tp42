import { motion } from 'framer-motion';
import {
  Building2,
  Target,
  Wallet,
  Clock,
  Mail,
  Phone,
  User,
  Building,
  Briefcase,
  Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Lead, LeadScore, BudgetRange, DecisionTimeline } from '@/types';
import ScoreRing from './ScoreRing';
import GradeBadge from './GradeBadge';
import { industries } from '@/data/industries';

interface LeadProfileCardProps {
  lead: Lead;
  score?: LeadScore;
  className?: string;
}

const budgetLabel: Record<BudgetRange, { label: string; short: string; color: string }> = {
  LESS_THAN_50K: { label: '50万以下', short: '<50万', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  '50K_200K': { label: '50-200万', short: '50-200万', color: 'bg-deep-sea-100 text-deep-sea-700 dark:bg-deep-sea-900/40 dark:text-deep-sea-300' },
  '200K_500K': { label: '200-500万', short: '200-500万', color: 'bg-teal-green-100 text-teal-green-700 dark:bg-teal-green-900/40 dark:text-teal-green-300' },
  '500K_1M': { label: '500万-1000万', short: '500-1000万', color: 'bg-warm-gold-100 text-warm-gold-700 dark:bg-warm-gold-900/40 dark:text-warm-gold-300' },
  ABOVE_1M: { label: '1000万以上', short: '>1000万', color: 'bg-coral-orange-100 text-coral-orange-700 dark:bg-coral-orange-900/40 dark:text-coral-orange-300' },
  UNSPECIFIED: { label: '未明确', short: '待确认', color: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' },
};

const timelineLabel: Record<DecisionTimeline, { label: string; short: string; color: string }> = {
  IMMEDIATE: { label: '立即决策', short: '立即', color: 'bg-coral-orange-100 text-coral-orange-700 dark:bg-coral-orange-900/40 dark:text-coral-orange-300' },
  WITHIN_1M: { label: '1个月内', short: '1个月内', color: 'bg-warm-gold-100 text-warm-gold-700 dark:bg-warm-gold-900/40 dark:text-warm-gold-300' },
  WITHIN_3M: { label: '3个月内', short: '3个月内', color: 'bg-teal-green-100 text-teal-green-700 dark:bg-teal-green-900/40 dark:text-teal-green-300' },
  WITHIN_6M: { label: '6个月内', short: '6个月内', color: 'bg-deep-sea-100 text-deep-sea-700 dark:bg-deep-sea-900/40 dark:text-deep-sea-300' },
  LONG_TERM: { label: '长期规划', short: '长期', color: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300' },
  UNSPECIFIED: { label: '未明确', short: '待确认', color: 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' },
};

const getIndustryName = (industryId: string) => {
  return industries.find((i) => i.id === industryId)?.name || industryId;
};

const InfoRow = ({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof Building2;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-3">
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400">
      <Icon className="h-4.5 w-4.5" />
    </div>
    <div className="min-w-0 flex-1">
      <div className="text-[11px] font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500">
        {label}
      </div>
      <div className="mt-0.5 truncate text-sm text-slate-700 dark:text-slate-200">
        {children}
      </div>
    </div>
  </div>
);

const TagChip = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <span
    className={cn(
      'inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium',
      className,
    )}
  >
    {children}
  </span>
);

export default function LeadProfileCard({ lead, score, className }: LeadProfileCardProps) {
  const initials = lead.name.slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800',
        className,
      )}
    >
      <div className="relative h-24 bg-gradient-to-br from-primary via-primary-light to-secondary/60">
      <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
        }} />
      <div className="absolute -bottom-12 left-6">
        <div className="relative">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-warm-gold-400 to-warm-gold-600 text-2xl font-bold text-white shadow-lg dark:border-slate-800">
            {initials}
          </div>
        </div>
      </div>
      {score && (
        <div className="absolute right-4 top-4">
          <GradeBadge grade={score.grade} size="sm" />
        </div>
      )}
    </div>

    <div className="px-6 pt-14 pb-6">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {lead.name}
          </h3>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Building className="h-3.5 w-3.5" />
            <span>{lead.company}</span>
          </div>
        </div>
        {score && (
          <ScoreRing
            score={score.totalScore}
            grade={score.grade}
            size={100}
            strokeWidth={8}
          />
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoRow icon={Mail} label="邮箱">
          <a
            href={`mailto:${lead.email}`}
            className="hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {lead.email}
          </a>
        </InfoRow>
        <InfoRow icon={Phone} label="电话">
          <a
            href={`tel:${lead.phone}`}
            className="hover:text-primary dark:hover:text-primary-light transition-colors"
          >
            {lead.phone}
          </a>
        </InfoRow>
      </div>

      <div className="mb-6 space-y-4">
        <InfoRow icon={Building2} label="所属行业">
          <TagChip className="bg-deep-sea-100 text-deep-sea-700 dark:bg-deep-sea-900/40 dark:text-deep-sea-300">
            <Briefcase className="mr-1 h-3 w-3" />
            {getIndustryName(lead.industryId)}
          </TagChip>
        </InfoRow>

        <InfoRow icon={Target} label="业务场景">
          <TagChip className="bg-secondary/10 text-secondary dark:bg-secondary/20 dark:text-secondary-light">
            <Target className="mr-1 h-3 w-3" />
            {lead.businessScenario}
          </TagChip>
        </InfoRow>

        <InfoRow icon={Wallet} label="预算范围">
          <TagChip className={budgetLabel[lead.budgetRange].color}>
            <Wallet className="mr-1 h-3 w-3" />
            {budgetLabel[lead.budgetRange].short}
          </TagChip>
        </InfoRow>

        <InfoRow icon={Clock} label="决策周期">
          <TagChip className={timelineLabel[lead.decisionTimeline].color}>
            <Clock className="mr-1 h-3 w-3" />
            {timelineLabel[lead.decisionTimeline].short}
          </TagChip>
        </InfoRow>
      </div>

      {score && (
        <div className="mb-6 rounded-xl bg-slate-50 p-4 dark:bg-slate-700/50">
          <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            评分详情
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: '行业匹配', value: score.industryScore },
              { label: '场景匹配', value: score.scenarioScore },
              { label: '预算评分', value: score.budgetScore },
              { label: '时间评分', value: score.timelineScore },
            ].map((item, idx) => (
              <div key={idx}>
                <div className="mb-1 flex justify-between text-[11px]">
                  <span className="text-slate-500 dark:text-slate-400">{item.label}</span>
                  <span className="font-medium text-slate-700 dark:text-slate-200">{item.value}/100</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-600">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ duration: 0.8, delay: 0.1 * idx, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {lead.painPoints.length > 0 && (
        <div>
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            痛点标签
          </div>
          <div className="flex flex-wrap gap-2">
            {lead.painPoints.map((point, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * idx }}
                className="inline-flex items-center gap-1 rounded-full bg-coral-orange-50 px-2.5 py-1 text-xs font-medium text-coral-orange-700 dark:bg-coral-orange-900/20 dark:text-coral-orange-300"
              >
                <Tag className="h-3 w-3" />
                {point}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {lead.tags.length > 0 && (
        <div className="mt-4">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            自定义标签
          </div>
          <div className="flex flex-wrap gap-2">
            {lead.tags.map((tag, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * idx }}
                className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300"
              >
                <User className="h-3 w-3" />
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      )}
    </div>
    </motion.div>
  );
}
