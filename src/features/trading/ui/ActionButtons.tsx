"use client";

import { useGameStore } from "@/shared/hooks/useGameStore";
import { GAME_CONSTANTS } from "@/shared/types/gameTypes";

/**
 * 게임 액션 버튼 컴포넌트
 * - 매수, 매도, 다음 버튼
 * - 버튼 활성화/비활성화 로직
 */
export const ActionButtons = () => {
  const {
    canBuy,
    canSell,
    isLastTurn,
    currentPrice,
    buyShares,
    sellShares,
    nextTurn,
  } = useGameStore();

  const requiredCash = currentPrice * GAME_CONSTANTS.SHARES_PER_TRADE;

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-3">
      {/* 매수 버튼 */}
      <button
        onClick={buyShares}
        disabled={!canBuy}
        className={`
          w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all
          ${
            canBuy
              ? "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }
        `}
        title={
          canBuy
            ? `${GAME_CONSTANTS.SHARES_PER_TRADE}주 매수 (${requiredCash.toLocaleString()}원)`
            : "자금 부족"
        }
      >
        💰 매수
        <div className="text-sm font-normal mt-1">
          {GAME_CONSTANTS.SHARES_PER_TRADE}주 / {requiredCash.toLocaleString()}원
        </div>
      </button>

      {/* 매도 버튼 */}
      <button
        onClick={sellShares}
        disabled={!canSell}
        className={`
          w-full px-6 py-4 rounded-lg font-semibold text-lg transition-all
          ${
            canSell
              ? "bg-red-600 hover:bg-red-700 text-white cursor-pointer"
              : "bg-gray-700 text-gray-500 cursor-not-allowed"
          }
        `}
        title={canSell ? "보유 주식 전량 매도" : "보유 주식 없음"}
      >
        💵 매도
        <div className="text-sm font-normal mt-1">전량 매도</div>
      </button>

      {/* 다음 버튼 */}
      <button
        onClick={nextTurn}
        className="w-full px-6 py-4 rounded-lg font-semibold text-lg bg-green-600 hover:bg-green-700 text-white transition-all"
      >
        {isLastTurn ? "🎮 게임 종료" : "▶️ 다음"}
        <div className="text-sm font-normal mt-1">
          {isLastTurn ? "결과 확인" : "다음 턴"}
        </div>
      </button>
    </div>
  );
};
