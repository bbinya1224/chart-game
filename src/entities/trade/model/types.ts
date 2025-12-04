export type TradeType = 'BUY' | 'SELL';

export interface Trade {
  id: string;
  timestamp: string; // ISO string
  price: number;
  type: TradeType;
  volume: number;
  profit?: number;
}
