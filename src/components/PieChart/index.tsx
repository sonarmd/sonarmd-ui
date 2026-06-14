import React, {useMemo, useCallback} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {ChartCanvas} from '../../charts/ChartCanvas';
import type {ECOption} from '../../charts/echartsCore';
import styles from './PieChart.module.css';

export interface PieDataItem {
  name: string;
  value: number;
  color?: string;
}

export interface PieChartProps {
  data: PieDataItem[];
  donut?: boolean;
  height?: number;
  showLabels?: boolean;
  showLegend?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  onClick?: (item: PieDataItem) => void;
  centerContent?: React.ReactNode;
  className?: string;
}

const cx = (...parts: Array<string | undefined>): string => parts.filter(Boolean).join(' ');

export const PieChart = React.memo(function PieChart({
  data,
  donut = false,
  height = 300,
  showLabels = true,
  showLegend = true,
  isLoading = false,
  isEmpty = false,
  onClick,
  centerContent,
  className,
}: PieChartProps): JSX.Element {
  const option = useMemo((): ECOption => {
    const seriesData = data.map((item, i) => ({
      name: item.name,
      value: item.value,
      itemStyle: {color: item.color ?? chartColors[i % chartColors.length]},
    }));

    return {
      tooltip: {
        trigger: 'item' as const,
        ...echartsDefaults.tooltip,
        formatter: (params: unknown) => {
          const p = params as {name: string; value: number; percent: number; color: string};
          return `<div style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.color}"></span>
            <span style="font-weight:600">${p.name}</span>
          </div>
          <div style="margin-top:4px">${p.value} (${p.percent}%)</div>`;
        },
      },
      legend: showLegend
        ? {
            ...echartsDefaults.legend,
            orient: 'horizontal' as const,
            bottom: 0,
            data: data.map((d) => d.name),
          }
        : {show: false},
      series: [
        {
          type: 'pie' as const,
          radius: donut ? ['45%', '70%'] : '65%',
          center: ['50%', showLegend ? '45%' : '50%'],
          data: seriesData,
          label: {show: showLabels},
          emphasis: {
            itemStyle: {shadowBlur: 10, shadowOffsetX: 0, shadowColor: 'rgba(0,0,0,0.2)'},
          },
        },
      ],
    };
  }, [data, donut, showLabels, showLegend]);

  const handleClick = useCallback(
    (p: ECElementEvent) => {
      const found = data.find((d) => d.name === p.name);
      if (found) onClick?.(found);
    },
    [onClick, data],
  );

  // ChartCanvas owns the loading/empty states; the donut center only overlays
  // the live chart.
  if (isLoading || isEmpty) {
    return <ChartCanvas option={option} height={height} isLoading={isLoading} isEmpty={isEmpty} className={className} />;
  }

  return (
    <div className={cx(styles.wrapper, className)}>
      <ChartCanvas option={option} height={height} onClick={onClick ? handleClick : undefined} />
      {donut && centerContent && <div className={styles.center}>{centerContent}</div>}
    </div>
  );
});
