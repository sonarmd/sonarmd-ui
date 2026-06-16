import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FieldWrapper } from '../FieldWrapper';
import { usePortal } from '../../hooks/usePortal';
import styles from './DateRangePicker.module.css';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  value: DateRange;
  onChange: (range: DateRange) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  presets?: Array<{ label: string; range: DateRange }>;
  name?: string;
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const DOW_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <rect x="2" y="3" width="12" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M5 2v2M11 2v2M2 7h12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M10 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

function formatDate(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayOf(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function isDisabledDay(day: Date, minDate?: Date, maxDate?: Date): boolean {
  const d = dayOf(day);
  if (minDate && d < dayOf(minDate)) return true;
  if (maxDate && d > dayOf(maxDate)) return true;
  return false;
}

interface CalPanelProps {
  year: number;
  month: number;
  today: Date;
  start: Date | null;
  end: Date | null;
  hoverDate: Date | null;
  minDate?: Date;
  maxDate?: Date;
  onDayClick: (date: Date) => void;
  onDayHover: (date: Date | null) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hidePrev?: boolean;
  hideNext?: boolean;
}

// Rule 1: memo on CalPanel since it receives stable callback props
const CalPanel = React.memo(function CalPanel({
  year,
  month,
  today,
  start,
  end,
  hoverDate,
  minDate,
  maxDate,
  onDayClick,
  onDayHover,
  onPrev,
  onNext,
  hidePrev,
  hideNext,
}: CalPanelProps) {
  // Rule 4: compute grid values via useMemo
  const { firstDay, daysInMonth } = useMemo(
    () => ({
      firstDay: getFirstDayOfMonth(year, month),
      daysInMonth: getDaysInMonth(year, month),
    }),
    [year, month],
  );

  // Effective end for hover range display
  const rangeEnd = end ?? hoverDate;

  return (
    <div className={styles.calPanel}>
      <div className={styles.calHeader}>
        <button
          type="button"
          className={`${styles.calNavBtn}${hidePrev ? ` ${styles.calNavBtnHidden}` : ''}`}
          onClick={onPrev}
          aria-label="Previous month"
          disabled={hidePrev}
        >
          <ChevronLeft />
        </button>
        <span className={styles.calTitle}>
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          type="button"
          className={`${styles.calNavBtn}${hideNext ? ` ${styles.calNavBtnHidden}` : ''}`}
          onClick={onNext}
          aria-label="Next month"
          disabled={hideNext}
        >
          <ChevronRight />
        </button>
      </div>
      <div className={styles.calGrid}>
        {DOW_LABELS.map((d) => (
          <div key={d} className={styles.calDow}>{d}</div>
        ))}
        {Array.from({ length: firstDay }, (_, i) => (
          <div key={`e${i}`} className={styles.calEmpty} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const d = dayOf(date);
          const isToday = isSameDay(date, today);
          const isStart = start ? isSameDay(date, start) : false;
          const isEnd = end ? isSameDay(date, end) : false;
          const dayDisabled = isDisabledDay(date, minDate, maxDate);

          let inRange = false;
          if (start && rangeEnd) {
            const lo = dayOf(start) <= dayOf(rangeEnd) ? dayOf(start) : dayOf(rangeEnd);
            const hi = dayOf(start) <= dayOf(rangeEnd) ? dayOf(rangeEnd) : dayOf(start);
            inRange = d > lo && d < hi;
          }

          return (
            <button
              key={day}
              type="button"
              className={styles.calDay}
              disabled={dayDisabled}
              data-today={isToday ? 'true' : undefined}
              data-selected-start={isStart ? 'true' : undefined}
              data-selected-end={isEnd ? 'true' : undefined}
              data-in-range={inRange ? 'true' : undefined}
              onClick={() => !dayDisabled && onDayClick(date)}
              onMouseEnter={() => onDayHover(date)}
              onMouseLeave={() => onDayHover(null)}
              aria-label={date.toDateString()}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
});

export const DateRangePicker = React.memo(function DateRangePicker({
  label,
  error,
  hint,
  size = 'md',
  required,
  value,
  onChange,
  placeholder = 'MM/DD/YYYY - MM/DD/YYYY',
  minDate,
  maxDate,
  disabled = false,
  clearable = false,
  presets,
  name,
}: DateRangePickerProps): React.JSX.Element {
  const triggerId = useId();
  const today = useRef(new Date()).current;

  // Normalise: treat null as an empty range so internal code never needs to
  // guard against value being null throughout.
  const safeValue = value ?? {start: null, end: null};

  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  // Left calendar always shows the month before right
  const initMonth = safeValue.start ? safeValue.start.getMonth() : today.getMonth();
  const initYear = safeValue.start ? safeValue.start.getFullYear() : today.getFullYear();

  const [leftMonth, setLeftMonth] = useState(initMonth);
  const [leftYear, setLeftYear] = useState(initYear);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Rule 6: selecting ref for stable handleDayClick
  const selectingRef = useRef(selecting);
  selectingRef.current = selecting;

  // Rule 8: portal container
  const portalEl = usePortal();

  // Rule 4: right calendar month/year derived from left
  const { rightMonth, rightYear } = useMemo(() => ({
    rightMonth: leftMonth === 11 ? 0 : leftMonth + 1,
    rightYear: leftMonth === 11 ? leftYear + 1 : leftYear,
  }), [leftMonth, leftYear]);

  const positionPopover = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const popoverHeight = 340;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove = spaceBelow < popoverHeight && spaceAbove > spaceBelow;
    setPopoverStyle({
      top: showAbove ? undefined : rect.bottom + 4,
      bottom: showAbove ? window.innerHeight - rect.top + 4 : undefined,
      left: rect.left,
    });
  }, []);

  const openPopover = useCallback(() => {
    if (disabled) return;
    positionPopover();
    setIsOpen(true);
    setSelecting(safeValue.start && !safeValue.end ? 'end' : 'start');
  }, [disabled, positionPopover, safeValue.start, safeValue.end]);

  const closePopover = useCallback(() => {
    setIsOpen(false);
    setHoverDate(null);
    triggerRef.current?.focus();
  }, []);

  // Click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !popoverRef.current?.contains(target)
      ) {
        closePopover();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, closePopover]);

  // Rule 9: day click reads selecting from ref
  const handleDayClick = useCallback(
    (date: Date) => {
      if (selectingRef.current === 'start' || (safeValue.start && safeValue.end)) {
        onChange({ start: date, end: null });
        setSelecting('end');
      } else {
        const start = safeValue.start!;
        if (dayOf(date) < dayOf(start)) {
          onChange({ start: date, end: start });
        } else {
          onChange({ start, end: date });
        }
        closePopover();
      }
    },
    [safeValue.start, safeValue.end, onChange, closePopover],
  );

  // Rule 3: stable nav handlers
  const prevLeftMonth = useCallback(() => {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear((y) => y - 1);
    } else {
      setLeftMonth((m) => m - 1);
    }
  }, [leftMonth]);

  const nextLeftMonth = useCallback(() => {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear((y) => y + 1);
    } else {
      setLeftMonth((m) => m + 1);
    }
  }, [leftMonth]);

  // Rule 7: data-attribute handler for preset clicks
  const handlePresetClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const idx = parseInt(e.currentTarget.dataset.presetIndex ?? '0', 10);
      if (presets?.[idx]) {
        onChange(presets[idx].range);
        closePopover();
      }
    },
    [presets, onChange, closePopover],
  );

  // Rule 3: stable trigger click handler
  const handleTriggerClick = useCallback(() => {
    isOpen ? closePopover() : openPopover();
  }, [isOpen, closePopover, openPopover]);

  // Rule 3: stable clear handler
  const handleClearClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange({ start: null, end: null });
    },
    [onChange],
  );

  // Rule 4: display text derived
  const display = useMemo(() => {
    if (!safeValue.start && !safeValue.end) return null;
    const startStr = safeValue.start ? formatDate(safeValue.start) : '\u2026';
    const endStr = safeValue.end ? formatDate(safeValue.end) : '\u2026';
    return `${startStr} \u2013 ${endStr}`;
  }, [safeValue.start, safeValue.end]);

  // Rule 2: triggerClasses via useMemo
  const triggerClasses = useMemo(
    () =>
      [
        styles.trigger,
        isOpen ? styles.triggerOpen : '',
        error ? styles.triggerError : '',
        disabled ? styles.triggerDisabled : '',
      ]
        .filter(Boolean)
        .join(' '),
    [isOpen, error, disabled],
  );

  // Rule 4: hoverDate for selecting state
  const effectiveHoverDate = selecting === 'end' ? hoverDate : null;

  const popover = (
    <div ref={popoverRef} className={styles.popover} style={popoverStyle}>
      {presets && presets.length > 0 && (
        <div className={styles.presets}>
          {presets.map((p, i) => (
            <button
              key={p.label}
              type="button"
              className={styles.presetBtn}
              data-preset-index={i}
              onClick={handlePresetClick}
            >
              {p.label}
            </button>
          ))}
        </div>
      )}
      <div className={styles.calendars}>
        <CalPanel
          year={leftYear}
          month={leftMonth}
          today={today}
          start={safeValue.start}
          end={safeValue.end}
          hoverDate={effectiveHoverDate}
          minDate={minDate}
          maxDate={maxDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          onPrev={prevLeftMonth}
          onNext={nextLeftMonth}
          hideNext={false}
        />
        <CalPanel
          year={rightYear}
          month={rightMonth}
          today={today}
          start={safeValue.start}
          end={safeValue.end}
          hoverDate={effectiveHoverDate}
          minDate={minDate}
          maxDate={maxDate}
          onDayClick={handleDayClick}
          onDayHover={setHoverDate}
          onPrev={prevLeftMonth}
          onNext={nextLeftMonth}
          hidePrev={true}
        />
      </div>
    </div>
  );

  return (
    <FieldWrapper
      label={label}
      htmlFor={triggerId}
      required={required}
      error={error}
      hint={hint}
    >
      {name && safeValue.start && (
        <input type="hidden" name={`${name}_start`} value={safeValue.start.toISOString()} />
      )}
      {name && safeValue.end && (
        <input type="hidden" name={`${name}_end`} value={safeValue.end.toISOString()} />
      )}
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={triggerClasses}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-required={required}
        aria-invalid={!!error}
      >
        <span className={display ? undefined : styles.triggerPlaceholder}>
          {display ?? placeholder}
        </span>
        <span className={styles.triggerRight}>
          {clearable && (safeValue.start || safeValue.end) && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClearClick}
              aria-label="Clear dates"
            >
              <XIcon />
            </button>
          )}
          <CalendarIcon />
        </span>
      </button>
      {isOpen && ReactDOM.createPortal(popover, portalEl)}
    </FieldWrapper>
  );
});
