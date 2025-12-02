'use client';

import React from 'react';
import { useGameStore } from '@/entities/session/model/gameStore';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export const TradePanel: React.FC = () => {
  const { wallet, actions, isPlaying, isGameOver, candles, currentIndex } = useGameStore();
  const { buy, sell } = actions;
  const [quantity, setQuantity] = React.useState(1);

  const currentPrice = candles[currentIndex]?.close || 0;
  const maxBuy = currentPrice > 0 ? Math.floor(wallet.cash / currentPrice) : 0;

  const handleBuy = () => {
    if (quantity > 0 && quantity <= maxBuy) {
      buy(quantity);
    }
  };

  const handleSell = () => {
    if (quantity > 0 && quantity <= wallet.holdings) {
      sell(quantity);
    }
  };

  return (
    <Card className="w-full" title="Trading Desk">
      <div className="space-y-6">
        {/* Wallet Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="block text-gray-400 mb-1">Cash</span>
            <span className="text-xl font-bold text-white">
              ₩{wallet.cash.toLocaleString()}
            </span>
          </div>
          <div className="bg-gray-800 p-3 rounded-lg">
            <span className="block text-gray-400 mb-1">Holdings</span>
            <span className="text-xl font-bold text-white">
              {wallet.holdings} Shares
            </span>
          </div>
          <div className="col-span-2 bg-gray-800 p-3 rounded-lg flex justify-between items-center">
             <div>
               <span className="block text-gray-400 mb-1">Avg Price</span>
               <span className="text-lg font-mono text-white">
                 ₩{Math.round(wallet.avgPrice).toLocaleString()}
               </span>
             </div>
             {wallet.holdings > 0 && (
               <div className="text-right">
                 <span className="block text-gray-400 mb-1">Return</span>
                 <span className={`text-lg font-bold ${((currentPrice - wallet.avgPrice) / wallet.avgPrice * 100) >= 0 ? 'text-red-400' : 'text-blue-400'}`}>
                   {((currentPrice - wallet.avgPrice) / wallet.avgPrice * 100).toFixed(2)}%
                 </span>
               </div>
             )}
          </div>
        </div>

        {/* Quantity Input */}
        <div className="space-y-2">
          <label className="text-sm text-gray-400">Quantity</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500"
            />
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={() => setQuantity(maxBuy)}
              disabled={maxBuy === 0}
            >
              Max
            </Button>
          </div>
          <p className="text-xs text-gray-500 text-right">
            Max Buy: {maxBuy} shares
          </p>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Button 
            variant="danger" 
            fullWidth 
            onClick={handleBuy}
            disabled={isGameOver || quantity > maxBuy || quantity <= 0}
          >
            BUY
          </Button>
          <Button 
            variant="primary" 
            fullWidth 
            onClick={handleSell}
            disabled={isGameOver || quantity > wallet.holdings || quantity <= 0}
          >
            SELL
          </Button>
        </div>
      </div>
    </Card>
  );
};
