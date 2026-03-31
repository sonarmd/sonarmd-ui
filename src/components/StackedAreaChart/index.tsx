import React, {useMemo} from 'react';
import ReactECharts from 'echarts-for-react';
import {chartColors, echartsDefaults, areaGradient} from '../../sonarmd-tokens';
import {Skeleton} from '../Skeleton';
import {EmptyState} from '../EmptyState';
import {BarSeries} from '../StackedBarChart';
import styles from './StackedAreaChart.module.css';

export interface StackedAreaChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  series: BarSeries[];
  height?: number;
  smooth?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  onClick?: (item: Record<string, unknown>, seriesKey: string) => void;
  className?: string;
}

export function StackedAreaChart({
  data,
  xKey,
  series,
  height = 400,
  smooth = false,
  isLoading = false,
  isEmpty = false,
  onClick,
  className,
}: StackedAreaChartProps): JSX.Element {
  const option = useMemo(() => {
    const labels = data.map((d) => String(d[xKey] ?? ''));

    const echartsSeries = series.map((s, i) => {
      const color = s.color ?? chartColors[i % chartColors.length];
      return {
        name: s.name,
        type: 'line' as const,
        smooth,
        symbol: 'none',
        stack: 'total',
        lineStyle: {width: 2, color},
        itemStyle: {color},
        areaStyle: {color: areaGradient(color)},
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
            html += `<div style="display:flex;align-items:center;gap:6px;margin:3px 0">`;
            html += `<span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>`;
            html += `<span>${p.seriesName}:</span>`;
            html += `<span style="font-weight:600">${p.value ?? 0}</span>`;
            html += `</div>`;
          });
          return html;
        },
      },
      legend: {...echartsDefaults.legend, data: series.map((s) => s.name)},
      grid: echartsDefaults.grid,
      xAxis: {type: 'category' as const, data: labels, ...echartsDefaults.xAxis},
      yAxis: {type: 'value' as const, ...echartsDefaults.yAxis},
      series: echartsSeries,
    };
  }, [data, xKey, series, smooth]);

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
        <EmptyState title="No data available" />
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
