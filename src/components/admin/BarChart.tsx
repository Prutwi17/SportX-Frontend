import type { ChartPoint } from '../../types';

interface BarChartProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
  valueFormatter?: (v: number) => string;
  labelEvery?: number;
}

export default function BarChart({
  data,
  height = 220,
  color = '#f97316',
  valueFormatter = (v) => String(Math.round(v)),
  labelEvery = 1,
}: BarChartProps) {
  if (!data || data.length === 0) {
    return <EmptyState height={height} />;
  }

  const max = Math.max(...data.map((d) => d.value), 1);
  const showLabel = (i: number) => (data.length <= 12 ? true : i % labelEvery === 0 || i === data.length - 1);

  return (
    <div className="w-full">
      <div className="flex items-end gap-1.5" style={{ height }}>
        {data.map((d, i) => {
          const h = max > 0 ? Math.max((d.value / max) * 100, d.value > 0 ? 2 : 0) : 0;
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full group min-w-0">
              <div className="relative w-full flex justify-center">
                <div
                  className="w-full max-w-[42px] rounded-t-md transition-all duration-500 group-hover:opacity-90"
                  style={{
                    height: `${h}%`,
                    minHeight: d.value > 0 ? 3 : 0,
                    background: `linear-gradient(180deg, ${color}, ${color}b3)`,
                  }}
                />
                <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded-md shadow-sm border border-slate-100 dark:border-slate-700">
                  {valueFormatter(d.value)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5 mt-2">
        {data.map((d, i) =>
          showLabel(i) ? (
            <div key={i} className="flex-1 text-center text-[10px] font-medium text-slate-400 truncate px-0.5">
              {d.label}
            </div>
          ) : (
            <div key={i} className="flex-1" />
          )
        )}
      </div>
    </div>
  );
}

export function EmptyState({ height = 220 }: { height?: number }) {
  return (
    <div
      className="w-full flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-700"
      style={{ height }}
    >
      <p className="text-sm font-medium text-slate-400">No data available yet</p>
      <p className="text-xs text-slate-400/80 mt-1">Data will appear once orders are placed</p>
    </div>
  );
}
