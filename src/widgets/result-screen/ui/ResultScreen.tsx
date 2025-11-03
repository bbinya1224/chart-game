"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/shared/hooks/useGameStore";

/**
 * 결과 화면 위젯
 * - 최종 자산, 수익률, 거래 이력 표시
 * - 다시하기, 홈으로 버튼
 */
export const ResultScreen = () => {
  const router = useRouter();
  const {
    initialCash,
    totalAssets,
    profitRate,
    trades,
    resetGame,
  } = useGameStore();

  const profit = totalAssets - initialCash;

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

  const handleRestart = () => {
    resetGame();
    router.push("/game");
  };

  const handleHome = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">🎮 게임 종료!</h1>
          <p className="text-gray-400">50턴이 모두 끝났습니다</p>
        </div>

        {/* 결과 요약 */}
        <div className="bg-gray-800 rounded-lg p-8 space-y-4">
          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span className="text-xl text-gray-400">초기 자산</span>
            <span className="text-2xl font-mono">
              {formatNumber(initialCash)}원
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span className="text-xl text-gray-400">최종 자산</span>
            <span className="text-2xl font-mono font-bold">
              {formatNumber(totalAssets)}원
            </span>
          </div>

          <div className="flex justify-between items-center border-b border-gray-700 pb-4">
            <span className="text-xl text-gray-400">수익</span>
            <span className={`text-2xl font-mono font-bold ${getProfitColor(profit)}`}>
              {formatNumber(profit)}원
            </span>
          </div>

          <div className="flex justify-between items-center pt-4">
            <span className="text-2xl font-semibold">수익률</span>
            <span className={`text-4xl font-mono font-bold ${getProfitColor(profitRate)}`}>
              {formatPercent(profitRate)}
            </span>
          </div>
        </div>

        {/* 거래 이력 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">📊 거래 이력</h2>

          {trades.length === 0 ? (
            <p className="text-gray-400 text-center py-8">거래 이력이 없습니다</p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {trades.map((trade, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center bg-gray-700 rounded p-3"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 font-mono">턴 {trade.turn}</span>
                    <span
                      className={`font-semibold ${
                        trade.type === "buy" ? "text-blue-400" : "text-red-400"
                      }`}
                    >
                      {trade.type === "buy" ? "매수" : "매도"}
                    </span>
                    <span className="font-mono">
                      {formatNumber(trade.shares)}주 @ {formatNumber(trade.price)}원
                    </span>
                  </div>
                  <span className="font-mono text-gray-300">
                    {formatNumber(trade.amount)}원
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 액션 버튼 */}
        <div className="flex gap-4">
          <button
            onClick={handleRestart}
            className="flex-1 px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-xl font-semibold transition-all"
          >
            다시 하기
          </button>
          <button
            onClick={handleHome}
            className="flex-1 px-8 py-4 bg-gray-700 hover:bg-gray-600 rounded-lg text-xl font-semibold transition-all"
          >
            홈으로
          </button>
        </div>
      </div>
    </div>
  );
};
