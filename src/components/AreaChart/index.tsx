import React, {useMemo, useCallback} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {chartColors, echartsDefaults, areaGradient} from '../../sonarmd-tokens';
import {ChartCanvas} from '../../charts/ChartCanvas';
import type {ECOption} from '../../charts/echartsCore';

export interface AreaChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  color?: string;
  height?: number;
  smooth?: boolean;
  gradient?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  onClick?: (item: Record<string, unknown>) => void;
  formatTooltip?: (value: number) => string;
  className?: string;
}

function hexToRgbaInline(color: string, alpha: number): string {
  if (color.startsWith('rgb')) return color;
  const h = color.replace('#', '');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export const AreaChart = React.memo(function AreaChart({
  data,
  xKey,
  yKey,
  color = chartColors[0],
  height = 400,
  smooth = false,
  gradient = true,
  isLoading = false,
  isEmpty = false,
  onClick,
  formatTooltip,
  className,
}: AreaChartProps): JSX.Element {
  const option = useMemo((): ECOption => {
    const labels = data.map((d) => String(d[xKey] ?? ''));
    const values = data.map((d) => (d[yKey] as number) ?? 0);

    const areaStyle = gradient
      ? {color: areaGradient(color)}
      : {color: hexToRgbaInline(color, 0.2)};

    return {
      tooltip: {
        trigger: 'axis' as const,
        ...echartsDefaults.tooltip,
        ...(formatTooltip
          ? {
              formatter: (params: unknown) => {
                const p = Array.isArray(params)
                  ? (params as Array<{axisValue: string; value: number}>)[0]
                  : (params as {axisValue: string; value: number});
                return `<div style="font-weight:600;margin-bottom:4px">${p.axisValue}</div><div><span style="font-weight:600">${formatTooltip(p.value ?? 0)}</span></div>`;
              },
            }
          : {}),
      },
      grid: echartsDefaults.grid,
      xAxis: {type: 'category' as const, data: labels, ...echartsDefaults.xAxis},
      yAxis: {type: 'value' as const, ...echartsDefaults.yAxis},
      series: [
        {
          type: 'line' as const,
          smooth,
          symbol: 'none',
          data: values,
          lineStyle: {width: 2, color},
          itemStyle: {color},
          areaStyle,
        },
      ],
    };
  }, [data, xKey, yKey, color, smooth, gradient, formatTooltip]);

  const handleClick = useCallback(
    (p: ECElementEvent) => onClick?.(data[p.dataIndex]),
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
