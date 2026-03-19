import { useMemo } from "react";
import {
  Area,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import type { SensorHistoryPoint } from "../../types/sensors";

export function TrendChart({ history }: { history: SensorHistoryPoint[] }) {
  const data = useMemo(() => {
    // Keep chart lightweight: last N points for a smooth IoT-like trace.
    const sliced = history.slice(-18);
    return sliced.map((p, i) => ({
      t: i,
      score: p.hygieneScore,
    }));
  }, [history]);

  return (
    <div className="w-full" aria-label="Hygiene score trend">
      <div className="h-[120px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <defs>
              <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(56,189,248,0.35)" />
                <stop offset="100%" stopColor="rgba(56,189,248,0.02)" />
              </linearGradient>
              <linearGradient id="trendStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(56,189,248,0.95)" />
                <stop offset="100%" stopColor="rgba(99,102,241,0.9)" />
              </linearGradient>
            </defs>

            <XAxis dataKey="t" hide />
            <YAxis domain={[0, 100]} hide />

            <Area
              type="monotone"
              dataKey="score"
              stroke="none"
              fill="url(#trendFill)"
              isAnimationActive
              animationDuration={520}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#trendStroke)"
              strokeWidth={2.6}
              dot={false}
              isAnimationActive
              animationDuration={520}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 text-xs text-slate-300/90">
        Live trend (last {Math.min(18, history.length)} updates)
      </div>
    </div>
  );
}

