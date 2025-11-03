"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/shared/hooks/useGameStore";
import { ChartCanvas } from "@/features/chart";
import { ActionButtons, StatusInfo } from "@/features/trading";

/**
 * 게임 보드 위젯
 * - 게임 화면 전체를 구성
 * - 헤더, 차트, 상태 정보, 액션 버튼 통합
 */
export const GameBoard = () => {
  const router = useRouter();
  const {
    currentTurn,
    maxTurns,
    currentPrice,
    visibleCandleData,
    isGameOver,
  } = useGameStore();

  // 게임 종료 시 결과 페이지로 이동
  useEffect(() => {
    if (isGameOver) {
      router.push("/result");
    }
  }, [isGameOver, router]);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">
              턴: {currentTurn} / {maxTurns}
            </div>
            <div className="text-3xl font-mono text-blue-400">
              현재가: {currentPrice.toLocaleString()}원
            </div>
          </div>
        </div>

        {/* 차트 영역 */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">📊 차트</h2>
          <div className="flex justify-center">
            <ChartCanvas candleData={visibleCandleData} width={800} height={400} />
          </div>
        </div>

        {/* 상태 정보 */}
        <StatusInfo />

        {/* 액션 버튼 */}
        <ActionButtons />
      </div>
    </div>
  );
};
