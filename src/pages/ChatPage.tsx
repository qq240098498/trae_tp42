import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Paperclip,
  Smile,
  Phone,
  Calendar,
  Video,
  User,
  Building2,
  Mail,
  Tag,
  Award,
  Clock,
  Sparkles,
  TrendingUp,
  Lightbulb,
  Handshake,
  ChevronDown,
  ChevronUp,
  Briefcase,
  DollarSign,
  Target,
  MoreHorizontal,
  Pause,
  Play,
  RefreshCw,
  Star,
  Package,
  CheckCircle2,
  Shield,
  Zap,
  Swords,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { products } from '@/data/products';
import { industries } from '@/data/industries';
import type { Competitor } from '@/data/competitors';
import { DialogEngine } from '@/utils/dialogEngine';
import { evaluateLead } from '@/utils/leadScoring';
import {
  handleCompetitorMention,
  analyzeCompetitorSentiment,
  generateComparisonScript,
} from '@/utils/competitorAnalyzer';
import type { GeneratedComparisonScript } from '@/utils/competitorAnalyzer';
import { getTopRecommendations, DEFAULT_PRODUCT_CATALOG } from '@/utils/recommender';
import type { LeadGrade, Message } from '@/types';
import ActionInvitePanel from '@/components/action/ActionInvitePanel';
import type { InviteFormData } from '@/components/action/ActionInvitePanel';
import CompetitorComparison from '@/components/chat/CompetitorComparison';

interface ChatMessagePayload {
  competitor?: Competitor;
  comparisonScript?: GeneratedComparisonScript;
  opening?: string;
  newGrade?: LeadGrade;
  previousGrade?: LeadGrade;
  reason?: string;
  product?: typeof products[0];
  productId?: string;
  matchScore?: number;
  [key: string]: unknown;
}

interface ChatMessage extends Message {
  content: string;
  payload?: ChatMessagePayload;
}

const gradeConfig: Record<LeadGrade, { color: string; bg: string; label: string; ring: string }> = {
  A: { color: 'text-emerald-600', bg: 'bg-gradient-to-br from-emerald-400 to-teal-500', label: 'A 级 · 高意向', ring: '#10b981' },
  B: { color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-400 to-indigo-500', label: 'B 级 · 有意向', ring: '#3b82f6' },
  C: { color: 'text-amber-600', bg: 'bg-gradient-to-br from-amber-400 to-orange-500', label: 'C 级 · 待培育', ring: '#f59e0b' },
  D: { color: 'text-slate-500', bg: 'bg-gradient-to-br from-slate-400 to-slate-500', label: 'D 级 · 低优先级', ring: '#94a3b8' },
};

const quickActions = [
  { icon: Phone, label: '发起通话', color: 'from-emerald-500 to-teal-500' },
  { icon: Calendar, label: '预约演示', color: 'from-blue-500 to-indigo-500' },
  { icon: Video, label: '视频会议', color: 'from-purple-500 to-fuchsia-500' },
  { icon: Handshake, label: '线下拜访', color: 'from-amber-500 to-orange-500' },
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [scoreExpanded, setScoreExpanded] = useState(true);
  const [paused, setPaused] = useState(false);
  const [showInvitePanel, setShowInvitePanel] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const engineRef = useRef<DialogEngine>(new DialogEngine('GREETING'));
  const [currentGrade, setCurrentGrade] = useState<LeadGrade>('D');
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState([
    { label: '行业匹配', value: 0, max: 25, icon: Briefcase },
    { label: '场景清晰度', value: 0, max: 30, icon: Target },
    { label: '预算匹配', value: 0, max: 25, icon: DollarSign },
    { label: '决策时间', value: 0, max: 20, icon: Clock },
  ]);
  const [leadProfile, setLeadProfile] = useState(engineRef.current.getLeadProfile());
  const [dialogProgress, setDialogProgress] = useState(0);
  const [currentSuggestedReplies, setCurrentSuggestedReplies] = useState<string[]>([]);
  const [competitorAlert, setCompetitorAlert] = useState<{ name: string; script: string } | null>(null);

  const entryData = useMemo(() => {
    try {
      const raw = localStorage.getItem('entryLead');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  const leadName = entryData?.name || '客户';
  const leadCompany = entryData?.company || '贵公司';
  const leadEmail = entryData?.email || '';

  const recommendedProducts = useMemo((): { id: string; name: string; description: string; imageUrl: string; priceFrom: number; priceTo: number; matchScore: number; matchReasons: string[] }[] => {
    const profile = engineRef.current.getLeadProfile();
    if (!profile.industry && !profile.scenario) return products.slice(0, 3).map((p) => ({ ...p, matchScore: 85, matchReasons: [] }));
    const recInput = {
      industry: profile.industry || '',
      scenario: profile.scenario || '',
      painPoints: profile.painPoints || [],
      budget: profile.budget || 0,
    };
    const results = getTopRecommendations(DEFAULT_PRODUCT_CATALOG, recInput, 3);
    return results.map((r) => ({
      id: r.product.id,
      name: r.product.name,
      description: r.product.description,
      imageUrl: r.product.imageUrl || '',
      priceFrom: r.product.priceMin,
      priceTo: r.product.priceMax,
      matchScore: Math.round(r.totalScore),
      matchReasons: r.matchReasons,
    }));
  }, [leadProfile]);

  const profileCompleteness = useMemo(() => {
    const p = leadProfile;
    let filled = 0;
    if (p.industry) filled++;
    if (p.scenario) filled++;
    if (p.painPoints && p.painPoints.length > 0) filled++;
    if (p.budget > 0) filled++;
    if (p.timeline) filled++;
    return Math.round((filled / 5) * 100);
  }, [leadProfile]);

  useEffect(() => {
    const engine = engineRef.current;
    const question = engine.getCurrentQuestion();
    const initialMsg: ChatMessage = {
      id: `m_init_${Date.now()}`,
      leadId: 'lead_current',
      sender: 'SYSTEM',
      type: 'TEXT',
      content: question.question,
      timestamp: new Date().toISOString(),
    };
    setMessages([initialMsg]);
    setCurrentSuggestedReplies(question.suggestedResponses || []);

    setTimeout(() => {
      const greet = `您好${leadName !== '客户' ? ` ${leadName}` : ''}！欢迎来到 LeadNurture 智能销售助手，我是您的专属 AI 顾问小睿 👋`;
      const greetMsg: ChatMessage = {
        id: `m_greet_${Date.now()}`,
        leadId: 'lead_current',
        sender: 'SYSTEM',
        type: 'TEXT',
        content: greet,
        timestamp: new Date().toISOString(),
      };
      setMessages([greetMsg, { ...initialMsg, id: `m_init_${Date.now() + 1}` }]);
    }, 500);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const recalculateScore = useCallback(() => {
    const profile = engineRef.current.getLeadProfile();
    const result = evaluateLead(
      profile.industry || '',
      profile.scenario || '',
      profile.painPoints || [],
      profile.budget || 0,
      profile.timeline || 'medium',
      {
        budgetRange: profile.budgetRange,
        timelineDays: profile.timelineDays || 0,
      }
    );
    setScore(Math.round(result.totalScore));
    setCurrentGrade(result.grade);
    setScoreBreakdown([
      { label: '行业匹配', value: Math.round(result.industryScore * 0.25), max: 25, icon: Briefcase },
      { label: '场景清晰度', value: Math.round(result.scenarioScore * 0.30), max: 30, icon: Target },
      { label: '预算匹配', value: Math.round(result.budgetScore * 0.25), max: 25, icon: DollarSign },
      { label: '决策时间', value: Math.round(result.timelineScore * 0.20), max: 20, icon: Clock },
    ]);
  }, []);

  const handleSend = useCallback(
    (text?: string) => {
      const content = (text ?? input).trim();
      if (!content || paused) return;

      const userMsg: ChatMessage = {
        id: `m_${Date.now()}`,
        leadId: 'lead_current',
        sender: 'USER',
        type: 'TEXT',
        content,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsTyping(true);
      setCompetitorAlert(null);

      const competitorResult = handleCompetitorMention(content);

      setTimeout(() => {
        const engine = engineRef.current;
        const prevGrade = currentGrade;
        const result = engine.getNextQuestion(content);
        const newProfile = engine.getLeadProfile();
        setLeadProfile({ ...newProfile });
        setDialogProgress(engine.getProgress());
        recalculateScore();

        const newMessages: ChatMessage[] = [];
        const newGrade = engine.getLeadProfile().grade;

        if (result.responseMessage) {
          newMessages.push({
            id: `m_ack_${Date.now()}`,
            leadId: 'lead_current',
            sender: 'SYSTEM',
            type: 'TEXT',
            content: result.responseMessage,
            timestamp: new Date().toISOString(),
          });
        }

        if (competitorResult.detected && competitorResult.competitors.length > 0) {
          const comp = competitorResult.competitors[0];
          const script = competitorResult.scripts[0];
          const sentiment = analyzeCompetitorSentiment(content, comp.name);
          const compScript = generateComparisonScript(comp, { sentiment, style: 'balanced' });

          newMessages.push({
            id: `m_comp_${Date.now()}`,
            leadId: 'lead_current',
            sender: 'SYSTEM',
            type: 'COMPETITOR_COMPARISON',
            content: script.opening,
            payload: {
              competitor: comp,
              comparisonScript: compScript,
              opening: script.opening,
            },
            timestamp: new Date().toISOString(),
          });
          setCompetitorAlert({ name: comp.name, script: script.fullScript });
        }

        if (newGrade && newGrade !== prevGrade && newGrade !== 'D') {
          newMessages.push({
            id: `m_grade_${Date.now()}`,
            leadId: 'lead_current',
            sender: 'SYSTEM',
            type: 'GRADE_UPDATE',
            content: '',
            payload: {
              previousGrade: prevGrade,
              newGrade: newGrade,
              reason: `客户信息完善，评分升级为 ${newGrade} 级`,
            },
            timestamp: new Date().toISOString(),
          });
        }

        if (result.shouldShowRecommendation) {
          const recInput = {
            industry: newProfile.industry || '',
            scenario: newProfile.scenario || '',
            painPoints: newProfile.painPoints || [],
            budget: newProfile.budget || 0,
          };
          const topRecs = getTopRecommendations(DEFAULT_PRODUCT_CATALOG, recInput, 2);
          if (topRecs.length > 0) {
            const topProduct = topRecs[0];
            const matchedProduct = products.find((p) =>
              p.targetIndustries.some((ind) =>
                newProfile.industry?.includes(industries.find((i) => i.id === ind)?.name || '')
              ) || p.targetScenarios.some((s) =>
                newProfile.scenario?.includes(s) || newProfile.painPoints?.some((pp) => s.includes(pp))
              )
            ) || products[0];

            newMessages.push({
              id: `m_prod_${Date.now()}`,
              leadId: 'lead_current',
              sender: 'SYSTEM',
              type: 'PRODUCT_CARD',
              content: '',
              payload: {
                productId: matchedProduct.id,
                product: matchedProduct,
                matchScore: Math.round(topProduct.totalScore),
              },
              timestamp: new Date().toISOString(),
            });
          }
        }

        if (result.nextQuestion) {
          newMessages.push({
            id: `m_next_${Date.now()}`,
            leadId: 'lead_current',
            sender: 'SYSTEM',
            type: 'TEXT',
            content: result.nextQuestion.question,
            timestamp: new Date().toISOString(),
          });
          setCurrentSuggestedReplies(result.nextQuestion.suggestedResponses || []);
        }

        if (result.shouldShowInvitation) {
          newMessages.push({
            id: `m_invite_${Date.now()}`,
            leadId: 'lead_current',
            sender: 'SYSTEM',
            type: 'ACTION_INVITE',
            content: '根据您的情况，我们非常希望能为您提供进一步的服务。请问您更倾向于以下哪种方式深入了解呢？',
            timestamp: new Date().toISOString(),
          });
          setCurrentSuggestedReplies(['预约商务会议', '申请产品演示', '开通免费试用']);
        }

        if (newMessages.length === 0 && !result.responseMessage) {
          newMessages.push({
            id: `m_fallback_${Date.now()}`,
            leadId: 'lead_current',
            sender: 'SYSTEM',
            type: 'TEXT',
            content: '感谢您的回复！还有什么我可以帮助您的吗？',
            timestamp: new Date().toISOString(),
          });
        }

        setMessages((prev) => [...prev, ...newMessages]);
        setIsTyping(false);
      }, 1200 + Math.random() * 800);
    },
    [input, paused, currentGrade, recalculateScore]
  );

  const handleReset = () => {
    engineRef.current = new DialogEngine('GREETING');
    setMessages([]);
    setCurrentGrade('D');
    setScore(0);
    setScoreBreakdown([
      { label: '行业匹配', value: 0, max: 25, icon: Briefcase },
      { label: '场景清晰度', value: 0, max: 30, icon: Target },
      { label: '预算匹配', value: 0, max: 25, icon: DollarSign },
      { label: '决策时间', value: 0, max: 20, icon: Clock },
    ]);
    setLeadProfile(engineRef.current.getLeadProfile());
    setDialogProgress(0);
    setShowInvitePanel(false);
    setCompetitorAlert(null);
    setCurrentSuggestedReplies([]);

    setTimeout(() => {
      const engine = engineRef.current;
      const question = engine.getCurrentQuestion();
      const greet = `您好！欢迎来到 LeadNurture 智能销售助手，我是您的专属 AI 顾问小睿 👋`;
      setMessages([
        {
          id: `m_greet_${Date.now()}`,
          leadId: 'lead_current',
          sender: 'SYSTEM',
          type: 'TEXT',
          content: greet,
          timestamp: new Date().toISOString(),
        },
        {
          id: `m_init_${Date.now()}`,
          leadId: 'lead_current',
          sender: 'SYSTEM',
          type: 'TEXT',
          content: question.question,
          timestamp: new Date().toISOString(),
        },
      ]);
      setCurrentSuggestedReplies(question.suggestedResponses || []);
    }, 300);
  };

  const handleInviteConfirm = (data: InviteFormData) => {
    setShowInvitePanel(false);
    const actionLabel = data.type === 'DEMO' ? '产品演示' : data.type === 'TRIAL' ? '免费试用' : '商务会议';
    const confirmMsg: ChatMessage = {
      id: `m_invite_confirm_${Date.now()}`,
      leadId: 'lead_current',
      sender: 'SYSTEM',
      type: 'TEXT',
      content: `太好了！已为您预约${actionLabel}，时间：${data.scheduledAt}，${data.type !== 'TRIAL' ? `地点：${data.location}，` : ''}期待与您的交流！如有变动，可随时联系我们调整。`,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, confirmMsg]);
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });
  };

  const industryName = useMemo(() => {
    const p = leadProfile;
    if (!p.industry) return '待确认';
    const found = industries.find((i) => p.industry?.includes(i.name));
    return found?.name || p.industry;
  }, [leadProfile]);

  const budgetDisplay = useMemo(() => {
    const b = leadProfile.budget;
    if (!b || b <= 0) return '待确认';
    if (b >= 10000) return `${(b / 10000).toFixed(0)}万+`;
    return `${b}元`;
  }, [leadProfile]);

  const timelineDisplay = useMemo(() => {
    const t = leadProfile.timeline;
    if (!t) return '待确认';
    const map: Record<string, string> = { urgent: '非常紧急', short: '近期规划', medium: '中期规划', long: '长期储备' };
    return map[t] || t;
  }, [leadProfile]);

  const renderMessage = (msg: ChatMessage) => {
    const isUser = msg.sender === 'USER';

    if (msg.type === 'GRADE_UPDATE') {
      const grade = gradeConfig[msg.payload?.newGrade as LeadGrade];
      return (
        <motion.div key={msg.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex justify-center my-3">
          <div className={cn('flex items-center gap-2 px-4 py-2 rounded-full text-white text-sm font-medium shadow-lg', grade.bg)}>
            <Award className="w-4 h-4" />
            <span>线索等级更新为 {msg.payload?.newGrade} 级</span>
            <span className="text-white/80 text-xs">· {msg.payload?.reason}</span>
          </div>
        </motion.div>
      );
    }

    if (msg.type === 'PRODUCT_CARD') {
      const p = (msg.payload?.product as typeof products[0]) || products.find((x) => x.id === msg.payload?.productId) || products[0];
      const matchScore = msg.payload?.matchScore || 85;
      return (
        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-4">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-blue-100 via-teal-50 to-amber-50">
              <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <div className="absolute top-3 left-3">
                <span className="badge badge-primary shadow-lg">🔥 智能推荐</span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-lg bg-black/50 backdrop-blur text-white text-xs font-semibold">匹配度 {matchScore}%</span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base">{p.name}</h4>
                <div className="flex items-center gap-1 text-amber-500 text-sm font-bold flex-shrink-0">
                  <Star className="w-4 h-4 fill-current" />4.9
                </div>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">{p.description}</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(typeof p.coreFeatures[0] === 'string'
                  ? p.coreFeatures
                  : p.coreFeatures.map((f: unknown) => (typeof f === 'object' && f !== null && 'name' in f ? (f as { name: string }).name : String(f)))
                ).slice(0, 3).map((f: string, i: number) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />{f}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                <div>
                  <span className="text-xs text-slate-500">起价</span>
                  <p className="text-lg font-black bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">
                    ¥{(p.priceFrom / 1000).toFixed(1)}k<span className="text-xs font-normal text-slate-400"> /年起</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-outline text-xs h-9">查看详情</button>
                  <button onClick={() => setShowInvitePanel(true)} className="btn btn-primary text-xs h-9"><Handshake className="w-3.5 h-3.5" />预约演示</button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    if (msg.type === 'COMPETITOR_COMPARISON') {
      const comp = msg.payload?.competitor;
      const script = msg.payload?.comparisonScript;
      const opening = msg.payload?.opening || msg.content;
      if (!comp) return null;
      return (
        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-4">
          <CompetitorComparison competitor={comp} script={script} opening={opening} />
        </motion.div>
      );
    }

    if (msg.type === 'ACTION_INVITE') {
      return (
        <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start mb-4">
          <div className="flex gap-3 max-w-[78%]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-md text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                {msg.content}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
        className={cn('flex mb-4', isUser ? 'justify-end' : 'justify-start')}>
        <div className={cn('flex gap-3 max-w-[78%]', isUser && 'flex-row-reverse')}>
          <div className={cn('w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md',
            isUser ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white' : 'bg-gradient-to-br from-teal-500 via-emerald-500 to-blue-500 text-white')}>
            {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          </div>
          <div>
            <div className={cn('px-4 py-3 rounded-2xl text-sm leading-relaxed',
              isUser ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-md shadow-lg shadow-blue-500/20'
                : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-md shadow-sm')}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
            <p className={cn('text-[11px] text-slate-400 mt-1.5 px-1', isUser ? 'text-right' : 'text-left')}>{formatTime(msg.timestamp)}</p>
          </div>
        </div>
      </motion.div>
    );
  };

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="h-[calc(100vh-7rem)] -mx-6 -mt-6 mb-[-1.5rem] flex flex-col">
      <div className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 px-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-900">
              <User className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-slate-800 dark:text-slate-100">{leadName}</h3>
              <span className={cn('badge', currentGrade === 'A' ? 'badge-secondary' : currentGrade === 'B' ? 'badge-primary' : currentGrade === 'C' ? 'badge-accent' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>
                {currentGrade} 级线索
              </span>
              <span className="badge badge-accent">进行中</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
              <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{leadCompany}</span>
              <span className="flex items-center gap-1"><Tag className="w-3 h-3" />{industryName}行业</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />培育进度 {dialogProgress}%</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setPaused(!paused)} className={cn('btn h-9 text-xs', paused ? 'btn-accent' : 'btn-outline')}>
            {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}{paused ? '继续培育' : '暂停培育'}
          </button>
          <button onClick={handleReset} className="btn btn-outline h-9 text-xs"><RefreshCw className="w-4 h-4" />重置对话</button>
          <button className="btn h-9 text-xs btn-primary"><Handshake className="w-4 h-4" />转为人工</button>
          <button className="btn btn-ghost h-9 w-9 p-0"><MoreHorizontal className="w-5 h-5" /></button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-[7] flex flex-col bg-gradient-to-b from-slate-50/50 to-white/30 dark:from-slate-900/30 dark:to-slate-900/10">
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex justify-center mb-6">
              <span className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 shadow-sm">
                今日 {new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })} · 开始对话
              </span>
            </div>
            {messages.map(renderMessage)}

            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-start mb-4">
                  <div className="flex gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-500 via-emerald-500 to-blue-500 flex-shrink-0 flex items-center justify-center shadow-md text-white">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="px-5 py-4 rounded-2xl rounded-tl-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm">
                      <div className="flex gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce-dot" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce-dot-delay-1" />
                        <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce-dot-delay-2" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!isTyping && currentSuggestedReplies.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 ml-12">
                <p className="text-xs text-slate-400 mb-2 flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-500" />建议回复（点击可快速发送）
                </p>
                <div className="flex flex-wrap gap-2">
                  {currentSuggestedReplies.map((reply, i) => (
                    <button key={i} onClick={() => handleSend(reply)}
                      className="px-3 py-2 rounded-xl text-xs text-left transition-all duration-200 max-w-xs bg-white border border-slate-200 text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm">
                      {reply}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4">
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500/30 focus-within:border-blue-400 transition-all">
              <textarea value={input} onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder={paused ? '对话已暂停，点击继续培育恢复' : '输入消息... 按 Enter 发送，Shift+Enter 换行'}
                disabled={paused} rows={2}
                className="w-full px-4 py-3 bg-transparent resize-none outline-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 disabled:opacity-50" />
              <div className="flex items-center justify-between px-3 pb-3 pt-1">
                <div className="flex items-center gap-1">
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Paperclip className="w-4.5 h-4.5" /></button>
                  <button className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors"><Smile className="w-4.5 h-4.5" /></button>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400">{input.length} / 500</span>
                  <button onClick={() => handleSend()} disabled={!input.trim() || isTyping || paused}
                    className={cn('btn h-9 px-5 text-sm font-semibold gap-1.5',
                      input.trim() && !paused ? 'btn-primary' : 'bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200')}>
                    <Send className="w-4 h-4" />发送
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-[3] border-l border-slate-200/60 dark:border-slate-800/60 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl overflow-y-auto flex-shrink-0 min-w-[320px]">
          <div className="p-5 space-y-5">
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-teal-500 p-5 text-white shadow-xl shadow-blue-500/20">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-base">客户画像</h4>
                <span className="px-2 py-0.5 rounded-md bg-white/20 backdrop-blur text-xs font-medium">已完善 {profileCompleteness}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-white/20 mb-5 overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-amber-300 to-white transition-all duration-500" style={{ width: `${profileCompleteness}%` }} />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center"><User className="w-4 h-4" /></div>
                  <div><p className="text-xs text-white/70">联系人</p><p className="font-semibold text-sm">{leadName}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center"><Building2 className="w-4 h-4" /></div>
                  <div><p className="text-xs text-white/70">公司</p><p className="font-semibold text-sm">{leadCompany}</p></div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center"><Mail className="w-4 h-4" /></div>
                  <div><p className="text-xs text-white/70">邮箱</p><p className="font-semibold text-sm">{leadEmail || '待获取'}</p></div>
                </div>
              </div>
              <div className="mt-5 pt-4 border-t border-white/15 flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-xs">{industryName}</span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-xs">预算 {budgetDisplay}</span>
                <span className="px-2.5 py-1 rounded-full bg-white/15 backdrop-blur text-xs">{timelineDisplay}</span>
                {leadProfile.competitorMentions?.map((c, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full bg-orange-400/30 backdrop-blur text-xs">竞品: {c}</span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden">
              <button onClick={() => setScoreExpanded(!scoreExpanded)} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-sm"><TrendingUp className="w-4 h-4 text-white" /></div>
                  <div className="text-left"><h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">评分进度</h4><p className="text-xs text-slate-500">实时更新 · AI 智能评估</p></div>
                </div>
                {scoreExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>
              <AnimatePresence initial={false}>
                {scoreExpanded && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: 'easeOut' }} className="overflow-hidden">
                    <div className="px-4 pb-4 pt-1">
                      <div className="flex items-center gap-5 mb-5">
                        <div className="relative w-32 h-32 flex-shrink-0">
                          <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                            <circle cx="60" cy="60" r="54" fill="none" stroke="currentColor" strokeWidth="10" className="text-slate-100 dark:text-slate-700" />
                            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#scoreGradient)" strokeWidth="10" strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
                            <defs><linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="50%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#f59e0b" /></linearGradient></defs>
                          </svg>
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-black bg-gradient-to-br from-blue-600 via-teal-500 to-amber-500 bg-clip-text text-transparent">{score}</span>
                            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">/ 100 分</span>
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold mb-2 text-white shadow-sm', gradeConfig[currentGrade].bg)}>
                            <Award className="w-3.5 h-3.5" />{gradeConfig[currentGrade].label}
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            {currentGrade === 'A' ? '优质线索，请及时跟进！' : currentGrade === 'B' ? '意向较好，继续深挖需求' : currentGrade === 'C' ? '待培育，建议持续触达' : '信息不足，继续收集客户需求'}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2.5">
                        {scoreBreakdown.map((s) => {
                          const Icon = s.icon;
                          const pct = s.max > 0 ? (s.value / s.max) * 100 : 0;
                          return (
                            <div key={s.label}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-300"><Icon className="w-3.5 h-3.5 text-slate-400" />{s.label}</span>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{s.value}<span className="font-normal text-slate-400"> / {s.max}</span></span>
                              </div>
                              <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                                <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: 'easeOut' }} className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-amber-500" />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 overflow-hidden">
              <div className="flex items-center justify-between p-4 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-sm"><Package className="w-4 h-4 text-white" /></div>
                  <div><h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">推荐产品</h4><p className="text-xs text-slate-500">基于客户画像智能匹配</p></div>
                </div>
                <span className="text-xs font-semibold text-blue-600">共 {recommendedProducts.length} 个</span>
              </div>
              <div className="px-4 pb-4 space-y-3">
                {recommendedProducts.map((p) => (
                  <div key={p.id} className="group flex gap-3 p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 via-teal-50 to-amber-50 flex-shrink-0 overflow-hidden">
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="font-semibold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{p.name}</h5>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 flex-shrink-0">{p.matchScore || 85}%</span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{p.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm font-bold bg-gradient-to-r from-blue-600 to-teal-500 bg-clip-text text-transparent">¥{(p.priceFrom / 1000).toFixed(1)}k 起</span>
                        <button onClick={() => setShowInvitePanel(true)} className="text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">详情 →</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {competitorAlert && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Swords className="w-4 h-4 text-orange-600" />
                  <h4 className="font-bold text-sm text-orange-800 dark:text-orange-300">竞品预警</h4>
                </div>
                <p className="text-xs text-orange-700 dark:text-orange-300 mb-2">客户提及了 <span className="font-bold">{competitorAlert.name}</span>，差异化话术已准备就绪</p>
                <div className="rounded-lg bg-white/60 dark:bg-slate-800/60 p-3 text-xs text-slate-700 dark:text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
                  {competitorAlert.script}
                </div>
              </motion.div>
            )}

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-fuchsia-500 flex items-center justify-center shadow-sm"><Lightbulb className="w-4 h-4 text-white" /></div>
                <div><h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">快捷操作</h4><p className="text-xs text-slate-500">一键推进销售流程</p></div>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((a) => {
                  const Icon = a.icon;
                  return (
                    <button key={a.label} onClick={() => { if (a.label === '预约演示') setShowInvitePanel(true); }}
                      className="group relative flex flex-col items-center justify-center gap-2 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-transparent hover:text-white transition-all overflow-hidden">
                      <span className={cn('absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300', a.color)} />
                      <div className={cn('relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300', 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 group-hover:bg-white/20 group-hover:text-white')}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="relative text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-white transition-colors">{a.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {showInvitePanel && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
                <ActionInvitePanel onConfirm={handleInviteConfirm} onCancel={() => setShowInvitePanel(false)} />
              </motion.div>
            )}

            {leadProfile.painPoints && leadProfile.painPoints.length > 0 && (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-400 to-red-500 flex items-center justify-center shadow-sm"><Target className="w-4 h-4 text-white" /></div>
                  <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">已识别痛点</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {leadProfile.painPoints.map((p, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-xs font-medium text-rose-700 dark:text-rose-300">
                      <Zap className="w-3 h-3" />{p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-sm"><Shield className="w-4 h-4 text-white" /></div>
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-100">对话进度</h4>
              </div>
              <div className="space-y-2">
                {[
                  { label: '问候', done: dialogProgress >= 10 },
                  { label: '行业确认', done: dialogProgress >= 20 },
                  { label: '场景了解', done: dialogProgress >= 35 },
                  { label: '痛点挖掘', done: dialogProgress >= 50 },
                  { label: '预算确认', done: dialogProgress >= 65 },
                  { label: '时间线', done: dialogProgress >= 80 },
                  { label: '产品推荐', done: dialogProgress >= 90 },
                  { label: '邀约行动', done: dialogProgress >= 100 },
                ].map((step) => (
                  <div key={step.label} className="flex items-center gap-2">
                    <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-xs', step.done ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-400')}>
                      {step.done ? <CheckCircle2 className="w-3 h-3" /> : <span className="w-1.5 h-1.5 rounded-full bg-current" />}
                    </div>
                    <span className={cn('text-xs', step.done ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400')}>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
