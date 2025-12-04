'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/widgets/dashboard-header';
import { TradeChart } from '@/widgets/trade-chart';
import { TradeStats } from '@/widgets/trade-stats';
import { GameResult } from '@/widgets/game-result';
import { useTradeSync } from '@/features/dashboard/useTradeSync';
import { Button } from '@/shared/ui/Button';

export function HomePage() {
  const { sync } = useTradeSync();

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-gray-950/80 backdrop-blur supports-[backdrop-filter]:bg-gray-950/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <span className="font-bold text-gray-100 tracking-tight">Quant Monitor</span>
          </div>
          
          <Link href="/find-my-strategy">
            <Button 
              variant="primary" 
              size="md"
              className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
            >
              <span className="mr-2">🎮</span>
              나만의 투자 전략 알아보기
            </Button>
          </Link>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="mx-auto max-w-7xl p-6 space-y-6">
        <DashboardHeader onSync={sync} />
        
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <TradeChart />
          </div>
          <div className="space-y-6">
            <TradeStats />
            <GameResult />
          </div>
        </div>
      </main>
    </div>
  );
}
