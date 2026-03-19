import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SensorData, SensorHistoryPoint } from "../types/sensors";

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min);

const INITIAL_DATA: SensorData = {
  hygieneScore: 82,
  airQuality: 38,
  humidity: 45,
};

export function useMockSensors() {
  const [data, setData] = useState<SensorData>(INITIAL_DATA);
  const [history, setHistory] = useState<SensorHistoryPoint[]>(() => [
    { t: Date.now(), hygieneScore: INITIAL_DATA.hygieneScore },
  ]);

  const [cleaningActive, setCleaningActive] = useState(false);
  const [ventilationOn, setVentilationOn] = useState(true);

  const cleaningTimeoutRef = useRef<number | null>(null);
  const latestRef = useRef<SensorData>(data);
  latestRef.current = data;

  const simulateNext = useCallback(() => {
    const prev = latestRef.current;

    // Update environmental sensors first, then derive hygiene score from them.
    const airImprove = cleaningActive ? randomBetween(3, 8) : ventilationOn ? randomBetween(1.5, 5) : 0;
    const airWorsen = cleaningActive ? 0.3 : ventilationOn ? 0.8 : 1.6;
    const nextAir = clamp(
      prev.airQuality + randomBetween(-airImprove, airWorsen * 4) + (Math.random() - 0.5) * 6,
      0,
      150,
    );

    const humidityImprove = cleaningActive
      ? randomBetween(1.5, 4.5)
      : ventilationOn
        ? randomBetween(1, 3.5)
        : 0;
    const humidityWorsen = cleaningActive ? 0.4 : ventilationOn ? 0.9 : 1.8;
    const nextHumidity = clamp(
      prev.humidity + randomBetween(-humidityImprove, humidityWorsen * 3.2) + (Math.random() - 0.5) * 4.2,
      10,
      90,
    );

    // Higher airQuality/humidity deviation reduces hygiene.
    const airFactor = (nextAir / 150) * 45; // 0..45
    const humidityFactor = (Math.abs(nextHumidity - 45) / 55) * 35; // 0..35

    const cleaningBoost = cleaningActive ? 10 : 0;
    const ventilationBoost = ventilationOn ? 5 : 0;
    const noise = (Math.random() - 0.5) * 4;

    const targetHygiene = 100 - airFactor - humidityFactor + cleaningBoost + ventilationBoost + noise;
    const smoothHygiene = prev.hygieneScore + (targetHygiene - prev.hygieneScore) * 0.35;

    const nextHygiene = clamp(smoothHygiene, 0, 100);

    // Update state once per simulation tick.
    setData({ hygieneScore: nextHygiene, airQuality: nextAir, humidity: nextHumidity });
    setHistory((prevHistory) => {
      const nextPoint: SensorHistoryPoint = { t: Date.now(), hygieneScore: nextHygiene };
      const withNew = [...prevHistory, nextPoint];
      // Keep a short rolling window for the chart.
      return withNew.length > 30 ? withNew.slice(withNew.length - 30) : withNew;
    });
  }, [cleaningActive, ventilationOn]);

  useEffect(() => {
    let timeoutId: number | null = null;
    const loop = () => {
      // 2-3 seconds between updates
      const delay = randomBetween(2000, 3000);
      timeoutId = window.setTimeout(() => {
        // Each tick mildly drifts values; hygiene is derived from air/humidity
        // and smoothed so the UI transitions never "jump".
        simulateNext();
        loop();
      }, delay);
    };
    loop();

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [simulateNext]);

  const triggerCleaning = useCallback(() => {
    setCleaningActive(true);
    if (cleaningTimeoutRef.current) window.clearTimeout(cleaningTimeoutRef.current);
    cleaningTimeoutRef.current = window.setTimeout(() => {
      setCleaningActive(false);
    }, 15000);
  }, []);

  const toggleExhaustFan = useCallback(() => {
    setVentilationOn((v) => !v);
  }, []);

  const resetSystem = useCallback(() => {
    if (cleaningTimeoutRef.current) window.clearTimeout(cleaningTimeoutRef.current);
    setCleaningActive(false);
    setVentilationOn(true);

    const reset: SensorData = {
      hygieneScore: clamp(randomBetween(60, 90), 0, 100),
      airQuality: clamp(randomBetween(20, 70), 0, 150),
      humidity: clamp(randomBetween(35, 55), 10, 90),
    };

    latestRef.current = reset;
    setData(reset);
    setHistory([{ t: Date.now(), hygieneScore: reset.hygieneScore }]);
  }, []);

  const alertThreshold = useMemo(() => 42, []);
  const hygieneAlert = data.hygieneScore < alertThreshold;

  return {
    data,
    history,
    cleaningActive,
    ventilationOn,
    hygieneAlert,
    alertThreshold,
    actions: {
      triggerCleaning,
      toggleExhaustFan,
      resetSystem,
    },
  };
}

