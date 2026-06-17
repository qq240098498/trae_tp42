export const WEIGHTS = {
  industry: 0.15,
  scenario: 0.25,
  budget: 0.30,
  timeline: 0.30,
} as const;

export type Grade = 'A' | 'B' | 'C' | 'D';

export interface IndustryScoreInput {
  industry: string;
}

export interface ScenarioScoreInput {
  scenario: string;
  painPoints: string[];
}

export interface BudgetScoreInput {
  budget: number;
  budgetRange?: 'low' | 'medium' | 'high' | 'enterprise';
}

export interface TimelineScoreInput {
  timeline: 'urgent' | 'short' | 'medium' | 'long';
  timelineDays?: number;
}

export interface LeadScoreResult {
  industryScore: number;
  scenarioScore: number;
  budgetScore: number;
  timelineScore: number;
  totalScore: number;
  grade: Grade;
  breakdown: {
    category: string;
    weight: number;
    rawScore: number;
    weightedScore: number;
  }[];
}

const HIGH_VALUE_INDUSTRIES = [
  '金融', '银行', '保险', '证券', '基金',
  '医疗', '医院', '医药', '健康',
  '能源', '电力', '石油', '石化',
  '政府', '政务', '军工', '央企', '国企',
  '制造', '汽车', '航空', '航天',
];

const MEDIUM_VALUE_INDUSTRIES = [
  '电商', '零售', '物流', '供应链',
  '教育', '培训',
  '房地产', '建筑',
  '传媒', '广告', '营销',
  '互联网', '科技', '软件', 'SaaS',
];

const HIGH_PRIORITY_SCENARIOS = [
  '数字化转型', '系统升级', '核心系统', '业务增长',
  '降本增效', '合规要求', '安全加固', '风险管控',
  '客户增长', '收入提升', '利润优化',
];

const MEDIUM_PRIORITY_SCENARIOS = [
  '效率提升', '流程优化', '自动化', '数据分析',
  '用户体验', '客户服务', '运维管理',
];

export function scoreIndustry(input: IndustryScoreInput): number {
  if (!input.industry || input.industry.trim() === '') return 30;

  const industryLower = input.industry.toLowerCase();

  for (const keyword of HIGH_VALUE_INDUSTRIES) {
    if (industryLower.includes(keyword.toLowerCase())) {
      return 100;
    }
  }

  for (const keyword of MEDIUM_VALUE_INDUSTRIES) {
    if (industryLower.includes(keyword.toLowerCase())) {
      return 70;
    }
  }

  return 50;
}

export function scoreScenario(input: ScenarioScoreInput): number {
  if (!input.scenario && (!input.painPoints || input.painPoints.length === 0)) {
    return 30;
  }

  let score = 40;
  const scenarioLower = input.scenario?.toLowerCase() || '';
  const allText = scenarioLower + ' ' + (input.painPoints?.join(' ').toLowerCase() || '');

  for (const keyword of HIGH_PRIORITY_SCENARIOS) {
    if (allText.includes(keyword.toLowerCase())) {
      score += 25;
      break;
    }
  }

  for (const keyword of MEDIUM_PRIORITY_SCENARIOS) {
    if (allText.includes(keyword.toLowerCase())) {
      score += 15;
      break;
    }
  }

  if (input.painPoints && input.painPoints.length >= 3) {
    score += 10;
  } else if (input.painPoints && input.painPoints.length >= 1) {
    score += 5;
  }

  if (scenarioLower.includes('紧急') || scenarioLower.includes('迫切') || scenarioLower.includes('立即')) {
    score += 10;
  }

  return Math.min(100, score);
}

export function scoreBudget(input: BudgetScoreInput): number {
  if (input.budgetRange) {
    switch (input.budgetRange) {
      case 'enterprise': return 100;
      case 'high': return 85;
      case 'medium': return 60;
      case 'low': return 30;
    }
  }

  const budget = input.budget;

  if (budget <= 0) return 20;
  if (budget >= 1000000) return 100;
  if (budget >= 500000) return 90;
  if (budget >= 200000) return 80;
  if (budget >= 100000) return 70;
  if (budget >= 50000) return 55;
  if (budget >= 20000) return 40;
  if (budget >= 10000) return 30;
  return 20;
}

export function scoreTimeline(input: TimelineScoreInput): number {
  if (input.timelineDays !== undefined && input.timelineDays > 0) {
    const days = input.timelineDays;
    if (days <= 7) return 100;
    if (days <= 30) return 90;
    if (days <= 90) return 70;
    if (days <= 180) return 50;
    return 30;
  }

  switch (input.timeline) {
    case 'urgent': return 100;
    case 'short': return 80;
    case 'medium': return 55;
    case 'long': return 30;
    default: return 40;
  }
}

export function calculateTotalScore(
  industryScore: number,
  scenarioScore: number,
  budgetScore: number,
  timelineScore: number
): { totalScore: number; breakdown: LeadScoreResult['breakdown'] } {
  const weightedIndustry = industryScore * WEIGHTS.industry;
  const weightedScenario = scenarioScore * WEIGHTS.scenario;
  const weightedBudget = budgetScore * WEIGHTS.budget;
  const weightedTimeline = timelineScore * WEIGHTS.timeline;

  const totalScore = weightedIndustry + weightedScenario + weightedBudget + weightedTimeline;

  const breakdown: LeadScoreResult['breakdown'] = [
    { category: '行业', weight: WEIGHTS.industry, rawScore: industryScore, weightedScore: weightedIndustry },
    { category: '场景', weight: WEIGHTS.scenario, rawScore: scenarioScore, weightedScore: weightedScenario },
    { category: '预算', weight: WEIGHTS.budget, rawScore: budgetScore, weightedScore: weightedBudget },
    { category: '时间线', weight: WEIGHTS.timeline, rawScore: timelineScore, weightedScore: weightedTimeline },
  ];

  return { totalScore: Math.round(totalScore * 100) / 100, breakdown };
}

export function calculateGrade(totalScore: number): Grade {
  if (totalScore >= 80) return 'A';
  if (totalScore >= 60) return 'B';
  if (totalScore >= 40) return 'C';
  return 'D';
}

export function evaluateLead(
  industry: string,
  scenario: string,
  painPoints: string[],
  budget: number,
  timeline: TimelineScoreInput['timeline'],
  options?: {
    budgetRange?: BudgetScoreInput['budgetRange'];
    timelineDays?: number;
  }
): LeadScoreResult {
  const industryScore = scoreIndustry({ industry });
  const scenarioScore = scoreScenario({ scenario, painPoints });
  const budgetScore = scoreBudget({ budget, budgetRange: options?.budgetRange });
  const timelineScore = scoreTimeline({ timeline, timelineDays: options?.timelineDays });

  const { totalScore, breakdown } = calculateTotalScore(
    industryScore,
    scenarioScore,
    budgetScore,
    timelineScore
  );

  const grade = calculateGrade(totalScore);

  return {
    industryScore,
    scenarioScore,
    budgetScore,
    timelineScore,
    totalScore,
    grade,
    breakdown,
  };
}
