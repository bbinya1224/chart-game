const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const API_URL = 'http://localhost:3000/api/trades';

const testTrade = [
  {
    id: `TEST_TRADE_${Date.now()}`,
    timestamp: new Date().toISOString(),
    price: 12345,
    type: 'BUY',
    volume: 1,
    profit: 100
  }
];

async function runTest() {
  try {
    console.log('Sending test trade to API:', testTrade);
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testTrade),
    });

    const result = await response.json();
    console.log('API Response:', result);

    if (result.success) {
      console.log('Test PASSED: Trade saved successfully.');
    } else {
      console.error('Test FAILED: API returned error.');
    }
  } catch (error) {
    console.error('Test FAILED: Network error or server not running.', error);
  }
}

runTest();
