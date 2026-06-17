import type { Competitor, ComparisonMetric, ComparisonSummary } from '@/data/competitors';
import { competitors, detectCompetitorsFromText, findCompetitorByKeyword } from '@/data/competitors';
import type { Industry } from '@/data/industries';
import {
  getIndustryAdapter,
  getIndustryCases,
  getTopIndustryPainPoints,
} from './industryAdapter';

export interface ScriptGenerationOptions {
  sentiment?: 'positive' | 'negative' | 'neutral';
  emphasizeDimensions?: ('功能覆盖' | '性能指标' | '价格区间' | '服务保障')[];
  style?: 'aggressive' | 'balanced' | 'humble';
  includeEvidence?: boolean;
  maxDimensions?: number;
  industryId?: string;
  industryName?: string;
}

export interface GeneratedComparisonScript {
  opening: string;
  dimensionScripts: {
    dimension: string;
    title: string;
    summary: string;
    script: string;
    metrics: ComparisonMetric[];
    keyEvidence?: string[];
  }[];
  closing: string;
  fullScript: string;
  keyTalkingPoints: string[];
  competitorName: string;
  competitorId: string;
  summary: ComparisonSummary;
  industryCases?: {
    company: string;
    result: string;
    metrics: string[];
  }[];
  industryTerms?: string[];
  adaptedIndustry?: Industry | null;
}

export function analyzeCompetitorSentiment(
  userMessage: string,
  competitorName: string
): 'positive' | 'negative' | 'neutral' {
  const messageLower = userMessage.toLowerCase();
  const compLower = competitorName.toLowerCase();

  if (!messageLower.includes(compLower)) return 'neutral';

  const positiveWords = [
    '好', '不错', '优秀', '满意', '喜欢', '推荐', '好用', '稳定',
    '出色', '赞赏', '认可', '信任', '强大', '专业', '优势', '厉害',
    '棒', 'perfect', 'good', 'great', 'excellent', 'nice',
  ];

  const negativeWords = [
    '差', '不好', '糟糕', '不满意', '坑', '慢', '卡', '崩溃',
    '问题', 'bug', '故障', '投诉', '后悔', '贵', '难用', '复杂',
    '服务差', '不响应', '推诿', '扯皮', '不好用', '垃圾', '烂',
    'bad', 'terrible', 'awful', 'slow', 'expensive',
  ];

  const competitorContext = extractCompetitorContext(userMessage, competitorName);

  let positiveScore = 0;
  let negativeScore = 0;

  for (const word of positiveWords) {
    if (competitorContext.includes(word.toLowerCase())) positiveScore++;
  }

  for (const word of negativeWords) {
    if (competitorContext.includes(word.toLowerCase())) negativeScore++;
  }

  if (negativeScore > positiveScore) return 'negative';
  if (positiveScore > negativeScore) return 'positive';
  return 'neutral';
}

function extractCompetitorContext(message: string, competitorName: string): string {
  const lowerMessage = message.toLowerCase();
  const lowerName = competitorName.toLowerCase();
  const index = lowerMessage.indexOf(lowerName);

  if (index === -1) return lowerMessage;

  const start = Math.max(0, index - 30);
  const end = Math.min(message.length, index + competitorName.length + 30);
  return message.substring(start, end).toLowerCase();
}

export function generateComparisonScript(
  competitor: Competitor,
  options: ScriptGenerationOptions = {}
): GeneratedComparisonScript {
  const {
    sentiment = 'neutral',
    emphasizeDimensions,
    style = 'balanced',
    includeEvidence = true,
    maxDimensions = 4,
    industryId,
    industryName,
  } = options;

  const adaptedIndustry: Industry | null = industryId || industryName
    ? getIndustryAdapter(industryId || industryName)
    : null;

  const industryCases = adaptedIndustry ? getIndustryCases(adaptedIndustry, 2) : [];
  const industryTerms = adaptedIndustry
    ? adaptedIndustry.terms.slice(0, 4).map((t) => t.term.split('（')[0])
    : [];
  const industryPainPoints = adaptedIndustry
    ? getTopIndustryPainPoints(adaptedIndustry, 3).map((p) => p.name)
    : [];

  const industryTag = adaptedIndustry ? `特别是在${adaptedIndustry.name}行业，` : '';

  let opening = '';
  switch (sentiment) {
    case 'positive':
      opening = `您提到的${competitor.name}确实是${competitor.category}领域非常优秀的厂商，在业内有很高的知名度，我们非常尊重这样的竞争对手。您觉得它哪些方面做得不错呢？同时也请允许我从几个客观的维度，为您做一个对比参考：`;
      break;
    case 'negative':
      opening = `非常理解您的感受，${competitor.name}在某些方面可能确实没有达到您的预期。其实每家产品都有自己的定位和专长，${competitor.name}的定位是"${competitor.positioning}"，可能在某些场景下和您的需求匹配度不够高。让我从几个维度为您做个客观对比，方便您参考选择：`;
      break;
    default:
      opening = adaptedIndustry
        ? `您提到的${competitor.name}确实是${competitor.category}领域有影响力的厂商，定位是"${competitor.positioning}"，主要服务于${competitor.targetCustomer}这类客户群体。${industryTag}我们服务了多家${adaptedIndustry.name}企业，对您提到的${industryPainPoints.slice(0, 2).join('、')}等行业痛点有非常成熟的解决方案。下面我从功能覆盖、性能指标、价格区间、服务保障这四个核心维度，为您做一个客观的对比分析：`
        : `您提到的${competitor.name}确实是${competitor.category}领域有影响力的厂商，定位是"${competitor.positioning}"，主要服务于${competitor.targetCustomer}这类客户群体。我们理解您会多方对比考量，这是非常明智的做法。下面我从功能覆盖、性能指标、价格区间、服务保障这四个核心维度，为您做一个客观的对比分析：`;
  }

  let dimensions = [...competitor.comparisonMatrix];
  
  if (emphasizeDimensions && emphasizeDimensions.length > 0) {
    dimensions.sort((a, b) => {
      const aPriority = emphasizeDimensions.indexOf(a.dimension);
      const bPriority = emphasizeDimensions.indexOf(b.dimension);
      if (aPriority === -1 && bPriority === -1) return 0;
      if (aPriority === -1) return 1;
      if (bPriority === -1) return -1;
      return aPriority - bPriority;
    });
  }

  dimensions = dimensions.slice(0, maxDimensions);

  const dimensionScripts = dimensions.map((dim) => {
    let script = '';
    switch (style) {
      case 'aggressive':
        script = dim.advantageScript;
        break;
      case 'humble':
        script = dim.neutralScript;
        break;
      default:
        script = `${dim.neutralScript}\n\n具体来说，${dim.advantageScript}`;
    }

    const keyEvidence: string[] = [];
    if (includeEvidence) {
      dim.metrics.forEach((metric) => {
        if (metric.evidence && metric.ourScore > metric.competitorScore) {
          keyEvidence.push(metric.evidence);
        }
      });
    }

    return {
      dimension: dim.dimension,
      title: dim.title,
      summary: dim.summary,
      script,
      metrics: dim.metrics,
      keyEvidence: keyEvidence.slice(0, 2),
    };
  });

  const topAdvantages = dimensionScripts
    .flatMap((ds) => ds.metrics.filter((m) => m.ourScore - m.competitorScore >= 20))
    .slice(0, 3)
    .map((m) => `${m.label}：${m.ourValue}`);

  const keyTalkingPoints: string[] = [];
  dimensionScripts.forEach((ds) => {
    const topMetric = [...ds.metrics].sort((a, b) => (b.ourScore - b.competitorScore) - (a.ourScore - a.competitorScore))[0];
    if (topMetric && topMetric.ourScore > topMetric.competitorScore) {
      keyTalkingPoints.push(`${ds.dimension}：${topMetric.label}领先（我方${topMetric.ourScore}分 vs 对方${topMetric.competitorScore}分）`);
    }
  });

  const industryCaseIntro = industryCases.length > 0
    ? `\n\n🏆 ${adaptedIndustry?.name || ''}行业成功案例：${industryCases.map((c) => `${c.company}（${c.metrics[0]}）`).join('、')}。这些同行业客户的实践经验，也能为您提供直接参考。`
    : '';

  let closing = '';
  switch (style) {
    case 'humble':
      closing = `以上就是我们和${competitor.name}的一些客观对比。其实${competitor.name}也是一家非常值得尊敬的公司，每家产品都有自己的优势领域。关键还是看哪款产品更能匹配您的实际需求。${adaptedIndustry ? `特别是针对${adaptedIndustry.name}行业，我们有专门的行业解决方案团队。` : ''}如果您方便的话，我可以根据您的具体业务场景，为您做更有针对性的方案演示，您看什么时候合适呢？${industryCaseIntro}`;
      break;
    case 'aggressive':
      closing = `综合来看，在${topAdvantages.join('、')}等方面，我们都有明显的优势。更重要的是，我们有${competitor.customerReferences?.map(c => `${c.count}${c.industry}客户`).join('、')}的成功实践${adaptedIndustry ? `，其中${adaptedIndustry.name}行业就服务了${industryCases[0]?.company || '多家标杆企业'}` : ''}，产品经过了大量客户的实战检验。如果您感兴趣，我可以马上为您安排产品演示和客户案例分享，帮您做更深入的评估。${industryCaseIntro}`;
      break;
    default:
      closing = `总结一下，${competitor.name}在它的优势领域确实表现出色，而我们的核心优势在于${keyTalkingPoints.slice(0, 2).join('；')}。选择哪款产品，关键还是看哪个更匹配您的业务现状和发展规划。${adaptedIndustry ? `针对${adaptedIndustry.name}行业，我们已经沉淀了成熟的行业最佳实践。` : ''}我可以为您详细展示一下具体的对比案例和客户证言，或者安排一次针对性的产品演示，方便您做更深入的评估，您看哪种方式更方便呢？${industryCaseIntro}`;
  }

  const fullScript = [
    opening,
    '',
    ...dimensionScripts.map((ds) => `【${ds.title}】\n${ds.script}${ds.keyEvidence && ds.keyEvidence.length > 0 ? `\n📊 数据支撑：${ds.keyEvidence.join('；')}` : ''}`),
    '',
    closing,
  ].join('\n');

  return {
    opening,
    dimensionScripts,
    closing,
    fullScript,
    keyTalkingPoints: keyTalkingPoints.slice(0, 4),
    competitorName: competitor.name,
    competitorId: competitor.id,
    summary: competitor.comparisonSummary,
    industryCases: industryCases.length > 0 ? industryCases : undefined,
    industryTerms: industryTerms.length > 0 ? industryTerms : undefined,
    adaptedIndustry,
  };
}

export function handleCompetitorMention(
  userMessage: string,
  options: Omit<ScriptGenerationOptions, 'sentiment'> = {}
): {
  detected: boolean;
  competitors: Competitor[];
  scripts: GeneratedComparisonScript[];
} {
  const detectedCompetitors = detectCompetitorsFromText(userMessage);

  if (detectedCompetitors.length === 0) {
    return { detected: false, competitors: [], scripts: [] };
  }

  const scripts = detectedCompetitors.map((comp) => {
    const sentiment = analyzeCompetitorSentiment(userMessage, comp.name);
    return generateComparisonScript(comp, { ...options, sentiment, style: 'balanced' });
  });

  return {
    detected: true,
    competitors: detectedCompetitors,
    scripts,
  };
}

export function getCompetitorById(id: string): Competitor | undefined {
  return competitors.find((c) => c.id === id);
}

export function getCompetitorByName(name: string): Competitor | undefined {
  return findCompetitorByKeyword(name);
}

export function getAllCompetitors(): Competitor[] {
  return competitors;
}

export function calculateOverallScore(competitor: Competitor): {
  ourScore: number;
  competitorScore: number;
  dimensionScores: Record<string, { our: number; theirs: number }>;
} {
  const dimensionScores: Record<string, { our: number; theirs: number }> = {};
  let totalOur = 0;
  let totalTheirs = 0;
  let dimCount = 0;

  competitor.comparisonMatrix.forEach((dim) => {
    let ourDimSum = 0;
    let theirDimSum = 0;
    dim.metrics.forEach((metric) => {
      ourDimSum += metric.ourScore;
      theirDimSum += metric.competitorScore;
    });
    const ourDimAvg = dim.metrics.length > 0 ? ourDimSum / dim.metrics.length : 0;
    const theirDimAvg = dim.metrics.length > 0 ? theirDimSum / dim.metrics.length : 0;
    
    dimensionScores[dim.dimension] = { our: Math.round(ourDimAvg), theirs: Math.round(theirDimAvg) };
    totalOur += ourDimAvg;
    totalTheirs += theirDimAvg;
    dimCount++;
  });

  return {
    ourScore: dimCount > 0 ? Math.round(totalOur / dimCount) : 0,
    competitorScore: dimCount > 0 ? Math.round(totalTheirs / dimCount) : 0,
    dimensionScores,
  };
}

export { competitors, detectCompetitorsFromText, findCompetitorByKeyword };
