import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquarePlus,
  LayoutDashboard,
  Package,
  Settings,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Bell,
  Search,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    path: '/entry',
    label: '对话入口',
    icon: MessageSquarePlus,
    description: '开启新的客户对话',
  },
  {
    path: '/chat',
    label: '对话中心',
    icon: Sparkles,
    description: 'AI智能对话培育',
  },
  {
    path: '/dashboard',
    label: '线索看板',
    icon: LayoutDashboard,
    description: '数据分析与管理',
  },
  {
    path: '/products',
    label: '产品管理',
    icon: Package,
    description: '产品配置与维护',
  },
  {
    path: '/settings',
    label: '系统配置',
    icon: Settings,
    description: '参数与规则设置',
  },
];

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-teal-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-teal-950/10 flex">
      <AnimatePresence mode="wait">
        <motion.aside
          initial={false}
          animate={{ width: sidebarOpen ? 264 : 72 }}
          className="relative flex flex-col bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-r border-slate-200/60 dark:border-slate-800/60 shadow-xl shadow-blue-900/5"
        >
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-200/60 dark:border-slate-800/60">
            <motion.div
              animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -20 }}
              className="flex items-center gap-3 overflow-hidden"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-teal-500 to-amber-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div className="whitespace-nowrap">
                <h1 className="text-lg font-bold gradient-text">LeadNurture</h1>
                <p className="text-[10px] text-slate-500">智能线索培育系统</p>
              </div>
            </motion.div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-colors"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      'group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300',
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-teal-500 text-white shadow-lg shadow-blue-500/25'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                    )
                  }
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        className={cn(
                          'w-5 h-5 flex-shrink-0 transition-transform duration-300',
                          isActive ? 'scale-110' : 'group-hover:scale-110'
                        )}
                      />
                      <motion.div
                        animate={{ opacity: sidebarOpen ? 1 : 0, x: sidebarOpen ? 0 : -10 }}
                        className="flex-1 min-w-0 overflow-hidden"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium whitespace-nowrap">
                            {item.label}
                          </span>
                          {isActive && sidebarOpen && (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </div>
                        {sidebarOpen && (
                          <p
                            className={cn(
                              'text-xs mt-0.5 whitespace-nowrap',
                              isActive
                                ? 'text-white/70'
                                : 'text-slate-400 dark:text-slate-500'
                            )}
                          >
                            {item.description}
                          </p>
                        )}
                      </motion.div>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          <motion.div
            animate={{ opacity: sidebarOpen ? 1 : 0, y: sidebarOpen ? 0 : 10 }}
            className="p-3 border-t border-slate-200/60 dark:border-slate-800/60"
          >
            <div
              className={cn(
                'rounded-xl p-3 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/50 dark:border-amber-900/30',
                !sidebarOpen && 'hidden'
              )}
            >
              <p className="text-xs font-medium text-amber-900 dark:text-amber-200 mb-1">
                💡 今日提示
              </p>
              <p className="text-[11px] text-amber-700/80 dark:text-amber-300/70 leading-relaxed">
                A级线索响应时间建议不超过2小时，转化率可提升35%
              </p>
            </div>
          </motion.div>
        </motion.aside>
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                {navItems.find((n) => location.pathname.startsWith(n.path))?.label ??
                  '工作台'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {navItems.find((n) => location.pathname.startsWith(n.path))
                  ?.description ?? '欢迎使用智能线索培育系统'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 w-64">
              <Search className="w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索线索、产品..."
                className="flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 outline-none"
              />
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                ⌘K
              </kbd>
            </div>

            <button className="relative p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

            <div className="flex items-center gap-3 pl-1">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  张经理
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  销售总监
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 ring-2 ring-white dark:ring-slate-800">
                <User className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
