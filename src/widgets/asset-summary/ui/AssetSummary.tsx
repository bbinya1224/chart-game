import React from 'react';
import { useTradeStore } from '@/entities/trade';
import { Wallet, TrendingUp, Lock, Unlock } from 'lucide-react';

export const AssetSummary: React.FC = () => {
  const { accountInfo } = useTradeStore();
  const { balance, equity, margin, freeMargin, marginLevel, unrealizedPL } = accountInfo;

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

  const StatCard = ({ label, value, subValue, icon: Icon, color }: any) => (
    <div className="flex-1 min-w-[200px] rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shadow-lg">
      <div className="flex items-center gap-3 mb-2">
        <div className={`rounded-full p-2 ${color} bg-opacity-20`}>
          <Icon size={18} className={color.replace('bg-', 'text-')} />
        </div>
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold text-gray-100">{formatMoney(value)}</div>
      {subValue && <div className={`text-xs mt-1 ${subValue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
        {subValue > 0 ? '+' : ''}{formatMoney(subValue)}
      </div>}
    </div>
  );

  return (
    <div className="flex flex-wrap gap-4 w-full">
      <StatCard 
        label="Balance" 
        value={balance} 
        icon={Wallet} 
        color="bg-blue-500" 
      />
      <StatCard 
        label="Equity" 
        value={equity} 
        subValue={unrealizedPL}
        icon={TrendingUp} 
        color="bg-green-500" 
      />
      <StatCard 
        label="Margin" 
        value={margin} 
        icon={Lock} 
        color="bg-orange-500" 
      />
      <StatCard 
        label="Free Margin" 
        value={freeMargin} 
        icon={Unlock} 
        color="bg-purple-500" 
      />
      <div className="flex-1 min-w-[200px] rounded-xl bg-white/5 p-4 backdrop-blur-md border border-white/10 shadow-lg flex flex-col justify-center">
        <span className="text-sm text-gray-400 mb-1">Margin Level</span>
        <div className="text-2xl font-bold text-gray-100">
          {marginLevel === 0 ? '0.00' : marginLevel.toFixed(2)}%
        </div>
        <div className="w-full bg-gray-700 h-1.5 rounded-full mt-2 overflow-hidden">
          <div 
            className={`h-full rounded-full ${marginLevel > 100 ? 'bg-green-500' : marginLevel > 50 ? 'bg-orange-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(marginLevel, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
};
