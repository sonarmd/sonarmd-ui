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
import { List, RowComponentProps } from 'react-window';
import { FieldWrapper } from '../FieldWrapper';
import { usePortal } from '../../hooks/usePortal';
import styles from './Typeahead.module.css';

export interface TypeaheadOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

export interface TypeaheadProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  value: TypeaheadOption | null;
  onChange: (option: TypeaheadOption | null) => void;
  loadOptions: (query: string, signal: AbortSignal) => Promise<TypeaheadOption[]>;
  placeholder?: string;
  clearable?: boolean;
  disabled?: boolean;
  debounceMs?: number;
  minQueryLength?: number;
  noResultsMessage?: string;
  loadingMessage?: string;
  renderOption?: (option: TypeaheadOption, isHighlighted: boolean) => React.ReactNode;
  className?: string;
  name?: string;
}

function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export const Typeahead = React.memo(
  forwardRef<HTMLInputElement, TypeaheadProps>(
    function Typeahead(
      {
        label,
        error,
        hint,
        size = 'md',
        required,
        value,
        onChange,
        loadOptions,
        placeholder = 'Type to search...',
        clearable = false,
        disabled = false,
        debounceMs = 200,
        minQueryLength = 1,
        noResultsMessage = 'No results',
        loadingMessage = 'Loading...',
        renderOption,
        className,
        name,
      },
      ref,
    ) {
      const inputId = useId();
      const menuId = `${inputId}-listbox`;
      // Stable per-row id so the combobox can point aria-activedescendant at the
      // highlighted option (WAI-ARIA combobox/listbox pattern).
      const optionId = useCallback((index: number) => `${menuId}-opt-${index}`, [menuId]);
      const [inputValue, setInputValue] = useState(value?.label ?? '');
      const [options, setOptions] = useState<TypeaheadOption[]>([]);
      const [isLoading, setIsLoading] = useState(false);
      const [isOpen, setIsOpen] = useState(false);
      const [activeIndex, setActiveIndex] = useState(-1);
      const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

      // Rule 6: non-render values in refs
      const abortRef = useRef<AbortController | null>(null);
      const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
      const inputRef = useRef<HTMLInputElement>(null);
      const menuRef = useRef<HTMLDivElement>(null);

      // Rule 9: stable refs for keyboard handler
      const activeIndexRef = useRef(activeIndex);
      activeIndexRef.current = activeIndex;

      // Rule 6: stable query ref to avoid stale closures
      const queryRef = useRef(inputValue);
      queryRef.current = inputValue;

      // Rule 6: prev value ref for blur-revert
      const prevValueRef = useRef(value);
      prevValueRef.current = value;

      // Rule 8: portal container
      const portalEl = usePortal();

      // Rule 7: lookup map for data-attribute option selection
      const optionsByValue = useMemo(
        () => new Map(options.map((o) => [o.value, o])),
        [options],
      );

      // Sync inputValue when controlled value changes
      useEffect(() => {
        setInputValue(value?.label ?? '');
      }, [value]);

      // Keep the active option in view as keyboard nav moves it.
      useEffect(() => {
        if (!isOpen || activeIndex < 0) return;
        menuRef.current
          ?.querySelector(`#${CSS.escape(optionId(activeIndex))}`)
          ?.scrollIntoView({ block: 'nearest' });
      }, [isOpen, activeIndex, optionId]);

      const positionMenu = useCallback(() => {
        if (!inputRef.current) return;
        const rect = inputRef.current.getBoundingClientRect();
        const menuHeight = 280;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        const showAbove = spaceBelow < menuHeight && spaceAbove > spaceBelow;
        setMenuStyle({
          top: showAbove ? undefined : rect.bottom + 4,
          bottom: showAbove ? window.innerHeight - rect.top + 4 : undefined,
          left: rect.left,
          width: rect.width,
        });
      }, []);

      const closeMenu = useCallback(() => {
        setIsOpen(false);
        setActiveIndex(-1);
      }, []);

      // Rule 3: stable stableLoadOptions
      const stableLoadOptions = useCallback(
        (query: string, signal: AbortSignal) => loadOptions(query, signal),
        [loadOptions],
      );

      const triggerSearch = useCallback(
        (query: string) => {
          if (timerRef.current) clearTimeout(timerRef.current);
          if (query.length < minQueryLength) {
            setOptions([]);
            setIsOpen(false);
            return;
          }
          timerRef.current = setTimeout(async () => {
            abortRef.current?.abort();
            const controller = new AbortController();
            abortRef.current = controller;
            setIsLoading(true);
            positionMenu();
            setIsOpen(true);
            try {
              const results = await stableLoadOptions(query, controller.signal);
              setOptions(results);
            } catch (err) {
              if ((err as Error).name !== 'AbortError') {
                setOptions([]);
              }
            } finally {
              if (!controller.signal.aborted) {
                setIsLoading(false);
              }
            }
          }, debounceMs);
        },
        [stableLoadOptions, debounceMs, minQueryLength, positionMenu],
      );

      // Click outside
      useEffect(() => {
        if (!isOpen) return;
        const handleMouseDown = (e: MouseEvent) => {
          const target = e.target as Node;
          if (!inputRef.current?.contains(target) && !menuRef.current?.contains(target)) {
            closeMenu();
          }
        };
        document.addEventListener('mousedown', handleMouseDown);
        return () => document.removeEventListener('mousedown', handleMouseDown);
      }, [isOpen, closeMenu]);

      // Cleanup on unmount
      useEffect(() => {
        return () => {
          abortRef.current?.abort();
          if (timerRef.current) clearTimeout(timerRef.current);
        };
      }, []);

      const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
          const q = e.target.value;
          setInputValue(q);
          if (!q) {
            onChange(null);
            setOptions([]);
            setIsOpen(false);
            return;
          }
          triggerSearch(q);
        },
        [onChange, triggerSearch],
      );

      const handleBlur = useCallback(() => {
        setTimeout(() => {
          if (menuRef.current?.contains(document.activeElement)) return;
          const currentValue = prevValueRef.current;
          if (!currentValue) {
            setInputValue('');
          } else {
            setInputValue(currentValue.label);
          }
          closeMenu();
        }, 150);
      }, [closeMenu]);

      // Rule 7: data-attribute handler for option selection
      const handleOptionClick = useCallback(
        (e: React.MouseEvent<HTMLElement>) => {
          const val = (e.target as HTMLElement)
            .closest('[data-option-value]')
            ?.getAttribute('data-option-value');
          if (val == null) return;
          const opt = optionsByValue.get(val);
          if (opt) {
            onChange(opt);
            setInputValue(opt.label);
            closeMenu();
          }
        },
        [optionsByValue, onChange, closeMenu],
      );

      // Rule 9: stable keyboard handler reading from activeIndexRef
      const handleKeyDown = useCallback(
        (e: React.KeyboardEvent) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActiveIndex((i) => Math.min(i + 1, options.length - 1));
          } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActiveIndex((i) => Math.max(i - 1, 0));
          } else if (e.key === 'Enter') {
            e.preventDefault();
            const idx = activeIndexRef.current;
            if (idx >= 0 && options[idx]) {
              const opt = options[idx];
              onChange(opt);
              setInputValue(opt.label);
              closeMenu();
            }
          } else if (e.key === 'Escape') {
            closeMenu();
          }
        },
        [options, onChange, closeMenu],
      );

      // Rule 3: stable clear handler
      const handleClearClick = useCallback(() => {
        onChange(null);
        setInputValue('');
        setOptions([]);
        setIsOpen(false);
        inputRef.current?.focus();
      }, [onChange]);

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

      // Rule 12: react-window for large result sets
      const useVirtualList = options.length > 100;

      const virtualRowProps = useMemo(
        () => ({ options, activeIndex, value, renderOption }),
        [options, activeIndex, value, renderOption],
      );

      type TypeaheadRowProps = {
        options: TypeaheadOption[];
        activeIndex: number;
        value: TypeaheadOption | null;
        renderOption?: (option: TypeaheadOption, isHighlighted: boolean) => React.ReactNode;
      };

      const OptionRow = useCallback(
        ({ index, style, options: opts, activeIndex: ai, value: val, renderOption: ro }: RowComponentProps<TypeaheadRowProps>) => {
          const opt = opts[index];
          const isHighlighted = index === ai;
          return (
            <div
              style={style}
              id={optionId(index)}
              className={`${styles.option}${isHighlighted ? ` ${styles.optionHighlighted}` : ''}`}
              role="option"
              aria-selected={opt.value === val?.value}
              data-option-value={opt.value}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {ro ? ro(opt, isHighlighted) : opt.label}
            </div>
          );
        },
        [optionId],
      );

      const menu = (
        <div ref={menuRef} id={menuId} className={styles.menu} style={menuStyle} role="listbox">
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner} aria-label={loadingMessage} />
            </div>
          ) : options.length === 0 ? (
            <div className={styles.noResults}>{noResultsMessage}</div>
          ) : (
            <div className={styles.optionList} onClick={handleOptionClick}>
              {useVirtualList ? (
                <List
                  rowHeight={36}
                  rowCount={options.length}
                  rowComponent={OptionRow}
                  rowProps={virtualRowProps}
                  style={{ height: 240 }}
                />
              ) : (
                options.map((opt, idx) => {
                  const isHighlighted = idx === activeIndex;
                  return (
                    <div
                      key={opt.value}
                      id={optionId(idx)}
                      className={`${styles.option}${isHighlighted ? ` ${styles.optionHighlighted}` : ''}`}
                      role="option"
                      aria-selected={opt.value === value?.value}
                      data-option-value={opt.value}
                      onMouseEnter={() => setActiveIndex(idx)}
                    >
                      {renderOption ? renderOption(opt, isHighlighted) : opt.label}
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      );

      return (
        <FieldWrapper
          label={label}
          htmlFor={inputId}
          required={required}
          error={error}
          hint={hint}
          className={className}
        >
          {name && value && <input type="hidden" name={name} value={value.value} />}
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
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleBlur}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              autoComplete="off"
              role="combobox"
              aria-expanded={isOpen}
              aria-controls={isOpen ? menuId : undefined}
              aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
              aria-autocomplete="list"
              aria-required={required}
              aria-invalid={!!error}
            />
            <span className={styles.adornmentRight}>
              {clearable && value && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={handleClearClick}
                  aria-label="Clear"
                >
                  <XIcon />
                </button>
              )}
            </span>
          </div>
          {isOpen && ReactDOM.createPortal(menu, portalEl)}
        </FieldWrapper>
      );
    },
  ),
);
