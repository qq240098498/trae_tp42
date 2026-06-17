import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Lead,
  LeadGrade,
  LeadStatus,
  BudgetRange,
  DecisionTimeline,
  Message,
  MessageType,
  MessageSender,
  LeadScore,
  LeadFilters,
  PaginationParams,
  PaginatedResult,
} from '../types';

const STORAGE_KEY = 'lead-store';

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const now = () => new Date().toISOString();

const createMockMessages = (leadId: string, count: number): Message[] => {
  const messages: Message[] = [];
  const baseTime = Date.now() - count * 3600000;
  const templates: Array<{ sender: MessageSender; content: string; type: MessageType }> = [
    { sender: 'SYSTEM', content: '您好！欢迎咨询我们的企业数字化解决方案，请问有什么可以帮助您的？', type: 'TEXT' },
    { sender: 'USER', content: '您好，我们公司想了解一下CRM系统，目前在选型阶段。', type: 'TEXT' },
    { sender: 'SYSTEM', content: '好的，请问贵公司主要从事什么行业？目前销售团队规模大概多少人？', type: 'TEXT' },
    { sender: 'USER', content: '我们是做金融行业的，销售团队大概50人左右。', type: 'TEXT' },
    { sender: 'SYSTEM', content: '金融行业是我们重点服务的领域之一，我们有多家城商行和消金公司的标杆案例。请问目前在销售管理方面遇到了哪些主要痛点？', type: 'TEXT' },
    { sender: 'USER', content: '主要问题是线索跟进混乱，很多商机跟进不及时导致丢单，另外销售数据也不准，老板每次要报表都要等好几天。', type: 'TEXT' },
    { sender: 'SYSTEM', content: '这些问题我们的CRM系统都能很好地解决。智能销售漏斗可以把每个商机阶段都管起来，自动提醒跟进，丢单率至少降低30%；同时全流程数据自动采集，经营数据实时看板。', type: 'PRODUCT_CARD' },
    { sender: 'USER', content: '听起来不错，那预算大概是怎样的？', type: 'TEXT' },
    { sender: 'SYSTEM', content: '我们的价格非常灵活，根据功能模块和使用人数，从几万到几十万都有方案。像您这个规模的团队，通常投入在10-20万区间，3-6个月就能通过效率提升收回成本。', type: 'TEXT' },
    { sender: 'USER', content: '那你们和Salesforce比有什么优势？', type: 'TEXT' },
    { sender: 'SYSTEM', content: 'Salesforce是国际大牌，但很多客户反馈本地化体验不好，微信/钉钉集成弱，实施周期长达3-6个月，总拥有成本是我们的3-5倍。我们深度适配国内企业使用习惯，2-4周就能上线。', type: 'COMPETITOR_COMPARISON' },
    { sender: 'USER', content: '了解了，可以安排一个详细的方案演示吗？', type: 'TEXT' },
    { sender: 'SYSTEM', content: '当然可以！我这边给您安排一个方案交流会，带上方案总监做定制化演示。请问下周二下午3点方便吗？', type: 'ACTION_INVITE' },
    { sender: 'SYSTEM', content: '根据您的需求和预算情况，您的线索等级已更新为 A 级，我们会安排专人跟进。', type: 'GRADE_UPDATE' },
  ];
  for (let i = 0; i < count; i++) {
    const tpl = templates[i % templates.length];
    messages.push({
      id: generateId(),
      leadId,
      sender: tpl.sender,
      content: tpl.content,
      type: tpl.type,
      timestamp: new Date(baseTime + i * 3600000).toISOString(),
    });
  }
  return messages;
};

const createMockLeads = (): Lead[] => {
  const leadTemplates = [
    { name: '张伟', company: '恒瑞商业银行', industryId: 'finance', grade: 'A' as LeadGrade, budgetRange: '500K_1M' as BudgetRange, timeline: 'WITHIN_1M' as DecisionTimeline, status: 'PROPOSAL' as LeadStatus, tags: ['高意向', '金融', '大客户'] },
    { name: '李娜', company: '华盛零售集团', industryId: 'retail', grade: 'A' as LeadGrade, budgetRange: '200K_500K' as BudgetRange, timeline: 'IMMEDIATE' as DecisionTimeline, status: 'NEGOTIATION' as LeadStatus, tags: ['高意向', '零售', '连锁'] },
    { name: '王强', company: '智能制造科技', industryId: 'manufacturing', grade: 'B' as LeadGrade, budgetRange: '200K_500K' as BudgetRange, timeline: 'WITHIN_3M' as DecisionTimeline, status: 'QUALIFIED' as LeadStatus, tags: ['中意向', '制造', '离散型'] },
    { name: '刘芳', company: '安康医疗集团', industryId: 'healthcare', grade: 'B' as LeadGrade, budgetRange: '500K_1M' as BudgetRange, timeline: 'WITHIN_3M' as DecisionTimeline, status: 'QUALIFYING' as LeadStatus, tags: ['中意向', '医疗', '集团型'] },
    { name: '陈明', company: '星辰教育科技', industryId: 'education', grade: 'B' as LeadGrade, budgetRange: '50K_200K' as BudgetRange, timeline: 'WITHIN_3M' as DecisionTimeline, status: 'QUALIFIED' as LeadStatus, tags: ['中意向', '教育', 'K12'] },
    { name: '杨洋', company: '创新软件技术', industryId: 'tech', grade: 'A' as LeadGrade, budgetRange: 'ABOVE_1M' as BudgetRange, timeline: 'WITHIN_1M' as DecisionTimeline, status: 'NEGOTIATION' as LeadStatus, tags: ['高意向', '科技', '独角兽'] },
    { name: '赵磊', company: '顺通物流集团', industryId: 'logistics', grade: 'C' as LeadGrade, budgetRange: '50K_200K' as BudgetRange, timeline: 'WITHIN_6M' as DecisionTimeline, status: 'QUALIFYING' as LeadStatus, tags: ['低意向', '物流', '仓储'] },
    { name: '周婷', company: '盛达地产开发', industryId: 'realestate', grade: 'C' as LeadGrade, budgetRange: '200K_500K' as BudgetRange, timeline: 'WITHIN_6M' as DecisionTimeline, status: 'NEW' as LeadStatus, tags: ['低意向', '地产', '开发商'] },
    { name: '吴鹏', company: '能源投资控股', industryId: 'energy', grade: 'B' as LeadGrade, budgetRange: 'ABOVE_1M' as BudgetRange, timeline: 'WITHIN_3M' as DecisionTimeline, status: 'QUALIFIED' as LeadStatus, tags: ['中意向', '能源', '国企'] },
    { name: '郑琳', company: '华翔汽车制造', industryId: 'automotive', grade: 'A' as LeadGrade, budgetRange: 'ABOVE_1M' as BudgetRange, timeline: 'IMMEDIATE' as DecisionTimeline, status: 'PROPOSAL' as LeadStatus, tags: ['高意向', '汽车', '整车厂'] },
    { name: '孙浩', company: '环球电信运营', industryId: 'telecom', grade: 'D' as LeadGrade, budgetRange: 'UNSPECIFIED' as BudgetRange, timeline: 'LONG_TERM' as DecisionTimeline, status: 'CLOSED_LOST' as LeadStatus, tags: ['流失', '电信', '运营商'] },
    { name: '林静', company: '阳光传媒集团', industryId: 'media', grade: 'C' as LeadGrade, budgetRange: '50K_200K' as BudgetRange, timeline: 'WITHIN_6M' as DecisionTimeline, status: 'QUALIFYING' as LeadStatus, tags: ['低意向', '传媒', '广告'] },
    { name: '黄磊', company: '蓝海金融科技', industryId: 'finance', grade: 'B' as LeadGrade, budgetRange: '200K_500K' as BudgetRange, timeline: 'WITHIN_1M' as DecisionTimeline, status: 'PROPOSAL' as LeadStatus, tags: ['中意向', '金融科技', '消金'] },
    { name: '徐慧', company: '良品零售连锁', industryId: 'retail', grade: 'D' as LeadGrade, budgetRange: 'LESS_THAN_50K' as BudgetRange, timeline: 'UNSPECIFIED' as DecisionTimeline, status: 'NEW' as LeadStatus, tags: ['新线索', '零售', '便利店'] },
    { name: '马超', company: '精密机械制造', industryId: 'manufacturing', grade: 'A' as LeadGrade, budgetRange: '500K_1M' as BudgetRange, timeline: 'WITHIN_1M' as DecisionTimeline, status: 'CLOSED_WON' as LeadStatus, tags: ['已成交', '制造', '精密加工'] },
  ];

  return leadTemplates.map((tpl, index) => {
    const createdAt = new Date(Date.now() - (index + 1) * 86400000).toISOString();
    return {
      id: generateId(),
      name: tpl.name,
      company: tpl.company,
      email: `${tpl.name.toLowerCase().replace(/\s/g, '')}${index + 1}@example.com`,
      phone: `138${String(10000000 + index * 12345).slice(0, 8)}`,
      industryId: tpl.industryId,
      businessScenario: `${tpl.company}希望通过数字化系统提升业务效率，优化客户管理流程，实现业绩增长目标。`,
      painPoints: [
        '线索跟进不及时，存在丢单风险',
        '销售数据汇总慢，决策缺乏数据支撑',
        '团队协作效率低，信息传递断层',
      ],
      budgetRange: tpl.budgetRange,
      decisionTimeline: tpl.timeline,
      status: tpl.status,
      tags: tpl.tags,
      createdAt,
      updatedAt: createdAt,
    };
  });
};

const createMockScores = (leads: Lead[]): Record<string, LeadScore> => {
  const scores: Record<string, LeadScore> = {};
  const gradeToBase: Record<LeadGrade, number> = { A: 85, B: 70, C: 50, D: 30 };
  const statusBonus: Record<LeadStatus, number> = {
    CLOSED_WON: 15, NEGOTIATION: 10, PROPOSAL: 5, QUALIFIED: 0,
    QUALIFYING: -5, NEW: -10, CLOSED_LOST: -20,
  };
  leads.forEach((lead) => {
    const tag = lead.tags.find((t) => ['高意向', '中意向', '低意向', '新线索', '流失', '已成交'].includes(t));
    let grade: LeadGrade = 'C';
    if (tag === '高意向' || tag === '已成交') grade = 'A';
    else if (tag === '中意向') grade = 'B';
    else if (tag === '流失') grade = 'D';
    else if (tag === '新线索') grade = 'C';
    else {
      const tplGrade = (['A', 'B', 'C', 'D'] as LeadGrade[]).find((g) => lead.tags.some((t) => t.includes(g)));
      if (tplGrade) grade = tplGrade;
    }
    const base = gradeToBase[grade];
    const bonus = statusBonus[lead.status] || 0;
    const industryScore = Math.min(100, Math.max(0, base + Math.floor(Math.random() * 20 - 10)));
    const scenarioScore = Math.min(100, Math.max(0, base + Math.floor(Math.random() * 20 - 10)));
    const budgetScore = Math.min(100, Math.max(0, base + Math.floor(Math.random() * 20 - 10)));
    const timelineScore = Math.min(100, Math.max(0, base + bonus + Math.floor(Math.random() * 20 - 10)));
    const totalScore = Math.round((industryScore + scenarioScore + budgetScore + timelineScore) / 4);
    scores[lead.id] = {
      leadId: lead.id,
      industryScore,
      scenarioScore,
      budgetScore,
      timelineScore,
      totalScore,
      grade,
      calculatedAt: now(),
    };
  });
  return scores;
};

export interface LeadStoreState {
  leads: Lead[];
  currentLeadId: string | null;
  messages: Record<string, Message[]>;
  scores: Record<string, LeadScore>;
  filters: LeadFilters;
  pagination: PaginationParams;
  isInitialized: boolean;
}

export interface LeadStoreActions {
  initMockData: () => void;
  setCurrentLead: (leadId: string | null) => void;
  getCurrentLead: () => Lead | null;
  getCurrentMessages: () => Message[];
  getCurrentScore: () => LeadScore | null;
  addLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>) => Lead;
  updateLead: (leadId: string, updates: Partial<Lead>) => void;
  deleteLead: (leadId: string) => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => Message;
  updateScore: (leadId: string, score: Partial<LeadScore>) => void;
  recalculateScore: (leadId: string) => void;
  setFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  setPagination: (pagination: Partial<PaginationParams>) => void;
  getFilteredLeads: () => Lead[];
  getPaginatedLeads: () => PaginatedResult<Lead>;
  getStats: () => { total: number; byGrade: Record<LeadGrade, number>; byStatus: Record<LeadStatus, number> };
  clearAll: () => void;
}

export type LeadStore = LeadStoreState & LeadStoreActions;

const defaultFilters: LeadFilters = {
  status: undefined,
  grade: undefined,
  industryId: undefined,
  budgetRange: undefined,
  decisionTimeline: undefined,
  search: undefined,
  tags: undefined,
  dateRange: undefined,
};

const defaultPagination: PaginationParams = {
  page: 1,
  pageSize: 20,
};

const calculateGrade = (totalScore: number, settingsStore?: { gradeThresholds?: { gradeA: number; gradeB: number; gradeC: number } }): LeadGrade => {
  const thresholds = settingsStore?.gradeThresholds || { gradeA: 80, gradeB: 65, gradeC: 50 };
  if (totalScore >= thresholds.gradeA) return 'A';
  if (totalScore >= thresholds.gradeB) return 'B';
  if (totalScore >= thresholds.gradeC) return 'C';
  return 'D';
};

export const useLeadStore = create<LeadStore>()(
  persist(
    (set, get) => ({
      leads: [],
      currentLeadId: null,
      messages: {},
      scores: {},
      filters: defaultFilters,
      pagination: defaultPagination,
      isInitialized: false,

      initMockData: () => {
        if (get().isInitialized && get().leads.length > 0) return;
        const leads = createMockLeads();
        const messages: Record<string, Message[]> = {};
        leads.forEach((lead) => {
          const count = 5 + Math.floor(Math.random() * 6);
          messages[lead.id] = createMockMessages(lead.id, count);
        });
        const scores = createMockScores(leads);
        set({
          leads,
          messages,
          scores,
          currentLeadId: leads.length > 0 ? leads[0].id : null,
          isInitialized: true,
        });
      },

      setCurrentLead: (leadId) => set({ currentLeadId: leadId }),

      getCurrentLead: () => {
        const { leads, currentLeadId } = get();
        return leads.find((l) => l.id === currentLeadId) || null;
      },

      getCurrentMessages: () => {
        const { messages, currentLeadId } = get();
        return currentLeadId ? messages[currentLeadId] || [] : [];
      },

      getCurrentScore: () => {
        const { scores, currentLeadId } = get();
        return currentLeadId ? scores[currentLeadId] || null : null;
      },

      addLead: (leadData) => {
        const newLead: Lead = {
          ...leadData,
          id: generateId(),
          createdAt: now(),
          updatedAt: now(),
        };
        set((state) => ({
          leads: [newLead, ...state.leads],
          messages: { ...state.messages, [newLead.id]: [] },
        }));
        get().recalculateScore(newLead.id);
        return newLead;
      },

      updateLead: (leadId, updates) => {
        set((state) => ({
          leads: state.leads.map((l) =>
            l.id === leadId ? { ...l, ...updates, updatedAt: now() } : l
          ),
        }));
        get().recalculateScore(leadId);
      },

      deleteLead: (leadId) => {
        set((state) => {
          const newMessages = { ...state.messages };
          delete newMessages[leadId];
          const newScores = { ...state.scores };
          delete newScores[leadId];
          return {
            leads: state.leads.filter((l) => l.id !== leadId),
            messages: newMessages,
            scores: newScores,
            currentLeadId: state.currentLeadId === leadId ? null : state.currentLeadId,
          };
        });
      },

      addMessage: (messageData) => {
        const newMessage: Message = {
          ...messageData,
          id: generateId(),
          timestamp: now(),
        };
        set((state) => ({
          messages: {
            ...state.messages,
            [newMessage.leadId]: [...(state.messages[newMessage.leadId] || []), newMessage],
          },
        }));
        return newMessage;
      },

      updateScore: (leadId, scoreUpdates) => {
        set((state) => {
          const existing = state.scores[leadId];
          if (!existing) return state;
          const updated = { ...existing, ...scoreUpdates, calculatedAt: now() };
          updated.totalScore = Math.round(
            (updated.industryScore + updated.scenarioScore + updated.budgetScore + updated.timelineScore) / 4
          );
          updated.grade = calculateGrade(updated.totalScore);
          return {
            scores: { ...state.scores, [leadId]: updated },
          };
        });
      },

      recalculateScore: (leadId) => {
        const lead = get().leads.find((l) => l.id === leadId);
        if (!lead) return;
        const industryWeights: Record<string, number> = {
          finance: 90, retail: 80, manufacturing: 75, healthcare: 85, education: 70,
          tech: 95, logistics: 65, realestate: 60, energy: 85, automotive: 80,
          telecom: 70, media: 65,
        };
        const budgetWeights: Record<BudgetRange, number> = {
          ABOVE_1M: 95, '500K_1M': 85, '200K_500K': 70, '50K_200K': 50, LESS_THAN_50K: 30, UNSPECIFIED: 40,
        };
        const timelineWeights: Record<DecisionTimeline, number> = {
          IMMEDIATE: 95, WITHIN_1M: 85, WITHIN_3M: 70, WITHIN_6M: 50, LONG_TERM: 30, UNSPECIFIED: 40,
        };
        const statusWeights: Record<LeadStatus, number> = {
          CLOSED_WON: 100, NEGOTIATION: 90, PROPOSAL: 80, QUALIFIED: 70,
          QUALIFYING: 55, NEW: 40, CLOSED_LOST: 10,
        };
        const industryScore = industryWeights[lead.industryId] || 60;
        const scenarioScore = lead.painPoints.length > 0 ? Math.min(100, 50 + lead.painPoints.length * 15) : 40;
        const budgetScore = budgetWeights[lead.budgetRange];
        const timelineScore = timelineWeights[lead.decisionTimeline];
        const statusBonus = statusWeights[lead.status];
        const baseTotal = (industryScore + scenarioScore + budgetScore + timelineScore) / 4;
        const totalScore = Math.min(100, Math.max(0, Math.round(baseTotal * 0.7 + statusBonus * 0.3)));
        const grade = calculateGrade(totalScore);
        set((state) => ({
          scores: {
            ...state.scores,
            [leadId]: {
              leadId,
              industryScore,
              scenarioScore,
              budgetScore,
              timelineScore,
              totalScore,
              grade,
              calculatedAt: now(),
            },
          },
        }));
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          pagination: { ...state.pagination, page: 1 },
        }));
      },

      resetFilters: () => set({ filters: defaultFilters, pagination: defaultPagination }),

      setPagination: (newPagination) => {
        set((state) => ({
          pagination: { ...state.pagination, ...newPagination },
        }));
      },

      getFilteredLeads: () => {
        const { leads, scores, filters } = get();
        return leads.filter((lead) => {
          const score = scores[lead.id];
          if (filters.status?.length && !filters.status.includes(lead.status)) return false;
          if (filters.grade?.length && score && !filters.grade.includes(score.grade)) return false;
          if (filters.industryId && lead.industryId !== filters.industryId) return false;
          if (filters.budgetRange?.length && !filters.budgetRange.includes(lead.budgetRange)) return false;
          if (filters.decisionTimeline?.length && !filters.decisionTimeline.includes(lead.decisionTimeline)) return false;
          if (filters.search) {
            const search = filters.search.toLowerCase();
            const matchText = [lead.name, lead.company, lead.email, lead.phone, ...lead.tags].join(' ').toLowerCase();
            if (!matchText.includes(search)) return false;
          }
          if (filters.tags?.length && !filters.tags.some((t) => lead.tags.includes(t))) return false;
          if (filters.dateRange) {
            const created = new Date(lead.createdAt).getTime();
            if (filters.dateRange.start && created < new Date(filters.dateRange.start).getTime()) return false;
            if (filters.dateRange.end && created > new Date(filters.dateRange.end).getTime()) return false;
          }
          return true;
        });
      },

      getPaginatedLeads: () => {
        const filtered = get().getFilteredLeads();
        const { pagination, scores } = get();
        const sorted = [...filtered].sort((a, b) => {
          const scoreA = scores[a.id]?.totalScore || 0;
          const scoreB = scores[b.id]?.totalScore || 0;
          if (scoreB !== scoreA) return scoreB - scoreA;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        const total = sorted.length;
        const totalPages = Math.max(1, Math.ceil(total / pagination.pageSize));
        const start = (pagination.page - 1) * pagination.pageSize;
        const items = sorted.slice(start, start + pagination.pageSize);
        return {
          items,
          total,
          page: pagination.page,
          pageSize: pagination.pageSize,
          totalPages,
        };
      },

      getStats: () => {
        const { leads, scores } = get();
        const byGrade: Record<LeadGrade, number> = { A: 0, B: 0, C: 0, D: 0 };
        const byStatus: Record<LeadStatus, number> = {
          NEW: 0, QUALIFYING: 0, QUALIFIED: 0, PROPOSAL: 0, NEGOTIATION: 0, CLOSED_WON: 0, CLOSED_LOST: 0,
        };
        leads.forEach((lead) => {
          byStatus[lead.status]++;
          const score = scores[lead.id];
          if (score) byGrade[score.grade]++;
        });
        return { total: leads.length, byGrade, byStatus };
      },

      clearAll: () => {
        set({
          leads: [],
          currentLeadId: null,
          messages: {},
          scores: {},
          filters: defaultFilters,
          pagination: defaultPagination,
          isInitialized: false,
        });
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        leads: state.leads,
        messages: state.messages,
        scores: state.scores,
        filters: state.filters,
        pagination: state.pagination,
        isInitialized: state.isInitialized,
      }),
    }
  )
);

export default useLeadStore;
