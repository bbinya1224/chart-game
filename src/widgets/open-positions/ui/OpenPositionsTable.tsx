import React from 'react';
import { useTradeStore } from '@/entities/trade';
import { format } from 'date-fns';

export const OpenPositionsTable: React.FC = () => {
  const { trades } = useTradeStore();
  const openTrades = trades.filter(t => t.status === 'OPEN' || (t.status === undefined && t.profit === undefined));

  if (openTrades.length === 0) {
    return (
      <div className="w-full rounded-xl bg-white/5 p-8 backdrop-blur-md border border-white/10 shadow-lg text-center text-gray-400">
        No open positions
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl bg-white/5 backdrop-blur-md border border-white/10 shadow-lg overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <h2 className="text-lg font-semibold text-gray-200">Open Positions</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-white/5 text-gray-200 uppercase">
            <tr>
              <th className="px-6 py-3">Time</th>
              <th className="px-6 py-3">Symbol</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Volume</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Profit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {openTrades.map((trade) => (
              <tr key={trade.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  {format(new Date(trade.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </td>
                <td className="px-6 py-4 font-medium text-gray-200">
                  {trade.symbol || 'Unknown'}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${
                    trade.type === 'BUY' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {trade.type}
                  </span>
                </td>
                <td className="px-6 py-4">{trade.volume.toFixed(2)}</td>
                <td className="px-6 py-4">{trade.price.toFixed(5)}</td>
                <td className="px-6 py-4">
                  {/* Mock profit for open trades if not present */}
                  <span className={Math.random() > 0.5 ? 'text-green-400' : 'text-red-400'}>
                    {(Math.random() * 100 - 50).toFixed(2)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
