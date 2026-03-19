import { GlassCard } from "../layout/GlassCard";
import { SpeedometerGauge } from "../gauges/SpeedometerGauge";

const zones = [
  { from: 0, to: 29, color: "rgba(244,63,94,0.92)" }, // Red
  { from: 29, to: 40, color: "rgba(245,158,11,0.95)" }, // Yellow
  { from: 40, to: 60, color: "rgba(16,185,129,0.92)" }, // Green
  { from: 60, to: 70, color: "rgba(245,158,11,0.95)" }, // Yellow
  { from: 70, to: 100, color: "rgba(244,63,94,0.92)" }, // Red
];

export function HumidityCard({ humidity }: { humidity: number }) {
  return (
    <GlassCard>
      <div className="flex flex-col items-center">
        <SpeedometerGauge
          value={humidity}
          min={0}
          max={100}
          zones={zones}
          label="Humidity (%)"
          unit="%"
          size={220}
          startAngle={-140}
          endAngle={140}
          valueFormatter={(v) => String(Math.round(v))}
          centerTitle="Relative"
          showCenterValue={false}
          belowLabel="Relative Humidity"
        />

        <div className="mt-3 text-xs text-slate-400/90 text-center">
          Ventilation affects humidity smoothing.
        </div>
      </div>
    </GlassCard>
  );
}

