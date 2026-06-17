import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  MessageSquare,
  Sliders,
  Bell,
  Palette,
  Save,
  RotateCcw,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Copy,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSettingsStore } from '@/store/useSettingsStore';
import type { Script } from '@/store/useSettingsStore';

type TabType = 'scripts' | 'scoring' | 'notifications' | 'system';

const tabs = [
  { id: 'scripts' as TabType, label: '话术库', icon: MessageSquare, desc: '管理销售话术模板' },
  { id: 'scoring' as TabType, label: '评分配置', icon: Sliders, desc: '线索评分权重与阈值' },
  { id: 'notifications' as TabType, label: '通知设置', icon: Bell, desc: '消息与提醒方式' },
  { id: 'system' as TabType, label: '系统设置', icon: Palette, desc: '主题与基础配置' },
];

export default function SettingsPage() {
  const {
    scripts,
    scriptCategories,
    scoringWeights,
    gradeThresholds,
    notifications,
    system,
    initMockData,
    addScript,
    updateScript,
    deleteScript,
    setScoringWeights,
    resetScoringWeights,
    setGradeThresholds,
    resetGradeThresholds,
    setNotifications,
    setSystemSettings,
    resetToDefaults,
    exportSettings,
    importSettings,
  } = useSettingsStore();

  const [activeTab, setActiveTab] = useState<TabType>('scripts');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showScriptModal, setShowScriptModal] = useState(false);
  const [editingScript, setEditingScript] = useState<Script | null>(null);
  const [scoringLocal, setScoringLocal] = useState(scoringWeights);
  const [thresholdsLocal, setThresholdsLocal] = useState(gradeThresholds);

  useEffect(() => {
    initMockData();
  }, [initMockData]);

  useEffect(() => {
    setScoringLocal(scoringWeights);
    setThresholdsLocal(gradeThresholds);
  }, [scoringWeights, gradeThresholds]);

  const filteredScripts = scripts.filter((s) => {
    if (selectedCategory && s.category !== selectedCategory) return false;
    if (searchKeyword) {
      const kw = searchKeyword.toLowerCase();
      const text = [s.title, s.content, s.category, ...(s.tags || [])].join(' ').toLowerCase();
      if (!text.includes(kw)) return false;
    }
    return true;
  });

  const handleAddScript = () => {
    setEditingScript(null);
    setShowScriptModal(true);
  };

  const handleEditScript = (script: Script) => {
    setEditingScript(script);
    setShowScriptModal(true);
  };

  const handleSaveScoring = () => {
    setScoringWeights(scoringLocal);
  };

  const handleSaveThresholds = () => {
    setGradeThresholds(thresholdsLocal);
  };

  const handleExport = () => {
    const data = exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leadnurture-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e: any) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          const result = ev.target?.result as string;
          if (importSettings(result)) {
            alert('设置导入成功！');
          } else {
            alert('导入失败，请检查文件格式');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">系统配置</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            自定义系统参数，适配您的业务流程
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleImport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Upload className="w-4 h-4" />
            导入配置
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            导出配置
          </button>
          <button
            onClick={() => { if (confirm('确定要重置为默认配置吗？')) resetToDefaults(); }}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            恢复默认
          </button>
        </div>
      </div>

      <div className="flex gap-6">
        <div className="w-56 flex-shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-md'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className={cn('text-sm font-medium', activeTab === tab.id ? 'text-white' : '')}>{tab.label}</p>
                  <p className={cn('text-xs', activeTab === tab.id ? 'text-white/70' : 'text-slate-400 dark:text-slate-500')}>
                    {tab.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-0">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
            <AnimatePresence mode="wait">
              {activeTab === 'scripts' && (
                <motion.div
                  key="scripts"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ScriptsPanel
                    scripts={filteredScripts}
                    categories={scriptCategories}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    searchKeyword={searchKeyword}
                    onSearchChange={setSearchKeyword}
                    onAdd={handleAddScript}
                    onEdit={handleEditScript}
                    onDelete={(id) => { if (confirm('确定删除这个话术？')) deleteScript(id); }}
                  />
                </motion.div>
              )}

              {activeTab === 'scoring' && (
                <motion.div
                  key="scoring"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <ScoringPanel
                    weights={scoringLocal}
                    thresholds={thresholdsLocal}
                    onWeightChange={setScoringLocal}
                    onThresholdChange={setThresholdsLocal}
                    onSaveWeights={handleSaveScoring}
                    onSaveThresholds={handleSaveThresholds}
                    onResetWeights={resetScoringWeights}
                    onResetThresholds={resetGradeThresholds}
                  />
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <NotificationPanel
                    settings={notifications}
                    onChange={setNotifications}
                  />
                </motion.div>
              )}

              {activeTab === 'system' && (
                <motion.div
                  key="system"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <SystemPanel
                    settings={system}
                    onChange={setSystemSettings}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {showScriptModal && (
        <ScriptModal
          script={editingScript}
          categories={scriptCategories.map(c => c.name)}
          onClose={() => setShowScriptModal(false)}
          onSave={(data) => {
            if (editingScript) {
              updateScript(editingScript.id, data);
            } else {
              addScript(data as any);
            }
            setShowScriptModal(false);
          }}
        />
      )}
    </div>
  );
}

function ScriptsPanel({ scripts, categories, selectedCategory, onCategoryChange, searchKeyword, onSearchChange, onAdd, onEdit, onDelete }: {
  scripts: Script[];
  categories: { id: string; name: string; color: string }[];
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  searchKeyword: string;
  onSearchChange: (kw: string) => void;
  onAdd: () => void;
  onEdit: (s: Script) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800 dark:text-white">话术模板</h3>
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 text-white text-sm font-medium shadow hover:shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            新建话术
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="搜索话术..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-4 max-h-[600px] overflow-y-auto space-y-2">
        {scripts.length === 0 ? (
          <div className="py-12 text-center">
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-sm text-slate-500 dark:text-slate-400">暂无匹配的话术</p>
          </div>
        ) : (
          scripts.map((script) => (
            <motion.div
              key={script.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-200 dark:hover:border-blue-800 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onEdit(script)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-slate-800 dark:text-white text-sm">{script.title}</h4>
                    <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-[10px] font-medium">
                      {script.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{script.content}</p>
                  {script.tags && script.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {script.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-[10px] text-slate-500 dark:text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(script.content); }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-600"
                    title="复制"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); onDelete(script.id); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-400 hover:text-red-600"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function ScoringPanel({ weights, thresholds, onWeightChange, onThresholdChange, onSaveWeights, onSaveThresholds, onResetWeights, onResetThresholds }: {
  weights: { industryMatch: number; scenarioClarity: number; budgetRange: number; decisionTimeline: number };
  thresholds: { gradeA: number; gradeB: number; gradeC: number };
  onWeightChange: (w: any) => void;
  onThresholdChange: (t: any) => void;
  onSaveWeights: () => void;
  onSaveThresholds: () => void;
  onResetWeights: () => void;
  onResetThresholds: () => void;
}) {
  const weightItems = [
    { key: 'industryMatch', label: '行业匹配度', desc: '客户所属行业与产品的匹配程度' },
    { key: 'scenarioClarity', label: '场景清晰度', desc: '业务场景和需求的明确程度' },
    { key: 'budgetRange', label: '预算范围', desc: '预算是否明确且在有效区间' },
    { key: 'decisionTimeline', label: '决策时间线', desc: '项目推进的紧迫程度' },
  ];

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  return (
    <div className="p-6 space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">评分权重配置</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">调整各维度在线索评分中的占比</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onResetWeights}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              重置
            </button>
            <button
              onClick={onSaveWeights}
              className="px-3 py-1.5 rounded-lg text-xs text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow hover:shadow-md transition-all"
            >
              <Save className="w-3 h-3 inline mr-1" />
              保存
            </button>
          </div>
        </div>

        <div className={cn(
          'mb-4 px-3 py-2 rounded-lg text-xs font-medium text-center',
          Math.abs(totalWeight - 1) < 0.01
            ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
        )}>
          权重总和：{Math.round(totalWeight * 100)}% {Math.abs(totalWeight - 1) < 0.01 ? '✓ 配置正确' : '（建议总和为100%）'}
        </div>

        <div className="space-y-4">
          {weightItems.map((item) => (
            <div key={item.key} className="flex items-center gap-4">
              <div className="w-32 flex-shrink-0">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
              </div>
              <div className="flex-1">
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(weights[item.key as keyof typeof weights] * 100)}
                  onChange={(e) => onWeightChange({ ...weights, [item.key]: Number(e.target.value) / 100 })}
                  className="w-full accent-blue-500"
                />
              </div>
              <div className="w-16 text-right">
                <span className="text-lg font-bold text-slate-800 dark:text-white">
                  {Math.round(weights[item.key as keyof typeof weights] * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white">等级阈值配置</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">设置不同线索等级的分数门槛</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onResetThresholds}
              className="px-3 py-1.5 rounded-lg text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="w-3 h-3 inline mr-1" />
              重置
            </button>
            <button
              onClick={onSaveThresholds}
              className="px-3 py-1.5 rounded-lg text-xs text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow hover:shadow-md transition-all"
            >
              <Save className="w-3 h-3 inline mr-1" />
              保存
            </button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { key: 'gradeA', label: 'A 级', color: 'from-emerald-500 to-teal-500', desc: '高意向' },
            { key: 'gradeB', label: 'B 级', color: 'from-blue-500 to-indigo-500', desc: '有意向' },
            { key: 'gradeC', label: 'C 级', color: 'from-amber-500 to-orange-500', desc: '待培育' },
          ].map((item) => (
            <div key={item.key} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/30">
              <div className="flex items-center gap-2 mb-3">
                <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-white text-sm font-bold', item.color)}>
                  {item.label.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 dark:text-slate-400">≥</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={thresholds[item.key as keyof typeof thresholds]}
                  onChange={(e) => onThresholdChange({ ...thresholds, [item.key]: Number(e.target.value) })}
                  className="flex-1 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-200 text-center focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <span className="text-xs text-slate-500 dark:text-slate-400">分</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-3">
          低于 C 级阈值的线索将自动归为 D 级（低优先级）
        </p>
      </div>
    </div>
  );
}

function NotificationPanel({ settings, onChange }: {
  settings: any;
  onChange: (s: any) => void;
}) {
  const toggleItems = [
    { key: 'email', label: '邮件通知', desc: '重要线索更新发送邮件提醒', icon: '✉️' },
    { key: 'browser', label: '浏览器通知', desc: '开启桌面推送通知', icon: '🌐' },
    { key: 'sound', label: '声音提醒', desc: '新消息时播放提示音', icon: '🔔' },
  ];

  const eventItems = [
    { key: 'leadGradeChange', label: '线索等级变化', desc: '当线索等级升级或降级时提醒' },
    { key: 'newMessage', label: '新消息到达', desc: '客户回复新消息时提醒' },
    { key: 'scheduledAction', label: '预约行动提醒', desc: '预约的跟进任务到期前提醒' },
  ];

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={cn(
        'relative w-12 h-6 rounded-full transition-colors duration-200',
        checked ? 'bg-gradient-to-r from-blue-600 to-teal-500' : 'bg-slate-300 dark:bg-slate-600'
      )}
    >
      <motion.div
        animate={{ x: checked ? 26 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
      />
    </button>
  );

  return (
    <div className="p-6 space-y-8">
      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">通知方式</h3>
        <div className="space-y-3">
          {toggleItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">{item.icon}</span>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
                </div>
              </div>
              <Toggle
                checked={settings[item.key]}
                onChange={() => onChange({ ...settings, [item.key]: !settings[item.key] })}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-slate-800 dark:text-white mb-4">通知事件</h3>
        <div className="space-y-3">
          {eventItems.map((item) => (
            <div
              key={item.key}
              className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{item.label}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{item.desc}</p>
              </div>
              <Toggle
                checked={settings[item.key]}
                onChange={() => onChange({ ...settings, [item.key]: !settings[item.key] })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemPanel({ settings, onChange }: {
  settings: any;
  onChange: (s: any) => void;
}) {
  return (
    <div className="p-6 space-y-6">
      <h3 className="font-semibold text-slate-800 dark:text-white">基础设置</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">公司名称</label>
          <input
            type="text"
            value={settings.companyName}
            onChange={(e) => onChange({ ...settings, companyName: e.target.value })}
            className="input w-full"
            placeholder="请输入公司名称"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">销售顾问称呼</label>
          <input
            type="text"
            value={settings.salesName}
            onChange={(e) => onChange({ ...settings, salesName: e.target.value })}
            className="input w-full"
            placeholder="请输入销售顾问名称"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">主题模式</label>
          <div className="flex gap-2">
            {['light', 'dark'].map((theme) => (
              <button
                key={theme}
                onClick={() => onChange({ ...settings, theme })}
                className={cn(
                  'flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all',
                  settings.theme === theme
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:border-slate-300'
                )}
              >
                {theme === 'light' ? '☀️ 浅色' : '🌙 深色'}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">界面语言</label>
          <select
            value={settings.language}
            onChange={(e) => onChange({ ...settings, language: e.target.value })}
            className="input w-full"
          >
            <option value="zh-CN">简体中文</option>
            <option value="en-US">English</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">主题色</label>
        <div className="flex items-center gap-3">
          {['#3B82F6', '#14B8A6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'].map((color) => (
            <button
              key={color}
              onClick={() => onChange({ ...settings, primaryColor: color })}
              className={cn(
                'w-8 h-8 rounded-full transition-transform hover:scale-110',
                settings.primaryColor === color ? 'ring-2 ring-offset-2 ring-slate-400 dark:ring-slate-500 scale-110' : ''
              )}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          自动保存间隔（秒）
        </label>
        <input
          type="number"
          min={5}
          max={300}
          value={settings.autoSaveInterval}
          onChange={(e) => onChange({ ...settings, autoSaveInterval: Number(e.target.value) })}
          className="input w-32"
        />
      </div>

      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700">
        <div>
          <p className="text-sm font-medium text-slate-700 dark:text-slate-200">使用分析</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">匿名收集使用数据帮助改进产品</p>
        </div>
        <button
          onClick={() => onChange({ ...settings, enableAnalytics: !settings.enableAnalytics })}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors duration-200',
            settings.enableAnalytics ? 'bg-gradient-to-r from-blue-600 to-teal-500' : 'bg-slate-300 dark:bg-slate-600'
          )}
        >
          <motion.div
            animate={{ x: settings.enableAnalytics ? 26 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-md"
          />
        </button>
      </div>
    </div>
  );
}

function ScriptModal({ script, categories, onClose, onSave }: {
  script: Script | null;
  categories: string[];
  onClose: () => void;
  onSave: (data: Partial<Script>) => void;
}) {
  const [formData, setFormData] = useState<Partial<Script>>({
    title: script?.title || '',
    category: script?.category || categories[0] || '开场白',
    content: script?.content || '',
    tags: script?.tags || [],
  });
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...(formData.tags || []), tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) || [] });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">
            {script ? '编辑话术' : '新建话术'}
          </h3>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">话术标题 *</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input w-full"
                placeholder="请输入标题"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">所属分类</label>
              <select
                value={formData.category || ''}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="input w-full"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">话术内容 *</label>
            <textarea
              value={formData.content || ''}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="input w-full min-h-[160px] resize-none"
              placeholder="请输入话术内容，支持变量占位符如 {name} {company}"
              rows={6}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">标签</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags?.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-medium flex items-center gap-1"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-blue-800">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="flex-1 input"
                placeholder="输入标签后按回车添加"
              />
              <button type="button" onClick={addTag} className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm">
                添加
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-teal-500 shadow-md hover:shadow-lg transition-all"
            >
              <Check className="w-4 h-4 inline mr-1" />
              保存
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
