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
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
        isDark ? 'text-accent-400 hover:bg-white/10' : 'text-slate-600 hover:text-brand-600 hover:bg-brand-50'
      } ${className}`}
    >
      {isDark ? <Sun size={19} /> : <Moon size={19} />}
    </button>
  );
}
