import { GlassCard } from "../layout/GlassCard";
import { SpeedometerGauge } from "../gauges/SpeedometerGauge";

const zones = [
  { from: 0, to: 50, color: "rgba(16,185,129,0.92)" }, // Green
  { from: 50, to: 90, color: "rgba(245,158,11,0.95)" }, // Yellow
  { from: 90, to: 150, color: "rgba(244,63,94,0.92)" }, // Red
];

export function AirQualityCard({ airQuality }: { airQuality: number }) {
  return (
    <GlassCard>
      <div className="flex flex-col items-center">
        <SpeedometerGauge
          value={airQuality}
          min={0}
          max={150}
          zones={zones}
          label="Air Quality (MQ-135)"
          unit="AQI"
          size={220}
          startAngle={-140}
          endAngle={140}
          valueFormatter={(v) => String(Math.round(v))}
          centerTitle="AQ Index"
          showCenterValue={false}
          belowLabel="MQ-135 AQI Index"
        />

        <div className="mt-3 text-xs text-slate-400/90 text-center">
          Simulated MQ-135 readings update every 2–3 seconds.
        </div>
      </div>
    </GlassCard>
  );
}

