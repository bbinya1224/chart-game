import React from 'react';
import { useTradeStore } from '@/entities/trade';

export const SafetyLight: React.FC = () => {
  const { accountInfo } = useTradeStore();
  const { marginLevel } = accountInfo;

  // Determine safety level
  let status: 'safe' | 'warning' | 'danger' = 'safe';
  let message = "아주 안전해요! 편안하게 주무세요.";
  let color = "bg-green-500";

  if (marginLevel > 0 && marginLevel < 100) {
    status = 'danger';
    message = "위험해요! 곧 깡통 찰 수도 있어요!";
    color = "bg-red-500/20 text-red-200 border border-red-500/30";
  } else if (marginLevel > 0 && marginLevel < 300) {
    status = 'warning';
    message = "조심하세요. 무리하고 계신 것 같아요.";
    color = "bg-yellow-500/20 text-yellow-200 border border-yellow-500/30";
  } else {
    color = "bg-green-500/20 text-green-200 border border-green-500/30";
  }

  return (
    <div className="w-full h-full rounded-3xl bg-[#1E222D] p-6 backdrop-blur-md border border-white/5 shadow-lg flex flex-col items-center justify-center text-center">
      <h3 className="text-gray-300 font-medium mb-6">계좌 안전도</h3>
      
      <div className="flex gap-4 mb-8">
        <div className={`w-16 h-16 rounded-full border-4 border-[#13161C] ${status === 'safe' ? 'bg-green-500 shadow-[0_0_30px_rgba(34,197,94,0.5)] scale-110' : 'bg-gray-800 opacity-30'}`}></div>
        <div className={`w-16 h-16 rounded-full border-4 border-[#13161C] ${status === 'warning' ? 'bg-yellow-500 shadow-[0_0_30px_rgba(234,179,8,0.5)] scale-110' : 'bg-gray-800 opacity-30'}`}></div>
        <div className={`w-16 h-16 rounded-full border-4 border-[#13161C] ${status === 'danger' ? 'bg-red-500 shadow-[0_0_30px_rgba(239,68,68,0.5)] scale-110' : 'bg-gray-800 opacity-30'}`}></div>
      </div>

      <div className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${color}`}>
        {message}
      </div>
    </div>
  );
};
