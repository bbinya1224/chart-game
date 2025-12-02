"use client";

import { useGameStore } from "@/shared/hooks/useGameStore";

/**
 * 게임 상태 정보 컴포넌트
 * - 현금, 보유주식, 평가손익, 실현손익, 총 자산, 수익률 표시
 */
export const StatusInfo = () => {
  const {
    cash,
    shares,
    entryPrice,
    unrealizedProfit,
    unrealizedProfitRate,
    realizedProfit,
    totalAssets,
    profitRate,
    initialCash,
  } = useGameStore();

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  const formatPercent = (num: number) => {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(2)}%`;
  };

  const getProfitColor = (value: number) => {
    if (value > 0) return "text-green-500";
    if (value < 0) return "text-red-500";
    return "text-gray-400";
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 space-y-3">
      {/* 현금 */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400">💰 현금</span>
        <span className="text-white font-mono text-lg">
          {formatNumber(cash)}원
        </span>
      </div>

      {/* 보유 주식 */}
      <div className="flex justify-between items-center">
        <span className="text-gray-400">📈 보유</span>
        <span className="text-white font-mono">
          {shares > 0
            ? `${formatNumber(shares)}주 @ ${formatNumber(entryPrice)}원`
            : "보유 없음"}
        </span>
      </div>

      {/* 평가 손익 */}
      {shares > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">📊 평가손익</span>
          <span className={`font-mono ${getProfitColor(unrealizedProfit)}`}>
            {formatNumber(unrealizedProfit)}원 ({formatPercent(unrealizedProfitRate)})
          </span>
        </div>
      )}

      {/* 실현 손익 */}
      {realizedProfit !== 0 && (
        <div className="flex justify-between items-center">
          <span className="text-gray-400">💵 실현손익</span>
          <span className={`font-mono ${getProfitColor(realizedProfit)}`}>
            {formatNumber(realizedProfit)}원
          </span>
        </div>
      )}

      {/* 구분선 */}
      <div className="border-t border-gray-700 pt-3">
        {/* 총 자산 */}
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 font-semibold">🎯 총 자산</span>
          <span className="text-white font-mono text-xl font-bold">
            {formatNumber(totalAssets)}원
          </span>
        </div>

        {/* 수익률 */}
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-semibold">📈 수익률</span>
          <span
            className={`font-mono text-lg font-bold ${getProfitColor(profitRate)}`}
          >
            {formatPercent(profitRate)}
          </span>
        </div>

        {/* 손익 금액 */}
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-400 text-sm">손익</span>
          <span
            className={`font-mono text-sm ${getProfitColor(totalAssets - initialCash)}`}
          >
            {formatNumber(totalAssets - initialCash)}원
          </span>
        </div>
      </div>
    </div>
  );
};
