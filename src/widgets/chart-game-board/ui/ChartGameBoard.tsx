'use client';

import React, { useEffect, useState } from 'react';
import { useGameStore } from '@/entities/session/model/gameStore';
import { Chart } from '@/shared/ui/Chart';
import { TradePanel } from '@/features/trade/ui/TradePanel';
import { Button } from '@/shared/ui/Button';

import { ResultReport } from '@/widgets/result-report/ui/ResultReport';
import { analyzeInvestmentStyle } from '@/features/analysis/lib/analyzeStyle';

export const ChartGameBoard: React.FC = () => {
  const { candles, currentIndex, isGameOver, actions, tradeHistory, wallet } = useGameStore();
  const { nextTick, resetGame } = actions;
  
  // Local state for visible data to avoid re-rendering entire chart on every tick if possible,
  // but for now we just slice the candles based on currentIndex.
  const visibleData = candles.slice(0, currentIndex + 1);

  // Calculate analysis when game is over
  const analysisResult = isGameOver 
    ? analyzeInvestmentStyle(tradeHistory, wallet.cash + (wallet.holdings * (candles[currentIndex]?.close || 0)), 10000000)
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {isGameOver && analysisResult && (
        <ResultReport result={analysisResult} onReset={resetGame} />
      )}
      
      {/* Main Chart Area */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <Chart data={visibleData} />
        </div>
        
        {/* Controls */}
        <div className="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className="flex gap-2">
            <Button 
              size="md" 
              variant="secondary"
              onClick={nextTick}
              disabled={isGameOver}
              className="w-32"
            >
              Next Tick →
            </Button>
          </div>
          <div>
             <Button size="sm" variant="ghost" onClick={resetGame}>
               Reset
             </Button>
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <div className="lg:col-span-1">
        <TradePanel />
      </div>
    </div>
  );
};
