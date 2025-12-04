'use client';

import React, { useEffect } from 'react';
import { useGameStore } from '@/entities/session/model/gameStore';
import { generateCandles } from '@/entities/session/lib/mockDataGenerator';
import Link from 'next/link';
import { Button } from '@/shared/ui/Button';
import { ChartGameBoard } from '@/widgets/chart-game-board/ui/ChartGameBoard';

export function FindMyStrategyPage() {
  const { actions } = useGameStore();
  const { setCandles } = actions;

  useEffect(() => {
    // Initialize with mock data
    const mockData = generateCandles(100, 10000); // 100 candles, start at 10,000
    setCandles(mockData);
  }, [setCandles]);

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">나만의 차트 성향 알아보기</h1>
            <p className="text-gray-400">
              과거 차트를 보고 매매를 진행해보세요. 당신의 투자 패턴을 분석해드립니다.
            </p>
          </div>
          <Link href="/">
            <Button variant="secondary" size="sm">
              ← 메인으로
            </Button>
          </Link>
        </header>

        <ChartGameBoard />
      </div>
    </main>
  );
}
