import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  CheckCircle2,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  BarChart3,
  Zap,
  Shield,
  DollarSign,
  Layers,
  Info,
  Target,
  ThumbsUp,
  HelpCircle,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Competitor, DimensionComparison, ComparisonMetric, ComparisonSummary } from '@/data/competitors';
import type { GeneratedComparisonScript } from '@/utils/competitorAnalyzer';
import { calculateOverallScore } from '@/utils/competitorAnalyzer';

interface CompetitorComparisonProps {
  competitor: Competitor;
  script?: GeneratedComparisonScript;
  opening?: string;
}

const DIMENSION_ICONS: Record<string, typeof Zap> = {
  '功能覆盖': Layers,
  '性能指标': Zap,
  '价格区间': DollarSign,
  '服务保障': Shield,
};

const DIMENSION_COLORS: Record<string, { from: string; to: string; text: string; bg: string }> = {
  '功能覆盖': { from: 'from-blue-500', to: 'to-indigo-500', text: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950/30' },
  '性能指标': { from: 'from-emerald-500', to: 'to-teal-500', text: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/30' },
  '价格区间': { from: 'from-amber-500', to: 'to-orange-500', text: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950/30' },
  '服务保障': { from: 'from-purple-500', to: 'to-fuchsia-500', text: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950/30' },
};

function ScoreBar({ ourScore, competitorScore, label }: { ourScore: number; competitorScore: number; label: string }) {
  const max = Math.max(ourScore, competitorScore, 100);
  const ourWidth = (ourScore / max) * 100;
  const theirWidth = (competitorScore / max) * 100;

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600 dark:text-slate-300">{label}</span>
        <div className="flex items-center gap-2">
          <span className={cn(
            'font-bold',
            ourScore >= competitorScore ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          )}>
            我方 {ourScore}
          </span>
          <span className="text-slate-400">vs</span>
          <span className={cn(
            'font-bold',
            competitorScore > ourScore ? 'text-orange-600 dark:text-orange-400' : 'text-slate-500'
          )}>
            对方 {competitorScore}
          </span>
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${ourWidth}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500"
          />
        </div>
        <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${theirWidth}%` }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
            className="h-full rounded-full bg-gradient-to-r from-slate-400 to-slate-500"
          />
        </div>
      </div>
    </div>
  );
}

function MetricRow({ metric, index }: { metric: ComparisonMetric; index: number }) {
  const [showEvidence, setShowEvidence] = useState(false);
  const ourBetter = metric.ourScore > metric.competitorScore;
  const equal = metric.ourScore === metric.competitorScore;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{metric.label}</span>
            {ourBetter && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                <TrendingUp className="w-3 h-3" />领先
              </span>
            )}
            {equal && (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[10px] font-bold">
                持平
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-2">
        <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center gap-1.5 mb-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300">我方方案</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">{metric.ourValue}</p>
        </div>
        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
          <div className="flex items-center gap-1.5 mb-1">
            <BarChart3 className="w-3 h-3 text-slate-500 shrink-0" />
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">竞品方案</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{metric.competitorValue}</p>
        </div>
      </div>

      <ScoreBar ourScore={metric.ourScore} competitorScore={metric.competitorScore} label="综合评分" />

      {metric.evidence && (
        <button
          onClick={() => setShowEvidence(!showEvidence)}
          className="mt-2 flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
        >
          <Info className="w-3 h-3" />
          <span>{showEvidence ? '收起数据支撑' : '查看数据支撑'}</span>
          {showEvidence ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
        </button>
      )}
      {metric.evidence && showEvidence && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50"
        >
          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">📊 {metric.evidence}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

function DimensionSection({ dimension, index }: { dimension: DimensionComparison; index: number }) {
  const [expanded, setExpanded] = useState(true);
  const colors = DIMENSION_COLORS[dimension.dimension] || DIMENSION_COLORS['功能覆盖'];
  const Icon = DIMENSION_ICONS[dimension.dimension] || Layers;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.12 }}
      className={cn('rounded-xl border overflow-hidden', `border-${dimension.dimension === '功能覆盖' ? 'blue' : dimension.dimension === '性能指标' ? 'emerald' : dimension.dimension === '价格区间' ? 'amber' : 'purple'}-200 dark:border-opacity-30`, colors.bg)}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-white/50 dark:hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br text-white shadow-sm', colors.from, colors.to)}>
            <Icon className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{dimension.title}</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">{dimension.summary}</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-3.5 pb-3.5"
        >
          <div className="space-y-2.5">
            {dimension.metrics.map((metric, i) => (
              <MetricRow key={i} metric={metric} index={i} />
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

function ComparisonSummarySection({ summary, competitorName }: { summary: ComparisonSummary; competitorName: string }) {
  const [expanded, setExpanded] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'strengths' | 'fit' | 'decision'>('overview');

  const importanceColor = (importance: 'critical' | 'high' | 'medium') => {
    switch (importance) {
      case 'critical':
        return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      case 'high':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'medium':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
    }
  };

  const importanceLabel = (importance: 'critical' | 'high' | 'medium') => {
    switch (importance) {
      case 'critical':
        return '关键';
      case 'high':
        return '重要';
      case 'medium':
        return '一般';
    }
  };

  const tabs = [
    { key: 'overview' as const, label: '总体结论', icon: Sparkles },
    { key: 'strengths' as const, label: '双方优势', icon: ThumbsUp },
    { key: 'fit' as const, label: '适用场景', icon: Target },
    { key: 'decision' as const, label: '决策要点', icon: HelpCircle },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="rounded-xl border border-gradient-to-r from-indigo-200 to-purple-200 dark:from-indigo-800/50 dark:to-purple-800/50 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/20 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3.5 hover:bg-white/30 dark:hover:bg-slate-800/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-sm">
            <BarChart3 className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">对比总结</h5>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
              综合分析，客观呈现，帮助您做出明智选择
            </p>
          </div>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="px-3.5 pb-3.5"
        >
          <div className="flex gap-1 mb-3 p-1 rounded-lg bg-white/60 dark:bg-slate-800/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'flex-1 flex items-center justify-center gap-1 px-2 py-1.5 rounded-md text-[11px] font-medium transition-all',
                    activeTab === tab.key
                      ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                  )}
                >
                  <Icon className="w-3 h-3" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-200 dark:border-slate-700">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">Executive Summary</p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      {summary.executiveSummary}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-[11px] font-bold">
                      💡 一句话总结
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      {summary.quickTakeaway}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'strengths' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">我方核心优势</p>
                  </div>
                  <div className="space-y-2">
                    {summary.ourStrengths.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="text-[11px] font-semibold text-slate-800 dark:text-slate-100">{item.dimension}</span>
                            <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-bold', importanceColor(item.importance))}>
                              {importanceLabel(item.importance)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">{item.description}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-center gap-1.5 mb-2">
                    <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">{competitorName}的优势领域</p>
                    <span className="text-[10px] text-slate-400">（客观呈现，不贬低对手）</span>
                  </div>
                  <div className="space-y-1.5">
                    {summary.competitorStrengths.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 border border-slate-100 dark:border-slate-600">
                        <BarChart3 className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                        <div>
                          <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-200">{item.dimension}：</span>
                          <span className="text-[11px] text-slate-600 dark:text-slate-300">{item.description}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'fit' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 gap-3"
              >
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">推荐选择我方</p>
                  </div>
                  <ul className="space-y-1.5">
                    {summary.fitForUs.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="text-emerald-500 font-bold mt-0.5">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target className="w-3.5 h-3.5 text-slate-500" />
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">推荐选择{competitorName}</p>
                  </div>
                  <ul className="space-y-1.5">
                    {summary.fitForThem.map((item, i) => (
                      <li key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        <span className="text-slate-400 font-bold mt-0.5">→</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {activeTab === 'decision' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-2"
              >
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2">
                  向客户提出以下关键问题，帮助其理清需求，做出最适合的选择：
                </p>
                {summary.keyDecisionPoints.map((point, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-start gap-2 p-2.5 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-100 dark:border-blue-900/50"
                  >
                    <HelpCircle className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <p className="text-[12px] font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                      {point}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default function CompetitorComparison({ competitor, script, opening }: CompetitorComparisonProps) {
  const [copied, setCopied] = useState(false);
  const overallScore = calculateOverallScore(competitor);

  const handleCopyScript = () => {
    if (script) {
      navigator.clipboard.writeText(script.fullScript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-lg w-full">
      {opening && (
        <div className="mb-2 ml-12">
          <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
            {opening}
          </div>
        </div>
      )}

      <div className="ml-12 rounded-2xl border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 overflow-hidden shadow-md">
        <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <div className="flex items-center gap-2">
            <Swords className="w-4 h-4" />
            <span className="text-sm font-bold">竞品对比：{competitor.name}</span>
          </div>
          {script && (
            <button
              onClick={handleCopyScript}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/20 hover:bg-white/30 transition-colors text-xs"
            >
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? '已复制' : '复制话术'}
            </button>
          )}
        </div>

        <div className="p-4 border-b border-orange-200/60 dark:border-orange-800/60">
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div className="text-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">我方综合</p>
              <p className="text-lg font-black text-emerald-600 dark:text-emerald-400">{overallScore.ourScore}</p>
            </div>
            <div className="text-center flex flex-col items-center justify-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">对比</p>
              <p className="text-sm font-bold text-slate-600 dark:text-slate-300">VS</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-0.5">{competitor.name}</p>
              <p className="text-lg font-black text-slate-500 dark:text-slate-400">{overallScore.competitorScore}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {competitor.comparisonMatrix.map((dim) => {
              const scores = overallScore.dimensionScores[dim.dimension];
              const Icon = DIMENSION_ICONS[dim.dimension] || Layers;
              const colors = DIMENSION_COLORS[dim.dimension] || DIMENSION_COLORS['功能覆盖'];
              return (
                <div key={dim.dimension} className="text-center p-2 rounded-lg bg-white/60 dark:bg-slate-800/60">
                  <div className={cn('w-6 h-6 mx-auto rounded-md flex items-center justify-center mb-1 text-white', `bg-gradient-to-br ${colors.from} ${colors.to}`)}>
                    <Icon className="w-3 h-3" />
                  </div>
                  <p className="text-[9px] text-slate-500 dark:text-slate-400 leading-tight mb-0.5">{dim.dimension}</p>
                  <div className="flex items-center justify-center gap-0.5">
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">{scores?.our || '-'}</span>
                    <span className="text-[9px] text-slate-400">/</span>
                    <span className="text-[11px] font-bold text-slate-500">{scores?.theirs || '-'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {competitor.comparisonMatrix.map((dim, i) => (
            <DimensionSection key={dim.dimension} dimension={dim} index={i} />
          ))}
        </div>

        {competitor.comparisonSummary && (
          <div className="px-4 pb-4">
            <ComparisonSummarySection summary={competitor.comparisonSummary} competitorName={competitor.name} />
          </div>
        )}

        {competitor.customerReferences && competitor.customerReferences.length > 0 && (
          <div className="px-4 pb-4">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-1.5 mb-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">我方客户实践</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {competitor.customerReferences.map((ref, i) => (
                  <span key={i} className="inline-flex items-center px-2 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-medium">
                    {ref.count} {ref.industry}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {script && script.keyTalkingPoints.length > 0 && (
          <div className="px-4 pb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border border-blue-200/60 dark:border-blue-800/60">
              <div className="flex items-center gap-1.5 mb-2">
                <Zap className="w-3.5 h-3.5 text-blue-500" />
                <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">核心优势要点</span>
              </div>
              <ul className="space-y-1">
                {script.keyTalkingPoints.map((point, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
                    <span className="text-blue-500 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
