'use client';

import React from 'react';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { AnalysisResult } from '@/features/analysis/lib/analyzeStyle';

interface ResultReportProps {
  result: AnalysisResult;
  onReset: () => void;
}

export const ResultReport: React.FC<ResultReportProps> = ({ result, onReset }) => {
  const { returnRate, turnover, mbti, strategyRecommendation } = result;
  const isProfit = returnRate >= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <Card className="max-w-lg w-full animate-in fade-in zoom-in duration-300 border-2 border-blue-500/50 max-h-[90vh] overflow-y-auto">
        <div className="text-center space-y-6 py-4">
          {/* Header */}
          <div className="space-y-2">
            <span className="text-6xl block mb-2">{mbti.emoji}</span>
            <div className="inline-block px-3 py-1 bg-blue-900/50 rounded-full text-blue-300 text-sm font-bold mb-2">
              {mbti.code}
            </div>
            <h2 className="text-3xl font-bold text-white">{mbti.name}</h2>
            <p className="text-gray-400 px-4">{mbti.description}</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 gap-4 bg-gray-800/50 p-4 rounded-xl mx-4">
            <div className="space-y-1">
              <span className="text-sm text-gray-400">수익률</span>
              <p className={`text-2xl font-bold ${isProfit ? 'text-red-400' : 'text-blue-400'}`}>
                {returnRate.toFixed(2)}%
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-sm text-gray-400">총 매매 횟수</span>
              <p className="text-2xl font-bold text-white">
                {turnover}회
              </p>
            </div>
          </div>

          {/* Quant Analysis */}
          <div className="bg-gray-900/50 p-4 rounded-xl mx-4 border border-gray-800">
            <h3 className="text-sm font-semibold text-gray-300 mb-3 text-left">📊 Quant Analysis</h3>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-left">
              <div>
                <span className="text-xs text-gray-500 block">Sharpe Ratio</span>
                <span className="text-lg font-mono text-white">{result.sharpeRatio.toFixed(2)}</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">MDD</span>
                <span className="text-lg font-mono text-blue-400">-{result.mdd.toFixed(2)}%</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Win Rate</span>
                <span className="text-lg font-mono text-white">{result.winRate.toFixed(1)}%</span>
              </div>
              <div>
                <span className="text-xs text-gray-500 block">Profit Factor</span>
                <span className="text-lg font-mono text-white">{result.profitFactor.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Strategy Recommendation */}
          <div className="bg-gray-800/30 p-5 rounded-xl mx-4 text-left border border-gray-700">
            <h3 className="text-lg font-semibold text-blue-400 mb-2 flex items-center gap-2">
              <span>💡</span> 추천 전략: {strategyRecommendation.title}
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              {strategyRecommendation.content}
            </p>
          </div>

          <div className="px-4">
            <Button 
              fullWidth 
              size="lg" 
              onClick={onReset}
              className="bg-blue-600 hover:bg-blue-500"
            >
              다시 도전하기
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
