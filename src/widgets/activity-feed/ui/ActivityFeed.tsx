import React, { useState } from 'react';
import { useTradeStore } from '@/entities/trade';
import { format } from 'date-fns';
import { Modal } from '@/shared/ui/Modal';
import { X } from 'lucide-react';

export const ActivityFeed: React.FC = () => {
  const { trades } = useTradeStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Sort trades by newest first
  const sortedTrades = [...trades].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  const recentTrades = sortedTrades.slice(0, 5);

  const formatKST = (dateString: string) => {
    const date = new Date(dateString);
    return format(date, 'yyyy년 MM월 dd일 HH:mm');
  };

  const getMessage = (trade: any) => {
    const action = trade.type === 'BUY' ? '샀어요' : '팔았어요';
    const symbol = trade.symbol || '주식';
    const profit = trade.profit;
    
    if (trade.status === 'CLOSED' && profit !== undefined) {
      const profitText = profit > 0 ? `${profit.toFixed(2)}달러 벌고` : `${Math.abs(profit).toFixed(2)}달러 잃고`;
      return `${symbol}을(를) ${profitText} ${action}.`;
    }
    
    return `${symbol}을(를) ${trade.price}에 ${action}.`;
  };

  return (
    <>
      <div className="w-full h-full rounded-3xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-lg flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-300 font-medium">최근 활동</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
          >
            전체 보기
          </button>
        </div>
        
        <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar">
          {recentTrades.length === 0 ? (
            <p className="text-gray-500 text-center py-4">아직 아무것도 안 했어요.</p>
          ) : (
            recentTrades.map((trade) => (
              <div key={trade.id} className="flex items-start gap-3 p-3 rounded-xl bg-white/5">
                <div className={`w-2 h-2 mt-2 rounded-full ${trade.type === 'BUY' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <div>
                  <p className="text-gray-200 text-sm">{getMessage(trade)}</p>
                  <p className="text-gray-500 text-xs mt-1">{formatKST(trade.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} closeOnBackdrop={true}>
        <div className="bg-gray-900 rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[80vh] flex flex-col">
          <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gray-800/50">
            <h2 className="text-xl font-bold text-white">전체 거래 내역</h2>
            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
              <X size={24} />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-3">
              {sortedTrades.length === 0 ? (
                <p className="text-gray-500 text-center py-8">거래 내역이 없습니다.</p>
              ) : (
                sortedTrades.map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {trade.type === 'BUY' ? 'B' : 'S'}
                      </div>
                      <div>
                        <p className="text-gray-200 font-medium">{trade.symbol || 'Unknown'}</p>
                        <p className="text-gray-500 text-xs">{formatKST(trade.timestamp)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-200 text-sm">{getMessage(trade)}</p>
                      {trade.profit !== undefined && (
                        <p className={`text-xs font-bold ${trade.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)} USD
                        </p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
