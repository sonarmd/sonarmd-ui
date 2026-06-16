import React, {useMemo, useCallback} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {chartColors, echartsDefaults} from '../../sonarmd-tokens';
import {ChartCanvas} from '../../charts/ChartCanvas';
import type {ECOption} from '../../charts/echartsCore';

export interface FunnelStage {
  name: string;
  value: number;
  color?: string;
}

export interface FunnelChartProps {
  stages: FunnelStage[];
  height?: number;
  showConversion?: boolean;
  isLoading?: boolean;
  isEmpty?: boolean;
  onClick?: (stage: FunnelStage) => void;
  className?: string;
}

export const FunnelChart = React.memo(function FunnelChart({
  stages,
  height = 300,
  showConversion = false,
  isLoading = false,
  isEmpty = false,
  onClick,
  className,
}: FunnelChartProps): React.JSX.Element {
  const option = useMemo((): ECOption => {
    const seriesData = stages.map((stage, i) => ({
      name: stage.name,
      value: stage.value,
      itemStyle: {color: stage.color ?? chartColors[i % chartColors.length]},
    }));

    return {
      tooltip: {
        trigger: 'item' as const,
        ...echartsDefaults.tooltip,
        formatter: (params: unknown) => {
          const p = params as {name: string; value: number; percent: number; color: string};
          return `<div style="display:flex;align-items:center;gap:6px">
            <span style="display:inline-block;width:10px;height:10px;border-radius:2px;background:${p.color}"></span>
            <span style="font-weight:600">${p.name}</span>
          </div>
          <div style="margin-top:4px">${p.value} (${p.percent}%)</div>`;
        },
      },
      legend: {
        ...echartsDefaults.legend,
        orient: 'vertical' as const,
        right: 10,
        data: stages.map((s) => s.name),
      },
      series: [
        {
          type: 'funnel' as const,
          left: '10%',
          right: '20%',
          top: 40,
          bottom: 20,
          width: '70%',
          sort: 'none' as const,
          gap: 2,
          label: {
            show: true,
            position: 'inside' as const,
            color: '#fff',
            fontWeight: 600,
            fontSize: 12,
            formatter: showConversion
              ? (params: unknown) => {
                  const p = params as {dataIndex: number; value: number; name: string};
                  if (p.dataIndex === 0 || !stages[p.dataIndex - 1]) {
                    return `{name|${p.name}}\n{val|${p.value}}`;
                  }
                  const prev = stages[p.dataIndex - 1].value;
                  const pct = prev > 0 ? ((p.value / prev) * 100).toFixed(1) : '0.0';
                  return `{name|${p.name}}\n{val|${p.value}}\n{pct|${pct}%}`;
                }
              : '{b}: {c}',
            rich: showConversion
              ? {
                  name: {fontSize: 11, color: '#fff'},
                  val: {fontSize: 13, fontWeight: 700, color: '#fff'},
                  pct: {fontSize: 11, color: 'rgba(255,255,255,0.8)'},
                }
              : undefined,
          },
          emphasis: {label: {fontSize: 14}},
          data: seriesData,
        },
      ],
    };
  }, [stages, showConversion]);

  const handleClick = useCallback(
    (p: ECElementEvent) => onClick?.(stages[p.dataIndex]),
    [onClick, stages],
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
