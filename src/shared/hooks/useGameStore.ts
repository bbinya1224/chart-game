import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  gameStateAtom,
  currentPriceAtom,
  positionValueAtom,
  unrealizedProfitAtom,
  totalAssetsAtom,
  profitRateAtom,
  canBuyAtom,
  canSellAtom,
  buySharesAtom,
  sellSharesAtom,
  nextTurnAtom,
  resetGameAtom,
  visibleCandleDataAtom,
} from "@/shared/atoms/gameAtom";
import { GAME_CONSTANTS } from "@/shared/types/gameTypes";

/**
 * 게임 스토어 커스텀 훅
 * - 게임 상태 및 액션을 관리
 * - 매수/매도/턴 진행 로직 포함
 */
export const useGameStore = () => {
  // 상태 읽기
  const [gameState] = useAtom(gameStateAtom);
  const currentPrice = useAtomValue(currentPriceAtom);
  const positionValue = useAtomValue(positionValueAtom);
  const unrealizedProfit = useAtomValue(unrealizedProfitAtom);
  const totalAssets = useAtomValue(totalAssetsAtom);
  const profitRate = useAtomValue(profitRateAtom);
  const canBuy = useAtomValue(canBuyAtom);
  const canSell = useAtomValue(canSellAtom);
  const visibleCandleData = useAtomValue(visibleCandleDataAtom);

  // 액션
  const buyShares = useSetAtom(buySharesAtom);
  const sellShares = useSetAtom(sellSharesAtom);
  const nextTurn = useSetAtom(nextTurnAtom);
  const resetGame = useSetAtom(resetGameAtom);

  // 평가손익률 계산
  const unrealizedProfitRate =
    gameState.shares > 0 && gameState.entryPrice > 0
      ? ((currentPrice - gameState.entryPrice) / gameState.entryPrice) * 100
      : 0;

  // 게임 종료 여부
  const isGameOver = gameState.currentTurn > GAME_CONSTANTS.MAX_TURNS;

  // 마지막 턴 여부
  const isLastTurn = gameState.currentTurn === GAME_CONSTANTS.MAX_TURNS;

  return {
    // 기본 상태
    currentTurn: gameState.currentTurn,
    maxTurns: GAME_CONSTANTS.MAX_TURNS,
    initialCash: GAME_CONSTANTS.INITIAL_CASH,
    cash: gameState.cash,
    shares: gameState.shares,
    entryPrice: gameState.entryPrice,
    realizedProfit: gameState.realizedProfit,
    trades: gameState.trades,

    // 계산된 값
    currentPrice,
    positionValue,
    unrealizedProfit,
    unrealizedProfitRate,
    totalAssets,
    profitRate,

    // 차트 데이터
    visibleCandleData,

    // 상태 플래그
    canBuy,
    canSell,
    isGameOver,
    isLastTurn,

    // 액션
    buyShares,
    sellShares,
    nextTurn,
    resetGame,
  };
};
