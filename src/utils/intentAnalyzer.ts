import type {
  IntentSignal,
  IntentAnalysisResult,
  SignalCategory,
  SignalType,
  IntentLevel,
} from '@/types';

interface SignalPattern {
  category: SignalCategory;
  type: SignalType;
  keywords: string[];
  weight: number;
  message: string;
}

const POSITIVE_SIGNAL_PATTERNS: SignalPattern[] = [
  {
    category: 'PRICE_INQUIRY',
    type: 'POSITIVE',
    keywords: ['价格', '报价', '多少钱', '费用', '定价', '价目', '收费', '折扣', '优惠', '套餐', '年费', '月费', '成本', '预算多少', '怎么卖'],
    weight: 15,
    message: '客户询问价格信息，表明进入实质性评估阶段',
  },
  {
    category: 'IMPLEMENTATION_TIMELINE',
    type: 'POSITIVE',
    keywords: ['实施周期', '多久上线', '什么时候能用', '部署时间', '上线时间', '多久能好', '需要多长时间', '交付周期', '实施时间', '什么时候完成'],
    weight: 18,
    message: '客户关心实施周期，说明在考虑落地计划',
  },
  {
    category: 'DECISION_PROCESS',
    type: 'POSITIVE',
    keywords: ['决策流程', '审批流程', '谁来拍板', '怎么采购', '招标流程', '采购流程', '内部流程', '需要谁同意', '怎么签约', '合同流程'],
    weight: 20,
    message: '客户了解决策流程，表明进入采购前准备阶段',
  },
  {
    category: 'PRODUCT_DETAIL',
    type: 'POSITIVE',
    keywords: ['具体功能', '详细介绍', '功能演示', '怎么用', '使用方法', '操作流程', '功能说明', '技术架构', 'API接口', '数据安全', '性能', '并发量', '稳定性'],
    weight: 12,
    message: '客户深入了解产品细节，购买兴趣浓厚',
  },
  {
    category: 'COMPETITOR_COMPARISON',
    type: 'POSITIVE',
    keywords: ['对比', '比较', '区别', '优势', '差异', '相比', '竞品', '竞争对手', '友商', '和XX比怎么样', '哪个好'],
    weight: 10,
    message: '客户进行竞品对比，正在进行选型评估',
  },
  {
    category: 'SUCCESS_CASE',
    type: 'POSITIVE',
    keywords: ['案例', '客户', '成功案例', '有没有案例', '谁在用', '参考案例', '同行案例', '标杆客户', '最佳实践'],
    weight: 10,
    message: '客户关注成功案例，希望验证产品价值',
  },
  {
    category: 'TRIAL_DEMO',
    type: 'POSITIVE',
    keywords: ['试用', '演示', 'demo', '体验一下', '免费试用', '申请试用', '能不能试试', 'POC', '概念验证', '现场演示'],
    weight: 22,
    message: '客户希望试用或演示，购买意愿非常强烈',
  },
  {
    category: 'BUDGET_POSITIVE',
    type: 'POSITIVE',
    keywords: ['预算充足', '预算已批', '预算没问题', '预算已经批了', '钱不是问题', '预算已到位', '可以申请预算', '有预算', '经费已落实'],
    weight: 20,
    message: '客户预算到位，具备采购条件',
  },
  {
    category: 'URGENCY',
    type: 'POSITIVE',
    keywords: ['尽快', '加急', '着急', '时间紧', '迫切', '尽快推进', '越快越好', '希望马上', '本周', '这两周', '尽快上线', '立即启动'],
    weight: 18,
    message: '客户表达紧迫性，决策窗口期已打开',
  },
];

const NEGATIVE_SIGNAL_PATTERNS: SignalPattern[] = [
  {
    category: 'REJECTION',
    type: 'NEGATIVE',
    keywords: ['暂时不考虑', '不需要', '不感兴趣', '算了吧', '不用了', '以后再说', '先不考虑', '目前不需要', '再说吧', '暂时不需要'],
    weight: -25,
    message: '客户明确表示暂不考虑，建议降低跟进频率',
  },
  {
    category: 'BUDGET_EXHAUSTED',
    type: 'NEGATIVE',
    keywords: ['预算已花完', '没预算', '预算不够', '没钱', '超预算', '太贵了', '超出预算', '预算有限', '今年预算用完了', '经费不足', '没有预算'],
    weight: -20,
    message: '客户预算不足，建议转入长期培育或提供低配方案',
  },
  {
    category: 'TIMING_NOT_RIGHT',
    type: 'NEGATIVE',
    keywords: ['时机不对', '时候未到', '明年再说', '下季度再看', '等一等', '先等等', '观望', '再看看', '不急', '还没到时候', '年底再说', '明年规划'],
    weight: -15,
    message: '客户认为时机未到，建议定期触达保持联系',
  },
  {
    category: 'NO_AUTHORITY',
    type: 'NEGATIVE',
    keywords: ['我做不了主', '领导没说', '需要请示', '老板决定', '说了不算', '我不是决策人', '得问领导', '上报一下', '上面审批', '领导拍板'],
    weight: -10,
    message: '客户不是最终决策人，建议设法触达关键决策人',
  },
  {
    category: 'SATISFIED_WITH_CURRENT',
    type: 'NEGATIVE',
    keywords: ['现在用的挺好', '现有系统够用', '已经有供应商了', '一直合作中', '暂时不换', '用惯了', '现有方案可以', '合作很稳定', '在用别家的'],
    weight: -18,
    message: '客户对现有方案满意，需要寻找差异化突破口',
  },
  {
    category: 'COMPETITOR_PREFERENCE',
    type: 'NEGATIVE',
    keywords: ['倾向于', '更看好', '已选定', '准备用XX', '和XX合作', '意向XX', '偏好XX', '领导指定', '已经定了XX'],
    weight: -20,
    message: '客户倾向竞争对手，需要紧急启动差异化策略',
  },
  {
    category: 'TOO_EXPENSIVE',
    type: 'NEGATIVE',
    keywords: ['太贵', '价格太高', '性价比不高', '不值这个价', '比别家贵', '超出预期', '费用太高', '成本太高', '价格接受不了'],
    weight: -15,
    message: '客户认为价格过高，需强调价值或提供优惠方案',
  },
  {
    category: 'NEEDS_MORE_TIME',
    type: 'NEGATIVE',
    keywords: ['再考虑考虑', '研究一下', '想想再说', '讨论一下', '商量一下', '内部再看看', '回去研究', '需要时间', '还在评估', '比较中'],
    weight: -8,
    message: '客户需要更多时间考虑，建议提供决策辅助材料',
  },
];

const INITIAL_INTENT_SCORE = 50;

export function getIntentLevel(score: number): IntentLevel {
  if (score >= 75) return 'HOT';
  if (score >= 55) return 'WARM';
  if (score >= 35) return 'COOL';
  return 'COLD';
}

export function getIntentLevelConfig(level: IntentLevel): {
  label: string;
  color: string;
  bg: string;
  textColor: string;
  ringColor: string;
} {
  switch (level) {
    case 'HOT':
      return {
        label: '🔥 高意向',
        color: 'from-rose-500 to-orange-500',
        bg: 'bg-gradient-to-br from-rose-500 via-red-500 to-orange-500',
        textColor: 'text-rose-600',
        ringColor: '#f43f5e',
      };
    case 'WARM':
      return {
        label: '🌤️ 意向良好',
        color: 'from-amber-400 to-orange-400',
        bg: 'bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500',
        textColor: 'text-amber-600',
        ringColor: '#f59e0b',
      };
    case 'COOL':
      return {
        label: '🌥️ 待培育',
        color: 'from-blue-400 to-indigo-400',
        bg: 'bg-gradient-to-br from-blue-400 via-sky-400 to-indigo-500',
        textColor: 'text-blue-600',
        ringColor: '#3b82f6',
      };
    case 'COLD':
      return {
        label: '❄️ 低意向',
        color: 'from-slate-400 to-slate-500',
        bg: 'bg-gradient-to-br from-slate-400 via-slate-500 to-slate-600',
        textColor: 'text-slate-600',
        ringColor: '#64748b',
      };
  }
}

export function getIntentRecommendation(level: IntentLevel, scoreChange: number): string {
  if (scoreChange >= 10) {
    return '✨ 购买意愿大幅上升！抓住最佳时机，主动推进到下一阶段（邀约演示/试用）';
  }
  if (scoreChange >= 5) {
    return '📈 购买意愿上升，继续深入挖掘客户需求，强化产品价值传递';
  }
  if (scoreChange <= -10) {
    return '⚠️ 购买意愿明显下降，建议放缓推进节奏，重新探寻客户顾虑所在';
  }
  if (scoreChange <= -5) {
    return '📉 购买意愿有所回落，暂停激进推销，倾听客户真实反馈';
  }

  switch (level) {
    case 'HOT':
      return '🔥 客户购买意愿强烈！建议立即主动邀约，推动进入采购决策流程';
    case 'WARM':
      return '🌤️ 客户意向良好，继续保持沟通，提供案例和数据增强信任';
    case 'COOL':
      return '🌥️ 客户意向平稳，建议定期分享行业洞察和价值内容进行培育';
    case 'COLD':
      return '❄️ 客户意向较低，降低跟进频率，以内容营销为主维持关系';
  }
}

export function analyzeIntent(
  message: string,
  history: IntentSignal[] = [],
  currentScore: number = INITIAL_INTENT_SCORE
): IntentAnalysisResult {
  const text = message.toLowerCase();
  const newSignals: IntentSignal[] = [];

  for (const pattern of POSITIVE_SIGNAL_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        const confidence = calculateConfidence(text, keyword);
        newSignals.push({
          id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          type: pattern.type,
          category: pattern.category,
          keyword,
          message: pattern.message,
          confidence,
          weight: pattern.weight * confidence,
          timestamp: new Date().toISOString(),
          messageContent: message,
        });
        break;
      }
    }
  }

  for (const pattern of NEGATIVE_SIGNAL_PATTERNS) {
    for (const keyword of pattern.keywords) {
      if (text.includes(keyword.toLowerCase())) {
        const confidence = calculateConfidence(text, keyword);
        newSignals.push({
          id: `sig_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
          type: pattern.type,
          category: pattern.category,
          keyword,
          message: pattern.message,
          confidence,
          weight: pattern.weight * confidence,
          timestamp: new Date().toISOString(),
          messageContent: message,
        });
        break;
      }
    }
  }

  const totalWeightDelta = newSignals.reduce((sum, s) => sum + s.weight, 0);

  const decayFactor = 0.95;
  const baseScore = currentScore;
  const decayedBase = baseScore * decayFactor;

  let newScore = decayedBase + totalWeightDelta;
  newScore = Math.max(0, Math.min(100, newScore));

  const scoreChange = Math.round((newScore - currentScore) * 10) / 10;
  const level = getIntentLevel(newScore);

  const positiveCount = newSignals.filter((s) => s.type === 'POSITIVE').length;
  const negativeCount = newSignals.filter((s) => s.type === 'NEGATIVE').length;

  let summary = '暂无明显信号波动';
  if (positiveCount > 0 && negativeCount === 0) {
    summary = `检测到 ${positiveCount} 个正向信号，客户兴趣度上升`;
  } else if (negativeCount > 0 && positiveCount === 0) {
    summary = `检测到 ${negativeCount} 个负向信号，需关注客户态度变化`;
  } else if (positiveCount > 0 && negativeCount > 0) {
    summary = `检测到 ${positiveCount} 个正向信号和 ${negativeCount} 个负向信号，客户态度复杂`;
  }

  const recommendation = getIntentRecommendation(level, scoreChange);

  return {
    signals: newSignals,
    intentScore: Math.round(newScore),
    scoreChange,
    summary,
    recommendation,
    positiveCount,
    negativeCount,
  };
}

function calculateConfidence(text: string, keyword: string): number {
  const keywordLower = keyword.toLowerCase();
  const textLower = text.toLowerCase();

  let confidence = 0.6;

  if (textLower.startsWith(keywordLower) || textLower.endsWith(keywordLower)) {
    confidence += 0.1;
  }

  const contextBoosters = ['请问', '想了解', '咨询', '了解一下', '关心', '想知道', '麻烦问', '能不能'];
  for (const booster of contextBoosters) {
    if (textLower.includes(booster)) {
      confidence += 0.1;
      break;
    }
  }

  if (textLower.length < 20) {
    confidence += 0.1;
  }

  const contextWeakeners = ['如果', '假设', '比如', '举个例子', '随便问问', '只是问问'];
  for (const weakener of contextWeakeners) {
    if (textLower.includes(weakener)) {
      confidence -= 0.15;
      break;
    }
  }

  return Math.max(0.3, Math.min(1, confidence));
}

export function aggregateSignals(history: IntentSignal[]): {
  byCategory: Record<SignalCategory, number>;
  positiveTotal: number;
  negativeTotal: number;
} {
  const byCategory = {} as Record<SignalCategory, number>;
  let positiveTotal = 0;
  let negativeTotal = 0;

  for (const signal of history) {
    if (!byCategory[signal.category]) byCategory[signal.category] = 0;
    byCategory[signal.category] += 1;

    if (signal.type === 'POSITIVE') positiveTotal++;
    else negativeTotal++;
  }

  return { byCategory, positiveTotal, negativeTotal };
}

export const SIGNAL_CATEGORY_LABELS: Record<SignalCategory, string> = {
  PRICE_INQUIRY: '价格询问',
  IMPLEMENTATION_TIMELINE: '实施周期',
  DECISION_PROCESS: '决策流程',
  PRODUCT_DETAIL: '产品细节',
  COMPETITOR_COMPARISON: '竞品对比',
  SUCCESS_CASE: '成功案例',
  TRIAL_DEMO: '试用/演示',
  BUDGET_POSITIVE: '预算积极',
  URGENCY: '紧迫性',
  REJECTION: '明确拒绝',
  BUDGET_EXHAUSTED: '预算不足',
  TIMING_NOT_RIGHT: '时机不对',
  NO_AUTHORITY: '无决策权',
  SATISFIED_WITH_CURRENT: '满意现状',
  COMPETITOR_PREFERENCE: '倾向竞品',
  TOO_EXPENSIVE: '价格过高',
  NEEDS_MORE_TIME: '需要更多时间',
};
