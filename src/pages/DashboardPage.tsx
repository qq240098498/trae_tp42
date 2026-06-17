import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import {
  Users,
  Award,
  TrendingUp,
  Target,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Phone,
  Mail,
  MoreHorizontal,
  Download,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { industries } from '@/data/industries';
import type { LeadGrade, LeadStatus } from '@/types';

interface LeadRow {
  id: string;
  name: string;
  company: string;
  email: string;
  industry: string;
  grade: LeadGrade;
  status: LeadStatus;
  score: number;
  createdAt: string;
  lastContact: string;
}

const trendData = [
  { date: '06/11', A: 3, B: 8, C: 12, D: 15, total: 38 },
  { date: '06/12', A: 5, B: 10, C: 9, D: 12, total: 36 },
  { date: '06/13', A: 4, B: 12, C: 11, D: 10, total: 37 },
  { date: '06/14', A: 7, B: 9, C: 14, D: 13, total: 43 },
  { date: '06/15', A: 6, B: 14, C: 10, D: 11, total: 41 },
  { date: '06/16', A: 9, B: 12, C: 13, D: 9, total: 43 },
  { date: '06/17', A: 8, B: 15, C: 11, D: 10, total: 44 },
];

const industryData = industries.slice(0, 6).map((ind, i) => ({
  name: ind.name,
  value: [32, 28, 24, 19, 15, 12][i],
}));

const PIE_COLORS = [
  '#3b82f6',
  '#14b8a6',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
];

const gradeColor: Record<LeadGrade, string> = {
  A: 'bg-emerald-500',
  B: 'bg-blue-500',
  C: 'bg-amber-500',
  D: 'bg-slate-400',
};

const gradeBadgeClass: Record<LeadGrade, string> = {
  A: 'badge-secondary',
  B: 'badge-primary',
  C: 'badge-accent',
  D: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
};

const statusLabels: Record<LeadStatus, string> = {
  NEW: '新线索',
  QUALIFYING: '验证中',
  QUALIFIED: '已验证',
  PROPOSAL: '方案中',
  NEGOTIATION: '谈判中',
  CLOSED_WON: '已成交',
  CLOSED_LOST: '已流失',
};

const statusColor: Record<LeadStatus, string> = {
  NEW: 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  QUALIFYING: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300',
  QUALIFIED: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  PROPOSAL: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  NEGOTIATION: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  CLOSED_WON: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  CLOSED_LOST: 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300',
};

const mockLeads: LeadRow[] = Array.from({ length: 28 }, (_, i) => {
  const grades: LeadGrade[] = ['A', 'B', 'C', 'D'];
  const statuses: LeadStatus[] = [
    'NEW',
    'QUALIFYING',
    'QUALIFIED',
    'PROPOSAL',
    'NEGOTIATION',
    'CLOSED_WON',
    'CLOSED_LOST',
  ];
  const names = ['李明', '王芳', '张伟', '刘洋', '陈静', '杨帆', '赵磊', '黄丽', '周强', '吴敏'];
  const companies = [
    '智云科技',
    '星辰数据',
    '瀚海软件',
    '巅峰互联',
    '启明信息',
    '纵横网络',
    '卓越数码',
    '未来科技',
    '云端智能',
    '智慧集团',
  ];
  const g = grades[Math.floor(Math.random() * 4)];
  return {
    id: `L${(10000 + i).toString()}`,
    name: names[i % 10],
    company: `${companies[i % 10]}${i > 9 ? ` · ${String.fromCharCode(65 + (i % 26))}分公司` : ''}`,
    email: `contact${i + 1}@company${(i % 5) + 1}.com`,
    industry: industries[i % industries.length].name,
    grade: g,
    status: statuses[Math.floor(Math.random() * 7)],
    score: g === 'A' ? 85 + Math.floor(Math.random() * 15) : g === 'B' ? 70 + Math.floor(Math.random() * 15) : g === 'C' ? 50 + Math.floor(Math.random() * 20) : 30 + Math.floor(Math.random() * 20),
    createdAt: `2026-06-${(11 + (i % 7)).toString().padStart(2, '0')}`,
    lastContact: `${Math.floor(Math.random() * 24)}小时前`,
  };
});

const gradeStats = [
  {
    label: 'A 级线索',
    value: 42,
    delta: '+12.5%',
    up: true,
    icon: Award,
    gradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    bgIcon: 'bg-emerald-500',
  },
  {
    label: 'B 级线索',
    value: 91,
    delta: '+8.3%',
    up: true,
    icon: TrendingUp,
    gradient: 'from-blue-400 via-indigo-500 to-violet-500',
    bgIcon: 'bg-blue-500',
  },
  {
    label: 'C 级线索',
    value: 128,
    delta: '-2.1%',
    up: false,
    icon: Users,
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    bgIcon: 'bg-amber-500',
  },
  {
    label: '总转化率',
    value: '23.8%',
    delta: '+3.6%',
    up: true,
    icon: Target,
    gradient: 'from-purple-400 via-fuchsia-500 to-pink-500',
    bgIcon: 'bg-purple-500',
  },
];

export default function DashboardPage() {
  const [search, setSearch] = useState('');
  const [gradeFilter, setGradeFilter] = useState<LeadGrade | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'ALL'>('ALL');
  const [industryFilter, setIndustryFilter] = useState<string>('ALL');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = useMemo(() => {
    return mockLeads.filter((l) => {
      if (search) {
        const s = search.toLowerCase();
        if (
          !l.name.toLowerCase().includes(s) &&
          !l.company.toLowerCase().includes(s) &&
          !l.email.toLowerCase().includes(s) &&
          !l.id.toLowerCase().includes(s)
        )
          return false;
      }
      if (gradeFilter !== 'ALL' && l.grade !== gradeFilter) return false;
      if (statusFilter !== 'ALL' && l.status !== statusFilter) return false;
      if (industryFilter !== 'ALL' && l.industry !== industryFilter) return false;
      return true;
    });
  }, [search, gradeFilter, statusFilter, industryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
      >
        {gradeStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="relative group"
            >
              <div
                className={cn(
                  'absolute -inset-0.5 rounded-2xl bg-gradient-to-br opacity-0 group-hover:opacity-70 blur transition-opacity duration-500',
                  s.gradient
                )}
              />
              <div className="relative rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
                <div
                  className={cn(
                    'absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br opacity-10',
                    s.gradient
                  )}
                />
                <div className="relative flex items-start justify-between mb-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center shadow-lg',
                      s.bgIcon
                    )}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span
                    className={cn(
                      'inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-bold',
                      s.up
                        ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400'
                    )}
                  >
                    {s.up ? (
                      <ArrowUpRight className="w-3 h-3" />
                    ) : (
                      <ArrowDownRight className="w-3 h-3" />
                    )}
                    {s.delta}
                  </span>
                </div>
                <div className="relative">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">
                    {s.label}
                  </p>
                  <p className="text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
                    {s.value}
                    <span className="ml-1 text-sm font-medium text-slate-400">
                      {typeof s.value === 'number' ? '条' : ''}
                    </span>
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500" />
                7 日线索趋势
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">各级别线索数量变化走势</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="btn btn-outline h-8 text-xs">
                <RefreshCw className="w-3.5 h-3.5" />
                刷新
              </button>
              <button className="btn h-8 text-xs btn-primary">
                <Download className="w-3.5 h-3.5" />
                导出
              </button>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-100 dark:text-slate-700" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={{ stroke: '#e2e8f0' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.1)',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="A" stroke="#10b981" strokeWidth={2.5} fill="url(#gradA)" name="A级" />
                <Area type="monotone" dataKey="B" stroke="#3b82f6" strokeWidth={2.5} fill="url(#gradB)" name="B级" />
                <Line type="monotone" dataKey="C" stroke="#f59e0b" strokeWidth={2} dot={false} name="C级" />
                <Line type="monotone" dataKey="D" stroke="#94a3b8" strokeWidth={2} dot={false} name="D级" strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            {[
              { c: '#10b981', l: 'A级' },
              { c: '#3b82f6', l: 'B级' },
              { c: '#f59e0b', l: 'C级' },
              { c: '#94a3b8', l: 'D级' },
            ].map((x) => (
              <div key={x.l} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: x.c }} />
                <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  {x.l}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 p-5 shadow-sm"
        >
          <div className="mb-4">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">行业分布</h3>
            <p className="text-xs text-slate-500 mt-0.5">按线索来源行业统计</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={industryData}
                  cx="50%"
                  cy="45%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {industryData.map((_, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '11px', paddingTop: 8 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 shadow-sm overflow-hidden"
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">线索列表</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                共找到 <span className="font-bold text-blue-600">{filtered.length}</span> 条线索
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="搜索姓名/公司/编号..."
                  className="input pl-9 h-9 w-full sm:w-56 text-sm"
                />
              </div>

              <select
                value={gradeFilter}
                onChange={(e) => {
                  setGradeFilter(e.target.value as LeadGrade | 'ALL');
                  setPage(1);
                }}
                className="input h-9 w-full sm:w-32 text-sm"
              >
                <option value="ALL">全部等级</option>
                <option value="A">A 级</option>
                <option value="B">B 级</option>
                <option value="C">C 级</option>
                <option value="D">D 级</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as LeadStatus | 'ALL');
                  setPage(1);
                }}
                className="input h-9 w-full sm:w-36 text-sm"
              >
                <option value="ALL">全部状态</option>
                {(
                  [
                    'NEW',
                    'QUALIFYING',
                    'QUALIFIED',
                    'PROPOSAL',
                    'NEGOTIATION',
                    'CLOSED_WON',
                    'CLOSED_LOST',
                  ] as LeadStatus[]
                ).map((s) => (
                  <option key={s} value={s}>
                    {statusLabels[s]}
                  </option>
                ))}
              </select>

              <select
                value={industryFilter}
                onChange={(e) => {
                  setIndustryFilter(e.target.value);
                  setPage(1);
                }}
                className="input h-9 w-full sm:w-36 text-sm"
              >
                <option value="ALL">全部行业</option>
                {industries.map((i) => (
                  <option key={i.id} value={i.name}>
                    {i.name}
                  </option>
                ))}
              </select>

              <button className="btn btn-outline h-9 text-sm">
                <Filter className="w-4 h-4" />
                更多筛选
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-900/40 text-left">
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  线索信息
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  行业
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  等级
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  评分
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  创建时间
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  最后联系
                </th>
                <th className="px-5 py-3.5 font-semibold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="w-10 h-10 text-slate-300" />
                      <p className="text-sm">暂无匹配的线索数据</p>
                    </div>
                  </td>
                </tr>
              ) : (
                pageData.map((l) => (
                  <motion.tr
                    key={l.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-blue-50/40 dark:hover:bg-blue-950/20 transition-colors group"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm',
                            gradeColor[l.grade]
                          )}
                        >
                          {l.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">
                              {l.name}
                            </p>
                            <span className="text-[10px] font-mono text-slate-400">#{l.id}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate max-w-[200px]">
                            {l.company}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300">{l.industry}</td>
                    <td className="px-5 py-4">
                      <span className={cn('badge', gradeBadgeClass[l.grade])}>
                        <Award className="w-3 h-3 mr-1" />
                        {l.grade} 级
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          statusColor[l.status]
                        )}
                      >
                        {statusLabels[l.status]}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-1.5 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-teal-500 to-amber-500"
                            style={{ width: `${l.score}%` }}
                          />
                        </div>
                        <span className="font-bold text-slate-700 dark:text-slate-200 text-xs w-8">
                          {l.score}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {l.createdAt}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {l.lastContact}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-blue-600 transition-colors" title="查看详情">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-emerald-600 transition-colors" title="拨打电话">
                          <Phone className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 hover:text-amber-600 transition-colors" title="发送邮件">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 transition-colors" title="更多">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/30">
          <p className="text-xs text-slate-500">
            显示第 <span className="font-semibold text-slate-700 dark:text-slate-300">{(page - 1) * pageSize + 1}</span> -{' '}
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {Math.min(page * pageSize, filtered.length)}
            </span>{' '}
            条，共 <span className="font-semibold text-slate-700 dark:text-slate-300">{filtered.length}</span> 条
          </p>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={cn(
                  'min-w-8 h-8 px-2.5 rounded-lg text-xs font-semibold transition-all',
                  p === page
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md shadow-blue-500/30'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
