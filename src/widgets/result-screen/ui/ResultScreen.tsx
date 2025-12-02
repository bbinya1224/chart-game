"use client";

import { useRouter } from "next/navigation";
import { useGameStore } from "@/shared/hooks/useGameStore";
import { Modal } from "@/shared/ui/Modal";
import { GameResult } from "@/widgets/GameResult";

type ResultScreenProps = {
  isOpen: boolean;
  onClose?: () => void;
};

/**
 * 결과 화면 모달 위젯
 * - 최종 자산, 수익률, 거래 이력 표시
 * - 다시하기, 홈으로 버튼
 */
export const ResultScreen = ({ isOpen, onClose }: ResultScreenProps) => {
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
    onClose?.();
  };

  const handleHome = () => {
    resetGame();
    router.push("/");
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} closeOnBackdrop={false}>
      <div className="bg-gray-900 text-white rounded-2xl shadow-2xl border-4 border-blue-500 overflow-hidden flex flex-col max-h-[90vh]">
        {/* 헤더 - 화려하게 */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 sm:p-6 text-center flex-shrink-0">
          <div className="text-4xl sm:text-5xl mb-2">🎮</div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-1">게임 종료!</h1>
          <p className="text-sm sm:text-base text-blue-100">50턴이 모두 끝났습니다</p>
        </div>

        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1">
          {/* 결과 요약 - 강조 */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 space-y-3 border-2 border-gray-700">
            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-sm sm:text-base text-gray-400">💰 초기 자산</span>
              <span className="text-base sm:text-xl font-mono">
                {formatNumber(initialCash)}원
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-sm sm:text-base text-gray-400">💎 최종 자산</span>
              <span className="text-base sm:text-xl font-mono font-bold text-yellow-400">
                {formatNumber(totalAssets)}원
              </span>
            </div>

            <div className="flex justify-between items-center border-b border-gray-700 pb-3">
              <span className="text-sm sm:text-base text-gray-400">💵 수익</span>
              <span className={`text-base sm:text-xl font-mono font-bold ${getProfitColor(profit)}`}>
                {formatNumber(profit)}원
              </span>
            </div>

            <div className="flex justify-between items-center pt-2 bg-gradient-to-r from-gray-700 to-gray-800 p-4 sm:p-6 rounded-lg">
              <span className="text-xl sm:text-2xl font-semibold">📈 수익률</span>
              <span className={`text-3xl sm:text-4xl font-mono font-bold ${getProfitColor(profitRate)}`}>
                {formatPercent(profitRate)}
              </span>
            </div>
          </div>

          {/* 투자 성향 분석 */}
          <GameResult trades={trades} />

          {/* 거래 이력 */}
          <div className="bg-gray-800 rounded-xl p-4 sm:p-6 border-2 border-gray-700">
            <h2 className="text-lg sm:text-xl font-bold mb-3">📊 거래 이력</h2>

            {trades.length === 0 ? (
              <p className="text-gray-400 text-center py-6 text-sm">거래 이력이 없습니다</p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {trades.map((trade, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-700 rounded-lg p-2 sm:p-3 hover:bg-gray-600 transition-colors gap-2"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <span className="text-gray-400 font-mono text-xs sm:text-sm">턴 {trade.turn}</span>
                      <span
                        className={`font-semibold px-2 py-1 rounded text-xs sm:text-sm ${
                          trade.type === "buy"
                            ? "bg-blue-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {trade.type === "buy" ? "매수" : "매도"}
                      </span>
                      <span className="font-mono text-xs sm:text-sm">
                        {formatNumber(trade.shares)}주 @ {formatNumber(trade.price)}원
                      </span>
                    </div>
                    <span className="font-mono text-gray-300 font-semibold text-xs sm:text-sm">
                      {formatNumber(trade.amount)}원
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleRestart}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 rounded-xl text-base sm:text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              🔄 다시 하기
            </button>
            <button
              onClick={handleHome}
              className="flex-1 px-4 sm:px-6 py-3 sm:py-4 bg-gray-700 hover:bg-gray-600 rounded-xl text-base sm:text-xl font-bold transition-all transform hover:scale-105 shadow-lg"
            >
              🏠 홈으로
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
