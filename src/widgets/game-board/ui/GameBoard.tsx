"use client";

import { useGameStore } from "@/shared/hooks/useGameStore";
import { ChartCanvas } from "@/features/chart";
import { ActionButtons, StatusInfo } from "@/features/trading";
import { ResultScreen } from "@/widgets/result-screen";

/**
 * 게임 보드 위젯
 * - 게임 화면 전체를 구성
 * - 헤더, 차트, 상태 정보, 액션 버튼 통합
 * - 게임 종료 시 결과 모달 표시
 */
export const GameBoard = () => {
  const {
    currentTurn,
    maxTurns,
    currentPrice,
    visibleCandleData,
    isGameOver,
  } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* 헤더 */}
        <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div className="text-xl lg:text-2xl font-bold">
              턴: {currentTurn} / {maxTurns}
            </div>
            <div className="text-2xl lg:text-3xl font-mono text-blue-400">
              현재가: {currentPrice.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* 메인 영역: 차트 + 게임 정보 */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-4">
          {/* 왼쪽: 차트 영역 */}
          <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
            <h2 className="text-lg lg:text-xl font-semibold mb-4">📊 차트 분석</h2>
            <div className="flex justify-center overflow-x-auto">
              <ChartCanvas candleData={visibleCandleData} width={800} height={550} />
            </div>
          </div>

          {/* 오른쪽: 상태 정보 + 액션 버튼 */}
          <div className="space-y-4">
            {/* 상태 정보 */}
            <StatusInfo />

            {/* 액션 버튼 */}
            <ActionButtons />
          </div>
        </div>
      </div>

      {/* 결과 모달 */}
      <ResultScreen isOpen={isGameOver} />
    </div>
  );
};
