/**
 * Recipe 9: Custom chart from the wrapper
 *
 * New echarts chart type using ChartCanvas core wrapper + semantic theme.
 * Import: `import { ChartCanvas } from '@sonarmd/ui/charts'`
 */
import React, {useMemo} from 'react';
import {ChartCanvas} from '../../src/charts/ChartCanvas';
import type {ECOption} from '../../src/charts/echartsCore';

interface RiskDistribution {
  band: string;
  count: number;
}

interface CustomChartProps {
  data: RiskDistribution[];
  height?: number;
}

/** Horizontal bar chart built on ChartCanvas. */
export function RiskDistributionChart({data, height = 300}: CustomChartProps): React.JSX.Element {
  const option = useMemo(
    (): ECOption => ({
      tooltip: {trigger: 'axis' as const},
      yAxis: {
        type: 'category',
        data: data.map((d) => d.band),
      },
      xAxis: {
        type: 'value',
        name: 'Patients',
      },
      series: [
        {
          type: 'bar',
          data: data.map((d) => d.count),
          itemStyle: {borderRadius: [0, 4, 4, 0]},
        },
      ],
    }),
    [data],
  );

  return <ChartCanvas option={option} height={height} />;
}

/** Usage demo. */
export function CustomChartDemo(): React.JSX.Element {
  const data: RiskDistribution[] = [
    {band: 'Low (<0.5)', count: 412},
    {band: 'Medium (0.5-1.5)', count: 738},
    {band: 'High (>1.5)', count: 90},
  ];

  return (
    <div style={{padding: 24}}>
      <h3>HCC Risk Distribution</h3>
      <RiskDistributionChart data={data} />
    </div>
  );
}
