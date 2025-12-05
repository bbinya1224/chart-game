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
    accountId: signal.leader_account,
    server: signal.account_server,
    accountSnapshot: signal.balance ? {
      balance: signal.balance,
      equity: signal.equity || 0,
      margin: signal.margin || 0,
      freeMargin: signal.free_margin || 0,
      marginLevel: signal.margin_level || 0,
    } : undefined,
  };
};
