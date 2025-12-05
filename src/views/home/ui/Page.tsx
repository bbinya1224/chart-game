'use client';

import { useState } from 'react';
import Link from 'next/link';
import { DashboardHeader } from '@/widgets/dashboard-header';
import { TradeStats } from '@/widgets/trade-stats';
import { AssetSummary } from '@/widgets/asset-summary';
import { OpenPositionsTable } from '@/widgets/open-positions';
import { EquityCurveChart } from '@/widgets/equity-curve';
import { GameResult } from '@/widgets/game-result';
import { SimpleAssetCard } from '@/widgets/simple-asset-card';
import { SafetyLight } from '@/widgets/safety-light';
import { ActivityFeed } from '@/widgets/activity-feed';
import { useTradeSync } from '@/features/dashboard';
import { Button } from '@/shared/ui/Button';
import { useTradeStore } from '@/entities/trade';

export function HomePage() {
  const { sync } = useTradeSync();
  const { trades } = useTradeStore();
  const [isBeginnerMode, setIsBeginnerMode] = useState(false);

  return (
    <main className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0B0E11] to-black text-gray-100 font-sans selection:bg-blue-500/30">
      <div className="container mx-auto px-4 py-8 space-y-6">
        
        {/* Header Section */}
        <DashboardHeader 
          onSync={sync} 
          isBeginnerMode={isBeginnerMode}
          onToggleMode={() => setIsBeginnerMode(!isBeginnerMode)}
        />

        {isBeginnerMode ? (
          // Beginner Mode Layout
          <div className="space-y-6">
            <section>
              <SimpleAssetCard />
            </section>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section className="h-full">
                <SafetyLight />
              </section>
              <section className="h-full">
                <ActivityFeed />
              </section>
            </div>
          </div>
        ) : (
          // Pro Mode Layout
          <div className="space-y-6">
            {/* Asset Summary Section */}
            <section>
              <AssetSummary />
            </section>

            {/* Stats Section */}
            <section>
              <TradeStats />
            </section>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Equity Curve - Takes up 2 columns */}
              <div className="lg:col-span-2">
                <EquityCurveChart />
              </div>

              {/* Open Positions - Takes up 1 column */}
              <div className="lg:col-span-1">
                <OpenPositionsTable />
              </div>
            </div>
          </div>
        )}

        {/* Game Result Section (if applicable) */}
        {!isBeginnerMode && <GameResult trades={trades} />}

        {/* Navigation Actions */}
        <div className="flex justify-center gap-4 mt-12">
          <Link href="/game">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-500/20">
              Start Trading Game
            </Button>
          </Link>
          <Link href="/find-my-strategy">
            <Button variant="secondary" size="lg" className="border-white/10 hover:bg-white/5">
              Find My Strategy
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
