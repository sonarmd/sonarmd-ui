import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { FieldWrapper } from '../FieldWrapper';
import { usePortal } from '../../hooks/usePortal';
import styles from './DatePicker.module.css';

export interface DatePickerProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
  clearable?: boolean;
  dateFormat?: string;
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
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function isDisabled(day: Date, minDate?: Date, maxDate?: Date): boolean {
  if (minDate) {
    const min = new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate());
    if (day < min) return true;
  }
  if (maxDate) {
    const max = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
    if (day > max) return true;
  }
  return false;
}

export const DatePicker = React.memo(
  forwardRef<HTMLInputElement, DatePickerProps>(
    function DatePicker(
      {
        label,
        error,
        hint,
        size = 'md',
        required,
        value,
        onChange,
        placeholder = 'MM/DD/YYYY',
        minDate,
        maxDate,
        disabled = false,
        clearable = false,
        name,
      },
      ref,
    ) {
      const inputId = useId();
      const today = useRef(new Date()).current;

      const [inputStr, setInputStr] = useState(value ? formatDate(value) : '');
      const [isOpen, setIsOpen] = useState(false);
      const [viewMonth, setViewMonth] = useState(value ? value.getMonth() : today.getMonth());
      const [viewYear, setViewYear] = useState(value ? value.getFullYear() : today.getFullYear());
      const [focusedDay, setFocusedDay] = useState<number | null>(null);
      const [calStyle, setCalStyle] = useState<React.CSSProperties>({});

      const inputRef = useRef<HTMLInputElement>(null);
      const calRef = useRef<HTMLDivElement>(null);

      // Rule 9: stable refs for keyboard handler
      const viewMonthRef = useRef(viewMonth);
      viewMonthRef.current = viewMonth;
      const viewYearRef = useRef(viewYear);
      viewYearRef.current = viewYear;
      const focusedDayRef = useRef(focusedDay);
      focusedDayRef.current = focusedDay;

      // Rule 8: portal container
      const portalEl = usePortal();

      // Sync inputStr when value changes externally
      useEffect(() => {
        setInputStr(value ? formatDate(value) : '');
        if (value) {
          setViewMonth(value.getMonth());
          setViewYear(value.getFullYear());
        }
      }, [value]);

      const positionCalendar = useCallback(() => {
        if (!inputRef.current) return;
        const rect = inputRef.current.getBoundingClientRect();
        const calHeight = 320;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const showAbove = spaceBelow < calHeight && spaceAbove > spaceBelow;
        setCalStyle({
          top: showAbove ? undefined : rect.bottom + 4,
          bottom: showAbove ? window.innerHeight - rect.top + 4 : undefined,
          left: rect.left,
        });
      }, []);

      const openCalendar = useCallback(() => {
        if (disabled) return;
        positionCalendar();
        setIsOpen(true);
        setFocusedDay(value?.getDate() ?? null);
      }, [disabled, positionCalendar, value]);

      const closeCalendar = useCallback(() => {
        setIsOpen(false);
        inputRef.current?.focus();
      }, []);

      // Click outside
      useEffect(() => {
        if (!isOpen) return;
        const handleMouseDown = (e: MouseEvent) => {
          const target = e.target as Node;
          if (!inputRef.current?.contains(target) && !calRef.current?.contains(target)) {
            closeCalendar();
          }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
      }, [isOpen, closeCalendar]);

      // Rule 3: stable day click handler reading viewYear/viewMonth from refs
      const selectDay = useCallback(
        (day: number) => {
          const selected = new Date(viewYearRef.current, viewMonthRef.current, day);
          onChange(selected);
          closeCalendar();
        },
        [onChange, closeCalendar],
      );

      // Rule 3: stable nav handlers
      const prevMonth = useCallback(() => {
        if (viewMonthRef.current === 0) {
          setViewMonth(11);
          setViewYear((y) => y - 1);
        } else {
          setViewMonth((m) => m - 1);
        }
      }, []);

      const nextMonth = useCallback(() => {
        if (viewMonthRef.current === 11) {
          setViewMonth(0);
          setViewYear((y) => y + 1);
        } else {
          setViewMonth((m) => m + 1);
        }
      }, []);

      // Rule 3: stable input blur handler
      const handleInputBlur = useCallback(() => {
        if (!inputStr) {
          onChange(null);
          return;
        }
        const parsed = new Date(inputStr);
        if (!isNaN(parsed.getTime())) {
          onChange(parsed);
        } else {
          setInputStr(value ? formatDate(value) : '');
        }
      }, [inputStr, onChange, value]);

      const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setInputStr(e.target.value);
      }, []);

      // Rule 9: stable calendar keyboard handler reading from refs
      const handleCalKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === 'Escape') {
            closeCalendar();
            return;
          }
          const vm = viewMonthRef.current;
          const vy = viewYearRef.current;
          const daysInMonth = getDaysInMonth(vy, vm);
          const currentFocus = focusedDayRef.current ?? (value?.getDate() ?? 1);

          if (e.key === 'ArrowRight') {
            e.preventDefault();
            const next = currentFocus + 1;
            if (next > daysInMonth) {
              nextMonth();
              setFocusedDay(1);
            } else {
              setFocusedDay(next);
            }
          } else if (e.key === 'ArrowLeft') {
            e.preventDefault();
            const prev = currentFocus - 1;
            if (prev < 1) {
              prevMonth();
              setFocusedDay(getDaysInMonth(
                vm === 0 ? vy - 1 : vy,
                vm === 0 ? 11 : vm - 1,
              ));
            } else {
              setFocusedDay(prev);
            }
          } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = currentFocus + 7;
            if (next > daysInMonth) {
              nextMonth();
              setFocusedDay(next - daysInMonth);
            } else {
              setFocusedDay(next);
            }
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = currentFocus - 7;
            if (prev < 1) {
              prevMonth();
              const prevDays = getDaysInMonth(
                vm === 0 ? vy - 1 : vy,
                vm === 0 ? 11 : vm - 1,
              );
              setFocusedDay(prevDays + prev);
            } else {
              setFocusedDay(prev);
            }
          } else if (e.key === 'Enter' && focusedDayRef.current !== null) {
            e.preventDefault();
            const fd = focusedDayRef.current;
            const candidate = new Date(vy, vm, fd);
            if (!isDisabled(candidate, minDate, maxDate)) {
              selectDay(fd);
            }
          }
        },
        [value, minDate, maxDate, closeCalendar, prevMonth, nextMonth, selectDay],
      );

      // Rule 4: calendar grid computation via useMemo
      const calendarDays = useMemo(() => {
        const firstDay = getFirstDayOfMonth(viewYear, viewMonth);
        const daysInMonth = getDaysInMonth(viewYear, viewMonth);
        return { firstDay, daysInMonth };
      }, [viewYear, viewMonth]);

      const inputClasses = useMemo(
        () =>
          [
            styles.input,
            error ? styles.inputError : '',
            isOpen ? styles.inputOpen : '',
            disabled ? styles.inputDisabled : '',
          ]
            .filter(Boolean)
            .join(' '),
        [error, isOpen, disabled],
      );

      const handleIconClick = useCallback(() => {
        isOpen ? closeCalendar() : openCalendar();
      }, [isOpen, closeCalendar, openCalendar]);

      const calendar = (
        <div
          ref={calRef}
          className={styles.calendar}
          style={calStyle}
          onKeyDown={handleCalKeyDown}
          tabIndex={-1}
        >
          <div className={styles.calHeader}>
            <button type="button" className={styles.calNavBtn} onClick={prevMonth} aria-label="Previous month">
              <ChevronLeft />
            </button>
            <span className={styles.calTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" className={styles.calNavBtn} onClick={nextMonth} aria-label="Next month">
              <ChevronRight />
            </button>
          </div>
          <div className={styles.calGrid}>
            {DOW_LABELS.map((d) => (
              <div key={d} className={styles.calDow}>{d}</div>
            ))}
            {Array.from({ length: calendarDays.firstDay }, (_, i) => (
              <div key={`empty-${i}`} className={styles.calEmpty} />
            ))}
            {Array.from({ length: calendarDays.daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayDate = new Date(viewYear, viewMonth, day);
              const isToday = isSameDay(dayDate, today);
              const isSelected = value ? isSameDay(dayDate, value) : false;
              const dayDisabled = isDisabled(dayDate, minDate, maxDate);

              return (
                <button
                  key={day}
                  type="button"
                  className={styles.calDay}
                  disabled={dayDisabled}
                  data-today={isToday ? 'true' : undefined}
                  data-selected={isSelected ? 'true' : undefined}
                  onClick={() => !dayDisabled && selectDay(day)}
                  onFocus={() => setFocusedDay(day)}
                  tabIndex={focusedDay === day || (!focusedDay && isSelected) ? 0 : -1}
                  aria-label={dayDate.toDateString()}
                  aria-pressed={isSelected}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>
      );

      return (
        <FieldWrapper
          label={label}
          htmlFor={inputId}
          required={required}
          error={error}
          hint={hint}
        >
          {name && value && (
            <input type="hidden" name={name} value={value.toISOString()} />
          )}
          <div className={styles.wrapper}>
            <div className={styles.inputWrapper}>
              <input
                ref={(node) => {
                  (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
                  if (typeof ref === 'function') ref(node);
                  else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
                }}
                id={inputId}
                type="text"
                className={inputClasses}
                value={inputStr}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onFocus={openCalendar}
                placeholder={placeholder}
                disabled={disabled}
                aria-required={required}
                aria-invalid={!!error}
                autoComplete="off"
              />
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleIconClick}
                aria-label={isOpen ? 'Close calendar' : 'Open calendar'}
                disabled={disabled}
              >
                {clearable && value ? <XIcon /> : <CalendarIcon />}
              </button>
            </div>
          </div>
          {isOpen && ReactDOM.createPortal(calendar, portalEl)}
        </FieldWrapper>
      );
    },
  ),
);
