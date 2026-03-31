import React, {useMemo} from 'react';
import ReactECharts from 'echarts-for-react';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {Skeleton} from '../Skeleton';
import {EmptyState} from '../EmptyState';
import styles from './StackedBarChart.module.css';

export interface BarSeries {
  key: string;
  name: string;
  color?: string;
}

export interface StackedBarChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: BarSeries[];
  stacked?: boolean;
  height?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onClick?: (item: Record<string, unknown>, seriesKey: string) => void;
  formatTooltip?: (value: number) => string;
  className?: string;
}

export function StackedBarChart({
  data,
  xKey,
  series,
  stacked = true,
  height = 400,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
  onClick,
  formatTooltip,
  className,
}: StackedBarChartProps): JSX.Element {
  const option = useMemo(() => {
    const labels = data.map((d) => String(d[xKey] ?? ''));

    const echartsSeries = series.map((s, i) => {
      const color = s.color ?? chartColors[i % chartColors.length];
      return {
        name: s.name,
        type: 'bar' as const,
        ...(stacked ? {stack: 'total'} : {}),
        data: data.map((d) => (d[s.key] as number) ?? 0),
        itemStyle: {color, borderRadius: [0, 0, 0, 0] as [number, number, number, number]},
        emphasis: {focus: 'series' as const},
        barMaxWidth: 48,
      };
    });

    // Round top corners on the topmost visible series when stacked
    if (stacked && echartsSeries.length > 0) {
      echartsSeries[echartsSeries.length - 1].itemStyle.borderRadius = [4, 4, 0, 0];
    }

    return {
      tooltip: {
        trigger: 'axis' as const,
        ...echartsDefaults.tooltip,
        formatter: (params: unknown) => {
          const arr = Array.isArray(params) ? params as Array<{axisValue: string; seriesName: string; value: number; color: string}> : [];
          if (!arr.length) return '';
          let html = `<div style="font-weight:600;margin-bottom:6px">${arr[0].axisValue}</div>`;
          let total = 0;
          arr.forEach((p) => {
            const val = p.value ?? 0;
            total += val;
            const formatted = formatTooltip ? formatTooltip(val) : String(val);
            html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">`;
            html += `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>`;
            html += `<span>${p.seriesName}:</span>`;
            html += `<span style="font-weight:600">${formatted}</span>`;
            html += `</div>`;
          });
          if (stacked && series.length > 1) {
            const totalFormatted = formatTooltip ? formatTooltip(total) : String(total);
            html += `<div style="margin-top:4px;padding-top:4px;border-top:1px solid #E2E8F0;font-weight:600">Total: ${totalFormatted}</div>`;
          }
          return html;
        },
      },
      legend: {...echartsDefaults.legend, data: series.map((s) => s.name)},
      grid: echartsDefaults.grid,
      xAxis: {type: 'category' as const, data: labels, ...echartsDefaults.xAxis},
      yAxis: {type: 'value' as const, ...echartsDefaults.yAxis},
      series: echartsSeries,
    };
  }, [data, xKey, series, stacked, formatTooltip]);

  const onEvents = useMemo(
    () =>
      onClick
        ? {
            click: (params: {dataIndex: number; seriesIndex: number}) => {
              onClick(data[params.dataIndex], series[params.seriesIndex]?.key ?? '');
            },
          }
        : undefined,
    [onClick, data, series],
  );

  if (isLoading) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <Skeleton variant="rect" width="100%" height={height} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={[styles.root, className].filter(Boolean).join(' ')}>
        <EmptyState title={emptyMessage ?? 'No data available'} />
      </div>
    );
  }

  return (
    <div className={[styles.root, className].filter(Boolean).join(' ')}>
      <ReactECharts
        option={option}
        theme="sonarmd"
        style={{height, width: '100%'}}
        opts={{renderer: 'svg'}}
        notMerge
        {...(onEvents ? {onEvents} : {})}
      />
    </div>
  );
}
