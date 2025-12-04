import fs from 'fs/promises';
import path from 'path';
import { Trade } from '../../../entities/trade';

const DB_PATH = path.join(process.cwd(), 'src/shared/db/trades.json');

export const getTrades = async (): Promise<Trade[]> => {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
};

export const saveTrade = async (trade: Trade): Promise<void> => {
  const trades = await getTrades();
  
  // Check if trade already exists (deduplication or update)
  const index = trades.findIndex((t) => t.id === trade.id);
  
  let newTrades;
  if (index !== -1) {
    // Update existing trade
    const updatedTrades = [...trades];
    updatedTrades[index] = { ...updatedTrades[index], ...trade };
    newTrades = updatedTrades;
  } else {
    // Add new trade
    newTrades = [trade, ...trades];
  }

  await fs.writeFile(DB_PATH, JSON.stringify(newTrades, null, 2));
};
