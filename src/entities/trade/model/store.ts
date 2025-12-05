import { create } from 'zustand';
import { Trade, AccountInfo } from './types';

interface TradeState {
  trades: Trade[];
  accountInfo: AccountInfo;
  lastSyncTime: Date | null;
  isLoading: boolean;
  error: string | null;
  
  setTrades: (trades: Trade[]) => void;
  addTrade: (trade: Trade) => void;
  updateAccountInfo: (info: Partial<AccountInfo>) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  setLastSyncTime: (date: Date) => void;
}

const INITIAL_BALANCE = 10000;

export const useTradeStore = create<TradeState>((set, get) => ({
  trades: [],
  accountInfo: {
    balance: INITIAL_BALANCE,
    equity: INITIAL_BALANCE,
    margin: 0,
    freeMargin: INITIAL_BALANCE,
    marginLevel: 0,
    unrealizedPL: 0,
  },
  lastSyncTime: null,
  isLoading: false,
  error: null,

  setTrades: (trades) => {
    // Calculate derived account info based on trades
    const closedTrades = trades.filter(t => t.status === 'CLOSED' || t.profit !== undefined);
    const realizedPL = closedTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
    const balance = INITIAL_BALANCE + realizedPL;
    
    // Mocking unrealized PL for open trades (in real app, this would come from price feed)
    const openTrades = trades.filter(t => t.status === 'OPEN' && t.profit === undefined);
    const unrealizedPL = openTrades.reduce((sum, t) => sum + (Math.random() * 20 - 10), 0); // Mock fluctuation
    
    const equity = balance + unrealizedPL;
    const margin = openTrades.reduce((sum, t) => sum + (t.volume * 100), 0); // Mock margin calc
    const freeMargin = equity - margin;
    const marginLevel = margin > 0 ? (equity / margin) * 100 : 0;
    
    // Extract account info from the latest trade if available
    const latestTrade = trades.length > 0 ? trades[0] : null;
    const accountId = latestTrade?.accountId;
    const server = latestTrade?.server;
    const snapshot = latestTrade?.accountSnapshot;

    // Use snapshot if available, otherwise use calculated values
    const finalAccountInfo = snapshot ? {
      balance: snapshot.balance,
      equity: snapshot.equity,
      margin: snapshot.margin,
      freeMargin: snapshot.freeMargin,
      marginLevel: snapshot.marginLevel,
      unrealizedPL: snapshot.equity - snapshot.balance, // Calculate implied PnL
      accountId,
      server
    } : {
      balance,
      equity,
      margin,
      freeMargin,
      marginLevel,
      unrealizedPL,
      accountId,
      server
    };

    set({ 
      trades, 
      accountInfo: finalAccountInfo,
      lastSyncTime: new Date(), 
      error: null 
    });
  },
  addTrade: (trade) => set((state) => ({ trades: [...state.trades, trade] })),
  updateAccountInfo: (info) => set((state) => ({ accountInfo: { ...state.accountInfo, ...info } })),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setLastSyncTime: (date) => set({ lastSyncTime: date }),
}));
