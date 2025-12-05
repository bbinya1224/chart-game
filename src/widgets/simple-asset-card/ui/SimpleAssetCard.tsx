import React from 'react';
import { useTradeStore } from '@/entities/trade';
import { Smile, Frown } from 'lucide-react';

export const SimpleAssetCard: React.FC = () => {
  const { accountInfo } = useTradeStore();
  const { equity, unrealizedPL } = accountInfo;

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(val * 1300); // Mock USD to KRW

  const isProfit = unrealizedPL >= 0;

  return (
    <div className={`w-full rounded-3xl border border-white/10 p-8 shadow-2xl text-white relative overflow-hidden group transition-all duration-500
      ${isProfit 
        ? 'bg-gradient-to-br from-blue-600 to-indigo-700 shadow-blue-900/20' 
        : 'bg-gradient-to-br from-gray-800 to-gray-900 shadow-gray-900/20'
      }`}>
      <div className="absolute top-0 right-0 p-8 opacity-20">
        {isProfit ? <Smile size={120} /> : <Frown size={120} />}
      </div>
      
      <div className="relative z-10">
        <p className="text-indigo-200 text-lg font-medium mb-2">현재 내 자산</p>
        <h2 className="text-4xl font-bold mb-6">{formatMoney(equity)}</h2>
        
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${isProfit ? 'bg-green-400/20 text-green-100' : 'bg-red-400/20 text-red-100'}`}>
          {isProfit ? <Smile size={20} /> : <Frown size={20} />}
          <span className="font-bold">
            {isProfit ? '기분 최고! ' : '조금 슬퍼요... '}
            {formatMoney(Math.abs(unrealizedPL))} {isProfit ? '벌고 있어요' : '잃고 있어요'}
          </span>
        </div>
      </div>
    </div>
  );
};
