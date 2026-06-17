import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { ThemeMode, AppSettings } from '../types';

const STORAGE_KEY = 'settings-store';

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const now = () => new Date().toISOString();

export interface Script {
  id: string;
  category: string;
  title: string;
  content: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ScoringWeights {
  industryMatch: number;
  scenarioClarity: number;
  budgetRange: number;
  decisionTimeline: number;
}

export interface GradeThresholds {
  gradeA: number;
  gradeB: number;
  gradeC: number;
}

export interface NotificationSettings {
  email: boolean;
  browser: boolean;
  sound: boolean;
  leadGradeChange: boolean;
  newMessage: boolean;
  scheduledAction: boolean;
}

export interface SystemSettings {
  theme: ThemeMode;
  language: 'zh-CN' | 'en-US';
  companyName: string;
  salesName: string;
  primaryColor: string;
  autoSaveInterval: number;
  enableAnalytics: boolean;
}

export interface ScriptCategory {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

const createMockScripts = (): Script[] => {
  return [
    {
      id: 'opening-1',
      category: '开场白',
      title: '通用开场白（电话）',
      content: '您好，请问是{company}的{name}总吗？我是{ourCompany}的{salesName}，专注于为{industry}行业企业提供数字化解决方案。今天给您来电主要是了解到贵公司在{businessArea}领域发展迅速，想和您交流一下目前在{topic}方面有没有遇到什么挑战，或者有没有考虑过通过系统来提效？',
      tags: ['电话', '通用', '初次接触'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'opening-2',
      category: '开场白',
      title: '转介绍开场白',
      content: '{name}总您好，我是{ourCompany}的{salesName}，是{referrerName}总推荐我联系您的。他之前用了我们的产品效果非常好，说你们俩情况比较像，让我一定要跟您聊聊。他特别提到您最近在关注{topic}，刚好我们在这方面有不少成熟的经验，想和您分享一下。',
      tags: ['转介绍', '信任背书'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'opening-3',
      category: '开场白',
      title: '活动/内容触达开场白',
      content: '{name}总您好，我是{ourCompany}的{salesName}。看到您上周参加了我们的{activityName}活动/下载了我们的《{contentName}》白皮书，感觉您对{topic}这块应该比较关注。刚好我们最近有几个{industry}行业的标杆案例做得不错，想和您约个时间分享一下，看有没有可以借鉴的地方。',
      tags: ['活动', '内容营销', '线索跟进'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'greeting-finance',
      category: '行业问候',
      title: '金融行业专属问候',
      content: '{name}总好！现在金融行业监管越来越严，获客成本也在不断攀升，加上最近经济环境的变化，相信您在客户精细化运营和风险管控方面的压力也不小吧？我们最近服务了几家城商行和消金公司，在合规前提下把客户转化率提升了20%+，想和您聊聊他们是怎么做的。',
      tags: ['金融', '行业专属'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'greeting-retail',
      category: '行业问候',
      title: '零售行业专属问候',
      content: '{name}总好！现在零售业线上线下融合是大趋势，私域运营也越来越卷，相信您在会员运营和全渠道营销这块肯定花了不少心思。我们帮几家连锁零售品牌做了全渠道客户数据打通，复购率平均提升了35%，不知道您这边有没有兴趣了解一下具体方案？',
      tags: ['零售', '行业专属'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'greeting-manufacturing',
      category: '行业问候',
      title: '制造行业专属问候',
      content: '{name}总好！这两年制造业数字化转型喊得很响，但真正落地出效果的其实不多，很多企业上了系统之后反而更复杂了。我们最近在离散制造和流程制造都有几个标杆客户，把从销售到生产到供应链的全流程打通了，库存周转效率提升了40%，想和您交流一下他们的经验。',
      tags: ['制造', '行业专属'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'scenario-1',
      category: '业务场景提问',
      title: '销售场景摸底',
      content: '想先了解一下，您目前的销售团队大概多少人？主要通过什么渠道获客？线索进来之后是怎么分配和跟进的？现在从线索到成交的转化率大概在什么水平？有没有做过系统的分析，哪个环节流失率比较高？',
      tags: ['销售', '需求调研'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'scenario-2',
      category: '业务场景提问',
      title: '营销场景摸底',
      content: '想请教一下，您目前的客户主要来自哪些渠道？每个渠道的ROI大概是什么水平？现在营销投入主要用什么方式做客户触达？有没有做用户分群和精准营销？客户生命周期管理这块有没有体系？比如新客培育和老客复购分别是怎么运营的？',
      tags: ['营销', '需求调研'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'scenario-3',
      category: '业务场景提问',
      title: '客服场景摸底',
      content: '了解一下，您目前的客服团队大概什么规模？主要服务哪些渠道的咨询？现在平均响应时长和解决率大概是多少？高峰期有没有接待压力大不大？有没有做客户满意度的跟踪？现在客服这块最大的痛点主要集中在哪些方面？',
      tags: ['客服', '需求调研'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'pain-1',
      category: '痛点挖掘',
      title: '效率类痛点引导',
      content: '那您觉得目前在这块，有没有觉得特别耗费人力、但价值又不高的重复性工作特别多？比如{example1}或者{example2}这些？有没有因为效率问题导致过什么损失的情况？如果这些问题不解决的话，对您今年的目标达成会不会有影响？',
      tags: ['痛点', '效率'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'pain-2',
      category: '痛点挖掘',
      title: '数据类痛点引导',
      content: '想请教一下，您现在做决策的时候，数据支撑够不够及时、准不准？比如您想看看各个部门的数据是不是还靠人手工汇总？有没有出现过数据口径对不上、老板要数据要等好几天的情况？这些数据不及时会不会导致错过一些机会？',
      tags: ['痛点', '数据'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'pain-3',
      category: '痛点挖掘',
      title: '协同类痛点引导',
      content: '现在跨部门协作这块有没有让您头疼过吗？比如销售和市场数据不互通，或者售前售后信息断层？有没有出现过因为信息不同步导致客户体验不好、甚至丢单的情况？如果部门之间能完全打通，您觉得对业绩能带来什么好处？',
      tags: ['痛点', '协同'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'budget-1',
      category: '预算询问',
      title: '预算初探（婉转型）',
      content: '聊到这里，我也大致了解了您这边的情况和需求了。想顺便问一下，如果咱们要上这样一套系统，今年在这块有没有大概的预算规划？这样我也好结合您的预算，给您推荐最合适的方案和选型建议。',
      tags: ['预算', '婉转型'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'budget-2',
      category: '预算询问',
      title: '预算锚定（对比型）',
      content: '您之前有没有了解过同类型的产品？大概是什么样的价位区间？或者您心里有没有一个预期的投入范围？说实话，这类产品从几万到几十万都有，关键看您想解决哪些问题、覆盖多少人。您给我一个大概范围，我就能帮您精准匹配。',
      tags: ['预算', '对比型'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'budget-3',
      category: '预算询问',
      title: '价值导向（投资回报）',
      content: '其实您可以换个角度看，与其说预算，不如说投资回报。我们之前服务的类似规模客户，一般投入在{range}左右，大概3-6个月就能通过效率提升和业绩增长收回成本。您这边对投资回收期大概有什么样的预期？我可以据此给您算一笔账，看看什么样的投入对您最合适。',
      tags: ['预算', 'ROI', '价值导向'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'timeline-1',
      category: '时间线询问',
      title: '紧迫度判断',
      content: '想了解一下，您这边考虑上系统大概是什么样的时间规划？是希望尽快落地，还是说还在前期调研阶段？目前这个事情是您这边在主导推进吗？还有哪些部门或者决策人会参与进来？',
      tags: ['时间线', '紧迫度'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'timeline-2',
      category: '时间线询问',
      title: '项目背景挖掘',
      content: '这次考虑做数字化升级，是因为遇到了什么具体的业务契机吗？比如新业务线要上、或者老板定了新的目标？有没有什么时间节点是必须要上线的？如果错过了这个时间点，会不会对业务有什么影响？',
      tags: ['时间线', '项目背景'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'timeline-3',
      category: '时间线询问',
      title: '决策流程了解',
      content: '方便问一下，咱们内部采购这类系统的流程大概是怎样的？需要经过哪些审批环节？从立项到最终签约大概需要多长时间？我也好配合您的节奏，准备相应的材料和支持。',
      tags: ['时间线', '决策流程'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'compare-template',
      category: '竞品对比模板',
      title: '通用竞品对比话术框架',
      content: '{competitor}确实是行业内的知名品牌，有他们的优势，比如{acknowledge}。不过很多客户最终还是选择了我们，主要是基于这几点考虑：第一，在{dimension1}方面，我们{advantage1}，而他们{weakness1}；第二，{dimension2}这块，我们{advantage2}，他们那边{weakness2}；第三也是最关键的一点，{dimension3}，我们{advantage3}，这对您来说意味着{value}。当然，最终选哪家还是看您最看重什么，我只是把真实情况给您摆出来供您参考。',
      tags: ['竞品', '对比', '通用框架'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'recommend-crm',
      category: '产品推荐话术',
      title: 'CRM系统推荐',
      content: '根据您刚才提到的情况，我觉得我们的CRM系统特别适合您。第一，您说销售线索跟进混乱、丢单严重，我们的智能销售漏斗能把每个商机阶段都管起来，自动提醒跟进，丢单率至少降30%；第二，您提到数据靠人报不准，我们系统全流程数据自动采集，老板随时看真实的业绩看板；第三，您团队有{size}人，我们的同行业客户{example}就是这个规模，上线两个月转化率就提升了25%。我建议先给您做一个15天的免费试用，您实际体验一下效果。',
      tags: ['推荐', 'CRM'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'recommend-analytics',
      category: '产品推荐话术',
      title: '数据分析平台推荐',
      content: '结合您的需求，我首推我们的数据分析平台。您提到老板要数据要等一周，这个问题太常见了。我们的平台接入您现有的各个系统数据，自动清洗建模，经营数据实时看板，老板自己就能看，不用再等人工汇总。而且我们的AI归因还能自动发现数据异常和增长机会，相当于多了一个数据分析师。像您同行业的{example}用了之后，决策效率提升了至少3倍，还发现了好几个之前被忽略的增长机会点。',
      tags: ['推荐', '数据分析', 'BI'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'recommend-ai-agent',
      category: '产品推荐话术',
      title: '智能客服机器人推荐',
      content: '您说客服人手不够、高峰期接不过来、客户满意度低，我们的智能客服机器人就是为解决这些问题而生的。首先，常见问题机器人就能解决80%以上，人工只需要处理复杂问题，人手压力直接减轻一大半；其次，7x24小时在线，客户随时来随时接，再也不会漏接客户了；最重要的是，我们用大模型训练您的知识库，越用越聪明。之前{example}上线后，客服成本降了60%，满意度还提升了15个百分点。您可以先把知识库给我们，我们免费帮您训练一个Demo，您实际测一下准确率。',
      tags: ['推荐', 'AI客服', '机器人'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'recommend-marketing',
      category: '产品推荐话术',
      title: '营销自动化平台推荐',
      content: '您现在营销投入不少但ROI算不清，这个痛点太普遍了。我们的营销自动化平台就是帮您把每一分钱的去向和效果都算明白。全渠道投放数据自动归因，哪个渠道带来多少线索、多少成交一目了然。而且还能做自动化触达，比如用户行为触发自动发券、自动加企业微信，运营效率至少翻3倍。您同行业的{example}用了之后，营销ROI提升了40%，同样的预算带来了更多的优质客户。',
      tags: ['推荐', '营销自动化'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'invite-a',
      category: '邀约话术',
      title: 'A级高意向邀约（明确需求+有预算+决策人）',
      content: '{name}总，今天聊下来感觉咱们的需求非常匹配，而且您也有明确的规划和预算。这样，我建议下{day}下午我们安排一个详细的方案交流会，我把方案总监也带上，针对您的具体痛点做定制化的方案演示，同时把同行业{example}的完整案例给您过一遍。时间大概1个小时，您看下{day}下午{time}方便吗？我这边马上把会议邀请和准备的参考资料发给您。',
      tags: ['邀约', 'A级', '高意向'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'invite-b',
      category: '邀约话术',
      title: 'B级中意向邀约（有需求+预算不明确/非决策人）',
      content: '{name}总，今天沟通得很愉快，我觉得您提的这些问题我们都能很好地解决。考虑到您可能还需要和内部对齐一下，我建议这样：我先准备一份针对您行业的解决方案和标杆案例集发给您，您可以先和相关同事过一遍，有什么问题随时找我。然后下周{day}我们再约个时间，您叫上{stakeholder}一起，我给大家做一个针对性的演示，您觉得怎么样？我先把资料发您邮箱，您注意查收。',
      tags: ['邀约', 'B级', '中意向'],
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: 'invite-c',
      category: '邀约话术',
      title: 'C级低意向邀约（需求模糊/暂无计划）',
      content: '{name}总，非常感谢您今天抽出时间和我交流，虽然您目前可能还没有明确的计划，但我相信这些问题早晚是要解决的。这样，我加您一下微信，后续我会不定期给您发一些{industry}行业的数字化实践案例和行业报告，您有时间可以看看，有什么想法随时找我聊。等您什么时候有计划了，咱们再深入沟通。另外我们每个月都会有行业沙龙，到时候也邀请您来和同行交流交流。',
      tags: ['邀约', 'C级', '低意向', '培育'],
      createdAt: now(),
      updatedAt: now(),
    },
  ];
};

const createMockCategories = (): ScriptCategory[] => {
  return [
    { id: 'cat-opening', name: '开场白', color: '#3B82F6', icon: 'MessageCircle' },
    { id: 'cat-greeting', name: '行业问候', color: '#10B981', icon: 'Handshake' },
    { id: 'cat-scenario', name: '业务场景提问', color: '#8B5CF6', icon: 'HelpCircle' },
    { id: 'cat-pain', name: '痛点挖掘', color: '#F59E0B', icon: 'AlertTriangle' },
    { id: 'cat-budget', name: '预算询问', color: '#EF4444', icon: 'DollarSign' },
    { id: 'cat-timeline', name: '时间线询问', color: '#6366F1', icon: 'Clock' },
    { id: 'cat-compare', name: '竞品对比模板', color: '#EC4899', icon: 'Scale' },
    { id: 'cat-recommend', name: '产品推荐话术', color: '#14B8A6', icon: 'ThumbsUp' },
    { id: 'cat-invite', name: '邀约话术', color: '#F97316', icon: 'Calendar' },
    { id: 'cat-other', name: '其他', color: '#6B7280', icon: 'Folder' },
  ];
};

export interface SettingsStoreState {
  scripts: Script[];
  scriptCategories: ScriptCategory[];
  scoringWeights: ScoringWeights;
  gradeThresholds: GradeThresholds;
  notifications: NotificationSettings;
  system: SystemSettings;
  isInitialized: boolean;
}

export interface SettingsStoreActions {
  initMockData: () => void;
  addScript: (script: Omit<Script, 'id' | 'createdAt' | 'updatedAt'>) => Script;
  updateScript: (scriptId: string, updates: Partial<Script>) => void;
  deleteScript: (scriptId: string) => void;
  getScriptsByCategory: (category: string) => Script[];
  getScriptCategories: () => string[];
  searchScripts: (keyword: string, category?: string, tags?: string[]) => Script[];
  addScriptCategory: (category: Omit<ScriptCategory, 'id'>) => ScriptCategory;
  updateScriptCategory: (categoryId: string, updates: Partial<ScriptCategory>) => void;
  deleteScriptCategory: (categoryId: string) => void;
  setScoringWeights: (weights: Partial<ScoringWeights>) => void;
  resetScoringWeights: () => void;
  setGradeThresholds: (thresholds: Partial<GradeThresholds>) => void;
  resetGradeThresholds: () => void;
  setNotifications: (settings: Partial<NotificationSettings>) => void;
  setSystemSettings: (settings: Partial<SystemSettings>) => void;
  resetToDefaults: () => void;
  exportSettings: () => string;
  importSettings: (jsonString: string) => boolean;
  clearAll: () => void;
}

export type SettingsStore = SettingsStoreState & SettingsStoreActions;

const defaultScoringWeights: ScoringWeights = {
  industryMatch: 0.25,
  scenarioClarity: 0.25,
  budgetRange: 0.25,
  decisionTimeline: 0.25,
};

const defaultGradeThresholds: GradeThresholds = {
  gradeA: 80,
  gradeB: 65,
  gradeC: 50,
};

const defaultNotifications: NotificationSettings = {
  email: true,
  browser: true,
  sound: false,
  leadGradeChange: true,
  newMessage: true,
  scheduledAction: true,
};

const defaultSystem: SystemSettings = {
  theme: 'light',
  language: 'zh-CN',
  companyName: '智云科技',
  salesName: '销售顾问',
  primaryColor: '#3B82F6',
  autoSaveInterval: 30,
  enableAnalytics: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set, get) => ({
      scripts: [],
      scriptCategories: [],
      scoringWeights: defaultScoringWeights,
      gradeThresholds: defaultGradeThresholds,
      notifications: defaultNotifications,
      system: defaultSystem,
      isInitialized: false,

      initMockData: () => {
        if (get().isInitialized && get().scripts.length > 0) return;
        set({
          scripts: createMockScripts(),
          scriptCategories: createMockCategories(),
          isInitialized: true,
        });
      },

      addScript: (scriptData) => {
        const newScript: Script = {
          ...scriptData,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          scripts: [...state.scripts, newScript],
        }));
        return newScript;
      },

      updateScript: (scriptId, updates) => {
        set((state) => ({
          scripts: state.scripts.map((s) =>
            s.id === scriptId ? { ...s, ...updates, updatedAt: now() } : s
          ),
        }));
      },

      deleteScript: (scriptId) => {
        set((state) => ({
          scripts: state.scripts.filter((s) => s.id !== scriptId),
        }));
      },

      getScriptsByCategory: (category) => {
        return get().scripts.filter((s) => s.category === category);
      },

      getScriptCategories: () => {
        return Array.from(new Set(get().scripts.map((s) => s.category)));
      },

      searchScripts: (keyword, category, tags) => {
        const { scripts } = get();
        return scripts.filter((s) => {
          if (keyword) {
            const kw = keyword.toLowerCase();
            const matchText = [s.title, s.content, s.category, ...(s.tags || [])].join(' ').toLowerCase();
            if (!matchText.includes(kw)) return false;
          }
          if (category && s.category !== category) return false;
          if (tags?.length && !(s.tags || []).some((t) => tags.includes(t))) return false;
          return true;
        });
      },

      addScriptCategory: (categoryData) => {
        const newCategory: ScriptCategory = {
          ...categoryData,
          id: generateId(),
        };
        set((state) => ({
          scriptCategories: [...state.scriptCategories, newCategory],
        }));
        return newCategory;
      },

      updateScriptCategory: (categoryId, updates) => {
        set((state) => ({
          scriptCategories: state.scriptCategories.map((c) =>
            c.id === categoryId ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteScriptCategory: (categoryId) => {
        set((state) => ({
          scriptCategories: state.scriptCategories.filter((c) => c.id !== categoryId),
        }));
      },

      setScoringWeights: (weights) => {
        set((state) => ({
          scoringWeights: { ...state.scoringWeights, ...weights },
        }));
      },

      resetScoringWeights: () => {
        set({ scoringWeights: defaultScoringWeights });
      },

      setGradeThresholds: (thresholds) => {
        set((state) => ({
          gradeThresholds: { ...state.gradeThresholds, ...thresholds },
        }));
      },

      resetGradeThresholds: () => {
        set({ gradeThresholds: defaultGradeThresholds });
      },

      setNotifications: (settings) => {
        set((state) => ({
          notifications: { ...state.notifications, ...settings },
        }));
      },

      setSystemSettings: (settings) => {
        set((state) => ({
          system: { ...state.system, ...settings },
        }));
      },

      resetToDefaults: () => {
        set({
          scoringWeights: defaultScoringWeights,
          gradeThresholds: defaultGradeThresholds,
          notifications: defaultNotifications,
          system: defaultSystem,
        });
      },

      exportSettings: () => {
        const { scripts, scriptCategories, scoringWeights, gradeThresholds, notifications, system } = get();
        return JSON.stringify({
          scripts,
          scriptCategories,
          scoringWeights,
          gradeThresholds,
          notifications,
          system,
          exportedAt: now(),
        }, null, 2);
      },

      importSettings: (jsonString) => {
        try {
          const data = JSON.parse(jsonString);
          set({
            scripts: data.scripts || [],
            scriptCategories: data.scriptCategories || [],
            scoringWeights: data.scoringWeights || defaultScoringWeights,
            gradeThresholds: data.gradeThresholds || defaultGradeThresholds,
            notifications: data.notifications || defaultNotifications,
            system: data.system || defaultSystem,
          });
          return true;
        } catch {
          return false;
        }
      },

      clearAll: () => {
        set({
          scripts: [],
          scriptCategories: [],
          scoringWeights: defaultScoringWeights,
          gradeThresholds: defaultGradeThresholds,
          notifications: defaultNotifications,
          system: defaultSystem,
          isInitialized: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        scripts: state.scripts,
        scriptCategories: state.scriptCategories,
        scoringWeights: state.scoringWeights,
        gradeThresholds: state.gradeThresholds,
        notifications: state.notifications,
        system: state.system,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export default useSettingsStore;
