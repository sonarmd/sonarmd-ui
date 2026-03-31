import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { List, RowComponentProps } from 'react-window';
import { FieldWrapper } from '../FieldWrapper';
import { usePortal } from '../../hooks/usePortal';
import styles from './Dropdown.module.css';

export interface DropdownOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
}

export interface DropdownProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  options: DropdownOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  className?: string;
  name?: string;
}

// Chevron icon
function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// X icon
function XIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M10.5 3.5l-7 7M3.5 3.5l7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// Check icon
function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const Dropdown = React.memo(function Dropdown({
  label,
  error,
  hint,
  size = 'md',
  required,
  options,
  value,
  onChange,
  placeholder = 'Select…',
  searchable = false,
  clearable = false,
  disabled = false,
  renderOption,
  className,
  name,
}: DropdownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const triggerId = useRef(`dropdown-${Math.random().toString(36).slice(2)}`);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Rule 9: stable refs for keyboard handler
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Rule 6: portal container
  const portalEl = usePortal();

  // Rule 4: derived state via useMemo
  const selectedOption = useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  );

  // Rule 4: filtered options
  const filteredOptions = useMemo(
    () =>
      searchable && searchQuery
        ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options,
    [options, searchable, searchQuery],
  );

  // Rule 7: lookup map for data-attribute handler
  const optionsByValue = useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options],
  );

  const positionMenu = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
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

  const openMenu = useCallback(() => {
    if (disabled) return;
    positionMenu();
    setIsOpen(true);
    setSearchQuery('');
    setActiveIndex(-1);
  }, [disabled, positionMenu]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setActiveIndex(-1);
    triggerRef.current?.focus();
  }, []);

  // Rule 3: stable option click handler using data attributes (Rule 7)
  const handleOptionClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const val = (e.target as HTMLElement)
        .closest('[data-option-value]')
        ?.getAttribute('data-option-value');
      if (val == null) return;
      const opt = optionsByValue.get(val);
      if (opt && !opt.disabled) {
        onChange(opt.value);
        setIsOpen(false);
        setSearchQuery('');
        setActiveIndex(-1);
        triggerRef.current?.focus();
      }
    },
    [optionsByValue, onChange],
  );

  // Rule 3: stable trigger click handler
  const handleTriggerClick = useCallback(() => {
    isOpen ? closeMenu() : openMenu();
  }, [isOpen, closeMenu, openMenu]);

  // Rule 3: stable clear button handler
  const handleClearClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(null);
    },
    [onChange],
  );

  // Click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, closeMenu]);

  // Focus search input when menu opens
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

  // Rule 9: stable keyboard handlers reading from refs
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        isOpen ? closeMenu() : openMenu();
      } else if (e.key === 'Escape') {
        closeMenu();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) openMenu();
        setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
    },
    [isOpen, closeMenu, openMenu, filteredOptions.length],
  );

  const handleMenuKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const idx = activeIndexRef.current;
        if (idx >= 0 && filteredOptions[idx]) {
          const opt = filteredOptions[idx];
          if (!opt.disabled) {
            onChange(opt.value);
            closeMenu();
          }
        }
      } else if (e.key === 'Escape') {
        closeMenu();
      }
    },
    [filteredOptions, onChange, closeMenu],
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActiveIndex(-1);
  }, []);

  // Rule 2: triggerClasses via useMemo
  const triggerClasses = useMemo(
    () =>
      [
        styles.trigger,
        styles[size],
        isOpen ? styles.triggerOpen : '',
        error ? styles.triggerError : '',
        disabled ? styles.triggerDisabled : '',
      ]
        .filter(Boolean)
        .join(' '),
    [size, isOpen, error, disabled],
  );

  // Rule 12: react-window for large option lists
  const useVirtualList = filteredOptions.length > 100;

  // rowProps data passed to the List row component
  const virtualRowProps = useMemo(
    () => ({ filteredOptions, value, activeIndex, renderOption }),
    [filteredOptions, value, activeIndex, renderOption],
  );

  type DropdownRowProps = {
    filteredOptions: DropdownOption[];
    value: string | null;
    activeIndex: number;
    renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  };

  const OptionRow = useCallback(
    ({ index, style, filteredOptions: opts, value: val, activeIndex: ai, renderOption: ro }: RowComponentProps<DropdownRowProps>) => {
      const opt = opts[index];
      const isSelected = opt.value === val;
      const isHighlighted = index === ai;
      const optClasses = [
        styles.option,
        isHighlighted ? styles.optionHighlighted : '',
        isSelected ? styles.optionSelected : '',
        opt.disabled ? styles.optionDisabled : '',
      ]
        .filter(Boolean)
        .join(' ');
      return (
        <div
          style={style}
          className={optClasses}
          role="option"
          aria-selected={isSelected}
          data-option-value={opt.value}
          onMouseEnter={() => setActiveIndex(index)}
        >
          {ro ? (
            ro(opt, isSelected)
          ) : (
            <>
              {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
              <span className={styles.optionContent}>
                <span>{opt.label}</span>
                {opt.description && (
                  <span className={styles.optionDesc}>{opt.description}</span>
                )}
              </span>
              {isSelected && <CheckIcon />}
            </>
          )}
        </div>
      );
    },
    [],
  );

  const menu = (
    <div
      ref={menuRef}
      className={styles.menu}
      style={menuStyle}
      role="listbox"
      onKeyDown={handleMenuKeyDown}
      tabIndex={-1}
    >
      {searchable && (
        <input
          ref={searchRef}
          className={styles.searchInput}
          type="text"
          placeholder="Search…"
          value={searchQuery}
          onChange={handleSearchChange}
          onKeyDown={handleMenuKeyDown}
        />
      )}
      <div className={styles.optionList} onClick={handleOptionClick}>
        {filteredOptions.length === 0 ? (
          <div className={styles.noResults}>No results</div>
        ) : useVirtualList ? (
          <List
            rowHeight={36}
            rowCount={filteredOptions.length}
            rowComponent={OptionRow}
            rowProps={virtualRowProps}
            style={{ height: 240 }}
          />
        ) : (
          filteredOptions.map((opt, idx) => {
            const isSelected = opt.value === value;
            const isHighlighted = idx === activeIndex;
            const optClasses = [
              styles.option,
              isHighlighted ? styles.optionHighlighted : '',
              isSelected ? styles.optionSelected : '',
              opt.disabled ? styles.optionDisabled : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={opt.value}
                className={optClasses}
                role="option"
                aria-selected={isSelected}
                data-option-value={opt.value}
                onMouseEnter={() => setActiveIndex(idx)}
              >
                {renderOption ? (
                  renderOption(opt, isSelected)
                ) : (
                  <>
                    {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                    <span className={styles.optionContent}>
                      <span>{opt.label}</span>
                      {opt.description && (
                        <span className={styles.optionDesc}>{opt.description}</span>
                      )}
                    </span>
                    {isSelected && <CheckIcon />}
                  </>
                )}
              </div>
            );
          })
        )}
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
      className={className}
    >
      {name && value && (
        <input type="hidden" name={name} value={value} />
      )}
      <button
        ref={triggerRef}
        id={triggerId.current}
        type="button"
        className={triggerClasses}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        aria-invalid={!!error}
      >
        <span className={styles.triggerLeft}>
          {selectedOption?.icon && (
            <span className={styles.optionIcon}>{selectedOption.icon}</span>
          )}
          <span className={selectedOption ? styles.triggerLabel : styles.placeholder}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <span className={styles.triggerRight}>
          {clearable && value && (
            <button
              type="button"
              className={styles.clearBtn}
              onClick={handleClearClick}
              aria-label="Clear selection"
            >
              <XIcon />
            </button>
          )}
          <ChevronDown className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`} />
        </span>
      </button>
      {isOpen && ReactDOM.createPortal(menu, portalEl)}
    </FieldWrapper>
  );
});
