'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, IChartApi, ISeriesApi, CandlestickData, CandlestickSeries } from 'lightweight-charts';
import { Candle } from '@/entities/session/model/gameStore';

interface ChartProps {
  data: Candle[];
  colors?: {
    backgroundColor?: string;
    lineColor?: string;
    textColor?: string;
    areaTopColor?: string;
    areaBottomColor?: string;
  };
}

export const Chart: React.FC<ChartProps> = ({ data, colors = {} }) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const {
    backgroundColor = '#111827', // gray-900
    textColor = '#D1D5DB', // gray-300
  } = colors;

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: backgroundColor },
        textColor,
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      grid: {
        vertLines: { color: '#374151' }, // gray-700
        horzLines: { color: '#374151' },
      },
      timeScale: {
        borderColor: '#4B5563', // gray-600
      },
    });

    chartRef.current = chart;

    const newSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    }) as ISeriesApi<"Candlestick">;

    seriesRef.current = newSeries;

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [backgroundColor, textColor]);

  useEffect(() => {
    if (seriesRef.current && data.length > 0) {
      // Map Candle to lightweight-charts format
      const chartData: CandlestickData[] = data.map((d) => ({
        time: d.time,
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }));
      
      seriesRef.current.setData(chartData);
    }
  }, [data]);

  return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};
