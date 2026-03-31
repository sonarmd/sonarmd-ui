import React, {useMemo} from 'react';
import ReactECharts from 'echarts-for-react';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {Skeleton} from '../Skeleton';
import {EmptyState} from '../EmptyState';
import styles from './BarChart.module.css';

export interface BarChartProps {
  data: Array<Record<string, unknown>>;
  xKey: string;
  yKey: string;
  color?: string;
  horizontal?: boolean;
  height?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  onClick?: (item: Record<string, unknown>) => void;
  formatTooltip?: (value: number) => string;
  formatYAxis?: (value: number) => string;
  className?: string;
}

export function BarChart({
  data,
  xKey,
  yKey,
  color = chartColors[0],
  horizontal = false,
  height = 400,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
  onClick,
  formatTooltip,
  formatYAxis,
  className,
}: BarChartProps): JSX.Element {
  const option = useMemo(() => {
    const labels = data.map((d) => String(d[xKey] ?? ''));
    const values = data.map((d) => d[yKey] as number ?? 0);

    const xAxis = horizontal
      ? {
          type: 'value' as const,
          ...echartsDefaults.xAxis,
          axisLabel: {
            ...echartsDefaults.xAxis.axisLabel,
            ...(formatYAxis ? {formatter: formatYAxis} : {}),
          },
        }
      : {
          type: 'category' as const,
          data: labels,
          ...echartsDefaults.xAxis,
        };

    const yAxis = horizontal
      ? {
          type: 'category' as const,
          data: labels,
          ...echartsDefaults.yAxis,
        }
      : {
          type: 'value' as const,
          ...echartsDefaults.yAxis,
          axisLabel: {
            ...echartsDefaults.yAxis.axisLabel,
            ...(formatYAxis ? {formatter: formatYAxis} : {}),
          },
        };

    return {
      tooltip: {
        trigger: 'axis' as const,
        ...echartsDefaults.tooltip,
        ...(formatTooltip
          ? {
              formatter: (params: unknown) => {
                const p = Array.isArray(params) ? params[0] : params as {axisValue: string; value: number};
                return `<div style="font-weight:600;margin-bottom:4px">${p.axisValue}</div><div><span style="font-weight:600">${formatTooltip(p.value ?? 0)}</span></div>`;
              },
            }
          : {}),
      },
      grid: echartsDefaults.grid,
      xAxis,
      yAxis,
      series: [
        {
          type: 'bar' as const,
          data: values,
          itemStyle: {color, borderRadius: horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]},
          emphasis: {focus: 'self' as const},
          barMaxWidth: 48,
        },
      ],
    };
  }, [data, xKey, yKey, color, horizontal, formatTooltip, formatYAxis]);

  const onEvents = useMemo(
    () =>
      onClick
        ? {
            click: (params: {dataIndex: number}) => {
              onClick(data[params.dataIndex]);
            },
          }
        : undefined,
    [onClick, data],
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
