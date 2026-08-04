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
      className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
        isDark
          ? 'bg-slate-800 text-yellow-300 border border-slate-700 hover:bg-slate-700'
          : 'bg-slate-100 text-slate-800 border border-slate-200 hover:bg-slate-200'
      } ${className}`}
    >
      {isDark ? (
        <>
          <Sun size={15} className="text-yellow-400 shrink-0" />
          <span className="text-white font-semibold">Light</span>
        </>
      ) : (
        <>
          <Moon size={15} className="text-slate-700 shrink-0" />
          <span className="text-slate-800 font-semibold">Dark</span>
        </>
      )}
    </button>
  );
}
