import React, {useMemo, useCallback, useRef, useEffect} from 'react';
import ReactECharts from 'echarts-for-react';
import type {EChartsInstance} from 'echarts-for-react';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {useThrottle} from '../../hooks/useThrottle';
import {Skeleton} from '../Skeleton';
import {EmptyState} from '../EmptyState';
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
  const containerRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<EChartsInstance | null>(null);

  const throttledResize = useThrottle(() => {
    chartInstanceRef.current?.resize();
  }, 200);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(throttledResize);
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [throttledResize]);

  const handleChartReady = useCallback((chart: EChartsInstance) => {
    chartInstanceRef.current = chart;
  }, []);

  const option = useMemo(() => {
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

  const onEvents = useMemo(
    () =>
      onClick
        ? {
            click: (params: {name: string}) => {
              const found = data.find((d) => d.name === params.name);
              if (found) onClick(found);
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
        <EmptyState title="No data available" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={[styles.root, className].filter(Boolean).join(' ')}>
      <div className={styles.wrapper}>
        <ReactECharts
          option={option}
          theme="sonarmd"
          style={{height, width: '100%'}}
          opts={{renderer: 'svg'}} lazyUpdate
          notMerge
          onChartReady={handleChartReady}
          {...(onEvents ? {onEvents} : {})}
        />
        {donut && centerContent && (
          <div className={styles.center}>{centerContent}</div>
        )}
      </div>
    </div>
  );
});
