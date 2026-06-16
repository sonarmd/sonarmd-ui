import React, {useMemo, useCallback} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {ChartCanvas} from '../../charts/ChartCanvas';
import type {ECOption} from '../../charts/echartsCore';

export interface BubbleDataPoint {
  name: string;
  x: number;
  y: number;
  size: number;
  color?: string;
  [key: string]: unknown;
}

export interface BubbleChartProps {
  data: BubbleDataPoint[];
  xLabel?: string;
  yLabel?: string;
  sizeLabel?: string;
  height?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  onClick?: (point: BubbleDataPoint) => void;
  formatX?: (value: number) => string;
  formatY?: (value: number) => string;
  className?: string;
}

export const BubbleChart = React.memo(function BubbleChart({
  data,
  xLabel,
  yLabel,
  height = 400,
  isLoading = false,
  isEmpty = false,
  onClick,
  formatX,
  formatY,
  className,
}: BubbleChartProps): React.JSX.Element {
  const option = useMemo((): ECOption => {
    // Group points by color into separate series for distinct rendering
    const colorMap = new Map<string, BubbleDataPoint[]>();
    data.forEach((pt) => {
      const c = pt.color ?? chartColors[0];
      if (!colorMap.has(c)) colorMap.set(c, []);
      colorMap.get(c)!.push(pt);
    });

    const echartsSeries = Array.from(colorMap.entries()).map(([color, points]) => ({
      type: 'scatter' as const,
      symbolSize: (d: number[]) => Math.sqrt(d[2]) * 8,
      itemStyle: {color},
      data: points.map((pt) => [pt.x, pt.y, pt.size, pt.name]),
      emphasis: {focus: 'self' as const},
    }));

    // Fall back to a single empty series so the axes still render
    const series =
      echartsSeries.length > 0
        ? echartsSeries
        : [
            {
              type: 'scatter' as const,
              symbolSize: (d: number[]) => Math.sqrt(d[2]) * 8,
              itemStyle: {color: chartColors[0]},
              data: [] as Array<Array<number | string>>,
              emphasis: {focus: 'self' as const},
            },
          ];

    return {
      tooltip: {
        trigger: 'item' as const,
        ...echartsDefaults.tooltip,
        formatter: (params: unknown) => {
          const p = params as {value: [number, number, number, string]; color: string};
          const [x, y, size, name] = p.value;
          const xFormatted = formatX ? formatX(x) : String(x);
          const yFormatted = formatY ? formatY(y) : String(y);
          return `<div style="font-weight:600;margin-bottom:4px">${name ?? ''}</div>
            <div>${xLabel ?? 'X'}: <span style="font-weight:600">${xFormatted}</span></div>
            <div>${yLabel ?? 'Y'}: <span style="font-weight:600">${yFormatted}</span></div>
            <div>Size: <span style="font-weight:600">${size}</span></div>`;
        },
      },
      grid: echartsDefaults.grid,
      xAxis: {
        type: 'value' as const,
        name: xLabel,
        nameLocation: 'middle' as const,
        nameGap: 30,
        ...echartsDefaults.xAxis,
        axisLabel: {
          ...echartsDefaults.xAxis.axisLabel,
          ...(formatX ? {formatter: formatX} : {}),
        },
      },
      yAxis: {
        type: 'value' as const,
        name: yLabel,
        nameLocation: 'middle' as const,
        nameGap: 40,
        ...echartsDefaults.yAxis,
        axisLabel: {
          ...echartsDefaults.yAxis.axisLabel,
          ...(formatY ? {formatter: formatY} : {}),
        },
      },
      series,
    };
  }, [data, xLabel, yLabel, formatX, formatY]);

  const handleClick = useCallback(
    (p: ECElementEvent) => {
      const [x, y, size, name] = p.value as [number, number, number, string];
      const found = data.find(
        (d) => d.x === x && d.y === y && d.size === size && d.name === name,
      );
      if (found) onClick?.(found);
    },
    [onClick, data],
  );

  return (
    <ChartCanvas
      option={option}
      height={height}
      isLoading={isLoading}
      isEmpty={isEmpty}
      onClick={onClick ? handleClick : undefined}
      className={className}
    />
  );
});
