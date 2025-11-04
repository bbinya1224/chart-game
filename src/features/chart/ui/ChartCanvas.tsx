"use client";

import { useEffect, useRef, useState } from "react";
import type { Candle } from "@/shared/types/gameTypes";
import { calculateMA, calculateRSI } from "@/shared/utils/indicators";

type ChartCanvasProps = {
  candleData: Candle[];
  width?: number;
  height?: number;
};

type TooltipData = {
  x: number;
  y: number;
  candle: Candle;
  index: number;
  ma5?: number;
  ma20?: number;
  rsi?: number;
} | null;

/**
 * 고급 차트 캔버스 컴포넌트
 * - 캔들스틱 차트
 * - 이동평균선 (5일, 20일)
 * - 거래량
 * - RSI 지표
 * - 마우스 호버 툴팁
 */
export const ChartCanvas = ({
  candleData,
  width = 800,
  height = 600,
}: ChartCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [tooltip, setTooltip] = useState<TooltipData>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candleData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 보조지표 계산
    const ma5 = calculateMA(candleData, 5);
    const ma20 = calculateMA(candleData, 20);
    const rsi = calculateRSI(candleData, 14);

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 레이아웃 설정
    const padding = { top: 40, right: 80, bottom: 30, left: 60 };
    const mainChartHeight = height * 0.55; // 55% for price
    const volumeHeight = height * 0.2; // 20% for volume
    const rsiHeight = height * 0.15; // 15% for RSI
    const gap = 10;

    const mainChartTop = padding.top;
    const mainChartBottom = mainChartTop + mainChartHeight;
    const volumeTop = mainChartBottom + gap;
    const volumeBottom = volumeTop + volumeHeight;
    const rsiTop = volumeBottom + gap;
    const rsiBottom = rsiTop + rsiHeight;

    const chartLeft = padding.left;
    const chartRight = width - padding.right;
    const chartWidth = chartRight - chartLeft;

    // 배경
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, width, height);

    // === 1. 메인 차트 (가격) ===
    const allPrices = candleData.flatMap((c) => [c.high, c.low]);
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;

    const priceToY = (price: number) => {
      return (
        mainChartBottom -
        ((price - (minPrice - pricePadding)) / (priceRange + pricePadding * 2)) *
          mainChartHeight
      );
    };

    // 메인 차트 배경 & 그리드
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(chartLeft, mainChartTop, chartWidth, mainChartHeight);

    ctx.strokeStyle = "#1a1a1a";
    ctx.lineWidth = 1;
    const priceGridLines = 5;
    for (let i = 0; i <= priceGridLines; i++) {
      const y = mainChartTop + (mainChartHeight / priceGridLines) * i;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();

      const price =
        maxPrice + pricePadding - ((priceRange + pricePadding * 2) / priceGridLines) * i;
      ctx.fillStyle = "#666";
      ctx.font = "11px monospace";
      ctx.textAlign = "right";
      ctx.fillText(price.toLocaleString(), chartLeft - 5, y + 4);
    }

    // 캔들 그리기
    const candleWidth = Math.max(2, Math.floor(chartWidth / candleData.length) - 2);
    const candleGap = 2;

    candleData.forEach((candle, index) => {
      const x = chartLeft + index * (candleWidth + candleGap) + candleWidth / 2;
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);

      const isUp = candle.close >= candle.open;
      const color = isUp ? "#10b981" : "#ef4444";

      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      ctx.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // 이동평균선 그리기
    const drawMA = (maData: (number | null)[], color: string, lineWidth: number) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.beginPath();

      let started = false;
      maData.forEach((value, index) => {
        if (value !== null) {
          const x = chartLeft + index * (candleWidth + candleGap) + candleWidth / 2;
          const y = priceToY(value);

          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });

      ctx.stroke();
    };

    drawMA(ma5, "#fbbf24", 2); // 5일선: 노란색
    drawMA(ma20, "#8b5cf6", 2); // 20일선: 보라색

    // 현재가 라인
    if (candleData.length > 0) {
      const lastCandle = candleData[candleData.length - 1];
      const currentPriceY = priceToY(lastCandle.close);

      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(chartLeft, currentPriceY);
      ctx.lineTo(chartRight, currentPriceY);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "left";
      ctx.fillText(
        lastCandle.close.toLocaleString(),
        chartRight + 5,
        currentPriceY + 4
      );
    }

    // === 2. 거래량 차트 ===
    const maxVolume = Math.max(...candleData.map((c) => c.volume));
    const volumeToY = (volume: number) => {
      return volumeBottom - (volume / maxVolume) * volumeHeight;
    };

    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(chartLeft, volumeTop, chartWidth, volumeHeight);

    // 거래량 레이블
    ctx.fillStyle = "#888";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("Volume", chartLeft, volumeTop - 5);

    candleData.forEach((candle, index) => {
      const x = chartLeft + index * (candleWidth + candleGap);
      const y = volumeToY(candle.volume);
      const barHeight = volumeBottom - y;

      const isUp = candle.close >= candle.open;
      ctx.fillStyle = isUp ? "#10b98140" : "#ef444440";
      ctx.fillRect(x, y, candleWidth, barHeight);
    });

    // === 3. RSI 차트 ===
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(chartLeft, rsiTop, chartWidth, rsiHeight);

    // RSI 레이블
    ctx.fillStyle = "#888";
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "left";
    ctx.fillText("RSI (14)", chartLeft, rsiTop - 5);

    // RSI 기준선 (30, 50, 70)
    const rsiToY = (value: number) => {
      return rsiBottom - (value / 100) * rsiHeight;
    };

    [30, 50, 70].forEach((level) => {
      const y = rsiToY(level);
      ctx.strokeStyle = level === 50 ? "#333" : "#666";
      ctx.lineWidth = 1;
      ctx.setLineDash(level === 50 ? [] : [2, 2]);
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "#666";
      ctx.font = "9px monospace";
      ctx.textAlign = "right";
      ctx.fillText(level.toString(), chartLeft - 5, y + 3);
    });

    // RSI 라인
    ctx.strokeStyle = "#a855f7";
    ctx.lineWidth = 2;
    ctx.beginPath();

    let rsiStarted = false;
    rsi.forEach((value, index) => {
      if (value !== null) {
        const x = chartLeft + index * (candleWidth + candleGap) + candleWidth / 2;
        const y = rsiToY(value);

        if (!rsiStarted) {
          ctx.moveTo(x, y);
          rsiStarted = true;
        } else {
          ctx.lineTo(x, y);
        }
      }
    });

    ctx.stroke();

    // === 4. 범례 (Legend) ===
    ctx.fillStyle = "#fff";
    ctx.font = "bold 12px monospace";
    ctx.textAlign = "left";
    ctx.fillText("MA5", chartLeft, mainChartTop - 20);

    ctx.fillStyle = "#fbbf24";
    ctx.fillRect(chartLeft + 35, mainChartTop - 27, 20, 3);

    ctx.fillStyle = "#fff";
    ctx.fillText("MA20", chartLeft + 65, mainChartTop - 20);

    ctx.fillStyle = "#8b5cf6";
    ctx.fillRect(chartLeft + 105, mainChartTop - 27, 20, 3);

    // 마우스 이벤트를 위한 데이터 저장
    (canvas as any)._chartData = {
      candleData,
      ma5,
      ma20,
      rsi,
      chartLeft,
      chartRight,
      mainChartTop,
      mainChartBottom,
      candleWidth,
      candleGap,
      priceToY,
    };
  }, [candleData, width, height]);

  // 마우스 이벤트 핸들러
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const chartData = (canvas as any)._chartData;
    if (!chartData) return;

    const {
      candleData,
      ma5,
      ma20,
      rsi,
      chartLeft,
      chartRight,
      mainChartTop,
      mainChartBottom,
      candleWidth,
      candleGap,
    } = chartData;

    if (
      mouseX < chartLeft ||
      mouseX > chartRight ||
      mouseY < mainChartTop ||
      mouseY > mainChartBottom
    ) {
      setTooltip(null);
      return;
    }

    const index = Math.floor((mouseX - chartLeft) / (candleWidth + candleGap));
    if (index >= 0 && index < candleData.length) {
      setTooltip({
        x: mouseX,
        y: mouseY,
        candle: candleData[index],
        index,
        ma5: ma5[index] ?? undefined,
        ma20: ma20[index] ?? undefined,
        rsi: rsi[index] ?? undefined,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="border border-gray-700 rounded-lg cursor-crosshair"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {/* 툴팁 */}
      {tooltip && (
        <div
          className="absolute bg-gray-900 border border-gray-600 rounded-lg p-3 text-xs font-mono pointer-events-none"
          style={{
            left: tooltip.x + 10,
            top: tooltip.y + 10,
            minWidth: "200px",
          }}
        >
          <div className="font-bold text-blue-400 mb-2">턴 {tooltip.index + 1}</div>
          <div className="space-y-1 text-gray-300">
            <div className="flex justify-between">
              <span className="text-gray-500">시가:</span>
              <span>{tooltip.candle.open.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">고가:</span>
              <span className="text-green-400">{tooltip.candle.high.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">저가:</span>
              <span className="text-red-400">{tooltip.candle.low.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">종가:</span>
              <span className="font-bold">{tooltip.candle.close.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">거래량:</span>
              <span>{tooltip.candle.volume.toLocaleString()}</span>
            </div>
            {tooltip.ma5 && (
              <div className="flex justify-between">
                <span className="text-yellow-500">MA5:</span>
                <span>{tooltip.ma5.toFixed(0)}</span>
              </div>
            )}
            {tooltip.ma20 && (
              <div className="flex justify-between">
                <span className="text-purple-500">MA20:</span>
                <span>{tooltip.ma20.toFixed(0)}</span>
              </div>
            )}
            {tooltip.rsi !== undefined && (
              <div className="flex justify-between">
                <span className="text-purple-400">RSI:</span>
                <span
                  className={
                    tooltip.rsi > 70
                      ? "text-red-400"
                      : tooltip.rsi < 30
                      ? "text-green-400"
                      : "text-gray-300"
                  }
                >
                  {tooltip.rsi.toFixed(1)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
