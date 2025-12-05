export type TradeType = 'BUY' | 'SELL';
export type TradeStatus = 'OPEN' | 'CLOSED';

export interface Trade {
  id: string;
  timestamp: string; // ISO string
  price: number;
  type: TradeType;
  volume: number;
  profit?: number;
  status?: TradeStatus;
  symbol?: string; // e.g., "EURUSD", "BTCUSD"
  closePrice?: number;
  closeTime?: string;
  accountId?: string;
  server?: string;
  accountSnapshot?: {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
  };
}

export interface AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  unrealizedPL: number;
  accountId?: string;
  server?: string;
  company?: string;
}
