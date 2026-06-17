export const RECOMMENDER_WEIGHTS = {
  industry: 0.40,
  scenario: 0.35,
  budget: 0.25,
} as const;

export interface Product {
  id: string;
  name: string;
  description: string;
  industryTags: string[];
  scenarioTags: string[];
  priceMin: number;
  priceMax: number;
  features: string[];
  imageUrl?: string;
}

export interface RecommendationInput {
  industry: string;
  scenario: string;
  painPoints: string[];
  budget: number;
}

export interface ProductMatchResult {
  product: Product;
  industryScore: number;
  scenarioScore: number;
  budgetScore: number;
  totalScore: number;
  matchReasons: string[];
}

export function calculateIndustryMatch(product: Product, industry: string): number {
  if (!industry || industry.trim() === '') return 30;

  const industryLower = industry.toLowerCase();
  const productTags = product.industryTags.map(t => t.toLowerCase());

  for (const tag of productTags) {
    if (tag === industryLower) return 100;
  }

  for (const tag of productTags) {
    if (industryLower.includes(tag) || tag.includes(industryLower)) return 80;
  }

  if (productTags.length === 0) return 50;

  return 20;
}

export function calculateScenarioMatch(
  product: Product,
  scenario: string,
  painPoints: string[]
): { score: number; reasons: string[] } {
  const reasons: string[] = [];

  if (!scenario && (!painPoints || painPoints.length === 0)) {
    return { score: 30, reasons };
  }

  let score = 30;
  const scenarioLower = scenario?.toLowerCase() || '';
  const painPointsLower = (painPoints || []).map(p => p.toLowerCase());
  const allUserText = scenarioLower + ' ' + painPointsLower.join(' ');
  const productTags = product.scenarioTags.map(t => t.toLowerCase());

  let matchedTags: string[] = [];

  for (const tag of productTags) {
    if (allUserText.includes(tag)) {
      matchedTags.push(tag);
    }
  }

  if (matchedTags.length >= 3) {
    score = 100;
    reasons.push(`完美匹配${matchedTags.length}个场景标签`);
  } else if (matchedTags.length === 2) {
    score = 85;
    reasons.push(`匹配${matchedTags.length}个核心场景`);
  } else if (matchedTags.length === 1) {
    score = 65;
    reasons.push(`匹配场景：${matchedTags[0]}`);
  }

  const featureHits = product.features.filter(f =>
    painPointsLower.some(pp => f.toLowerCase().includes(pp) || pp.includes(f.toLowerCase()))
  );

  if (featureHits.length >= 2) {
    score = Math.min(100, score + 15);
    reasons.push(`可解决${featureHits.length}个核心痛点`);
  } else if (featureHits.length === 1) {
    score = Math.min(100, score + 8);
    reasons.push(`能解决痛点：${featureHits[0]}`);
  }

  if (productTags.length === 0) {
    score = Math.max(score, 40);
  }

  return { score, reasons };
}

export function calculateBudgetMatch(product: Product, budget: number): { score: number; reason?: string } {
  if (budget <= 0) {
    return { score: 40, reason: '预算未明确，产品方案可供参考' };
  }

  const { priceMin, priceMax } = product;

  if (budget >= priceMin && budget <= priceMax) {
    return { score: 100, reason: `预算${formatCurrency(budget)}在产品价格区间内` };
  }

  if (budget > priceMax) {
    const ratio = priceMax / budget;
    if (ratio >= 0.7) {
      return { score: 85, reason: `预算充足，可选择高阶配置方案` };
    } else if (ratio >= 0.5) {
      return { score: 70, reason: `预算充足，可搭配增值服务` };
    }
    return { score: 60, reason: `预算高于产品定价，可定制企业方案` };
  }

  const ratio = budget / priceMin;
  if (ratio >= 0.8) {
    return { score: 55, reason: `接近预算，可申请优惠方案` };
  } else if (ratio >= 0.5) {
    return { score: 40, reason: `预算略低，可考虑基础版本` };
  }
  return { score: 20, reason: `预算偏低，建议先了解产品价值` };
}

function formatCurrency(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return `${amount}元`;
}

export function calculateProductMatch(
  product: Product,
  input: RecommendationInput
): ProductMatchResult {
  const industryScore = calculateIndustryMatch(product, input.industry);
  const { score: scenarioScore, reasons: scenarioReasons } = calculateScenarioMatch(
    product,
    input.scenario,
    input.painPoints
  );
  const { score: budgetScore, reason: budgetReason } = calculateBudgetMatch(product, input.budget);

  const weightedIndustry = industryScore * RECOMMENDER_WEIGHTS.industry;
  const weightedScenario = scenarioScore * RECOMMENDER_WEIGHTS.scenario;
  const weightedBudget = budgetScore * RECOMMENDER_WEIGHTS.budget;

  const totalScore = Math.round((weightedIndustry + weightedScenario + weightedBudget) * 100) / 100;

  const matchReasons: string[] = [...scenarioReasons];
  if (budgetReason) matchReasons.push(budgetReason);

  if (industryScore >= 80) {
    matchReasons.unshift(`适用于${input.industry}行业`);
  }

  return {
    product,
    industryScore,
    scenarioScore,
    budgetScore,
    totalScore,
    matchReasons,
  };
}

export function getTopRecommendations(
  products: Product[],
  input: RecommendationInput,
  topN: number = 3
): ProductMatchResult[] {
  const results = products.map(product => calculateProductMatch(product, input));

  results.sort((a, b) => b.totalScore - a.totalScore);

  return results.slice(0, topN);
}

export const DEFAULT_PRODUCT_CATALOG: Product[] = [
  {
    id: 'prod-001',
    name: '企业数字化中台旗舰版',
    description: '面向大型企业的全栈数字化转型解决方案，覆盖业务全流程',
    industryTags: ['金融', '银行', '保险', '制造', '汽车', '能源', '电力', '政府', '央企', '国企'],
    scenarioTags: ['数字化转型', '系统升级', '核心系统', '降本增效', '流程优化', '自动化'],
    priceMin: 500000,
    priceMax: 2000000,
    features: ['微服务架构', '数据中台', '智能分析', '高可用部署', '定制开发'],
  },
  {
    id: 'prod-002',
    name: '智能客户增长平台',
    description: '全渠道客户获取与转化系统，驱动业绩可持续增长',
    industryTags: ['电商', '零售', '教育', '培训', '传媒', '广告', '营销', '互联网', 'SaaS'],
    scenarioTags: ['客户增长', '收入提升', '用户体验', '客户服务', '数据分析', '营销自动化'],
    priceMin: 100000,
    priceMax: 500000,
    features: ['精准获客', '用户画像', '智能推荐', 'A/B测试', '转化漏斗分析'],
  },
  {
    id: 'prod-003',
    name: '安全合规管控系统',
    description: '企业级数据安全与合规审计平台，满足监管要求',
    industryTags: ['金融', '银行', '保险', '证券', '基金', '医疗', '医院', '医药', '政府', '政务', '军工'],
    scenarioTags: ['安全加固', '合规要求', '风险管控', '数据治理', '审计'],
    priceMin: 200000,
    priceMax: 800000,
    features: ['数据加密', '访问控制', '合规审计', '风险预警', '漏洞扫描'],
  },
  {
    id: 'prod-004',
    name: '智慧供应链协同平台',
    description: '端到端供应链可视化与智能协同，提升运营效率',
    industryTags: ['制造', '汽车', '零售', '物流', '供应链', '电商', '能源', '石化'],
    scenarioTags: ['降本增效', '流程优化', '自动化', '供应链协同', '库存优化'],
    priceMin: 150000,
    priceMax: 600000,
    features: ['需求预测', '库存管理', '物流追踪', '供应商协同', '智能调度'],
  },
  {
    id: 'prod-005',
    name: '数据智能决策系统',
    description: '基于AI的商业智能与决策分析平台，驱动业务增长',
    industryTags: ['金融', '电商', '零售', '互联网', 'SaaS', '教育', '传媒', '制造'],
    scenarioTags: ['数据分析', '业务增长', '利润优化', '智能决策', 'BI'],
    priceMin: 80000,
    priceMax: 350000,
    features: ['数据可视化', 'AI预测', '报表自动化', '多维度分析', '实时监控'],
  },
  {
    id: 'prod-006',
    name: '云端协同办公套件',
    description: '一体化企业协作与效率工具，提升团队生产力',
    industryTags: ['互联网', '科技', '软件', 'SaaS', '教育', '培训', '传媒', '广告', '房地产'],
    scenarioTags: ['效率提升', '流程优化', '自动化', '协作', '运维管理'],
    priceMin: 30000,
    priceMax: 150000,
    features: ['即时通讯', '文档协作', '项目管理', '审批流', '知识库'],
  },
  {
    id: 'prod-007',
    name: '医疗健康信息化平台',
    description: '面向医疗机构的数字化运营与患者服务系统',
    industryTags: ['医疗', '医院', '医药', '健康'],
    scenarioTags: ['数字化转型', '系统升级', '患者服务', '效率提升', '合规要求'],
    priceMin: 300000,
    priceMax: 1200000,
    features: ['HIS系统', '电子病历', '预约挂号', '智能诊断', '医保对接'],
  },
  {
    id: 'prod-008',
    name: '智慧政务服务平台',
    description: '一站式政务服务与城市治理数字化解决方案',
    industryTags: ['政府', '政务', '央企', '国企'],
    scenarioTags: ['数字化转型', '政务服务', '流程优化', '合规要求', '数据治理'],
    priceMin: 400000,
    priceMax: 1500000,
    features: ['一网通办', '审批服务', '数据共享', '智慧城市', '监督考核'],
  },
];
