import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  Rocket,
  Calendar,
  Clock,
  MapPin,
  StickyNote,
  User,
  Mail,
  Phone,
  CheckCircle2,
  CalendarDays,
  ArrowLeft,
  Send,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ActionType } from '@/types';

interface ActionInvitePanelProps {
  selectedType?: ActionType;
  onConfirm?: (data: InviteFormData) => void;
  onCancel?: () => void;
  className?: string;
}

export interface InviteFormData {
  type: ActionType;
  scheduledAt: string;
  duration: number;
  location: string;
  notes: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
}

interface ActionConfig {
  label: string;
  description: string;
  icon: typeof PlayCircle;
  gradient: string;
  bgLight: string;
  border: string;
  text: string;
  durationOptions: number[];
  defaultLocation: string;
}

const actionConfig: Record<ActionType, ActionConfig> = {
  DEMO: {
    label: '产品演示 DEMO',
    description: '30分钟深度产品演示，带您了解核心功能与实际应用场景',
    icon: PlayCircle,
    gradient: 'from-primary to-primary-light',
    bgLight: 'bg-primary/5 dark:bg-primary/10',
    border: 'border-primary/20',
    text: 'text-primary dark:text-primary-light',
    durationOptions: [15, 30, 45, 60],
    defaultLocation: '腾讯会议',
  },
  TRIAL: {
    label: '免费试用 TRIAL',
    description: '开通14天全功能试用账号，亲自体验产品价值',
    icon: Rocket,
    gradient: 'from-teal-green-400 to-teal-green-600',
    bgLight: 'bg-teal-green-50 dark:bg-teal-green-900/20',
    border: 'border-teal-green-20 dark:border-teal-green-700',
    text: 'text-teal-green-700 dark:text-teal-green-300',
    durationOptions: [7, 14, 30],
    defaultLocation: '在线开通',
  },
  MEETING: {
    label: '深度沟通 MEETING',
    description: '与解决方案专家面对面沟通，定制专属方案',
    icon: CalendarDays,
    gradient: 'from-warm-gold-400 to-warm-gold-600',
    bgLight: 'bg-warm-gold-50 dark:bg-warm-gold-900/20',
    border: 'border-warm-gold-200 dark:border-warm-gold-700',
    text: 'text-warm-gold-700 dark:text-warm-gold-300',
    durationOptions: [30, 60, 90, 120],
    defaultLocation: '贵公司会议室',
  },
};

const typeOptions: ActionType[] = ['DEMO', 'TRIAL', 'MEETING'];

const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let h = 9; h <= 18; h++) {
    slots.push(`${h.toString().padStart(2, '0')}:00`);
    if (h < 18) {
      slots.push(`${h.toString().padStart(2, '0')}:30`);
    }
  }
  return slots;
};

const generateDateOptions = () => {
  const dates: { value: string; label: string; weekday: string }[] = [];
  const today = new Date();
  for (let i = 1; i <= 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    dates.push({
      value: d.toISOString().split('T')[0],
      label: `${d.getMonth() + 1}/${d.getDate()}`,
      weekday: weekdayNames[d.getDay()],
    });
  }
  return dates;
};

export default function ActionInvitePanel({
  selectedType,
  onConfirm,
  onCancel,
  className,
}: ActionInvitePanelProps) {
  const [type, setType] = useState<ActionType>(selectedType || 'DEMO');
  const [step, setStep] = useState<1 | 2>(selectedType ? 2 : 1);
  const [formData, setFormData] = useState<Partial<InviteFormData>>({
    type: selectedType || 'DEMO',
    duration: actionConfig[selectedType || 'DEMO'].durationOptions[1],
    location: actionConfig[selectedType || 'DEMO'].defaultLocation,
    notes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
  });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);

  const config = actionConfig[type];
  const timeSlots = generateTimeSlots();
  const dateOptions = generateDateOptions();

  const handleTypeSelect = (t: ActionType) => {
    setType(t);
    setFormData((prev) => ({
      ...prev,
      type: t,
      duration: actionConfig[t].durationOptions[1],
      location: actionConfig[t].defaultLocation,
    }));
  };

  const handleNext = () => {
    setStep(2);
  };

  const handleBack = () => {
    if (selectedType) {
      onCancel?.();
    } else {
      setStep(1);
    }
  };

  const handleSubmit = () => {
    if (!selectedDate || !selectedTime) return;
    const scheduledAt = `${selectedDate}T${selectedTime}:00`;
    const finalData: InviteFormData = {
      type,
      scheduledAt,
      duration: formData.duration || 30,
      location: formData.location || config.defaultLocation,
      notes: formData.notes || '',
      contactName: formData.contactName || '',
      contactEmail: formData.contactEmail || '',
      contactPhone: formData.contactPhone || '',
    };
    setSubmitted(true);
    setTimeout(() => {
      onConfirm?.(finalData);
    }, 1500);
  };

  const canSubmit = selectedDate && selectedTime && formData.contactName;

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={cn('flex flex-col items-center justify-center py-12', className)}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary-light shadow-lg shadow-secondary/30"
        >
          <CheckCircle2 className="h-10 w-10 text-white" />
        </motion.div>
        <h3 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">
          邀约已发送
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          我们会尽快与您联系确认详情
        </p>
      </motion.div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <AnimatePresence mode="wait">
        {step === 1 ? (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                选择邀约类型
              </h3>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                选择最适合您的方式，开启下一步合作
              </p>
            </div>

            <div className="space-y-3">
              {typeOptions.map((t) => {
                const tConfig = actionConfig[t];
                const Icon = tConfig.icon;
                const isSelected = type === t;

                return (
                  <motion.button
                    key={t}
                    whileHover={{ scale: 1.01, y: -2 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleTypeSelect(t)}
                    className={cn(
                      'w-full overflow-hidden rounded-xl border p-4 text-left transition-all duration-300',
                      isSelected
                        ? `${tConfig.border} ${tConfig.bgLight} ring-2 ring-offset-2 dark:ring-offset-slate-800 ring-${t === 'DEMO' ? 'primary' : t === 'TRIAL' ? 'teal-green' : 'warm-gold'}-300/50`
                        : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-slate-600',
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md',
                          tConfig.gradient,
                        )}
                      >
                        <Icon className="h-5.5 w-5.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900 dark:text-white">
                            {tConfig.label}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-secondary-light"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                            </motion.div>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                          {tConfig.description}
                        </p>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:shadow-lg',
                `bg-gradient-to-r ${config.gradient}`,
              )}
            >
              下一步
              <Send className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleBack}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </motion.button>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {config.label}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {config.description}
                </p>
              </div>
            </div>

            <div className={cn('rounded-xl border p-4', config.border, config.bgLight)}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold" className-extra={config.text}>
                <Calendar className="h-4 w-4" />
                选择日期
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {dateOptions.map((d, idx) => {
                  const isSelected = selectedDate === d.value;
                  const isWeekend = d.weekday === '周六' || d.weekday === '周日';
                  return (
                    <motion.button
                      key={d.value}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(d.value)}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className={cn(
                        'flex w-16 shrink-0 flex-col items-center rounded-lg border px-2 py-2.5 transition-all duration-200',
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${config.gradient} text-white shadow-md`
                          : isWeekend
                          ? 'border-slate-200 bg-white/50 text-slate-400 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-500'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500',
                      )}
                    >
                      <span className={cn('text-[11px] font-medium', isSelected ? 'text-white/80' : '')}>
                        {d.weekday}
                      </span>
                      <span className="text-base font-bold">{d.label}</span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={cn('rounded-xl border p-4', config.border, config.bgLight)}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold" className-extra={config.text}>
                <Clock className="h-4 w-4" />
                选择时间
              </div>
              <div className="grid grid-cols-5 gap-2">
                {timeSlots.map((t, idx) => {
                  const isSelected = selectedTime === t;
                  return (
                    <motion.button
                      key={t}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedTime(t)}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.015 }}
                      className={cn(
                        'rounded-lg border py-2 text-xs font-medium transition-all duration-200',
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${config.gradient} text-white shadow-md`
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500',
                      )}
                    >
                      {t}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={cn('rounded-xl border p-4', config.border, config.bgLight)}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold" className-extra={config.text}>
                <Clock className="h-4 w-4" />
                {type === 'TRIAL' ? '试用时长' : '预计时长'}
              </div>
              <div className="flex gap-2">
                {config.durationOptions.map((dur) => {
                  const isSelected = formData.duration === dur;
                  return (
                    <motion.button
                      key={dur}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setFormData((p) => ({ ...p, duration: dur }))}
                      className={cn(
                        'flex-1 rounded-lg border py-2 text-xs font-medium transition-all duration-200',
                        isSelected
                          ? `border-transparent bg-gradient-to-br ${config.gradient} text-white shadow-md`
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-slate-500',
                      )}
                    >
                      {type === 'TRIAL' ? `${dur}天` : `${dur}分钟`}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            <div className={cn('rounded-xl border p-4', config.border, config.bgLight)}>
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold" className-extra={config.text}>
                <User className="h-4 w-4" />
                联系方式
              </div>
              <div className="space-y-3">
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    联系人姓名 *
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData((p) => ({ ...p, contactName: e.target.value }))}
                      placeholder="请输入姓名"
                      className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-primary/30"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      邮箱
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="email"
                        value={formData.contactEmail}
                        onChange={(e) => setFormData((p) => ({ ...p, contactEmail: e.target.value }))}
                        placeholder="邮箱地址"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      电话
                    </label>
                    <div className="relative">
                      <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => setFormData((p) => ({ ...p, contactPhone: e.target.value }))}
                        placeholder="手机号码"
                        className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
                {type !== 'TRIAL' && (
                  <div>
                    <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <MapPin className="mr-1 inline h-3 w-3" />
                      {type === 'DEMO' ? '会议方式' : '会面地点'}
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData((p) => ({ ...p, location: e.target.value }))}
                      placeholder={config.defaultLocation}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-primary/30"
                    />
                  </div>
                )}
                <div>
                  <label className="mb-1 block text-[11px] font-medium text-slate-500 dark:text-slate-400">
                    <StickyNote className="mr-1 inline h-3 w-3" />
                    备注信息
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData((p) => ({ ...p, notes: e.target.value }))}
                    placeholder="有什么特别想了解的？欢迎告诉我们..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:placeholder:text-slate-500 dark:focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: canSubmit ? 1.02 : 1 }}
              whileTap={{ scale: canSubmit ? 0.98 : 1 }}
              onClick={handleSubmit}
              disabled={!canSubmit}
              className={cn(
                'w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white shadow-md transition-all duration-300',
                canSubmit
                  ? `bg-gradient-to-r ${config.gradient} hover:shadow-lg hover:shadow-${type === 'DEMO' ? 'primary' : type === 'TRIAL' ? 'teal-green' : 'warm-gold'}/30`
                  : 'cursor-not-allowed bg-slate-300 dark:bg-slate-700',
              )}
            >
              {!canSubmit && '请选择日期、时间并填写姓名'}
              {canSubmit && (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  确认邀约
                </>
              )}
            </motion.button>

            {onCancel && (
              <button
                onClick={onCancel}
                className="w-full py-2 text-xs text-slate-400 transition-colors hover:text-slate-600 dark:hover:text-slate-300"
              >
                取消
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
