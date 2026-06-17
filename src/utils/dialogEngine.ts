import { Grade, TimelineScoreInput } from './leadScoring';
import type { Industry } from '@/data/industries';
import {
  getIndustryAdapter,
  generateIndustryGreeting,
  generateIndustryPainPointQuestion,
  getPainPointSuggestedResponses,
  getScenarioSuggestedResponses,
  detectIndustryFromText,
} from './industryAdapter';

export type DialogState =
  | 'GREETING'
  | 'ASK_INDUSTRY'
  | 'ASK_SCENARIO'
  | 'ASK_PAIN_POINTS'
  | 'ASK_BUDGET'
  | 'ASK_TIMELINE'
  | 'RECOMMENDATION'
  | 'INVITATION'
  | 'CLOSING';

export interface LeadProfile {
  industry: string;
  industryId?: string;
  scenario: string;
  painPoints: string[];
  budget: number;
  budgetRange: 'low' | 'medium' | 'high' | 'enterprise';
  timeline: TimelineScoreInput['timeline'];
  timelineDays: number;
  grade: Grade | null;
  totalScore: number;
  competitorMentions: string[];
}

export interface StateQuestion {
  state: DialogState;
  question: string;
  suggestedResponses?: string[];
  isOptional?: boolean;
}

export interface ProcessResult {
  extractedInfo: Partial<LeadProfile>;
  nextQuestion: StateQuestion | null;
  nextState: DialogState;
  shouldShowRecommendation?: boolean;
  shouldShowInvitation?: boolean;
  detectedCompetitors?: string[];
  responseMessage?: string;
  adaptedIndustry?: Industry | null;
}

function buildStateQuestions(industry: Industry | null, leadName?: string): Record<DialogState, StateQuestion> {
  return {
    GREETING: {
      state: 'GREETING',
      question: industry
        ? generateIndustryGreeting(industry, { name: leadName })
        : '您好！我是您的专属智能顾问小鲸，很高兴为您服务。我们专注于为企业提供数字化转型解决方案，请问您怎么称呼？',
      suggestedResponses: ['您好，我是李总', '你好，请介绍一下你们的产品'],
      isOptional: false,
    },
    ASK_INDUSTRY: {
      state: 'ASK_INDUSTRY',
      question: '了解了！为了给您推荐最贴合的方案，请先告诉我，贵公司目前属于哪个行业呢？',
      suggestedResponses: ['金融/银行', '制造/汽车', '医疗/健康', '电商/零售', '互联网/科技', '物流/供应链'],
      isOptional: false,
    },
    ASK_SCENARIO: {
      state: 'ASK_SCENARIO',
      question: industry
        ? `感谢！了解到贵公司是${industry.name}行业，这是一个非常有发展潜力的领域。能请您简单描述一下目前希望通过数字化解决的核心业务场景是什么吗？比如${industry.scenarios.slice(0, 2).join('、')}等？`
        : '感谢！了解了贵公司的行业背景，能请您简单描述一下目前希望通过数字化解决的核心业务场景是什么吗？比如是系统升级、降本增效、还是客户增长？',
      suggestedResponses: getScenarioSuggestedResponses(industry),
      isOptional: false,
    },
    ASK_PAIN_POINTS: {
      state: 'ASK_PAIN_POINTS',
      question: generateIndustryPainPointQuestion(industry),
      suggestedResponses: getPainPointSuggestedResponses(industry),
      isOptional: false,
    },
    ASK_BUDGET: {
      state: 'ASK_BUDGET',
      question: '非常理解这些痛点！为了匹配最合适的产品方案，请问贵公司对此项目大概的预算范围是多少呢？',
      suggestedResponses: ['10万以下', '10-50万', '50-100万', '100-500万', '500万以上'],
      isOptional: false,
    },
    ASK_TIMELINE: {
      state: 'ASK_TIMELINE',
      question: '好的，了解预算了。最后想请教一下，贵公司希望这个项目大概什么时候启动和落地呢？',
      suggestedResponses: ['非常紧急（1个月内）', '近期规划（1-3个月）', '中期规划（3-6个月）', '长期储备（6个月以上）'],
      isOptional: false,
    },
    RECOMMENDATION: {
      state: 'RECOMMENDATION',
      question: industry
        ? `感谢您提供这些宝贵信息！结合您${industry.name}行业的特点和具体需求，我已经为您匹配了最适合的产品方案，这些方案在${industry.scenarios[0] || '业务增长'}方面有非常成熟的行业实践。请查看右侧的推荐卡片，您对哪个方案比较感兴趣，想进一步了解详情吗？`
        : '感谢您提供这些宝贵信息！根据您的情况，我已经为您匹配了最适合的产品方案，请查看右侧的推荐卡片。您对哪个方案比较感兴趣，想进一步了解详情吗？',
      suggestedResponses: ['查看方案详情', '申请产品演示', '对比竞品差异', '预约顾问沟通'],
      isOptional: true,
    },
    INVITATION: {
      state: 'INVITATION',
      question: '根据您的情况，我们非常希望能为您提供进一步的服务。请问您更倾向于以下哪种方式深入了解呢？',
      suggestedResponses: ['预约商务会议', '申请产品演示', '开通免费试用'],
      isOptional: true,
    },
    CLOSING: {
      state: 'CLOSING',
      question: industry
        ? `感谢您的信任！针对您${industry.name}行业的需求，我们已将相关的行业解决方案和标杆案例记录在案，专属顾问将在1个工作日内与您联系确认。请保持电话畅通，期待为您服务！如果有其他问题，随时可以告诉我。`
        : '感谢您的信任！我们已将您的需求记录在案，专属顾问将在1个工作日内与您联系确认。请保持电话畅通，期待为您服务！如果有其他问题，随时可以告诉我。',
      suggestedResponses: ['好的，期待联系', '还有其他问题', '修改需求信息'],
      isOptional: true,
    },
  };
}

const STATE_TRANSITION_ORDER: DialogState[] = [
  'GREETING',
  'ASK_INDUSTRY',
  'ASK_SCENARIO',
  'ASK_PAIN_POINTS',
  'ASK_BUDGET',
  'ASK_TIMELINE',
  'RECOMMENDATION',
  'INVITATION',
  'CLOSING',
];

export class DialogEngine {
  private currentState: DialogState;
  private leadProfile: LeadProfile;
  private stateHistory: DialogState[];
  private leadName?: string;
  private adaptedIndustry: Industry | null = null;

  constructor(initialState: DialogState = 'GREETING', leadName?: string) {
    this.currentState = initialState;
    this.stateHistory = [initialState];
    this.leadName = leadName;
    this.leadProfile = {
      industry: '',
      scenario: '',
      painPoints: [],
      budget: 0,
      budgetRange: 'low',
      timeline: 'medium',
      timelineDays: 0,
      grade: null,
      totalScore: 0,
      competitorMentions: [],
    };
  }

  private refreshAdaptedIndustry(): void {
    const industryName = this.leadProfile.industry;
    const industryId = this.leadProfile.industryId;
    this.adaptedIndustry = getIndustryAdapter(industryId || industryName);
  }

  private getStateQuestions(): Record<DialogState, StateQuestion> {
    this.refreshAdaptedIndustry();
    return buildStateQuestions(this.adaptedIndustry, this.leadName);
  }

  getCurrentState(): DialogState {
    return this.currentState;
  }

  getLeadProfile(): LeadProfile {
    return { ...this.leadProfile };
  }

  getCurrentQuestion(): StateQuestion {
    const questions = this.getStateQuestions();
    return { ...questions[this.currentState] };
  }

  getStateHistory(): DialogState[] {
    return [...this.stateHistory];
  }

  getAdaptedIndustry(): Industry | null {
    this.refreshAdaptedIndustry();
    return this.adaptedIndustry;
  }

  getProgress(): number {
    const currentIndex = STATE_TRANSITION_ORDER.indexOf(this.currentState);
    const totalStates = STATE_TRANSITION_ORDER.length - 1;
    return Math.round((currentIndex / totalStates) * 100);
  }

  getNextQuestion(userAnswer: string): ProcessResult {
    const extraction = this.extractInformation(userAnswer);

    if (extraction.competitors.length > 0) {
      this.leadProfile.competitorMentions = [
        ...new Set([...this.leadProfile.competitorMentions, ...extraction.competitors]),
      ];
    }

    Object.assign(this.leadProfile, extraction.profile);

    if (this.leadProfile.industry) {
      this.refreshAdaptedIndustry();
    }

    const nextState = this.determineNextState();
    this.transitionTo(nextState);

    const shouldShowRecommendation = nextState === 'RECOMMENDATION';
    const shouldShowInvitation = nextState === 'INVITATION';

    const questions = this.getStateQuestions();

    const result: ProcessResult = {
      extractedInfo: extraction.profile,
      nextQuestion: questions[nextState] ? { ...questions[nextState] } : null,
      nextState,
      shouldShowRecommendation,
      shouldShowInvitation,
      detectedCompetitors: extraction.competitors.length > 0 ? extraction.competitors : undefined,
      adaptedIndustry: this.adaptedIndustry,
    };

    if (extraction.acknowledgment) {
      result.responseMessage = extraction.acknowledgment;
    }

    return result;
  }

  skipCurrentState(): ProcessResult {
    const questions = this.getStateQuestions();
    const currentOptional = questions[this.currentState]?.isOptional;

    let nextState: DialogState;

    if (currentOptional) {
      nextState = this.determineNextState();
    } else {
      const currentIndex = STATE_TRANSITION_ORDER.indexOf(this.currentState);
      nextState = STATE_TRANSITION_ORDER[currentIndex + 1] || 'CLOSING';
    }

    this.transitionTo(nextState);
    const nextQuestions = this.getStateQuestions();

    return {
      extractedInfo: {},
      nextQuestion: nextQuestions[nextState] ? { ...nextQuestions[nextState] } : null,
      nextState,
      adaptedIndustry: this.adaptedIndustry,
    };
  }

  goBack(): DialogState | null {
    if (this.stateHistory.length <= 1) return null;

    this.stateHistory.pop();
    this.currentState = this.stateHistory[this.stateHistory.length - 1];
    return this.currentState;
  }

  setState(state: DialogState): void {
    this.currentState = state;
    if (this.stateHistory[this.stateHistory.length - 1] !== state) {
      this.stateHistory.push(state);
    }
  }

  updateLeadProfile(updates: Partial<LeadProfile>): void {
    this.leadProfile = { ...this.leadProfile, ...updates };
  }

  private transitionTo(nextState: DialogState): void {
    if (this.currentState !== nextState) {
      this.currentState = nextState;
      this.stateHistory.push(nextState);
    }
  }

  private determineNextState(): DialogState {
    const { industry, scenario, painPoints, budget, timeline } = this.leadProfile;

    if (this.currentState === 'GREETING') return 'ASK_INDUSTRY';

    if (this.currentState === 'ASK_INDUSTRY') {
      return industry ? 'ASK_SCENARIO' : 'ASK_INDUSTRY';
    }

    if (this.currentState === 'ASK_SCENARIO') {
      return scenario ? 'ASK_PAIN_POINTS' : 'ASK_SCENARIO';
    }

    if (this.currentState === 'ASK_PAIN_POINTS') {
      return painPoints.length > 0 ? 'ASK_BUDGET' : 'ASK_PAIN_POINTS';
    }

    if (this.currentState === 'ASK_BUDGET') {
      return budget > 0 ? 'ASK_TIMELINE' : 'ASK_BUDGET';
    }

    if (this.currentState === 'ASK_TIMELINE') {
      return timeline ? 'RECOMMENDATION' : 'ASK_TIMELINE';
    }

    if (this.currentState === 'RECOMMENDATION') {
      return 'INVITATION';
    }

    if (this.currentState === 'INVITATION') {
      return 'CLOSING';
    }

    return 'CLOSING';
  }

  private extractInformation(userAnswer: string): {
    profile: Partial<LeadProfile>;
    competitors: string[];
    acknowledgment?: string;
  } {
    const answer = userAnswer.trim();
    const profile: Partial<LeadProfile> = {};
    const competitors: string[] = [];
    let acknowledgment: string | undefined;

    const state = this.currentState;

    switch (state) {
      case 'GREETING':
        acknowledgment = this.parseGreeting(answer);
        break;

      case 'ASK_INDUSTRY': {
        const detectedIndustry = detectIndustryFromText(answer);
        const industryName = detectedIndustry?.name || this.parseIndustry(answer);
        if (industryName) {
          profile.industry = industryName;
          if (detectedIndustry) {
            profile.industryId = detectedIndustry.id;
          }
          const industryDesc = detectedIndustry?.description || `${industryName}行业`;
          acknowledgment = `好的，了解了贵公司是${industryName}行业！${detectedIndustry ? `这是一个非常有发展潜力的领域，我们服务了多家${detectedIndustry.cases[0]?.industry || industryName}企业，有丰富的行业经验。` : '这是一个非常有发展潜力的领域！'}`;
        }
        break;
      }

      case 'ASK_SCENARIO': {
        const scenario = this.parseScenario(answer);
        if (scenario) {
          profile.scenario = scenario;
          acknowledgment = `${scenario}是当前企业非常关注的重点方向，我们在这方面有丰富的成功经验。`;
        }
        break;
      }

      case 'ASK_PAIN_POINTS': {
        const painPoints = this.parsePainPoints(answer);
        if (painPoints.length > 0) {
          profile.painPoints = painPoints;
          acknowledgment = `这${painPoints.length}个痛点确实是很多企业都会遇到的共性挑战，我们的产品方案能够针对性地逐一解决。`;
        }
        break;
      }

      case 'ASK_BUDGET': {
        const { budget, range } = this.parseBudget(answer);
        if (budget > 0) {
          profile.budget = budget;
          profile.budgetRange = range;
          const budgetText = this.formatBudget(budget);
          acknowledgment = `了解了，${budgetText}的预算范围，我们有多个非常匹配的产品方案供您选择。`;
        }
        break;
      }

      case 'ASK_TIMELINE': {
        const { timeline, days } = this.parseTimeline(answer);
        if (timeline) {
          profile.timeline = timeline;
          if (days > 0) profile.timelineDays = days;
          const urgencyText = timeline === 'urgent' ? '我们会优先安排资源对接' : '我们会根据您的节奏推进';
          acknowledgment = `好的，${urgencyText}，确保项目按计划推进。`;
        }
        break;
      }

      case 'RECOMMENDATION':
        acknowledgment = '好的，我来为您详细介绍！';
        break;

      case 'INVITATION':
        acknowledgment = '太好了，我来为您安排！';
        break;

      case 'CLOSING':
        acknowledgment = '没问题，随时为您服务！';
        break;
    }

    const detectedCompetitors = this.detectCompetitorMentions(answer);
    competitors.push(...detectedCompetitors);

    return { profile, competitors, acknowledgment };
  }

  private parseGreeting(answer: string): string {
    if (answer.includes('你好') || answer.includes('您好') || answer.includes('hi') || answer.includes('hello')) {
      return '很高兴认识您！';
    }
    return '';
  }

  private parseIndustry(answer: string): string {
    const industryKeywords: { keywords: string[]; name: string }[] = [
      { keywords: ['金融', '银行', '保险', '证券', '基金', '理财', '投资'], name: '金融' },
      { keywords: ['制造', '汽车', '工业', '工厂', '生产', '航空', '航天'], name: '制造' },
      { keywords: ['医疗', '医院', '医药', '健康', '生物'], name: '医疗健康' },
      { keywords: ['电商', '零售', '物流', '供应链', '贸易', '消费'], name: '电商零售' },
      { keywords: ['互联网', '科技', '软件', 'saas', 'IT', '信息', '数字'], name: '互联网科技' },
      { keywords: ['政府', '政务', '央企', '国企', '军工', '事业单位', '公共'], name: '政府央企' },
      { keywords: ['能源', '电力', '石油', '石化', '煤炭', '新能源'], name: '能源' },
      { keywords: ['教育', '培训', '学校', '在线教育'], name: '教育培训' },
      { keywords: ['房地产', '建筑', '地产', '物业'], name: '房地产建筑' },
      { keywords: ['传媒', '广告', '营销', '文化', '娱乐'], name: '传媒营销' },
    ];

    const answerLower = answer.toLowerCase();

    for (const industry of industryKeywords) {
      for (const keyword of industry.keywords) {
        if (answerLower.includes(keyword.toLowerCase())) {
          return industry.name;
        }
      }
    }

    if (answer.length >= 2) return answer;
    return '';
  }

  private parseScenario(answer: string): string {
    const scenarioKeywords: { keywords: string[]; name: string }[] = [
      { keywords: ['数字化转型', '系统升级', '改造', '现代化'], name: '数字化转型/系统升级' },
      { keywords: ['降本增效', '降本', '增效', '降低成本', '提高效率', '节省', '优化成本'], name: '降本增效' },
      { keywords: ['客户增长', '获客', '营销', '推广', '增长', '引流', '转化', '用户增长'], name: '客户增长/营销获客' },
      { keywords: ['安全', '合规', '风险', '审计', '等保', '数据安全'], name: '安全合规/风险管控' },
      { keywords: ['数据分析', 'BI', '商业智能', '决策', '报表', '可视化', '大数据'], name: '数据分析/智能决策' },
      { keywords: ['流程优化', '自动化', '协同', '效率提升', '办公', '协作'], name: '流程优化/自动化协同' },
      { keywords: ['供应链', '库存', '采购', '物流', '仓储'], name: '供应链管理' },
      { keywords: ['用户体验', '客户服务', '体验', '服务', 'CRM', '客户关系'], name: '用户体验/客户服务' },
    ];

    const answerLower = answer.toLowerCase();

    for (const scenario of scenarioKeywords) {
      for (const keyword of scenario.keywords) {
        if (answerLower.includes(keyword.toLowerCase())) {
          return scenario.name;
        }
      }
    }

    if (answer.length >= 2) return answer;
    return '';
  }

  private parsePainPoints(answer: string): string[] {
    const painPointKeywords: { keywords: string[]; name: string }[] = [
      { keywords: ['效率低', '效率不高', '慢', '繁琐', '麻烦', '重复', '人工'], name: '工作效率低/人工操作多' },
      { keywords: ['数据孤岛', '不通', '打通', '分散', '不共享', '无法整合'], name: '数据孤岛/系统不互通' },
      { keywords: ['系统老', '系统旧', '不稳定', '卡', '崩溃', 'bug', '故障'], name: '系统老旧/稳定性差' },
      { keywords: ['成本高', '贵', '预算', 'ROI', '投入大', '回报低'], name: '成本高/投入产出不清晰' },
      { keywords: ['人不够', '缺人', '团队', '能力', '技术', '人才'], name: '团队能力不足/技术缺口' },
      { keywords: ['合规', '风险', '安全', '审计', '监管', '等保'], name: '合规压力大/安全风险' },
      { keywords: ['客户', '用户', '增长难', '流失', '转化低', '获客难'], name: '客户增长乏力/流失率高' },
      { keywords: ['报表', '决策', '分析难', '看不清', '不透明'], name: '决策数据不支撑/报表难' },
    ];

    const answerLower = answer.toLowerCase();
    const found: string[] = [];

    for (const painPoint of painPointKeywords) {
      for (const keyword of painPoint.keywords) {
        if (answerLower.includes(keyword.toLowerCase())) {
          if (!found.includes(painPoint.name)) {
            found.push(painPoint.name);
          }
          break;
        }
      }
    }

    if (found.length === 0 && answer.length >= 2) {
      const parts = answer.split(/[,，、;；\n\r]+/).filter(p => p.trim().length >= 2);
      if (parts.length > 0) {
        return parts.slice(0, 5).map(p => p.trim());
      }
      return [answer];
    }

    return found;
  }

  private parseBudget(answer: string): { budget: number; range: LeadProfile['budgetRange'] } {
    let budget = 0;
    let range: LeadProfile['budgetRange'] = 'low';

    const answerLower = answer.toLowerCase();

    const enterpriseMatch = answerLower.match(/(500万以上|500w以上|五百万以上|千万|亿|5000000以上)/);
    if (enterpriseMatch) {
      budget = 800000;
      range = 'enterprise';
      return { budget, range };
    }

    const highMatch = answerLower.match(/(100-500万|100w-500w|一百万到五百万|100万到500万|1000000-5000000|100万以上|200万|300万|400万)/);
    if (highMatch) {
      budget = 300000;
      range = 'high';
      return { budget, range };
    }

    const mediumMatch = answerLower.match(/(50-100万|50w-100w|五十万到一百万|50万到100万|500000-1000000|50万以上|60万|70万|80万|90万)/);
    if (mediumMatch) {
      budget = 75000;
      range = 'medium';
      return { budget, range };
    }

    const lowMatch = answerLower.match(/(10-50万|10w-50w|十万到五十万|10万到50万|100000-500000|20万|30万|40万|十几万|二三十万)/);
    if (lowMatch) {
      budget = 30000;
      range = 'low';
      return { budget, range };
    }

    const belowMatch = answerLower.match(/(10万以下|10w以下|十万以下|几万|5万|3万|2万|1万|几千)/);
    if (belowMatch) {
      budget = 10000;
      range = 'low';
      return { budget, range };
    }

    const numMatch = answer.match(/(\d+(\.\d+)?)\s*(万|w|W|千元|元)?/);
    if (numMatch) {
      const num = parseFloat(numMatch[1]);
      const unit = numMatch[3] || '';

      if (unit === '万' || unit === 'w' || unit === 'W') {
        budget = num * 10000;
      } else if (unit === '千元') {
        budget = num * 1000;
      } else {
        budget = num;
      }

      if (budget >= 500000) range = 'enterprise';
      else if (budget >= 100000) range = 'high';
      else if (budget >= 50000) range = 'medium';
      else range = 'low';

      if (budget > 0) return { budget, range };
    }

    if (answerLower.includes('充足') || answerLower.includes('不限') || answerLower.includes('不是问题') || answerLower.includes('ok')) {
      budget = 300000;
      range = 'high';
    }

    return { budget, range };
  }

  private parseTimeline(answer: string): { timeline: LeadProfile['timeline']; days: number } {
    let timeline: LeadProfile['timeline'] = 'medium';
    let days = 0;

    const answerLower = answer.toLowerCase();

    if (answerLower.match(/(紧急|马上|立即|这周|本周|下周|1个月内|一个月内|30天|立刻|尽快|urgent)/)) {
      timeline = 'urgent';
      days = 15;
      return { timeline, days };
    }

    if (answerLower.match(/(近期|1-3个月|一到三个月|1个月|2个月|3个月|30天|60天|90天|short)/)) {
      timeline = 'short';
      days = 60;
      return { timeline, days };
    }

    if (answerLower.match(/(中期|3-6个月|三到六个月|3个月|4个月|5个月|6个月|Q2|Q3|medium)/)) {
      timeline = 'medium';
      days = 120;
      return { timeline, days };
    }

    if (answerLower.match(/(长期|6个月以上|半年以上|明年|下季度|long|储备|观望)/)) {
      timeline = 'long';
      days = 240;
      return { timeline, days };
    }

    const dayMatch = answerLower.match(/(\d+)\s*(天|日)/);
    if (dayMatch) {
      days = parseInt(dayMatch[1]);
      if (days <= 30) timeline = 'urgent';
      else if (days <= 90) timeline = 'short';
      else if (days <= 180) timeline = 'medium';
      else timeline = 'long';
      return { timeline, days };
    }

    const monthMatch = answerLower.match(/(\d+)\s*(月|个月|month)/);
    if (monthMatch) {
      const months = parseInt(monthMatch[1]);
      days = months * 30;
      if (months <= 1) timeline = 'urgent';
      else if (months <= 3) timeline = 'short';
      else if (months <= 6) timeline = 'medium';
      else timeline = 'long';
      return { timeline, days };
    }

    return { timeline, days };
  }

  private detectCompetitorMentions(answer: string): string[] {
    const competitorAliases: { names: string[]; id: string }[] = [
      { names: ['阿里云', 'aliyun', '阿里', 'alibaba cloud'], id: '阿里云' },
      { names: ['腾讯云', 'tencent cloud', '腾讯', 'qcloud'], id: '腾讯云' },
      { names: ['华为云', 'huawei cloud', '华为', 'hcloud'], id: '华为云' },
      { names: ['salesforce', '赛富时', 'sfdc'], id: 'Salesforce' },
      { names: ['用友', 'yonyou', 'ufida'], id: '用友' },
      { names: ['金蝶', 'kingdee'], id: '金蝶' },
      { names: ['钉钉', 'dingtalk', '阿里钉钉'], id: '钉钉' },
      { names: ['企业微信', 'wecom', 'wechat work', '企微'], id: '企业微信' },
      { names: ['飞书', 'feishu', 'lark'], id: '飞书' },
      { names: ['帆软', 'fanruan', 'finebi', 'finereport'], id: '帆软' },
    ];

    const answerLower = answer.toLowerCase();
    const found: string[] = [];

    for (const comp of competitorAliases) {
      for (const alias of comp.names) {
        if (answerLower.includes(alias.toLowerCase())) {
          if (!found.includes(comp.id)) {
            found.push(comp.id);
          }
          break;
        }
      }
    }

    return found;
  }

  private formatBudget(budget: number): string {
    if (budget >= 10000) {
      return `${(budget / 10000).toFixed(1)}万元`;
    }
    return `${budget}元`;
  }
}

export function createDialogEngine(leadName?: string): DialogEngine {
  return new DialogEngine('GREETING', leadName);
}

function getStaticStateQuestions(): Record<DialogState, StateQuestion> {
  return buildStateQuestions(null);
}

export { STATE_TRANSITION_ORDER };
export const STATE_QUESTIONS = getStaticStateQuestions();
