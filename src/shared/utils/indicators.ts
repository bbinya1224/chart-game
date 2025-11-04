import type { Candle } from "@/shared/types/gameTypes";

/**
 * 이동평균선 (Moving Average) 계산
 * @param candles 캔들 데이터 배열
 * @param period 평균 기간 (예: 5, 20)
 * @returns 이동평균 값 배열 (기간 미만은 null)
 */
export const calculateMA = (candles: Candle[], period: number): (number | null)[] => {
  const ma: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1) {
      ma.push(null);
      continue;
    }

    let sum = 0;
    for (let j = 0; j < period; j++) {
      sum += candles[i - j].close;
    }
    ma.push(sum / period);
  }

  return ma;
};

/**
 * RSI (Relative Strength Index) 계산
 * @param candles 캔들 데이터 배열
 * @param period RSI 기간 (일반적으로 14)
 * @returns RSI 값 배열 (0~100, 기간 미만은 null)
 */
export const calculateRSI = (candles: Candle[], period: number = 14): (number | null)[] => {
  const rsi: (number | null)[] = [];

  if (candles.length < period + 1) {
    return candles.map(() => null);
  }

  // 가격 변화 계산
  const changes: number[] = [];
  for (let i = 1; i < candles.length; i++) {
    changes.push(candles[i].close - candles[i - 1].close);
  }

  for (let i = 0; i < candles.length; i++) {
    if (i < period) {
      rsi.push(null);
      continue;
    }

    let gains = 0;
    let losses = 0;

    for (let j = 0; j < period; j++) {
      const change = changes[i - period + j];
      if (change > 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    const avgGain = gains / period;
    const avgLoss = losses / period;

    if (avgLoss === 0) {
      rsi.push(100);
    } else {
      const rs = avgGain / avgLoss;
      rsi.push(100 - 100 / (1 + rs));
    }
  }

  return rsi;
};

/**
 * 볼린저밴드 계산
 * @param candles 캔들 데이터 배열
 * @param period 이동평균 기간 (일반적으로 20)
 * @param stdDev 표준편차 배수 (일반적으로 2)
 * @returns {upper, middle, lower} 배열
 */
export const calculateBollingerBands = (
  candles: Candle[],
  period: number = 20,
  stdDev: number = 2
): { upper: (number | null)[]; middle: (number | null)[]; lower: (number | null)[] } => {
  const middle = calculateMA(candles, period);
  const upper: (number | null)[] = [];
  const lower: (number | null)[] = [];

  for (let i = 0; i < candles.length; i++) {
    if (i < period - 1 || middle[i] === null) {
      upper.push(null);
      lower.push(null);
      continue;
    }

    // 표준편차 계산
    let sumSquaredDiff = 0;
    for (let j = 0; j < period; j++) {
      const diff = candles[i - j].close - middle[i]!;
      sumSquaredDiff += diff * diff;
    }
    const std = Math.sqrt(sumSquaredDiff / period);

    upper.push(middle[i]! + std * stdDev);
    lower.push(middle[i]! - std * stdDev);
  }

  return { upper, middle, lower };
};
