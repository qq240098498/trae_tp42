import type { Industry, IndustryPainPoint, IndustryCase } from '@/data/industries';
import {
  industries,
  getIndustryById,
  getIndustryByName,
  detectIndustryFromText,
} from '@/data/industries';

export interface TemplateVariables {
  name?: string;
  company?: string;
  industry?: string;
  ourCompany?: string;
  salesName?: string;
  referrerName?: string;
  activityName?: string;
  contentName?: string;
  businessArea?: string;
  topic?: string;
  example?: string;
  metric?: string;
  competitor?: string;
  acknowledge?: string;
  dimension1?: string;
  advantage1?: string;
  weakness1?: string;
  dimension2?: string;
  advantage2?: string;
  weakness2?: string;
  dimension3?: string;
  advantage3?: string;
  value?: string;
  range?: string;
  size?: string;
  day?: string;
  time?: string;
  stakeholder?: string;
  example1?: string;
  example2?: string;
  [key: string]: string | undefined;
}

export interface IndustryAdaptedContent {
  industry: Industry | null;
  greeting: string;
  painPointLeadIn: string;
  valueProposition: string;
  closing: string;
  keyTerms: string[];
  painPoints: IndustryPainPoint[];
  cases: IndustryCase[];
  suggestedScenarios: string[];
}

export function fillTemplate(template: string, variables: TemplateVariables = {}): string {
  let result = template;
  Object.entries(variables).forEach(([key, value]) => {
    if (value !== undefined) {
      result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
  });
  return result;
}

export function detectIndustry(
  text: string,
  existingIndustryId?: string
): Industry | null {
  if (existingIndustryId) {
    const industry = getIndustryById(existingIndustryId);
    if (industry) return industry;
  }

  const detected = detectIndustryFromText(text);
  if (detected) return detected;

  return null;
}

export function getIndustryAdapter(
  industryIdOrName?: string
): Industry | null {
  if (!industryIdOrName) return null;

  const byId = getIndustryById(industryIdOrName);
  if (byId) return byId;

  const byName = getIndustryByName(industryIdOrName);
  if (byName) return byName;

  return null;
}

export function adaptIndustryContent(
  industry: Industry | null,
  variables: TemplateVariables = {}
): IndustryAdaptedContent {
  if (!industry) {
    return {
      industry: null,
      greeting: '',
      painPointLeadIn: '',
      valueProposition: '',
      closing: '',
      keyTerms: [],
      painPoints: [],
      cases: [],
      suggestedScenarios: [],
    };
  }

  const defaultVars: TemplateVariables = {
    ...variables,
    example: industry.cases[0]?.company || '您同行业的标杆企业',
    metric: industry.cases[0]?.metrics[0] || '关键业务指标得到显著提升',
  };

  return {
    industry,
    greeting: fillTemplate(industry.scripts.greeting, defaultVars),
    painPointLeadIn: fillTemplate(industry.scripts.painPointLeadIn, defaultVars),
    valueProposition: fillTemplate(industry.scripts.valueProposition, defaultVars),
    closing: fillTemplate(industry.scripts.closing, defaultVars),
    keyTerms: industry.terms.map((t) => t.term),
    painPoints: industry.painPoints,
    cases: industry.cases,
    suggestedScenarios: industry.scenarios,
  };
}

export function generateIndustryGreeting(
  industry: Industry | null,
  variables: TemplateVariables = {}
): string {
  if (!industry) {
    return fillTemplate(
      '{name}总好！非常高兴与您交流。我们专注于为企业提供数字化解决方案，帮助企业实现降本增效和业务增长。想先了解一下贵公司目前在数字化方面有什么规划和需求？',
      variables
    );
  }
  return adaptIndustryContent(industry, variables).greeting;
}

export function generateIndustryPainPointQuestion(
  industry: Industry | null,
  variables: TemplateVariables = {}
): string {
  if (!industry) {
    return '想了解一下，贵公司目前在业务运营过程中，有没有遇到什么特别突出的痛点或挑战？比如效率、成本、数据、协同方面的？';
  }
  return adaptIndustryContent(industry, variables).painPointLeadIn;
}

export function generateIndustryValueProposition(
  industry: Industry | null,
  variables: TemplateVariables = {}
): string {
  if (!industry) {
    return '我们的核心优势在于帮助企业实现全链路数字化管理，从销售、营销到服务，从数据采集到智能决策，全方位提升运营效率和业绩增长。';
  }
  return adaptIndustryContent(industry, variables).valueProposition;
}

export function generateIndustryClosing(
  industry: Industry | null,
  variables: TemplateVariables = {}
): string {
  if (!industry) {
    return '很多类似规模的企业用了我们的方案后，在效率提升和成本降低方面都取得了不错的效果。您方便的话，我可以发一些相关资料给您参考？';
  }
  return adaptIndustryContent(industry, variables).closing;
}

export function getIndustryPainPoints(
  industry: Industry | null,
  severity?: 'critical' | 'high' | 'medium'
): IndustryPainPoint[] {
  if (!industry) return [];
  if (!severity) return industry.painPoints;
  return industry.painPoints.filter((p) => p.severity === severity);
}

export function getTopIndustryPainPoints(
  industry: Industry | null,
  topN: number = 3
): IndustryPainPoint[] {
  if (!industry) return [];
  const severityOrder: Record<string, number> = { critical: 0, high: 1, medium: 2 };
  return [...industry.painPoints]
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])
    .slice(0, topN);
}

export function getIndustryCases(
  industry: Industry | null,
  count: number = 3
): IndustryCase[] {
  if (!industry) return [];
  return industry.cases.slice(0, count);
}

export function getSuggestedScenarios(
  industry: Industry | null
): string[] {
  if (!industry) return [];
  return industry.scenarios;
}

export function getPainPointSuggestedResponses(
  industry: Industry | null
): string[] {
  if (!industry) {
    return ['效率低/人工操作多', '数据孤岛/无法打通', '成本高/ROI不清晰', '协同效率低'];
  }
  return getTopIndustryPainPoints(industry, 4).map((p) => p.name);
}

export function getScenarioSuggestedResponses(
  industry: Industry | null
): string[] {
  if (!industry) {
    return ['系统升级/数字化转型', '降本增效/流程优化', '客户增长/营销获客', '数据分析/智能决策'];
  }
  return industry.scenarios.slice(0, 4);
}

export function injectIndustryTerms(
  text: string,
  industry: Industry | null
): string {
  if (!industry || industry.terms.length === 0) return text;
  let result = text;
  industry.terms.slice(0, 2).forEach((term) => {
    if (!result.includes(term.term.split('（')[0])) {
      result = result + ` （参考行业术语：${term.term}）`;
    }
  });
  return result;
}

export function buildIndustryAwareScript(
  template: string,
  industry: Industry | null,
  variables: TemplateVariables = {}
): string {
  let script = fillTemplate(template, variables);

  if (industry) {
    if (variables.name && !script.includes(variables.name)) {
      script = script.replace('您好', `${variables.name}总好！`);
    }

    const topCase = industry.cases[0];
    if (topCase && !script.includes(topCase.company)) {
      script = script + ` 像${topCase.company}就是用了我们的方案，实现了${topCase.metrics[0]}。`;
    }
  }

  return script;
}

export {
  industries,
  getIndustryById,
  getIndustryByName,
  detectIndustryFromText,
};

export type { Industry };
