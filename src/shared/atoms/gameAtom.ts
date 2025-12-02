import { atom, type PrimitiveAtom } from "jotai";
import type { Trade } from "@/shared/types/gameTypes";
import { GAME_CONSTANTS } from "@/shared/types/gameTypes";
import { candleData } from "@/shared/data/candleData";

/**
 * 게임 기본 상태 atom
 */
const baseGameStateAtom = atom({
  currentTurn: 1,
  cash: GAME_CONSTANTS.INITIAL_CASH as number,
  shares: 0,
  entryPrice: 0,
  realizedProfit: 0,
  trades: [] as Trade[],
});

/**
 * 현재 가격 계산 (읽기 전용)
 * 인덱스 = PAST_CANDLES + currentTurn - 1
 */
export const currentPriceAtom = atom((get) => {
  const { currentTurn } = get(baseGameStateAtom);
  const turnIndex = GAME_CONSTANTS.PAST_CANDLES + currentTurn - 1;
  return candleData[turnIndex]?.close ?? 0;
});

/**
 * 보유 주식 평가액 계산 (읽기 전용)
 */
export const positionValueAtom = atom((get) => {
  const { shares } = get(baseGameStateAtom);
  const currentPrice = get(currentPriceAtom);
  return shares * currentPrice;
});

/**
 * 평가 손익 계산 (읽기 전용)
 */
export const unrealizedProfitAtom = atom((get) => {
  const { shares, entryPrice } = get(baseGameStateAtom);
  const currentPrice = get(currentPriceAtom);
  if (shares === 0) return 0;
  return (currentPrice - entryPrice) * shares;
});

/**
 * 총 자산 계산 (읽기 전용)
 */
export const totalAssetsAtom = atom((get) => {
  const { cash } = get(baseGameStateAtom);
  const positionValue = get(positionValueAtom);
  return cash + positionValue;
});

/**
 * 수익률 계산 (읽기 전용)
 */
export const profitRateAtom = atom((get) => {
  const totalAssets = get(totalAssetsAtom);
  const profit = totalAssets - GAME_CONSTANTS.INITIAL_CASH;
  return (profit / GAME_CONSTANTS.INITIAL_CASH) * 100;
});

/**
 * 매수 가능 여부 (읽기 전용)
 */
export const canBuyAtom = atom((get) => {
  const { cash } = get(baseGameStateAtom);
  const currentPrice = get(currentPriceAtom);
  const requiredCash = currentPrice * GAME_CONSTANTS.SHARES_PER_TRADE;
  return cash >= requiredCash;
});

/**
 * 매도 가능 여부 (읽기 전용)
 */
export const canSellAtom = atom((get) => {
  const { shares } = get(baseGameStateAtom);
  return shares > 0;
});

/**
 * 게임 상태 읽기/쓰기 atom
 */
export const gameStateAtom = atom(
  (get) => get(baseGameStateAtom),
  (get, set, update: Partial<typeof baseGameStateAtom extends PrimitiveAtom<infer T> ? T : never>) => {
    const current = get(baseGameStateAtom);
    set(baseGameStateAtom, { ...current, ...update });
  }
);

/**
 * 매수 액션 atom
 */
export const buySharesAtom = atom(null, (get, set) => {
  const state = get(baseGameStateAtom);
  const currentPrice = get(currentPriceAtom);
  const canBuy = get(canBuyAtom);

  if (!canBuy) {
    console.warn("매수 불가: 자금 부족");
    return;
  }

  const sharesToBuy = GAME_CONSTANTS.SHARES_PER_TRADE;
  const cost = currentPrice * sharesToBuy;

  // 평단가 계산
  const totalShares = state.shares + sharesToBuy;
  const totalCost = state.shares * state.entryPrice + cost;
  const newEntryPrice = totalShares > 0 ? totalCost / totalShares : 0;

  // 거래 기록 추가
  const newTrade: Trade = {
    turn: state.currentTurn,
    type: "buy",
    price: currentPrice,
    shares: sharesToBuy,
    amount: cost,
  };

  set(baseGameStateAtom, {
    ...state,
    cash: state.cash - cost,
    shares: totalShares,
    entryPrice: newEntryPrice,
    trades: [...state.trades, newTrade],
  });
});

/**
 * 매도 액션 atom
 */
export const sellSharesAtom = atom(null, (get, set) => {
  const state = get(baseGameStateAtom);
  const currentPrice = get(currentPriceAtom);
  const canSell = get(canSellAtom);

  if (!canSell) {
    console.warn("매도 불가: 보유 주식 없음");
    return;
  }

  const sharesToSell = 1; // 1주 매도
  const revenue = currentPrice * sharesToSell;

  // 실현손익 계산 (평단가 기준)
  const profit = (currentPrice - state.entryPrice) * sharesToSell;

  // 거래 기록 추가
  const newTrade: Trade = {
    turn: state.currentTurn,
    type: "sell",
    price: currentPrice,
    shares: sharesToSell,
    amount: revenue,
  };

  const remainingShares = state.shares - sharesToSell;
  // 전량 매도시 평단가 초기화, 아니면 유지
  const newEntryPrice = remainingShares === 0 ? 0 : state.entryPrice;

  set(baseGameStateAtom, {
    ...state,
    cash: state.cash + revenue,
    shares: remainingShares,
    entryPrice: newEntryPrice,
    realizedProfit: state.realizedProfit + profit,
    trades: [...state.trades, newTrade],
  });
});

/**
 * 다음 턴 액션 atom
 * 턴 50에서 "다음" 클릭 시 자동 매도 후 게임 종료
 */
export const nextTurnAtom = atom(null, (get, set) => {
  const state = get(baseGameStateAtom);

  if (state.currentTurn > GAME_CONSTANTS.MAX_TURNS) {
    console.warn("게임 종료: 이미 게임이 끝났습니다");
    return;
  }

  // 턴 50에서 자동 매도 후 게임 종료
  if (state.currentTurn === GAME_CONSTANTS.MAX_TURNS) {
    if (state.shares > 0) {
      set(sellSharesAtom);
    }
    // 턴을 51로 증가시켜 isGameOver = true 되도록
    set(baseGameStateAtom, {
      ...get(baseGameStateAtom), // sellSharesAtom 이후 상태 반영
      currentTurn: state.currentTurn + 1,
    });
    return;
  }

  // 일반 턴 증가
  set(baseGameStateAtom, {
    ...state,
    currentTurn: state.currentTurn + 1,
  });
});

/**
 * 게임 리셋 액션 atom
 */
export const resetGameAtom = atom(null, (get, set) => {
  set(baseGameStateAtom, {
    currentTurn: 1,
    cash: GAME_CONSTANTS.INITIAL_CASH,
    shares: 0,
    entryPrice: 0,
    realizedProfit: 0,
    trades: [],
  });
});

/**
 * 차트 데이터 읽기 전용 atom
 */
export const candleDataAtom = atom(() => candleData);

/**
 * 현재 턴까지의 차트 데이터 (읽기 전용)
 * 과거 캔들 + 현재 턴까지 모두 표시
 */
export const visibleCandleDataAtom = atom((get) => {
  const { currentTurn } = get(baseGameStateAtom);
  return candleData.slice(0, GAME_CONSTANTS.PAST_CANDLES + currentTurn);
});
