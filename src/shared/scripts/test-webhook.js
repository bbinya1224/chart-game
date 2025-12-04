const fetch = require('node-fetch');

const WEBHOOK_URL = 'http://localhost:3000/api/trades';

const mockSignal = {
  leader_account: '12345678',
  signal_type: 'OPEN',
  ticket: Math.floor(Math.random() * 1000000).toString(),
  symbol: 'EURUSD',
  lots: 0.1,
  open_price: 1.0850,
  stop_loss: 1.0800,
  take_profit: 1.0900,
  order_type: 'OP_BUY',
  open_time: new Date().toISOString(),
  magic_number: 0,
  comment: 'Test Trade'
};

async function testWebhook() {
  console.log('Sending mock signal to:', WEBHOOK_URL);
  console.log('Signal:', mockSignal);

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mockSignal)
    });

    const data = await response.json();
    console.log('Response:', data);

    if (data.success) {
      console.log('✅ Trade saved successfully!');
      
      // Verify by fetching list
      const listResponse = await fetch(WEBHOOK_URL);
      const list = await listResponse.json();
      console.log('Current Trades:', list);
    } else {
      console.error('❌ Failed to save trade');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testWebhook();
