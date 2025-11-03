/**
 * 차트 매매 게임 타입 정의
 */

/**
 * 캔들 데이터 구조
 */
export type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

/**
 * 거래 타입 (매수/매도)
 */
export type TradeType = "buy" | "sell";

/**
 * 거래 이력
 */
export type Trade = {
  turn: number;
  type: TradeType;
  price: number;
  shares: number;
  amount: number;
};

/**
 * 게임 상태
 */
export type GameState = {
  currentTurn: number;
  cash: number;
  shares: number;
  entryPrice: number;
  trades: Trade[];
  currentPrice: number;
};

/**
 * 게임 설정 상수
 */
export const GAME_CONSTANTS = {
  INITIAL_CASH: 10_000_000,
  MAX_TURNS: 50,
  SHARES_PER_TRADE: 100,
} as const;
