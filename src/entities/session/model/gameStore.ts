import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// --- Types ---
export interface Candle {
  time: string; // '2023-01-01'
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TradeLog {
  id: string;
  timestamp: string;
  type: 'BUY' | 'SELL';
  price: number;
  volume: number;
  balanceAfter: number;
}

export interface Wallet {
  cash: number;
  holdings: number; // number of shares
  avgPrice: number; // average purchase price
}

export interface GameState {
  // Data
  candles: Candle[];
  currentIndex: number;
  
  // User Status
  wallet: Wallet;
  tradeHistory: TradeLog[];
  
  // Game Status
  isPlaying: boolean;
  isGameOver: boolean;
  realizedProfit: number;
  gameSpeed: number; // ms per tick
  
  // Actions
  actions: {
    setCandles: (data: Candle[]) => void;
    nextTick: () => void;
    buy: (quantity: number) => void;
    sell: (quantity: number) => void;
    resetGame: () => void;
    setGameSpeed: (speed: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
  };
}

// --- Initial State ---
const INITIAL_WALLET: Wallet = {
  cash: 10000000, // 10 million KRW
  holdings: 0,
  avgPrice: 0,
};

// --- Store ---
export const useGameStore = create<GameState>()(
  devtools((set, get) => ({
    candles: [],
    currentIndex: 0,
    wallet: INITIAL_WALLET,
    tradeHistory: [],
    isPlaying: false,
    isGameOver: false,
    realizedProfit: 0,
    gameSpeed: 1000,

    actions: {
      setCandles: (data) => {
        // Start at index 20 to show some past data, or 0 if data is short
        const initialIndex = data.length > 20 ? 20 : 0;
        set({ candles: data, currentIndex: initialIndex, isGameOver: false });
      },
      
      nextTick: () => {
        const { currentIndex, candles, isPlaying } = get();
        if (currentIndex >= candles.length - 1) {
          set({ isPlaying: false, isGameOver: true });
          return;
        }
        set({ currentIndex: currentIndex + 1 });
      },

      buy: (quantity: number) => {
        const { wallet, candles, currentIndex, tradeHistory } = get();
        const currentPrice = candles[currentIndex].close;
        const cost = currentPrice * quantity;
        
        if (wallet.cash >= cost) {
          const newHoldings = wallet.holdings + quantity;
          const totalCost = wallet.avgPrice * wallet.holdings + cost;
          const newAvgPrice = totalCost / newHoldings;
          
          const newWallet = {
            cash: wallet.cash - cost,
            holdings: newHoldings,
            avgPrice: newAvgPrice,
          };

          const trade: TradeLog = {
            id: crypto.randomUUID(),
            timestamp: candles[currentIndex].time,
            type: 'BUY',
            price: currentPrice,
            volume: quantity,
            balanceAfter: newWallet.cash,
          };

          set({
            wallet: newWallet,
            tradeHistory: [...tradeHistory, trade],
          });
        }
      },

      sell: (quantity: number) => {
        const { wallet, candles, currentIndex, tradeHistory, realizedProfit } = get();
        const currentPrice = candles[currentIndex].close;
        
        if (wallet.holdings >= quantity) {
           const revenue = currentPrice * quantity;
           const profit = (currentPrice - wallet.avgPrice) * quantity;
           
           const newWallet = {
             ...wallet,
             cash: wallet.cash + revenue,
             holdings: wallet.holdings - quantity,
             // avgPrice remains same when selling
           };

           const trade: TradeLog = {
            id: crypto.randomUUID(),
            timestamp: candles[currentIndex].time,
            type: 'SELL',
            price: currentPrice,
            volume: quantity,
            balanceAfter: newWallet.cash,
          };

           set({
             wallet: newWallet,
             tradeHistory: [...tradeHistory, trade],
             realizedProfit: realizedProfit + profit,
           });
        }
      },

      resetGame: () => {
        set({
          currentIndex: 0,
          wallet: INITIAL_WALLET,
          tradeHistory: [],
          isPlaying: false,
          isGameOver: false,
          realizedProfit: 0,
        });
      },

      setGameSpeed: (speed) => set({ gameSpeed: speed }),
      setIsPlaying: (isPlaying) => set({ isPlaying }),
    },
  }))
);
