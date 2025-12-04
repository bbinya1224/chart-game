'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import { format } from 'date-fns';
import { useTradeStore } from '@/entities/trade';

export const TradeChart: React.FC = () => {
  const { trades } = useTradeStore();

  // Format data for chart
  const data = trades.map((t) => ({
    ...t,
    time: new Date(t.timestamp).getTime(),
    formattedTime: format(new Date(t.timestamp), 'HH:mm'),
  }));

  // Calculate domain for better visualization
  const prices = data.map((d) => d.price);
  const minPrice = Math.min(...prices) * 0.999;
  const maxPrice = Math.max(...prices) * 1.001;

  return (
    <div className="h-[400px] w-full rounded-xl bg-white/5 p-6 backdrop-blur-md border border-white/10 shadow-lg">
      <h2 className="mb-4 text-lg font-semibold text-gray-200">Live Market Movement</h2>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis 
            dataKey="formattedTime" 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[minPrice, maxPrice]} 
            stroke="#9ca3af" 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.toFixed(4)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f3f4f6',
            }}
            labelStyle={{ color: '#9ca3af' }}
            formatter={(value: number) => [value.toFixed(5), 'Price']}
          />
          <Line
            type="monotone"
            dataKey="price"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6, fill: '#3b82f6' }}
          />
          {/* Render Buy/Sell points */}
          {data.map((entry, index) => (
            <ReferenceDot
              key={entry.id}
              x={entry.formattedTime}
              y={entry.price}
              r={4}
              fill={entry.type === 'BUY' ? '#10b981' : '#ef4444'}
              stroke="none"
              ifOverflow="extendDomain"
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
