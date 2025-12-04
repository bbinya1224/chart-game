import { Trade } from '../../../entities/trade';
import { EASignal } from '../model/types';

export const mapSignalToTrade = (signal: EASignal): Trade => {
  return {
    id: `${signal.leader_account}_${signal.ticket}`,
    timestamp: new Date().toISOString(), // Use current server time for receipt
    price: signal.open_price,
    type: signal.order_type === 'OP_BUY' ? 'BUY' : 'SELL',
    volume: signal.lots,
    profit: signal.profit,
  };
};
