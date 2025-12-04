import { create } from 'zustand';
import { Trade } from './types';

interface TradeState {
  trades: Trade[];
  lastSyncTime: Date | null;
  isLoading: boolean;
  error: string | null;
  
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setLastSyncTime: (date: Date) => void;
}

export const useTradeStore = create<TradeState>((set) => ({
  trades: [],
  lastSyncTime: null,
  isLoading: false,
  error: null,

  setTrades: (trades) => set({ trades, lastSyncTime: new Date(), error: null }),
  addTrade: (trade) => set((state) => ({ trades: [...state.trades, trade] })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setLastSyncTime: (date) => set({ lastSyncTime: date }),
}));
