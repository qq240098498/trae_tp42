import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  User,
  Building2,
  Mail,
  ArrowRight,
  Shield,
  Zap,
  BarChart3,
  CheckCircle2,
  Globe2,
  TrendingUp,
  Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormData {
  name: string;
  company: string;
  email: string;
}

const features = [
  {
    icon: Shield,
    title: '企业级安全',
    desc: '数据加密存储，符合合规标准',
    color: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Zap,
    title: '智能培育',
    desc: 'AI驱动，精准洞察客户需求',
    color: 'from-amber-500 to-orange-500',
  },
  {
    icon: BarChart3,
    title: '转化提升',
    desc: '平均线索转化率提升 42%',
    color: 'from-teal-500 to-emerald-500',
  },
];

const trustedBy = [
  '华为云',
  '阿里云',
  '腾讯云',
  '字节跳动',
  '美团',
  '京东科技',
];

export default function EntryPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { name: '', company: '', email: '' },
  });

  const watchedFields = watch();
  const filledCount = Object.values(watchedFields).filter((v) => v.trim()).length;
  const progress = (filledCount / 3) * 100;

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1200));
    localStorage.setItem(
      'entryLead',
      JSON.stringify({
        ...data,
        id: `lead_${Date.now()}`,
        createdAt: new Date().toISOString(),
      })
    );
    navigate('/chat');
  };

  return (
    <div className="min-h-[calc(100vh-3rem)] -mx-6 -mt-6 mb-[-1.5rem] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-indigo-900 to-slate-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(59,130,246,0.8) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(20,184,166,0.6) 0%, transparent 45%), radial-gradient(circle at 60% 80%, rgba(245,158,11,0.5) 0%, transparent 40%)',
            backgroundSize: '100% 100%',
            animation: 'gradient 8s ease infinite',
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-white/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 min-h-[calc(100vh-3rem)] flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-7xl grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-3 text-white"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8"
            >
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm font-medium text-white/90">
                企业级 SaaS 智能销售助手 · 已服务 2000+ 客户
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex items-center gap-4 mb-6"
            >
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 via-teal-400 to-amber-400 flex items-center justify-center shadow-2xl shadow-blue-500/40">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <motion.div
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-blue-500/40 via-teal-400/40 to-amber-400/40 -z-10 blur-xl"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-black tracking-tight">
                  LeadNurture
                </h1>
                <p className="text-sm text-white/60 font-medium">
                  智能线索培育系统 · v3.2
                </p>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl lg:text-6xl font-black leading-[1.1] tracking-tight mb-6"
            >
              让每一条线索
              <br />
              都成为{' '}
              <span className="bg-gradient-to-r from-blue-300 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                高价值商机
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg lg:text-xl text-white/70 leading-relaxed mb-10 max-w-xl"
            >
              AI 驱动的对话式销售助手，通过多轮智能对话深度挖掘客户需求，
              自动完成线索分级与产品匹配，让销售团队专注于真正有价值的客户。
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="grid sm:grid-cols-3 gap-4 mb-10"
            >
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.55 + i * 0.1, duration: 0.5 }}
                    className="group relative rounded-2xl p-5 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                  >
                    <div
                      className={cn(
                        'w-11 h-11 rounded-xl bg-gradient-to-br flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300',
                        f.color
                      )}
                    >
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">
                      {f.title}
                    </h3>
                    <p className="text-sm text-white/60 leading-relaxed">{f.desc}</p>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <p className="text-xs text-white/40 uppercase tracking-wider font-semibold mb-4">
                值得信赖的合作伙伴
              </p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 opacity-60">
                {trustedBy.map((brand) => (
                  <div
                    key={brand}
                    className="flex items-center gap-2 text-white/80 font-semibold text-lg"
                  >
                    <Globe2 className="w-4 h-4 text-teal-300" />
                    {brand}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-2"
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-blue-500/30 via-teal-400/30 to-amber-400/30 blur-2xl"
                animate={{ scale: [1, 1.04, 1], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              />
              <div className="relative rounded-3xl bg-white/95 backdrop-blur-2xl shadow-2xl shadow-blue-950/40 border border-white/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 px-7 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white">开启智能对话</h3>
                      <p className="text-sm text-white/80 mt-0.5">
                        填写信息，开始 AI 线索培育之旅
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-5 h-1.5 rounded-full bg-white/20 overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-300 via-white to-teal-200"
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-white/70 font-medium">
                    <span>信息完成度</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="p-7 space-y-5">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <User className="w-4 h-4 text-blue-600" />
                      联系人姓名
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="请输入您的姓名"
                        className={cn(
                          'input pl-11 h-12 text-base',
                          errors.name && 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        )}
                        {...register('name', {
                          required: '请输入姓名',
                          minLength: { value: 2, message: '姓名至少2个字符' },
                        })}
                      />
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      {watch('name') && !errors.name && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Building2 className="w-4 h-4 text-teal-600" />
                      公司名称
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="请输入公司全称"
                        className={cn(
                          'input pl-11 h-12 text-base',
                          errors.company && 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        )}
                        {...register('company', {
                          required: '请输入公司名称',
                          minLength: { value: 2, message: '公司名称至少2个字符' },
                        })}
                      />
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      {watch('company') && !errors.company && (
                        <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                      )}
                    </div>
                    {errors.company && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {errors.company.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                      <Mail className="w-4 h-4 text-amber-600" />
                      企业邮箱
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="name@company.com"
                        className={cn(
                          'input pl-11 h-12 text-base',
                          errors.email && 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
                        )}
                        {...register('email', {
                          required: '请输入邮箱',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: '请输入有效的邮箱地址',
                          },
                        })}
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      {watch('email') &&
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(watch('email')) &&
                        !errors.email && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                        )}
                    </div>
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-1.5 text-xs text-red-500 font-medium flex items-center gap-1"
                      >
                        <span className="w-1 h-1 rounded-full bg-red-500" />
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={!isValid || isSubmitting}
                      className={cn(
                        'w-full h-14 rounded-2xl text-base font-bold text-white transition-all duration-300 relative overflow-hidden group',
                        isValid
                          ? 'bg-gradient-to-r from-blue-600 via-indigo-600 to-teal-500 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5 active:translate-y-0'
                          : 'bg-slate-300 cursor-not-allowed'
                      )}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                      <span className="relative flex items-center justify-center gap-2">
                        {isSubmitting ? (
                          <>
                            <svg
                              className="w-5 h-5 animate-spin"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="3"
                                className="opacity-25"
                              />
                              <path
                                fill="currentColor"
                                className="opacity-75"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            正在初始化对话...
                          </>
                        ) : (
                          <>
                            开始智能对话
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-6 pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Shield className="w-3.5 h-3.5 text-emerald-500" />
                      <span>数据加密</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                      <span>隐私保护</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-500" />
                      <span>无承诺</span>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
