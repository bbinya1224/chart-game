import React, { useMemo } from 'react';
import { Brain, ShieldAlert, Zap, Hourglass } from 'lucide-react';
import { useTradeStore } from '@/entities/trade/model';
import { analyzeTrades, Persona } from '@/features/game/Analysis';

export interface GameResultProps {
  trades?: any[]; // Accept game trades
}

export const GameResult: React.FC<GameResultProps> = ({ trades: externalTrades }) => {
  const { trades: storeTrades } = useTradeStore();
  
  // Use external trades if provided, otherwise use store trades
  const tradesToAnalyze = useMemo(() => {
    if (externalTrades && externalTrades.length > 0) {
      // Check if it's already in the correct format (has timestamp)
      if ('timestamp' in externalTrades[0]) {
        return externalTrades;
      }

      // Adapt legacy game trades (with turn) to the format expected by analyzeTrades
      return externalTrades.map((t, i) => ({
        id: `game-${i}`,
        timestamp: new Date(Date.now() - (1000 * 60 * (50 - t.turn))).toISOString(), // Mock timestamp based on turn
        price: t.price,
        type: t.type === 'buy' ? 'BUY' : 'SELL',
        volume: t.shares,
        profit: t.type === 'sell' ? (t.amount - (t.shares * t.price)) : 0, // Simplified profit
      }));
    }
    return storeTrades;
  }, [externalTrades, storeTrades]);

  const result = useMemo(() => analyzeTrades(tradesToAnalyze as any), [tradesToAnalyze]);

  const getIcon = (persona: Persona) => {
    switch (persona) {
      case 'Scalper': return Zap;
      case 'Gambler': return ShieldAlert;
      case 'HODLer': return Hourglass;
      case 'Swing Trader': return Brain;
      default: return Brain;
    }
  };

  const Icon = getIcon(result.persona);

  const getColor = (persona: Persona) => {
    switch (persona) {
      case 'Scalper': return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'Gambler': return 'text-red-400 border-red-400/50 bg-red-400/10';
      case 'HODLer': return 'text-green-400 border-green-400/50 bg-green-400/10';
      case 'Swing Trader': return 'text-blue-400 border-blue-400/50 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400/50 bg-gray-400/10';
    }
  };

  const colorClass = getColor(result.persona);

  return (
    <div className={`rounded-xl p-6 backdrop-blur-md border shadow-lg transition-all duration-500 ${colorClass.replace('text-', 'border-')}`}>
      <div className="flex items-center gap-4 mb-4">
        <div className={`p-3 rounded-full ${colorClass}`}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-100">Investment Persona</h3>
          <p className={`text-xl font-extrabold ${colorClass.split(' ')[0]}`}>
            {result.persona}
          </p>
        </div>
      </div>
      
      <p className="text-gray-300 mb-4 leading-relaxed">
        {result.description}
      </p>

      <div className="w-full bg-gray-700 rounded-full h-2.5 mb-1">
        <div 
          className="bg-gradient-to-r from-green-400 to-red-500 h-2.5 rounded-full transition-all duration-1000" 
          style={{ width: `${result.riskScore}%` }}
        ></div>
      </div>
      <div className="flex justify-between text-xs text-gray-400">
        <span>Safe</span>
        <span>Risk Score: {result.riskScore}</span>
        <span>Risky</span>
      </div>
    </div>
  );
};
