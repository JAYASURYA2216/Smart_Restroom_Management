import { motion } from "framer-motion";
import type { SensorHistoryPoint } from "../../types/sensors";
import { SpeedometerGauge } from "../gauges/SpeedometerGauge";
import { TrendChart } from "./TrendChart";
import { GlassCard } from "../layout/GlassCard";

const zones = [
  { from: 0, to: 40, color: "rgba(244,63,94,0.92)" }, // Red
  { from: 40, to: 70, color: "rgba(245,158,11,0.95)" }, // Yellow
  { from: 70, to: 100, color: "rgba(16,185,129,0.92)" }, // Green
];

export function HygieneMeter({
  hygieneScore,
  history,
  hygieneAlert,
  threshold,
}: {
  hygieneScore: number;
  history: SensorHistoryPoint[];
  hygieneAlert: boolean;
  threshold: number;
}) {
  return (
    <GlassCard className="h-full">
      <div className="relative">
        {hygieneAlert ? (
          <motion.div
            className="absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-bold
                       bg-red-400/10 border border-red-400/25 text-red-100 shadow-[0_0_30px_rgba(244,63,94,0.25)]"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.1, repeat: Infinity }}
          >
            Below {threshold}
          </motion.div>
        ) : null}

        <div className="flex items-start justify-between">
          <div>
            <div className="text-base sm:text-lg tracking-wide text-slate-300/90 font-semibold">
              Hygiene Score
            </div>
            <div className="mt-1 text-xs text-slate-400">
              Smart Restroom Monitoring System
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center gap-4">
          <SpeedometerGauge
            value={hygieneScore}
            min={0}
            max={100}
            zones={zones}
            unit={undefined}
            label={undefined}
            showCenterValue={false}
            showBelowValue={true}
            belowLabel="Hygiene Score (0-100)"
            size={290}
            startAngle={-170}
            endAngle={170}
            valueFormatter={(v) => String(Math.round(v))}
          />

          <div className="w-full">
            <TrendChart history={history} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

