import { Candle } from '@/entities/session/model/gameStore';

export const generateCandles = (count: number, startPrice: number): Candle[] => {
  const candles: Candle[] = [];
  let currentPrice = startPrice;
  const startDate = new Date('2023-01-01');

  for (let i = 0; i < count; i++) {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + i);
    const timeString = date.toISOString().split('T')[0];

    // Random walk logic
    const volatility = 0.02; // 2% daily volatility
    const changePercent = (Math.random() - 0.5) * 2 * volatility;
    const changeAmount = currentPrice * changePercent;
    
    const open = currentPrice;
    const close = currentPrice + changeAmount;
    
    // Generate high and low based on open/close
    const high = Math.max(open, close) * (1 + Math.random() * 0.01);
    const low = Math.min(open, close) * (1 - Math.random() * 0.01);

    candles.push({
      time: timeString,
      open,
      high,
      low,
      close,
    });

    currentPrice = close;
  }

  return candles;
};
