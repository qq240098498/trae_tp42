export type LeadGrade = 'A' | 'B' | 'C' | 'D';

export type BudgetRange =
  | 'LESS_THAN_50K'
  | '50K_200K'
  | '200K_500K'
  | '500K_1M'
  | 'ABOVE_1M'
  | 'UNSPECIFIED';

export type DecisionTimeline =
  | 'IMMEDIATE'
  | 'WITHIN_1M'
  | 'WITHIN_3M'
  | 'WITHIN_6M'
  | 'LONG_TERM'
  | 'UNSPECIFIED';

export type LeadStatus =
  | 'NEW'
  | 'QUALIFYING'
  | 'QUALIFIED'
  | 'PROPOSAL'
  | 'NEGOTIATION'
  | 'CLOSED_WON'
  | 'CLOSED_LOST';

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industryId: string;
  businessScenario: string;
  painPoints: string[];
  budgetRange: BudgetRange;
  decisionTimeline: DecisionTimeline;
  status: LeadStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export type MessageType =
  | 'TEXT'
  | 'PRODUCT_CARD'
  | 'ACTION_INVITE'
  | 'COMPETITOR_COMPARISON'
  | 'GRADE_UPDATE';

export type MessageSender = 'SYSTEM' | 'USER';

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'link';
  url: string;
  name?: string;
}

export interface Message {
  id: string;
  leadId: string;
  sender: MessageSender;
  content: string;
  type: MessageType;
  payload?: Record<string, any>;
  attachments?: MessageAttachment[];
  timestamp: string;
}

export interface LeadScore {
  leadId: string;
  industryScore: number;
  scenarioScore: number;
  budgetScore: number;
  timelineScore: number;
  totalScore: number;
  grade: LeadGrade;
  calculatedAt: string;
}

export interface ProductFeature {
  name: string;
  description: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  priceFrom: number;
  priceTo: number;
  targetIndustries: string[];
  targetScenarios: string[];
  coreFeatures: ProductFeature[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DiffPoint {
  dimension: string;
  ourAdvantage: string;
  competitorWeakness: string;
  script: string;
}

export interface Competitor {
  id: string;
  name: string;
  logoUrl: string;
  keywords: string[];
  positioning: string;
  diffPoints: DiffPoint[];
  createdAt?: string;
  updatedAt?: string;
}

export type ActionType = 'DEMO' | 'TRIAL' | 'MEETING';

export type ActionStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface ScheduledAction {
  id: string;
  leadId: string;
  type: ActionType;
  scheduledAt: string;
  duration: number;
  location: string;
  notes: string;
  status: ActionStatus;
  createdAt?: string;
  updatedAt?: string;
}

export type DialogState =
  | 'GREETING'
  | 'ASK_INDUSTRY'
  | 'ASK_SCENARIO'
  | 'ASK_PAIN_POINTS'
  | 'ASK_BUDGET'
  | 'ASK_TIMELINE'
  | 'COMPETITOR_HANDLING'
  | 'RECOMMENDATION'
  | 'INVITATION'
  | 'CLOSING'
  | 'COMPLETED';

export interface Industry {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface DialogContext {
  leadId: string;
  currentState: DialogState;
  visitedStates: DialogState[];
  collectedData: Partial<Lead>;
  pendingCompetitorId?: string;
  lastMessageId?: string;
  startedAt: string;
  lastUpdatedAt: string;
}

export interface LeadFilters {
  status?: LeadStatus[];
  grade?: LeadGrade[];
  industryId?: string;
  budgetRange?: BudgetRange[];
  decisionTimeline?: DecisionTimeline[];
  search?: string;
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface DashboardStats {
  totalLeads: number;
  newLeadsThisWeek: number;
  qualifiedLeads: number;
  gradeADistribution: number;
  gradeBDistribution: number;
  gradeCDistribution: number;
  gradeDDistribution: number;
  pendingActions: number;
  convertedRate: number;
  averageResponseTime: number;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  language: 'zh-CN' | 'en-US';
  scoringWeights: {
    industryMatch: number;
    scenarioClarity: number;
    budgetRange: number;
    decisionTimeline: number;
  };
  gradeThresholds: {
    gradeA: number;
    gradeB: number;
    gradeC: number;
  };
  notifications: {
    email: boolean;
    browser: boolean;
    sound: boolean;
  };
}
