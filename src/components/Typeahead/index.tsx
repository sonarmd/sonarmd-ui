import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { FieldWrapper } from '../FieldWrapper';
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

export const Typeahead = forwardRef<HTMLInputElement, TypeaheadProps>(
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
      placeholder = 'Type to search…',
      clearable = false,
      disabled = false,
      debounceMs = 200,
      minQueryLength = 1,
      noResultsMessage = 'No results',
      loadingMessage = 'Loading…',
      renderOption,
      className,
      name,
    },
    ref,
  ) {
    const inputId = useRef(`typeahead-${Math.random().toString(36).slice(2)}`);
    const [inputValue, setInputValue] = useState(value?.label ?? '');
    const [options, setOptions] = useState<TypeaheadOption[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

    const abortRef = useRef<AbortController | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    // Sync inputValue when controlled value changes
    useEffect(() => {
      setInputValue(value?.label ?? '');
    }, [value]);

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

    const selectOption = useCallback(
      (opt: TypeaheadOption) => {
        onChange(opt);
        setInputValue(opt.label);
        closeMenu();
      },
      [onChange, closeMenu],
    );

    const triggerSearch = useCallback(
      (query: string) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        if (query.length < minQueryLength) {
          setOptions([]);
          setIsOpen(false);
          return;
        }
        debounceRef.current = setTimeout(async () => {
          abortRef.current?.abort();
          const controller = new AbortController();
          abortRef.current = controller;
          setIsLoading(true);
          positionMenu();
          setIsOpen(true);
          try {
            const results = await loadOptions(query, controller.signal);
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
      [loadOptions, debounceMs, minQueryLength, positionMenu],
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
      };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const q = e.target.value;
      setInputValue(q);
      if (!q) {
        onChange(null);
        setOptions([]);
        setIsOpen(false);
        return;
      }
      triggerSearch(q);
    };

    const handleBlur = () => {
      setTimeout(() => {
        if (menuRef.current?.contains(document.activeElement)) return;
        // If no selection and clearable, clear; else restore
        if (!value) {
          if (clearable) {
            setInputValue('');
          } else {
            setInputValue('');
          }
        } else {
          setInputValue(value.label);
        }
        closeMenu();
      }, 150);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, options.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (activeIndex >= 0 && options[activeIndex]) {
          selectOption(options[activeIndex]);
        }
      } else if (e.key === 'Escape') {
        closeMenu();
      }
    };

    const inputClasses = [
      styles.input,
      error ? styles.inputError : '',
      isOpen ? styles.inputOpen : '',
      disabled ? styles.inputDisabled : '',
    ]
      .filter(Boolean)
      .join(' ');

    const menu = (
      <div ref={menuRef} className={styles.menu} style={menuStyle} role="listbox">
        {isLoading ? (
          <div className={styles.loading}>
            <div className={styles.spinner} aria-label={loadingMessage} />
          </div>
        ) : options.length === 0 ? (
          <div className={styles.noResults}>{noResultsMessage}</div>
        ) : (
          <div className={styles.optionList}>
            {options.map((opt, idx) => {
              const isHighlighted = idx === activeIndex;
              return (
                <div
                  key={opt.value}
                  className={`${styles.option}${isHighlighted ? ` ${styles.optionHighlighted}` : ''}`}
                  role="option"
                  aria-selected={opt.value === value?.value}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => selectOption(opt)}
                >
                  {renderOption ? renderOption(opt, isHighlighted) : opt.label}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );

    return (
      <FieldWrapper
        label={label}
        htmlFor={inputId.current}
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
            id={inputId.current}
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
            aria-autocomplete="list"
            aria-required={required}
            aria-invalid={!!error}
          />
          <span className={styles.adornmentRight}>
            {clearable && value && (
              <button
                type="button"
                className={styles.clearBtn}
                onClick={() => {
                  onChange(null);
                  setInputValue('');
                  setOptions([]);
                  setIsOpen(false);
                  inputRef.current?.focus();
                }}
                aria-label="Clear"
              >
                <XIcon />
              </button>
            )}
          </span>
        </div>
        {isOpen && ReactDOM.createPortal(menu, document.body)}
      </FieldWrapper>
    );
  },
);
