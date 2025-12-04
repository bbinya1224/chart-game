import { Trade } from '@/entities/trade';

export type Persona = 'Scalper' | 'Swing Trader' | 'Gambler' | 'HODLer' | 'Unknown';

interface AnalysisResult {
  persona: Persona;
  description: string;
  riskScore: number; // 0-100
}

export const analyzeTrades = (trades: Trade[]): AnalysisResult => {
  if (trades.length < 5) {
    return {
      persona: 'Unknown',
      description: 'Not enough data to analyze your style. Make more trades!',
      riskScore: 0,
    };
  }

  // Calculate metrics
  const totalTrades = trades.length;
  const timeSpan = new Date(trades[trades.length - 1].timestamp).getTime() - new Date(trades[0].timestamp).getTime();
  const avgTimeBetweenTrades = timeSpan / totalTrades; // in ms
  
  // Mock profit calculation if not present (for demo)
  const profits = trades.map(t => t.profit || (Math.random() - 0.5));
  const winRate = profits.filter(p => p > 0).length / totalTrades;
  
  // Determine Persona
  let persona: Persona = 'Unknown';
  let description = '';
  let riskScore = 50;

  // Logic (Simplified)
  if (avgTimeBetweenTrades < 60000 * 5) { // Less than 5 mins
    persona = 'Scalper';
    description = 'You thrive on speed and small market movements. High frequency, quick decisions.';
    riskScore = 70;
  } else if (winRate < 0.4) {
    persona = 'Gambler';
    description = 'High risk, low reward currently. You might be chasing losses or taking too much risk.';
    riskScore = 90;
  } else if (totalTrades < 10) {
    persona = 'HODLer';
    description = 'Patient and calculated. You prefer to hold positions rather than trade frequently.';
    riskScore = 20;
  } else {
    persona = 'Swing Trader';
    description = 'You ride the waves. Balanced approach with medium-term holding periods.';
    riskScore = 40;
  }

  return { persona, description, riskScore };
};
