import React from 'react';
import { TrendingUp, TrendingDown, Activity, AlertTriangle } from 'lucide-react';
import { useTradeStore } from '@/entities/trade';

export const TradeStats: React.FC = () => {
  const { trades } = useTradeStore();

  const closedTrades = trades.filter(t => t.status === 'CLOSED' || t.profit !== undefined);
  const totalTrades = closedTrades.length;
  
  // Calculate Profit Factor
  const grossProfit = closedTrades.filter(t => (t.profit || 0) > 0).reduce((sum, t) => sum + (t.profit || 0), 0);
  const grossLoss = Math.abs(closedTrades.filter(t => (t.profit || 0) < 0).reduce((sum, t) => sum + (t.profit || 0), 0));
  const profitFactor = grossLoss > 0 ? (grossProfit / grossLoss).toFixed(2) : '∞';

  // Calculate Max Drawdown (Simplified based on closed trades sequence)
  let peak = 0;
  let maxDrawdown = 0;
  let runningBalance = 0;

  closedTrades.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).forEach(t => {
    runningBalance += (t.profit || 0);
    if (runningBalance > peak) peak = runningBalance;
    const drawdown = peak - runningBalance;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  });
  
  // Win Rate
  const winningTrades = closedTrades.filter((t) => (t.profit || 0) > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shadow-lg flex-1 min-w-[200px]">
      <div className={`rounded-full p-3 ${color} bg-opacity-20`}>
        <Icon size={20} className={color.replace('bg-', 'text-')} />
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold text-gray-100">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <StatCard
        label="Profit Factor"
        value={profitFactor}
        icon={TrendingUp}
        color="bg-green-500"
      />
      <StatCard
        label="Max Drawdown"
        value={`$${maxDrawdown.toFixed(2)}`}
        icon={TrendingDown}
        color="bg-red-500"
      />
      <StatCard
        label="Win Rate"
        value={`${winRate}%`}
        icon={Activity}
        color="bg-blue-500"
      />
      <StatCard
        label="Total Trades"
        value={totalTrades}
        icon={AlertTriangle}
        color="bg-purple-500"
      />
    </div>
  );
};
