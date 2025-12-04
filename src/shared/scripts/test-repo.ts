import { saveTrade, getTrades } from '../../features/trade-receiver/lib/repository';
import { Trade } from '../../entities/trade/model';

// Mock the Trade type
const mockTrade: Trade = {
  id: 'test_123',
  timestamp: new Date().toISOString(),
  price: 1.1234,
  type: 'BUY',
  volume: 0.1
};

async function testRepo() {
  console.log('Testing repository...');
  try {
    await saveTrade(mockTrade);
    console.log('Trade saved.');
    
    const trades = await getTrades();
    console.log('Trades in DB:', trades);
  } catch (error) {
    console.error('Error:', error);
  }
}

testRepo();
