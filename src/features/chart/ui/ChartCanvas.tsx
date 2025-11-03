"use client";

import { useEffect, useRef } from "react";
import type { Candle } from "@/shared/types/gameTypes";

type ChartCanvasProps = {
  candleData: Candle[];
  width?: number;
  height?: number;
};

/**
 * 차트 캔버스 컴포넌트
 * - 캔들스틱 차트 렌더링
 * - 가격 범위 자동 조정
 */
export const ChartCanvas = ({
  candleData,
  width = 800,
  height = 400,
}: ChartCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candleData.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 캔버스 초기화
    ctx.clearRect(0, 0, width, height);

    // 가격 범위 계산
    const allPrices = candleData.flatMap((candle) => [
      candle.high,
      candle.low,
    ]);
    const maxPrice = Math.max(...allPrices);
    const minPrice = Math.min(...allPrices);
    const priceRange = maxPrice - minPrice;
    const padding = priceRange * 0.1; // 10% 패딩

    // 차트 영역 설정
    const chartTop = 40;
    const chartBottom = height - 40;
    const chartHeight = chartBottom - chartTop;
    const chartLeft = 60;
    const chartRight = width - 20;
    const chartWidth = chartRight - chartLeft;

    // 가격을 Y좌표로 변환
    const priceToY = (price: number) => {
      return (
        chartBottom -
        ((price - (minPrice - padding)) / (priceRange + padding * 2)) *
          chartHeight
      );
    };

    // 배경 그리기
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, width, height);

    // 그리드 라인 그리기
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = chartTop + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(chartLeft, y);
      ctx.lineTo(chartRight, y);
      ctx.stroke();

      // 가격 레이블
      const price =
        maxPrice + padding - ((priceRange + padding * 2) / gridLines) * i;
      ctx.fillStyle = "#888";
      ctx.font = "12px monospace";
      ctx.textAlign = "right";
      ctx.fillText(price.toLocaleString(), chartLeft - 10, y + 4);
    }

    // 캔들 그리기
    const candleWidth = Math.max(
      2,
      Math.floor(chartWidth / candleData.length) - 2
    );
    const candleGap = 2;

    candleData.forEach((candle, index) => {
      const x = chartLeft + index * (candleWidth + candleGap) + candleWidth / 2;
      const openY = priceToY(candle.open);
      const closeY = priceToY(candle.close);
      const highY = priceToY(candle.high);
      const lowY = priceToY(candle.low);

      const isUp = candle.close >= candle.open;
      const color = isUp ? "#22c55e" : "#ef4444"; // green : red

      // 고가-저가 선
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // 몸통
      ctx.fillStyle = color;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.abs(closeY - openY) || 1;
      ctx.fillRect(
        x - candleWidth / 2,
        bodyTop,
        candleWidth,
        bodyHeight
      );
    });

    // 현재가 라인 (마지막 캔들의 close)
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

      // 현재가 레이블
      ctx.fillStyle = "#3b82f6";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "left";
      ctx.fillText(
        lastCandle.close.toLocaleString(),
        chartRight + 10,
        currentPriceY + 5
      );
    }
  }, [candleData, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="border border-gray-700 rounded-lg"
    />
  );
};
