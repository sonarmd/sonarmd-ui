// ─── Layer 1: Form Primitives ────────────────────────────────────────────────
export {FieldWrapper} from './components/FieldWrapper';
export type {FieldWrapperProps} from './components/FieldWrapper';

// Forms System: layout + motion foundation
export {FormGrid} from './components/FormGrid';
export type {FormGridProps} from './components/FormGrid';
export {FormSection} from './components/FormSection';
export type {FormSectionProps} from './components/FormSection';
export {FormActions} from './components/FormActions';
export type {FormActionsProps} from './components/FormActions';
export {Fade} from './components/Fade';
export type {FadeProps} from './components/Fade';
export {SecureField} from './components/SecureField';
export type {SecureFieldProps} from './components/SecureField';

export {TextInput} from './components/TextInput';
export type {TextInputProps} from './components/TextInput';

export {TextArea} from './components/TextArea';
export type {TextAreaProps} from './components/TextArea';

export {Select} from './components/Select';
export type {SelectProps, SelectOption} from './components/Select';

export {Checkbox} from './components/Checkbox';
export type {CheckboxProps} from './components/Checkbox';

export {CheckboxGroup} from './components/CheckboxGroup';
export type {CheckboxGroupProps, CheckboxGroupOption} from './components/CheckboxGroup';

export {Radio} from './components/Radio';
export type {RadioProps} from './components/Radio';

export {RadioGroup} from './components/RadioGroup';
export type {RadioGroupProps, RadioGroupOption} from './components/RadioGroup';

export {Toggle} from './components/Toggle';
export type {ToggleProps} from './components/Toggle';

// ─── Layer 2: Complex Inputs ─────────────────────────────────────────────────
export {Dropdown} from './components/Dropdown';
export type {DropdownProps, DropdownOption} from './components/Dropdown';

export {Typeahead} from './components/Typeahead';
export type {TypeaheadProps, TypeaheadOption} from './components/Typeahead';

export {MultiSelect} from './components/MultiSelect';
export type {MultiSelectProps} from './components/MultiSelect';

export {DatePicker} from './components/DatePicker';
export type {DatePickerProps} from './components/DatePicker';

export {DateRangePicker} from './components/DateRangePicker';
export type {DateRangePickerProps, DateRange} from './components/DateRangePicker';

// ─── Layer 3: Feedback & Display ─────────────────────────────────────────────
export {Badge} from './components/Badge';
export type {BadgeProps, BadgeVariant} from './components/Badge';

export {Alert} from './components/Alert';
export type {AlertProps, AlertVariant} from './components/Alert';

export {ToastProvider, useToast} from './components/Toast';
export type {ToastProviderProps, ToastItem, ToastContextValue} from './components/Toast';

export {Tooltip} from './components/Tooltip';
export type {TooltipProps} from './components/Tooltip';

export {Modal} from './components/Modal';
export type {ModalProps} from './components/Modal';

export {ConfirmDialog} from './components/ConfirmDialog';
export type {ConfirmDialogProps} from './components/ConfirmDialog';

// ─── Layer 4: Data Display ───────────────────────────────────────────────────
export {Skeleton} from './components/Skeleton';
export type {SkeletonProps} from './components/Skeleton';

export {LoadingSpinner} from './components/LoadingSpinner';
export type {LoadingSpinnerProps} from './components/LoadingSpinner';

export {EmptyState} from './components/EmptyState';
export type {EmptyStateProps} from './components/EmptyState';

export {KpiCard} from './components/KpiCard';
export type {KpiCardProps, KpiCardTrend} from './components/KpiCard';

export {KpiGrid} from './components/KpiGrid';
export type {KpiGridProps} from './components/KpiGrid';

export {DataTable} from './components/DataTable';
export type {DataTableProps, Column} from './components/DataTable';

// ─── Layer 5: Chart Wrappers ─────────────────────────────────────────────────
export {BarChart} from './components/BarChart';
export type {BarChartProps} from './components/BarChart';

export {StackedBarChart} from './components/StackedBarChart';
export type {StackedBarChartProps, BarSeries} from './components/StackedBarChart';

export {LineChart} from './components/LineChart';
export type {LineChartProps, LineSeries} from './components/LineChart';

export {AreaChart} from './components/AreaChart';
export type {AreaChartProps} from './components/AreaChart';

export {StackedAreaChart} from './components/StackedAreaChart';
export type {StackedAreaChartProps} from './components/StackedAreaChart';

export {PieChart} from './components/PieChart';
export type {PieChartProps, PieDataItem} from './components/PieChart';

export {GaugeChart} from './components/GaugeChart';
export type {GaugeChartProps, GaugeThreshold} from './components/GaugeChart';

export {FunnelChart} from './components/FunnelChart';
export type {FunnelChartProps, FunnelStage} from './components/FunnelChart';

export {BubbleChart} from './components/BubbleChart';
export type {BubbleChartProps, BubbleDataPoint} from './components/BubbleChart';

// ─── Layer 6: Composition & Layout ───────────────────────────────────────────
export {ChartCard} from './components/ChartCard';
export type {ChartCardProps} from './components/ChartCard';

export {FilterBar} from './components/FilterBar';
export type {FilterBarProps} from './components/FilterBar';

export {PageHeader} from './components/PageHeader';
export type {PageHeaderProps, BreadcrumbItem} from './components/PageHeader';

export {PageSection} from './components/PageSection';
export type {PageSectionProps} from './components/PageSection';

export {Tabs} from './components/Tabs';
export type {TabsProps, Tab} from './components/Tabs';

export {Sidebar} from './components/Sidebar';
export type {SidebarProps, NavItem} from './components/Sidebar';

export {GapsBanner} from './components/GapsBanner';
export type {GapsBannerProps} from './components/GapsBanner';

// ─── Design Tokens (re-exported for consumers) ────────────────────────────────
export {
  colors,
  spacing,
  radius,
  shadows,
  fontSize,
  fontWeight,
  lineHeight,
  duration,
  ease,
  inputHeight,
  inputPaddingX,
  inputFontSize,
  sidebar,
  chartColors,
  echartsDefaults,
  areaGradient,
} from './sonarmd-tokens';
