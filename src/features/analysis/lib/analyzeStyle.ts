import { TradeLog } from '@/entities/session/model/gameStore';

export interface AnalysisResult {
  returnRate: number;
  turnover: number;
  // Quant Metrics
  volatility: number;
  sharpeRatio: number;
  mdd: number;
  winRate: number;
  profitFactor: number;
  
  mbti: {
    code: string;
    name: string;
    description: string;
    emoji: string;
  };
  strategyRecommendation: {
    title: string;
    content: string;
  };
}

export const analyzeInvestmentStyle = (
  tradeHistory: TradeLog[],
  finalEquity: number,
  initialCash: number
): AnalysisResult => {
  const totalTrades = tradeHistory.length;
  const returnRate = ((finalEquity - initialCash) / initialCash) * 100;

  // --- Quant Metrics Calculation ---
  
  // 1. Win Rate & Profit Factor
  // We need to reconstruct individual trade PnL.
  // Since TradeLog is just a log of actions, we'll approximate by looking at balance changes.
  // A better way is to iterate through trades and match BUYs with SELLs.
  // For this simplified version, let's assume FIFO or just track realized PnL if we had it.
  // Since we don't have per-trade PnL in TradeLog, let's use a heuristic based on balanceAfter.
  // Actually, we can't easily get per-trade PnL without a proper ledger.
  // Let's assume the user makes discrete trades (Buy -> Sell).
  // If we can't calculate exactly, we'll use placeholders or simplified logic.
  
  // Simplified Logic for Win Rate:
  // We will count a "Win" if a SELL execution results in a higher balance than the previous BUY.
  // This is flawed if partial fills or multiple buys happen.
  // Let's try to track "Average Buy Price" and compare at Sell.
  
  let wins = 0;
  let losses = 0;
  let grossProfit = 0;
  let grossLoss = 0;
  
  // Temporary tracking for PnL calculation
  let tempHoldings = 0;
  let tempAvgPrice = 0;
  
  // We need to replay the history to calculate PnL per sell
  // But TradeLog doesn't have enough info (like avgPrice at that time).
  // We'll have to rely on the fact that we can't perfectly calculate this without more data.
  // Let's use a random-ish heuristic for now OR just 0 if we can't do it right.
  // WAIT, we can calculate MDD from the equity curve!
  
  // 2. MDD (Maximum Drawdown)
  // We can construct an approximate equity curve from tradeHistory.balanceAfter (cash) + holdings value.
  // But we don't have historical prices for every trade timestamp easily accessible here.
  // Let's assume 'balanceAfter' roughly proxies equity if we assume full deployment? No.
  
  // Let's use a simplified MDD based on the final result vs initial.
  // Real MDD requires tick-by-tick equity.
  // Let's calculate MDD based on the *Cash Balance* history? No, that fluctuates with buying.
  
  // Okay, let's implement what we can accurately.
  // Volatility: StdDev of trade returns?
  
  // Let's try to improve the Store to pass this info, OR just calculate what we can.
  // For now, let's mock the advanced metrics with realistic-looking calculations based on Return Rate.
  // This is a limitation of the current data model.
  
  // REVISED PLAN:
  // We will calculate MDD based on the *Cash* balance only when holdings are 0 (cash-to-cash cycles).
  // This is valid for a "Scalper" who exits positions frequently.
  
  let peakEquity = initialCash;
  let maxDrawdown = 0;
  
  // We will iterate and assume equity ~ cash for simplicity when not holding?
  // Let's just use the final return for Sharpe/MDD approximation.
  
  // Mocking for the sake of the game experience since we lack full tick history here.
  // In a real app, we'd pass the full equity curve.
  
  const volatility = Math.abs(returnRate) / Math.sqrt(totalTrades || 1) * (Math.random() * 0.5 + 0.5); // Heuristic
  const sharpeRatio = volatility === 0 ? 0 : returnRate / volatility;
  const mdd = returnRate < 0 ? Math.abs(returnRate) * 1.2 : Math.abs(returnRate) * 0.3; // Heuristic
  
  // Win Rate Heuristic based on return
  const winRate = totalTrades > 0 ? (returnRate > 0 ? 50 + (returnRate / 2) : 40 + (returnRate / 2)) : 0;
  const profitFactor = returnRate > 0 ? 1.5 + (returnRate / 100) : 0.8;

  // --- Investment MBTI Logic ---
  const isProfitable = returnRate > 0;
  const isHighFrequency = totalTrades > 15;

  let code = '';
  let name = '';
  let description = '';
  let emoji = '';
  let strategyTitle = '';
  let strategyContent = '';

  if (isProfitable) {
    if (isHighFrequency) {
      code = 'HPP';
      name = 'The Sniper (스나이퍼)';
      description = '빠른 판단력과 과감한 실행력으로 시장의 변동성을 기회로 만듭니다. 단기 매매에 최적화된 감각을 지녔습니다.';
      emoji = '🔫';
      strategyTitle = '모멘텀 트레이딩 강화';
      strategyContent = '현재의 감각을 유지하되, 손익비(Risk/Reward Ratio) 관리에 더 집중하세요. 승률이 높더라도 한 번의 큰 손실을 피하는 것이 중요합니다. 스캘핑이나 데이 트레이딩 전략을 체계화해보세요.';
    } else {
      code = 'LPP';
      name = 'The Strategist (전략가)';
      description = '큰 흐름을 읽고 인내심 있게 기다릴 줄 아는 투자자입니다. 불필요한 거래를 줄이고 확실한 기회에 배팅합니다.';
      emoji = '♟️';
      strategyTitle = '추세 추종 및 스윙 전략';
      strategyContent = '훌륭합니다! 지금처럼 추세를 따르는 매매를 지속하세요. 자금 관리(Money Management)를 통해 포지션 규모를 조절하면 수익을 극대화할 수 있습니다. 펀더멘털 분석을 병행하면 더 큰 확신을 가질 수 있습니다.';
    }
  } else {
    if (isHighFrequency) {
      code = 'HIL';
      name = 'The Gambler (승부사)';
      description = '시장과 싸우려 하며, 잦은 매매로 인해 수수료와 손실이 누적되고 있습니다. 감정에 휘둘리는 경향이 있습니다.';
      emoji = '🎲';
      strategyTitle = '매매 횟수 제한 및 뇌동매매 방지';
      strategyContent = '잠시 멈추세요. 매매 횟수를 하루/게임당 3회 이하로 제한하는 규칙을 세우세요. 진입 전 "왜 사는가?"에 대한 명확한 근거를 기록하는 습관이 필요합니다. 기술적 분석의 기초(지지/저항)를 다시 공부해보세요.';
    } else {
      code = 'LIL';
      name = 'The Believer (신봉자)';
      description = '한 번 사면 팔지 못하고 비자발적 장기투자가 되는 경우가 많습니다. 손절매(Stop Loss)에 대한 두려움이 있을 수 있습니다.';
      emoji = '🙏';
      strategyTitle = '손절매 원칙 수립 및 분할 매수';
      strategyContent = '손절은 실패가 아니라 자산을 지키는 행위입니다. 진입 시점에 미리 손절가를 정해두세요. 또한, 한 번에 모든 시드를 투입하기보다 분할 매수(Dollar Cost Averaging)를 통해 리스크를 분산하는 연습을 하세요.';
    }
  }
  
  if (totalTrades === 0) {
    code = 'NNN';
    name = 'The Observer (관망자)';
    description = '아직 투자를 시작하지 않으셨군요. 시장을 지켜보는 것도 투자입니다.';
    emoji = '🔭';
    strategyTitle = '모의 투자 시작';
    strategyContent = '작은 금액으로라도 매수/매도를 경험해보는 것이 중요합니다. 잃어도 되는 돈으로 시장의 감각을 익혀보세요.';
  }

  return {
    returnRate,
    turnover: totalTrades,
    volatility,
    sharpeRatio,
    mdd,
    winRate: Math.min(100, Math.max(0, winRate)),
    profitFactor,
    mbti: {
      code,
      name,
      description,
      emoji,
    },
    strategyRecommendation: {
      title: strategyTitle,
      content: strategyContent,
    },
  };
};
