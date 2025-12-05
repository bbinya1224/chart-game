'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';
import { useTradeStore } from '@/entities/trade';

export const EquityCurveChart: React.FC = () => {
  const { trades } = useTradeStore();

  // Calculate equity curve
  let runningBalance = 10000; // Initial Balance
  const data = trades
    .filter(t => t.status === 'CLOSED' || t.profit !== undefined)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    .map((t) => {
      runningBalance += (t.profit || 0);
      return {
        time: new Date(t.timestamp).getTime(),
        formattedTime: format(new Date(t.timestamp), 'MM/dd HH:mm'),
        balance: runningBalance,
        profit: t.profit
      };
    });

  // Add initial point
  if (data.length > 0) {
    data.unshift({
      time: data[0].time - 1000,
      formattedTime: 'Start',
      balance: 10000,
      profit: 0
    });
  }

  const minBalance = Math.min(...data.map(d => d.balance), 10000) * 0.99;
  const maxBalance = Math.max(...data.map(d => d.balance), 10000) * 1.01;

  return (
    <div className="h-[400px] w-full rounded-xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-200">Equity Curve</h2>
        <div className="flex gap-2 text-sm">
          <span className="flex items-center gap-1 text-gray-400">
            <div className="w-3 h-3 rounded-full bg-blue-500/50"></div>
            Balance
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="formattedTime" 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            minTickGap={50}
          />
          <YAxis 
            domain={[minBalance, maxBalance]} 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
            itemStyle={{ color: '#60a5fa' }}
            labelStyle={{ color: '#9ca3af', marginBottom: '0.5rem' }}
            formatter={(value: number) => [`$${value.toLocaleString()}`, 'Balance']}
          />
          <Area
            type="monotone"
            dataKey="balance"
            stroke="#3b82f6"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorBalance)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
