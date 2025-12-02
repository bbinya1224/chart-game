import React from 'react';
import { TrendingUp, TrendingDown, Activity, DollarSign } from 'lucide-react';
import { useTradeStore } from '@/entities/trade/model';

export const TradeStats: React.FC = () => {
  const { trades } = useTradeStore();

  const totalTrades = trades.length;
  const buyTrades = trades.filter((t) => t.type === 'BUY').length;
  const sellTrades = trades.filter((t) => t.type === 'SELL').length;
  
  // Calculate win rate (assuming profit field exists and > 0 is win)
  const winningTrades = trades.filter((t) => (t.profit || 0) > 0).length;
  const winRate = totalTrades > 0 ? ((winningTrades / totalTrades) * 100).toFixed(1) : '0.0';

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <div className="flex items-center gap-4 rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shadow-lg">
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
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Trades"
        value={totalTrades}
        icon={Activity}
        color="bg-blue-500"
      />
      <StatCard
        label="Win Rate"
        value={`${winRate}%`}
        icon={TrendingUp}
        color="bg-green-500"
      />
      <StatCard
        label="Buy Orders"
        value={buyTrades}
        icon={DollarSign}
        color="bg-purple-500"
      />
      <StatCard
        label="Sell Orders"
        value={sellTrades}
        icon={TrendingDown}
        color="bg-red-500"
      />
    </div>
  );
};
