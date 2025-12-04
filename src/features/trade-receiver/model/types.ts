export interface EASignal {
  leader_account: string;
  signal_type: 'OPEN' | 'HEARTBEAT' | 'FLAT';
  ticket: string;
  symbol: string;
  lots: number;
  open_price: number;
  stop_loss: number;
  take_profit: number;
  order_type: 'OP_BUY' | 'OP_SELL';
  open_time: string;
  magic_number: number;
  comment: string;
  // Fields for FLAT signal
  close_price?: number;
  close_time?: string;
  profit?: number;
}
