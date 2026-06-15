// --- Theming (attribute-based; provider is optional) -------------------------
export {ThemeProvider, useTheme} from './theme';
export type {Theme, ThemeProviderProps} from './theme';

// --- Layer 0: Action & Surface Primitives ------------------------------------
export {Button} from './components/Button';
export type {ButtonProps, ButtonVariant, ButtonSize, ButtonDensity} from './components/Button';
export {Card} from './components/Card';
export type {CardProps, CardVariant, CardDensity} from './components/Card';
export {IconButton} from './components/IconButton';
export type {IconButtonProps} from './components/IconButton';
export {Breadcrumbs} from './components/Breadcrumbs';
export type {BreadcrumbsProps, BreadcrumbItem} from './components/Breadcrumbs';

// --- Layer 1: Form Primitives ------------------------------------------------
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
export {Form} from './components/Form';
export type {FormProps} from './components/Form';
export {FormErrorSummary} from './components/FormErrorSummary';
export type {FormErrorSummaryProps} from './components/FormErrorSummary';
export {useForm} from './hooks/useForm';
export type {FieldRules, FieldBinding, UseFormReturn} from './hooks/useForm';

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

// Chart components, ChartCard, and chart tokens live in the ./charts subpath
// entry so the core surface ships zero echarts bytes.

// --- Layer 5: Layout Primitives -----------------------------------------------
export {Stack} from './components/Stack';
export type {StackProps} from './components/Stack';
export {Cluster} from './components/Cluster';
export type {ClusterProps} from './components/Cluster';
export {Spacer} from './components/Spacer';
export type {SpacerProps} from './components/Spacer';
export {Columns} from './components/Columns';
export type {ColumnsProps} from './components/Columns';
export {AppShell} from './components/AppShell';
export type {AppShellProps} from './components/AppShell';

// --- Layer 6: Composition & Layout -------------------------------------------
export {FilterBar} from './components/FilterBar';
export type {FilterBarProps} from './components/FilterBar';

export {PageHeader} from './components/PageHeader';
export type {PageHeaderProps} from './components/PageHeader';

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
  inputIconInset,
  sidebar,
  zIndex,
} from './sonarmd-tokens';
