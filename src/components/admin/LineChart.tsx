import { useId } from 'react';
import type { ChartPoint } from '../../types';

interface LineChartProps {
  data: ChartPoint[];
  height?: number;
  color?: string;
  valueFormatter?: (v: number) => string;
  labelEvery?: number;
}

const W = 640;
const H = 220;
const PAD = { top: 18, right: 16, bottom: 34, left: 48 };

export default function LineChart({
  data,
  height = 220,
  color = '#f97316',
  valueFormatter = (v) => String(Math.round(v)),
  labelEvery = 1,
}: LineChartProps) {
  const gid = useId();
  if (!data || data.length === 0) {
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

  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const max = Math.max(...data.map((d) => d.value), 1);
  const niceMax = niceCeil(max);

  const x = (i: number) => PAD.left + (data.length === 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);
  const y = (v: number) => PAD.top + innerH - (v / niceMax) * innerH;

  const linePts = data.map((d, i) => `${x(i).toFixed(1)},${y(d.value).toFixed(1)}`);
  const areaPts = `${PAD.left},${PAD.top + innerH} ${linePts.join(' ')} ${PAD.left + innerW},${PAD.top + innerH}`;

  const gridLines = 4;
  const showLabel = (i: number) => (data.length <= 8 ? true : i % labelEvery === 0 || i === data.length - 1);

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }} preserveAspectRatio="none">
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {Array.from({ length: gridLines + 1 }, (_, i) => {
          const gy = PAD.top + (i / gridLines) * innerH;
          const val = niceMax - (i / gridLines) * niceMax;
          return (
            <g key={i}>
              <line x1={PAD.left} y1={gy} x2={W - PAD.right} y2={gy} stroke="#e2e8f0" strokeWidth="1" strokeDasharray="3 3" />
              <text x={PAD.left - 8} y={gy + 3.5} textAnchor="end" fontSize="10" fill="#94a3b8">
                {valueFormatter(Math.round(val))}
              </text>
            </g>
          );
        })}

        <polygon points={areaPts} fill={`url(#${gid})`} />
        <polyline
          points={linePts.join(' ')}
          fill="none"
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <circle key={i} cx={x(i)} cy={y(d.value)} r="2.6" fill="#fff" stroke={color} strokeWidth="2" />
        ))}
      </svg>

      <div className="flex justify-between mt-1 -mx-1" style={{ padding: '0 42px' }}>
        {data.map((d, i) =>
          showLabel(i) ? (
            <span key={i} className="text-[10px] font-medium text-slate-400 truncate">
              {d.label}
            </span>
          ) : null
        )}
      </div>
    </div>
  );
}

function niceCeil(v: number): number {
  if (v <= 0) return 1;
  const pow = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / pow;
  const nice = n <= 1 ? 1 : n <= 2 ? 2 : n <= 5 ? 5 : 10;
  return nice * pow;
}
