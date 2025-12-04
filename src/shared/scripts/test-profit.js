// Native fetch is available in Node.js 18+

const WEBHOOK_URL = 'http://localhost:3000/api/trades';
const TICKET = 'PROFIT_TEST_' + Math.floor(Math.random() * 1000);

async function testProfit() {
  console.log('Testing Profit Update...');

  // 1. Send OPEN signal
  const openSignal = {
    leader_account: '12345678',
    signal_type: 'OPEN',
    ticket: TICKET,
    symbol: 'EURUSD',
    lots: 0.1,
    open_price: 1.1000,
    stop_loss: 1.0900,
    take_profit: 1.1100,
    order_type: 'OP_BUY',
    open_time: new Date().toISOString(),
    magic_number: 0,
    comment: 'Profit Test Open'
  };

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(openSignal)
  });
  console.log('Sent OPEN signal');

  // 2. Send FLAT signal (Close with Profit)
  const flatSignal = {
    ...openSignal,
    signal_type: 'FLAT',
    close_price: 1.1050,
    close_time: new Date().toISOString(),
    profit: 50.0 // $50 profit
  };

  await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(flatSignal)
  });
  console.log('Sent FLAT signal');

  // 3. Verify Data
  const response = await fetch(WEBHOOK_URL);
  const trades = await response.json();
  const trade = trades.find(t => t.id === `12345678_${TICKET}`);

  if (trade && trade.profit === 50) {
    console.log('✅ Profit updated successfully!');
    console.log('Trade:', trade);
  } else {
    console.error('❌ Failed to update profit');
    console.log('Trade:', trade);
  }
}

testProfit();
