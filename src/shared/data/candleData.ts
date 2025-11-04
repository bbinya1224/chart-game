import type { Candle } from "@/shared/types/gameTypes";

/**
 * 80개의 캔들 데이터
 * - 처음 30개: 게임 시작 전 과거 차트 (인덱스 0~29)
 * - 나머지 50개: 게임 턴 데이터 (인덱스 30~79, 턴 1~50)
 * - 게임 시작가(인덱스 30): 12,500원
 * - 가격 범위: 10,000 ~ 15,000원
 */
export const candleData: Candle[] = [
  // === 과거 차트 (30개) ===
  // 초기 상승 추세
  { open: 11000, high: 11150, low: 10950, close: 11100, volume: 120000 },
  { open: 11100, high: 11250, low: 11050, close: 11200, volume: 130000 },
  { open: 11200, high: 11350, low: 11150, close: 11300, volume: 140000 },
  { open: 11300, high: 11450, low: 11250, close: 11400, volume: 150000 },
  { open: 11400, high: 11550, low: 11350, close: 11500, volume: 160000 },

  // 조정 (하락)
  { open: 11500, high: 11550, low: 11300, close: 11350, volume: 170000 },
  { open: 11350, high: 11400, low: 11150, close: 11200, volume: 165000 },
  { open: 11200, high: 11250, low: 11000, close: 11050, volume: 160000 },
  { open: 11050, high: 11100, low: 10850, close: 10900, volume: 155000 },
  { open: 10900, high: 10950, low: 10700, close: 10750, volume: 150000 },

  // 횡보
  { open: 10750, high: 10850, low: 10700, close: 10800, volume: 135000 },
  { open: 10800, high: 10900, low: 10750, close: 10850, volume: 130000 },
  { open: 10850, high: 10950, low: 10800, close: 10900, volume: 125000 },
  { open: 10900, high: 11000, low: 10850, close: 10950, volume: 120000 },
  { open: 10950, high: 11050, low: 10900, close: 11000, volume: 125000 },

  // 상승 전환
  { open: 11000, high: 11200, low: 10950, close: 11150, volume: 140000 },
  { open: 11150, high: 11350, low: 11100, close: 11300, volume: 155000 },
  { open: 11300, high: 11500, low: 11250, close: 11450, volume: 170000 },
  { open: 11450, high: 11650, low: 11400, close: 11600, volume: 185000 },
  { open: 11600, high: 11800, low: 11550, close: 11750, volume: 200000 },

  // 강한 상승
  { open: 11750, high: 11950, low: 11700, close: 11900, volume: 220000 },
  { open: 11900, high: 12100, low: 11850, close: 12050, volume: 240000 },
  { open: 12050, high: 12250, low: 12000, close: 12200, volume: 260000 },
  { open: 12200, high: 12400, low: 12150, close: 12350, volume: 280000 },
  { open: 12350, high: 12550, low: 12300, close: 12500, volume: 300000 },

  // 고점 근처 횡보
  { open: 12500, high: 12600, low: 12400, close: 12550, volume: 290000 },
  { open: 12550, high: 12650, low: 12450, close: 12500, volume: 280000 },
  { open: 12500, high: 12600, low: 12400, close: 12550, volume: 270000 },
  { open: 12550, high: 12650, low: 12450, close: 12500, volume: 260000 },
  { open: 12500, high: 12600, low: 12400, close: 12500, volume: 250000 },

  // === 게임 턴 시작 (50개) ===
  // 턴 1-10: 상승 추세
  { open: 12500, high: 12650, low: 12400, close: 12550, volume: 150000 },
  { open: 12550, high: 12700, low: 12500, close: 12680, volume: 180000 },
  { open: 12680, high: 12800, low: 12600, close: 12750, volume: 200000 },
  { open: 12750, high: 12900, low: 12700, close: 12850, volume: 220000 },
  { open: 12850, high: 13000, low: 12800, close: 12950, volume: 250000 },
  { open: 12950, high: 13100, low: 12850, close: 13050, volume: 270000 },
  { open: 13050, high: 13200, low: 12950, close: 13150, volume: 300000 },
  { open: 13150, high: 13300, low: 13050, close: 13250, volume: 320000 },
  { open: 13250, high: 13400, low: 13150, close: 13350, volume: 350000 },
  { open: 13350, high: 13500, low: 13250, close: 13450, volume: 380000 },

  // 턴 11-20: 조정 (하락)
  { open: 13450, high: 13550, low: 13300, close: 13400, volume: 340000 },
  { open: 13400, high: 13500, low: 13200, close: 13250, volume: 310000 },
  { open: 13250, high: 13350, low: 13050, close: 13100, volume: 280000 },
  { open: 13100, high: 13200, low: 12900, close: 12950, volume: 260000 },
  { open: 12950, high: 13050, low: 12750, close: 12850, volume: 240000 },
  { open: 12850, high: 12950, low: 12650, close: 12750, volume: 220000 },
  { open: 12750, high: 12850, low: 12550, close: 12650, volume: 200000 },
  { open: 12650, high: 12750, low: 12450, close: 12550, volume: 180000 },
  { open: 12550, high: 12650, low: 12350, close: 12450, volume: 160000 },
  { open: 12450, high: 12550, low: 12250, close: 12350, volume: 140000 },

  // 턴 21-30: 추가 하락
  { open: 12350, high: 12450, low: 12150, close: 12250, volume: 130000 },
  { open: 12250, high: 12350, low: 12050, close: 12150, volume: 120000 },
  { open: 12150, high: 12250, low: 11950, close: 12050, volume: 110000 },
  { open: 12050, high: 12150, low: 11850, close: 11950, volume: 100000 },
  { open: 11950, high: 12050, low: 11750, close: 11850, volume: 95000 },
  { open: 11850, high: 11950, low: 11700, close: 11800, volume: 90000 },
  { open: 11800, high: 11900, low: 11650, close: 11750, volume: 85000 },
  { open: 11750, high: 11850, low: 11600, close: 11700, volume: 80000 },
  { open: 11700, high: 11850, low: 11650, close: 11800, volume: 90000 },
  { open: 11800, high: 11950, low: 11750, close: 11900, volume: 100000 },

  // 턴 31-40: 반등
  { open: 11900, high: 12050, low: 11850, close: 12000, volume: 120000 },
  { open: 12000, high: 12150, low: 11950, close: 12100, volume: 140000 },
  { open: 12100, high: 12250, low: 12050, close: 12200, volume: 160000 },
  { open: 12200, high: 12350, low: 12150, close: 12300, volume: 180000 },
  { open: 12300, high: 12450, low: 12250, close: 12400, volume: 200000 },
  { open: 12400, high: 12550, low: 12350, close: 12500, volume: 220000 },
  { open: 12500, high: 12700, low: 12450, close: 12650, volume: 240000 },
  { open: 12650, high: 12850, low: 12600, close: 12800, volume: 260000 },
  { open: 12800, high: 13000, low: 12750, close: 12950, volume: 280000 },
  { open: 12950, high: 13150, low: 12900, close: 13100, volume: 300000 },

  // 턴 41-50: 강한 상승 마무리
  { open: 13100, high: 13300, low: 13050, close: 13250, volume: 320000 },
  { open: 13250, high: 13450, low: 13200, close: 13400, volume: 340000 },
  { open: 13400, high: 13600, low: 13350, close: 13550, volume: 360000 },
  { open: 13550, high: 13750, low: 13500, close: 13700, volume: 380000 },
  { open: 13700, high: 13900, low: 13650, close: 13850, volume: 400000 },
  { open: 13850, high: 14050, low: 13800, close: 14000, volume: 420000 },
  { open: 14000, high: 14200, low: 13950, close: 14150, volume: 440000 },
  { open: 14150, high: 14350, low: 14100, close: 14300, volume: 460000 },
  { open: 14300, high: 14500, low: 14250, close: 14450, volume: 480000 },
  { open: 14450, high: 14650, low: 14400, close: 14600, volume: 500000 },
];
