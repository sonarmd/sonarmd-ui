// @sonarmd/ui/charts - the only entry that pulls echarts. Apps importing zero
// charts ship zero echarts bytes.

export {BarChart} from '../components/BarChart/BarChart';
export type {BarChartProps} from '../components/BarChart/BarChart';

export {StackedBarChart} from '../components/StackedBarChart/StackedBarChart';
export type {StackedBarChartProps, BarSeries} from '../components/StackedBarChart/StackedBarChart';

export {LineChart} from '../components/LineChart/LineChart';
export type {LineChartProps, LineSeries} from '../components/LineChart/LineChart';

export {AreaChart} from '../components/AreaChart/AreaChart';
export type {AreaChartProps} from '../components/AreaChart/AreaChart';

export {StackedAreaChart} from '../components/StackedAreaChart/StackedAreaChart';
export type {StackedAreaChartProps} from '../components/StackedAreaChart/StackedAreaChart';

export {PieChart} from '../components/PieChart/PieChart';
export type {PieChartProps, PieDataItem} from '../components/PieChart/PieChart';

export {GaugeChart} from '../components/GaugeChart/GaugeChart';
export type {GaugeChartProps, GaugeThreshold} from '../components/GaugeChart/GaugeChart';

export {FunnelChart} from '../components/FunnelChart/FunnelChart';
export type {FunnelChartProps, FunnelStage} from '../components/FunnelChart/FunnelChart';

export {BubbleChart} from '../components/BubbleChart/BubbleChart';
export type {BubbleChartProps, BubbleDataPoint} from '../components/BubbleChart/BubbleChart';

export {ChartCard} from '../components/ChartCard/ChartCard';
export type {ChartCardProps} from '../components/ChartCard/ChartCard';

// The internal wrapper + core, exported so consumers can build their own chart
// types on the same registered echarts instance and theme.
export {ChartCanvas} from './ChartCanvas/ChartCanvas';
export type {ChartCanvasProps} from './ChartCanvas/ChartCanvas';
export {echarts} from './echartsCore';
export type {ECOption} from './echartsCore';

// Chart token helpers.
export {chartColors, echartsDefaults, areaGradient} from '../sonarmd-tokens';
