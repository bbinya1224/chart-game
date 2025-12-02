import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Trade } from '@/entities/trade/model';

// Mock Data Generator
const generateMockTrades = (count: number): Trade[] => {
  const trades: Trade[] = [];
  let price = 1.1000;
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const time = new Date(now.getTime() - (count - i) * 60000); // 1 min intervals
    const change = (Math.random() - 0.5) * 0.0010;
    price += change;
    
    trades.push({
      id: `mock-${i}`,
      timestamp: time.toISOString(),
      price: Number(price.toFixed(5)),
      type: Math.random() > 0.5 ? 'BUY' : 'SELL',
      volume: Number((Math.random() * 1).toFixed(2)),
      profit: Math.random() > 0.7 ? (Math.random() - 0.4) * 100 : undefined,
    });
  }
  return trades;
};

export const fetchTradesFromSheet = async (): Promise<Trade[]> => {
  // Check if credentials exist
  const email = process.env.NEXT_PUBLIC_GOOGLE_SERVICE_ACCOUNT_EMAIL || process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY || process.env.GOOGLE_PRIVATE_KEY;
  const sheetId = process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID || process.env.GOOGLE_SHEET_ID;

  if (!email || !key || !sheetId) {
    console.warn('Missing Google Sheets credentials. Using Mock Data.');
    return new Promise((resolve) => {
      setTimeout(() => resolve(generateMockTrades(50)), 1000);
    });
  }

  try {
    const serviceAccountAuth = new JWT({
      email: email,
      key: key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const doc = new GoogleSpreadsheet(sheetId, serviceAccountAuth);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map((row, index) => ({
      id: `sheet-${index}`,
      timestamp: row.get('Timestamp') || new Date().toISOString(),
      price: parseFloat(row.get('Price') || '0'),
      type: (row.get('Type') || 'BUY') as 'BUY' | 'SELL',
      volume: parseFloat(row.get('Volume') || '0'),
      profit: row.get('Profit') ? parseFloat(row.get('Profit')) : undefined,
    }));
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    throw error;
  }
};
