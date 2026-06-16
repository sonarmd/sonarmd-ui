import React, {useMemo, useCallback} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {ChartCanvas} from '../../charts/ChartCanvas';
import type {ECOption} from '../../charts/echartsCore';

export interface LineSeries {
  key: string;
  name: string;
  color?: string;
  dashed?: boolean;
}

export interface LineChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: LineSeries[];
  height?: number;
  smooth?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onClick?: (item: Record<string, unknown>) => void;
  formatTooltip?: (value: number) => string;
  formatYAxis?: (value: number) => string;
  className?: string;
}

export const LineChart = React.memo(function LineChart({
  data,
  xKey,
  series,
  height = 400,
  smooth = false,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
  onClick,
  formatTooltip,
  formatYAxis,
  className,
}: LineChartProps): React.JSX.Element {
  const option = useMemo((): ECOption => {
    const labels = data.map((d) => String(d[xKey] ?? ''));

    const echartsSeries = series.map((s, i) => {
      const color = s.color ?? chartColors[i % chartColors.length];
      return {
        name: s.name,
        type: 'line' as const,
        smooth,
        symbol: 'none',
        lineStyle: {
          width: 2,
          color,
          type: s.dashed ? ('dashed' as const) : ('solid' as const),
        },
        itemStyle: {color},
        data: data.map((d) => (d[s.key] as number) ?? 0),
      };
    });

    return {
      tooltip: {
        trigger: 'axis' as const,
        ...echartsDefaults.tooltip,
        formatter: (params: unknown) => {
          const arr = Array.isArray(params)
            ? (params as Array<{axisValue: string; seriesName: string; value: number; color: string}>)
            : [];
          if (!arr.length) return '';
          let html = `<div style="font-weight:600;margin-bottom:6px">${arr[0].axisValue}</div>`;
          arr.forEach((p) => {
            const val = p.value ?? 0;
            const formatted = formatTooltip ? formatTooltip(val) : String(val);
            html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">`;
            html += `<span style="display:inline-block;width:10px;height:2px;background:${p.color};border-radius:1px"></span>`;
            html += `<span>${p.seriesName}:</span>`;
            html += `<span style="font-weight:600">${formatted}</span>`;
            html += `</div>`;
          });
          return html;
        },
      },
      legend: {...echartsDefaults.legend, data: series.map((s) => s.name)},
      grid: echartsDefaults.grid,
      xAxis: {type: 'category' as const, data: labels, ...echartsDefaults.xAxis},
      yAxis: {
        type: 'value' as const,
        ...echartsDefaults.yAxis,
        axisLabel: {
          ...echartsDefaults.yAxis.axisLabel,
          ...(formatYAxis ? {formatter: formatYAxis} : {}),
        },
      },
      series: echartsSeries,
    };
  }, [data, xKey, series, smooth, formatTooltip, formatYAxis]);

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
      emptyMessage={emptyMessage}
      onClick={onClick ? handleClick : undefined}
      className={className}
    />
  );
});
