// --- Theming (attribute-based; provider is optional) -------------------------
export {ThemeProvider, useTheme} from './theme';
export type {Theme, ThemeProviderProps} from './theme';

// --- Layer 0: Action & Surface Primitives ------------------------------------
export {Button} from './components/Button/Button';
export type {ButtonProps, ButtonVariant, ButtonSize, ButtonDensity} from './components/Button/Button';
export {Card} from './components/Card/Card';
export type {CardProps, CardVariant, CardDensity} from './components/Card/Card';
export {IconButton} from './components/IconButton/IconButton';
export type {IconButtonProps} from './components/IconButton/IconButton';
export {Breadcrumbs} from './components/Breadcrumbs/Breadcrumbs';
export type {BreadcrumbsProps, BreadcrumbItem} from './components/Breadcrumbs/Breadcrumbs';

// --- Layer 1: Form Primitives ------------------------------------------------
export {FieldWrapper} from './components/FieldWrapper/FieldWrapper';
export type {FieldWrapperProps} from './components/FieldWrapper/FieldWrapper';

// Forms System: layout + motion foundation
export {FormGrid} from './components/FormGrid/FormGrid';
export type {FormGridProps} from './components/FormGrid/FormGrid';
export {FormSection} from './components/FormSection/FormSection';
export type {FormSectionProps} from './components/FormSection/FormSection';
export {FormActions} from './components/FormActions/FormActions';
export type {FormActionsProps} from './components/FormActions/FormActions';
export {Fade} from './components/Fade/Fade';
export type {FadeProps} from './components/Fade/Fade';
export {SecureField} from './components/SecureField/SecureField';
export type {SecureFieldProps} from './components/SecureField/SecureField';
export {Form} from './components/Form/Form';
export type {FormProps} from './components/Form/Form';
export {FormErrorSummary} from './components/FormErrorSummary/FormErrorSummary';
export type {FormErrorSummaryProps} from './components/FormErrorSummary/FormErrorSummary';
export {useForm} from './hooks/useForm';
export type {FieldRules, FieldBinding, UseFormReturn} from './hooks/useForm';

export {TextInput} from './components/TextInput/TextInput';
export type {TextInputProps} from './components/TextInput/TextInput';

export {TextArea} from './components/TextArea/TextArea';
export type {TextAreaProps} from './components/TextArea/TextArea';

export {Select} from './components/Select/Select';
export type {SelectProps, SelectOption} from './components/Select/Select';

export {Checkbox} from './components/Checkbox/Checkbox';
export type {CheckboxProps} from './components/Checkbox/Checkbox';

export {CheckboxGroup} from './components/CheckboxGroup/CheckboxGroup';
export type {CheckboxGroupProps, CheckboxGroupOption} from './components/CheckboxGroup/CheckboxGroup';

export {Radio} from './components/Radio/Radio';
export type {RadioProps} from './components/Radio/Radio';

export {RadioGroup} from './components/RadioGroup/RadioGroup';
export type {RadioGroupProps, RadioGroupOption} from './components/RadioGroup/RadioGroup';

export {Toggle} from './components/Toggle/Toggle';
export type {ToggleProps} from './components/Toggle/Toggle';

// --- Layer 2: Complex Inputs -------------------------------------------------
export {Dropdown} from './components/Dropdown/Dropdown';
export type {DropdownProps, DropdownOption} from './components/Dropdown/Dropdown';

export {Typeahead} from './components/Typeahead/Typeahead';
export type {TypeaheadProps, TypeaheadOption} from './components/Typeahead/Typeahead';

export {MultiSelect} from './components/MultiSelect/MultiSelect';
export type {MultiSelectProps} from './components/MultiSelect/MultiSelect';

export {DatePicker} from './components/DatePicker/DatePicker';
export type {DatePickerProps} from './components/DatePicker/DatePicker';

export {DateRangePicker} from './components/DateRangePicker/DateRangePicker';
export type {DateRangePickerProps, DateRange} from './components/DateRangePicker/DateRangePicker';

// --- Layer 3: Feedback & Display ---------------------------------------------
export {Badge} from './components/Badge/Badge';
export type {BadgeProps, BadgeVariant} from './components/Badge/Badge';

export {Avatar} from './components/Avatar/Avatar';
export type {AvatarProps, AvatarSize, AvatarStatus} from './components/Avatar/Avatar';

export {Progress} from './components/Progress/Progress';
export type {ProgressProps, ProgressTone} from './components/Progress/Progress';

export {Alert} from './components/Alert/Alert';
export type {AlertProps, AlertVariant} from './components/Alert/Alert';

export {ToastProvider, useToast} from './components/Toast/Toast';
export type {ToastProviderProps, ToastItem, ToastContextValue} from './components/Toast/Toast';

export {Tooltip} from './components/Tooltip/Tooltip';
export type {TooltipProps} from './components/Tooltip/Tooltip';

export {Modal} from './components/Modal/Modal';
export type {ModalProps} from './components/Modal/Modal';

export {Drawer} from './components/Drawer/Drawer';
export type {DrawerProps, DrawerSide} from './components/Drawer/Drawer';

export {Popover} from './components/Popover/Popover';
export type {PopoverProps, PopoverPlacement} from './components/Popover/Popover';

export {ConfirmDialog} from './components/ConfirmDialog/ConfirmDialog';
export type {ConfirmDialogProps} from './components/ConfirmDialog/ConfirmDialog';

// --- Layer 4: Data Display ---------------------------------------------------
export {Skeleton} from './components/Skeleton/Skeleton';
export type {SkeletonProps} from './components/Skeleton/Skeleton';

export {LoadingSpinner} from './components/LoadingSpinner/LoadingSpinner';
export type {LoadingSpinnerProps} from './components/LoadingSpinner/LoadingSpinner';

export {EmptyState} from './components/EmptyState/EmptyState';
export type {EmptyStateProps} from './components/EmptyState/EmptyState';

export {KpiCard} from './components/KpiCard/KpiCard';
export type {KpiCardProps, KpiCardTrend} from './components/KpiCard/KpiCard';

export {KpiGrid} from './components/KpiGrid/KpiGrid';
export type {KpiGridProps} from './components/KpiGrid/KpiGrid';

export {DataTable} from './components/DataTable/DataTable';
export type {DataTableProps, Column} from './components/DataTable/DataTable';

export {DataGrid} from './components/DataGrid/DataGrid';
export type {
  DataGridProps,
  DataGridColumn,
  DataGridPagination,
  DataGridInfinite,
} from './components/DataGrid/DataGrid';

export {InfiniteList} from './components/InfiniteList/InfiniteList';
export type {InfiniteListProps} from './components/InfiniteList/InfiniteList';

// Chart components, ChartCard, and chart tokens live in the ./charts subpath
// entry so the core surface ships zero echarts bytes.

// --- Layer 5: Layout Primitives -----------------------------------------------
export {Stack} from './components/Stack/Stack';
export type {StackProps} from './components/Stack/Stack';
export {Cluster} from './components/Cluster/Cluster';
export type {ClusterProps} from './components/Cluster/Cluster';
export {Spacer} from './components/Spacer/Spacer';
export type {SpacerProps} from './components/Spacer/Spacer';
export {Columns} from './components/Columns/Columns';
export type {ColumnsProps} from './components/Columns/Columns';
export {Separator} from './components/Separator/Separator';
export type {SeparatorProps} from './components/Separator/Separator';
export {VisuallyHidden} from './components/VisuallyHidden/VisuallyHidden';
export type {VisuallyHiddenProps} from './components/VisuallyHidden/VisuallyHidden';
export {AppShell} from './components/AppShell/AppShell';
export type {AppShellProps} from './components/AppShell/AppShell';
export {AppErrorBoundary} from './components/AppErrorBoundary/AppErrorBoundary';
export type {AppErrorBoundaryProps} from './components/AppErrorBoundary/AppErrorBoundary';
export {WidgetErrorBoundary} from './components/WidgetErrorBoundary/WidgetErrorBoundary';
export type {WidgetErrorBoundaryProps} from './components/WidgetErrorBoundary/WidgetErrorBoundary';
export {QueryBoundary} from './components/QueryBoundary/QueryBoundary';
export type {QueryBoundaryProps} from './components/QueryBoundary/QueryBoundary';

// --- Layer 6: Composition & Layout -------------------------------------------
export {FilterBar} from './components/FilterBar/FilterBar';
export type {FilterBarProps} from './components/FilterBar/FilterBar';

export {PageHeader} from './components/PageHeader/PageHeader';
export type {PageHeaderProps} from './components/PageHeader/PageHeader';

export {PageSection} from './components/PageSection/PageSection';
export type {PageSectionProps} from './components/PageSection/PageSection';

export {Tabs} from './components/Tabs/Tabs';
export type {TabsProps, Tab} from './components/Tabs/Tabs';

export {Accordion} from './components/Accordion/Accordion';
export type {AccordionProps, AccordionItem} from './components/Accordion/Accordion';

export {Pagination} from './components/Pagination/Pagination';
export type {PaginationProps} from './components/Pagination/Pagination';

export {SegmentedControl} from './components/SegmentedControl/SegmentedControl';
export type {SegmentedControlProps, SegmentedOption} from './components/SegmentedControl/SegmentedControl';

export {Stepper} from './components/Stepper/Stepper';
export type {StepperProps, Step} from './components/Stepper/Stepper';

export {Sidebar} from './components/Sidebar/Sidebar';
export type {SidebarProps, NavItem} from './components/Sidebar/Sidebar';

export {GapsBanner} from './components/GapsBanner/GapsBanner';
export type {GapsBannerProps} from './components/GapsBanner/GapsBanner';

// --- Design Tokens (re-exported for consumers) --------------------------------
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
  inputIconInset,
  sidebar,
  zIndex,
} from './sonarmd-tokens';
