import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FieldWrapper } from '../FieldWrapper';
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

function CalPanel({
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
  const firstDay = getFirstDayOfMonth(year, month);
  const daysInMonth = getDaysInMonth(year, month);

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
}

export function DateRangePicker({
  label,
  error,
  hint,
  size = 'md',
  required,
  value,
  onChange,
  placeholder = 'MM/DD/YYYY – MM/DD/YYYY',
  minDate,
  maxDate,
  disabled = false,
  clearable = false,
  presets,
  name,
}: DateRangePickerProps): JSX.Element {
  const triggerId = useRef(`drp-${Math.random().toString(36).slice(2)}`);
  const today = new Date();

  const [isOpen, setIsOpen] = useState(false);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');

  // Left calendar always shows the month before right
  const initMonth = value.start
    ? value.start.getMonth()
    : today.getMonth();
  const initYear = value.start
    ? value.start.getFullYear()
    : today.getFullYear();

  const [leftMonth, setLeftMonth] = useState(initMonth);
  const [leftYear, setLeftYear] = useState(initYear);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Compute right calendar month/year from left
  const rightMonth = leftMonth === 11 ? 0 : leftMonth + 1;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

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
    // Reset selecting state
    setSelecting(value.start && !value.end ? 'end' : 'start');
  }, [disabled, positionPopover, value.start, value.end]);

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

  const handleDayClick = useCallback(
    (date: Date) => {
      if (selecting === 'start' || (value.start && value.end)) {
        // Start fresh selection
        onChange({ start: date, end: null });
        setSelecting('end');
      } else {
        // Selecting end
        const start = value.start!;
        if (dayOf(date) < dayOf(start)) {
          // Swap: clicked before start
          onChange({ start: date, end: start });
        } else {
          onChange({ start, end: date });
        }
        closePopover();
      }
    },
    [selecting, value.start, value.end, onChange, closePopover],
  );

  const prevLeftMonth = () => {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear((y) => y - 1);
    } else {
      setLeftMonth((m) => m - 1);
    }
  };

  const nextLeftMonth = () => {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear((y) => y + 1);
    } else {
      setLeftMonth((m) => m + 1);
    }
  };

  const displayText = () => {
    if (!value.start && !value.end) return null;
    const startStr = value.start ? formatDate(value.start) : '…';
    const endStr = value.end ? formatDate(value.end) : '…';
    return `${startStr} \u2013 ${endStr}`;
  };

  const triggerClasses = [
    styles.trigger,
    isOpen ? styles.triggerOpen : '',
    error ? styles.triggerError : '',
    disabled ? styles.triggerDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const display = displayText();

  const popover = (
    <div ref={popoverRef} className={styles.popover} style={popoverStyle}>
      {presets && presets.length > 0 && (
        <div className={styles.presets}>
          {presets.map((p) => (
            <button
              key={p.label}
              type="button"
              className={styles.presetBtn}
              onClick={() => {
                onChange(p.range);
                closePopover();
              }}
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
          start={value.start}
          end={value.end}
          hoverDate={selecting === 'end' ? hoverDate : null}
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
          start={value.start}
          end={value.end}
          hoverDate={selecting === 'end' ? hoverDate : null}
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
      htmlFor={triggerId.current}
      required={required}
      error={error}
      hint={hint}
    >
      {name && value.start && (
        <input type="hidden" name={`${name}_start`} value={value.start.toISOString()} />
      )}
      {name && value.end && (
        <input type="hidden" name={`${name}_end`} value={value.end.toISOString()} />
      )}
      <button
        ref={triggerRef}
        id={triggerId.current}
        type="button"
        className={triggerClasses}
        onClick={() => (isOpen ? closePopover() : openPopover())}
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
          {clearable && (value.start || value.end) && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={(e) => {
                e.stopPropagation();
                onChange({ start: null, end: null });
              }}
              aria-label="Clear dates"
            >
              <XIcon />
            </button>
          )}
          <CalendarIcon />
        </span>
      </button>
      {isOpen && ReactDOM.createPortal(popover, document.body)}
    </FieldWrapper>
  );
}
