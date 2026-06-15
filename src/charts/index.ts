// @sonarmd/ui/charts - the only entry that pulls echarts. Apps importing zero
// charts ship zero echarts bytes.

export {BarChart} from '../components/BarChart';
export type {BarChartProps} from '../components/BarChart';

export {StackedBarChart} from '../components/StackedBarChart';
export type {StackedBarChartProps, BarSeries} from '../components/StackedBarChart';

export {LineChart} from '../components/LineChart';
export type {LineChartProps, LineSeries} from '../components/LineChart';

export {AreaChart} from '../components/AreaChart';
export type {AreaChartProps} from '../components/AreaChart';

export {StackedAreaChart} from '../components/StackedAreaChart';
export type {StackedAreaChartProps} from '../components/StackedAreaChart';

export {PieChart} from '../components/PieChart';
export type {PieChartProps, PieDataItem} from '../components/PieChart';

export {GaugeChart} from '../components/GaugeChart';
export type {GaugeChartProps, GaugeThreshold} from '../components/GaugeChart';

export {FunnelChart} from '../components/FunnelChart';
export type {FunnelChartProps, FunnelStage} from '../components/FunnelChart';

export {BubbleChart} from '../components/BubbleChart';
export type {BubbleChartProps, BubbleDataPoint} from '../components/BubbleChart';

export {ChartCard} from '../components/ChartCard';
export type {ChartCardProps} from '../components/ChartCard';

// The internal wrapper + core, exported so consumers can build their own chart
// types on the same registered echarts instance and theme.
export {ChartCanvas} from './ChartCanvas';
export type {ChartCanvasProps} from './ChartCanvas';
export {echarts} from './echartsCore';
export type {ECOption} from './echartsCore';

// Chart token helpers.
export {chartColors, echartsDefaults, areaGradient} from '../sonarmd-tokens';
