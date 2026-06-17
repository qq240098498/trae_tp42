import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Smile, X, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickReply {
  id: string;
  text: string;
  icon?: string;
}

interface ChatInputProps {
  onSend: (message: string) => void;
  quickReplies?: QuickReply[];
  disabled?: boolean;
  placeholder?: string;
  maxHeight?: number;
}

export default function ChatInput({
  onSend,
  quickReplies = [],
  disabled = false,
  placeholder = '输入消息，按 Enter 发送，Shift+Enter 换行...',
  maxHeight = 160,
}: ChatInputProps) {
  const [value, setValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    const newHeight = Math.min(textarea.scrollHeight, maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustHeight();
  }, [value]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickReply = (reply: QuickReply) => {
    if (disabled) return;
    onSend(reply.text);
  };

  const canSend = value.trim().length > 0 && !disabled;

  return (
    <div className="w-full space-y-3">
      <AnimatePresence>
        {quickReplies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex flex-wrap gap-2"
          >
            {quickReplies.map((reply) => (
              <motion.button
                key={reply.id}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleQuickReply(reply)}
                disabled={disabled}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm font-medium text-slate-700 shadow-sm transition-all duration-200 hover:border-primary/30 hover:bg-primary/5 hover:text-primary disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-primary/50 dark:hover:bg-primary/10',
                )}
              >
                <Zap className="h-3.5 w-3.5 text-warm-gold-500" />
                {reply.text}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={cn(
          'relative flex items-end gap-2 rounded-2xl border p-2 transition-all duration-300',
          isFocused
            ? 'border-primary/50 bg-white shadow-lg shadow-primary/10 dark:bg-slate-800 dark:shadow-primary/20'
            : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/50',
          disabled && 'opacity-60',
        )}
        animate={{
          boxShadow: isFocused
            ? '0 10px 40px -10px rgba(30, 58, 138, 0.25)'
            : '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        }}
      >
        <div className="flex items-center gap-1 px-1 pb-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <Paperclip className="h-4.5 w-4.5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            type="button"
            disabled={disabled}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed dark:hover:bg-slate-700 dark:hover:text-slate-300"
          >
            <Smile className="h-4.5 w-4.5" />
          </motion.button>
        </div>

        <div className="relative flex-1">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            disabled={disabled}
            rows={1}
            className={cn(
              'block w-full resize-none border-0 bg-transparent px-2 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:ring-0 disabled:cursor-not-allowed dark:text-slate-100 dark:placeholder:text-slate-500',
            )}
            style={{ maxHeight: `${maxHeight}px` }}
          />
          {value.length > 0 && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setValue('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-full bg-slate-200 text-slate-500 transition-colors hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-400 dark:hover:bg-slate-600"
            >
              <X className="h-3 w-3" />
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          <motion.button
            key={canSend ? 'active' : 'inactive'}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            whileHover={canSend ? { scale: 1.05 } : undefined}
            whileTap={canSend ? { scale: 0.95 } : undefined}
            onClick={handleSend}
            disabled={!canSend}
            className={cn(
              'ml-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
              canSend
                ? 'bg-gradient-to-br from-primary to-primary-light text-white shadow-md shadow-primary/30 hover:shadow-lg hover:shadow-primary/40'
                : 'bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500',
            )}
          >
            <Send className={cn('h-4.5 w-4.5', canSend && 'translate-x-px')} />
          </motion.button>
        </AnimatePresence>
      </motion.div>

      <div className="flex justify-between px-1 text-[11px] text-slate-400 dark:text-slate-500">
        <span>支持 Markdown 格式</span>
        <span>{value.length} 字符</span>
      </div>
    </div>
  );
}
