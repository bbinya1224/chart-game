import { NextResponse } from 'next/server';
import { mapSignalToTrade } from '../../../features/trade-receiver/lib/mapper';
import { saveTrade, getTrades } from '../../../features/trade-receiver/lib/repository';
import { EASignal } from '../../../features/trade-receiver/model/types';

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Case 1: Array of Trades (from Game)
    if (Array.isArray(payload)) {
      for (const trade of payload) {
        // Ensure it matches repository Trade format
        await saveTrade({
          id: trade.id,
          timestamp: trade.timestamp,
          price: trade.price,
          type: trade.type,
          volume: trade.volume,
          profit: trade.profit
        });
      }
      console.log(`Processed ${payload.length} game trades`);
      return NextResponse.json({ success: true, count: payload.length });
    }

    // Case 2: EASignal (from MT4)
    const signal = payload as EASignal;
    if (signal.signal_type === 'OPEN' || signal.signal_type === 'FLAT') {
      const trade = mapSignalToTrade(signal);
      await saveTrade(trade);
      console.log(`Trade processed (${signal.signal_type}):`, trade.id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing trade signal:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const trades = await getTrades();
    return NextResponse.json(trades);
  } catch (error) {
    console.error('Error fetching trades:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
