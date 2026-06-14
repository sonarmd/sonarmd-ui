/**
 * The single echarts entry point for the library. Importing from `echarts/core`
 * and registering only the chart types, components, and renderer we use keeps an
 * app that imports zero charts at zero echarts bytes, and keeps the charts entry
 * far below a full echarts build. All chart components go through ChartCanvas,
 * which is the only consumer of this module.
 */
import * as echarts from 'echarts/core';
import type {ComposeOption} from 'echarts/core';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  FunnelChart,
} from 'echarts/charts';
import type {
  LineSeriesOption,
  BarSeriesOption,
  PieSeriesOption,
  ScatterSeriesOption,
  GaugeSeriesOption,
  FunnelSeriesOption,
} from 'echarts/charts';
import {GridComponent, TooltipComponent, LegendComponent} from 'echarts/components';
import type {
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components';
import {CanvasRenderer} from 'echarts/renderers';
import {chartColors} from '../sonarmd-tokens';

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  GaugeChart,
  FunnelChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
]);

// Built from the same semantic palette as the rest of the system. S2 extends
// this with a dark variant from the dark token map.
echarts.registerTheme('sonarmd', {
  color: [...chartColors],
  backgroundColor: 'transparent',
});

/** Option type composed from exactly the modules registered above. */
export type ECOption = ComposeOption<
  | LineSeriesOption
  | BarSeriesOption
  | PieSeriesOption
  | ScatterSeriesOption
  | GaugeSeriesOption
  | FunnelSeriesOption
  | GridComponentOption
  | TooltipComponentOption
  | LegendComponentOption
>;

export {echarts};
