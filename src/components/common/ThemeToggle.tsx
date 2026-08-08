import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  className?: string;
}

export default function ThemeToggle({ className = '' }: Props) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shrink-0 ${className} ${
        isDark
          ? 'bg-white/10 text-brand-400 hover:bg-white/20 border border-white/10'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
      }`}
    >
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
