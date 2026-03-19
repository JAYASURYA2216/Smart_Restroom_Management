export type SensorData = {
  hygieneScore: number; // 0..100
  airQuality: number; // MQ-135 (arbitrary index for UI)
  humidity: number; // %
};

export type SensorHistoryPoint = {
  t: number; // epoch millis
  hygieneScore: number;
};

