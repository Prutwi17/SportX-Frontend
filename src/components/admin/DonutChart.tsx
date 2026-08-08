import type { NameValue } from '../../types';

interface DonutChartProps {
  data: NameValue[];
  size?: number;
  thickness?: number;
  colors?: string[];
  centerLabel?: string;
  centerValue?: string;
  valueFormatter?: (v: number) => string;
}

const DEFAULT_COLORS = ['#f97316', '#0b0b0b', '#fdba74', '#1a1a1a', '#ea580c', '#4b4b4b', '#f59e0b', '#10b981', '#94a3b8', '#c2410c'];

export default function DonutChart({
  data,
  size = 180,
  thickness = 26,
  colors = DEFAULT_COLORS,
  centerLabel = 'Total',
  centerValue,
  valueFormatter = (v) => String(Math.round(v)),
}: DonutChartProps) {
  const total = data.reduce((sum, d) => sum + (d.value || 0), 0);

  if (!data || data.length === 0 || total <= 0) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700"
        style={{ height: size }}
      >
        <p className="text-sm font-medium text-slate-400">No data available yet</p>
      </div>
    );
  }

  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = data.reduce<({ name: string; value: number; color: string; dash: number; offset: number; fraction: number })[]>((acc, d, i) => {
    const fraction = d.value / total;
    const dash = fraction * circumference;
    const offset = acc.length > 0 ? acc[acc.length - 1].offset + acc[acc.length - 1].dash : 0;
    acc.push({
      ...d,
      color: colors[i % colors.length],
      dash,
      offset,
      fraction,
    });
    return acc;
  }, []);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={thickness}
          />
          {segments.map((s, i) => (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={s.color}
              strokeWidth={thickness}
              strokeDasharray={`${s.dash} ${circumference - s.dash}`}
              strokeDashoffset={-s.offset}
              strokeLinecap="butt"
            />
          ))}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-extrabold text-slate-900">
            {centerValue ?? (total > 0 ? valueFormatter(total) : '0')}
          </span>
          <span className="text-xs font-medium text-slate-400 mt-0.5">{centerLabel}</span>
        </div>
      </div>

      <div className="w-full min-w-0 flex-1 space-y-2">
        {segments.map((s, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span className="w-3 h-3 rounded-full shrink-0" style={{ background: s.color }} />
            <span className="text-slate-600 dark:text-slate-300 truncate flex-1">{s.name}</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">
              {valueFormatter(s.value)}
            </span>
            <span className="text-xs text-slate-400 w-11 text-right">
              {Math.round(s.fraction * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
