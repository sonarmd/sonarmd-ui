import React, {useMemo} from 'react';
import {echartsDefaults} from '../../sonarmd-tokens';
import {ChartCanvas} from '../../charts/ChartCanvas';
import type {ECOption} from '../../charts/echartsCore';

export interface GaugeThreshold {
  at: number;
  color: string;
}

export interface GaugeChartProps {
  value: number;
  min?: number;
  max?: number;
  label?: string;
  thresholds?: GaugeThreshold[];
  showPercent?: boolean;
  height?: number;
  isLoading?: boolean;
  className?: string;
}

const DEFAULT_THRESHOLDS: GaugeThreshold[] = [
  {at: 0.3, color: '#E9424C'},
  {at: 0.6, color: '#FFCA2D'},
  {at: 1.0, color: '#2BA854'},
];

export const GaugeChart = React.memo(function GaugeChart({
  value,
  min = 0,
  max = 100,
  label,
  thresholds = DEFAULT_THRESHOLDS,
  showPercent = false,
  height = 300,
  isLoading = false,
  className,
}: GaugeChartProps): JSX.Element {
  const option = useMemo((): ECOption => {
    const axisLineColors = thresholds.map((t) => [t.at, t.color] as [number, string]);

    return {
      tooltip: {
        trigger: 'item' as const,
        ...echartsDefaults.tooltip,
      },
      series: [
        {
          type: 'gauge' as const,
          min,
          max,
          data: [{value, name: label ?? ''}],
          axisLine: {
            lineStyle: {
              width: 18,
              color: axisLineColors,
            },
          },
          axisTick: {show: false},
          splitLine: {show: false},
          axisLabel: {
            color: '#727286',
            fontSize: 11,
            distance: 20,
          },
          pointer: {
            itemStyle: {color: 'auto'},
          },
          detail: {
            fontSize: 24,
            fontWeight: 600,
            color: '#171724',
            formatter: showPercent
              ? (v: number) => `${((v / max) * 100).toFixed(1)}%`
              : (v: number) => String(v),
            offsetCenter: [0, '60%'],
          },
          title: {
            show: !!label,
            fontSize: 13,
            color: '#3F3F54',
            offsetCenter: [0, '80%'],
          },
        },
      ],
    };
  }, [value, min, max, label, thresholds, showPercent]);

  return <ChartCanvas option={option} height={height} isLoading={isLoading} className={className} />;
});
