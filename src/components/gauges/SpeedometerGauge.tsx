import { useMotionValueEvent, useSpring } from "framer-motion";
import { useMemo, useState } from "react";

export type GaugeZone = {
  from: number;
  to: number;
  color: string;
};

export type SpeedometerGaugeProps = {
  value: number;
  min: number;
  max: number;
  zones: GaugeZone[];
  label?: string;
  unit?: string;
  centerTitle?: string;
  showCenterValue?: boolean; // whether to render the number/unit overlay
  showBelowValue?: boolean; // whether to render the value below the meter
  belowLabel?: string; // small caption under the below value
  size?: number; // px
  startAngle?: number; // degrees in SVG space
  endAngle?: number; // degrees in SVG space
  valueFormatter?: (v: number) => string;
};

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  // SVG angle: 0deg points to the right; we convert by subtracting 90deg so that -90 is up.
  const angleRad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  };
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, startAngle);
  const end = polarToCartesian(cx, cy, r, endAngle);

  const delta = Math.abs(endAngle - startAngle);
  const largeArcFlag = delta <= 180 ? 0 : 1;
  // Sweep is always 1 because our angle mapping produces a consistent direction.
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArcFlag} 1 ${end.x} ${end.y}`;
}

export function SpeedometerGauge({
  value,
  min,
  max,
  zones,
  label,
  unit,
  centerTitle,
  showCenterValue = true,
  showBelowValue = true,
  belowLabel,
  size = 210,
  startAngle = -135,
  endAngle = 135,
  valueFormatter,
}: SpeedometerGaugeProps) {
  const vb = 200;
  // CRITICAL: all needle rotations must pivot around this exact center.
  const cx = 100;
  const cy = 100;

  const radius = 78;
  const trackWidth = 10;
  const zoneWidth = 12;
  // Thin needle and long enough to reach near the arc.
  const needleLength = radius - 6;
  // Fixed SVG units so all gauges share identical needle proportions.
  // (The SVG itself scales via the `size` prop, so these units should not depend on size.)
  const needleStrokeWidth = 2.2; // thin shaft width in viewBox units
  const arrowHeadHalfWidth = 7; // triangle base half-width
  const arrowHeadHeight = 22; // triangle head height

  const clampedValue = clamp(value, min, max);

  const targetAngle = useMemo(() => {
    const ratio = (clampedValue - min) / (max - min || 1);
    return startAngle + ratio * (endAngle - startAngle);
  }, [clampedValue, min, max, startAngle, endAngle]);

  // Spring-animated needle rotation for a speedometer-like feel.
  const needleAngle = useSpring(targetAngle, { stiffness: 320, damping: 30, mass: 0.35 });
  const [needleAngleDisplay, setNeedleAngleDisplay] = useState(() => targetAngle);
  // Keep the SVG transform attribute driven by the spring (smooth animation, no CSS rotation).
  useMotionValueEvent(needleAngle, "change", (latest) => {
    setNeedleAngleDisplay(latest);
  });
  const [displayValue, setDisplayValue] = useState(() => Math.round(clampedValue));

  // Smooth number transitions (rounded) synced with the spring.
  const valueSpring = useSpring(clampedValue, { stiffness: 280, damping: 26, mass: 0.25 });
  useMotionValueEvent(valueSpring, "change", (latest) => {
    setDisplayValue(Math.round(latest));
  });

  const formatValue = (v: number) => (valueFormatter ? valueFormatter(v) : String(v));

  const arcPath = describeArc(cx, cy, radius, startAngle, endAngle);

  const valueToAngle = (v: number) => {
    const ratio = (clamp(v, min, max) - min) / (max - min || 1);
    return startAngle + ratio * (endAngle - startAngle);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {label ? (
        <div className="text-base sm:text-lg tracking-wide text-slate-300/90 font-semibold">
          {label}
        </div>
      ) : (
        <div className="h-5" />
      )}

      <div className="relative" style={{ width: size, height: size }}>
        <svg viewBox="0 0 200 200" className="w-full h-full">
          <path d={arcPath} stroke="rgba(148, 163, 184, 0.18)" strokeWidth={trackWidth} fill="none" strokeLinecap="round" />

          {zones.map((z, idx) => {
            const a0 = valueToAngle(z.from);
            const a1 = valueToAngle(z.to);
            const d = describeArc(cx, cy, radius, a0, a1);
            return (
              <path
                key={`${z.from}-${z.to}-${idx}`}
                d={d}
                stroke={z.color}
                strokeWidth={zoneWidth}
                fill="none"
                strokeLinecap="round"
                opacity={0.98}
              />
            );
          })}

          {/* Needle */}
          <g transform={`rotate(${needleAngleDisplay} ${cx} ${cy})`}>
            {/* Solid filled needle (pure SVG shapes; no CSS transforms):
                - shaft: thin rectangle
                - head: triangle
                - base anchored at the gauge center via the SVG rotation pivot */}
            {(() => {
              const halfShaft = needleStrokeWidth / 2; // rectangle half-width (viewBox units)
              const tipY = cy - needleLength;
              const headBaseY = tipY + arrowHeadHeight;
              const halfHead = arrowHeadHalfWidth;

              // Shaft spans from center (cy) up to headBaseY.
              const shaftY = headBaseY;
              const shaftHeight = cy - headBaseY;
              const shaftX = cx - halfShaft;
              const shaftW = halfShaft * 2;

              return (
                <>
                  <rect
                    x={shaftX}
                    y={shaftY}
                    width={shaftW}
                    height={shaftHeight}
                    fill="#ff3b3b"
                    rx={0.8}
                    ry={0.8}
                  />
                  <polygon
                    points={[
                      `${cx - halfHead} ${headBaseY}`,
                      `${cx + halfHead} ${headBaseY}`,
                      `${cx} ${tipY}`,
                    ].join(" ")}
                    fill="#ff3b3b"
                  />
                </>
              );
            })()}
          </g>
        </svg>

        {showCenterValue ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-3xl font-semibold tracking-tight text-white/95 tabular-nums">
              {formatValue(displayValue)}
            </div>
            {unit ? <div className="mt-0.5 text-sm text-slate-300/90">{unit}</div> : null}
            {centerTitle ? <div className="mt-0.5 text-xs text-slate-300/80">{centerTitle}</div> : null}
          </div>
        ) : null}
      </div>

      {showBelowValue ? (
        <div className="mt-1 text-center">
          <div className="text-3xl font-semibold tracking-tight text-white/95 tabular-nums">
            {(() => {
              const n = formatValue(displayValue);
              if (!unit) return n;
              if (unit.trim() === "%") return `${n}%`;
              return `${n} ${unit}`;
            })()}
          </div>
          {belowLabel ? <div className="mt-0.5 text-xs text-slate-300/80">{belowLabel}</div> : null}
        </div>
      ) : null}
    </div>
  );
}

