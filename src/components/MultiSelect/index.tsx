import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FieldWrapper } from '../FieldWrapper';
import type { DropdownOption } from '../Dropdown';
import styles from './MultiSelect.module.css';

export type { DropdownOption } from '../Dropdown';

export interface MultiSelectProps {
  label?: string;
  error?: string;
  hint?: string;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  options: DropdownOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  maxSelections?: number;
  renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  className?: string;
  name?: string;
}

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2.5 7l3.5 3.5 5.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MultiSelect({
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
  disabled = false,
  maxSelections,
  renderOption,
  className,
  name,
}: MultiSelectProps): JSX.Element {
  const wrapperId = useRef(`multiselect-${Math.random().toString(36).slice(2)}`);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const filteredOptions =
    searchable && searchQuery
      ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

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
      width: Math.max(rect.width, 200),
    });
  }, []);

  const openMenu = useCallback(() => {
    if (disabled) return;
    positionMenu();
    setIsOpen(true);
    setActiveIndex(-1);
  }, [disabled, positionMenu]);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    setSearchQuery('');
    setActiveIndex(-1);
  }, []);

  const toggleOption = useCallback(
    (opt: DropdownOption) => {
      if (opt.disabled) return;
      const isSelected = value.includes(opt.value);
      if (isSelected) {
        onChange(value.filter((v) => v !== opt.value));
      } else {
        if (maxSelections !== undefined && value.length >= maxSelections) return;
        onChange([...value, opt.value]);
      }
    },
    [value, onChange, maxSelections],
  );

  const removeValue = useCallback(
    (v: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(value.filter((x) => x !== v));
    },
    [value, onChange],
  );

  // Click outside
  useEffect(() => {
    if (!isOpen) return;
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        closeMenu();
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [isOpen, closeMenu]);

  // Focus search when menu opens
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeMenu();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) openMenu();
      setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        toggleOption(filteredOptions[activeIndex]);
      }
    }
  };

  const triggerAreaClasses = [
    styles.triggerArea,
    isOpen ? styles.triggerAreaOpen : '',
    error ? styles.triggerAreaError : '',
    disabled ? styles.triggerAreaDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

  const selectedLabels = value.map((v) => options.find((o) => o.value === v)?.label ?? v);

  const menu = (
    <div
      ref={menuRef}
      className={styles.menu}
      style={menuStyle}
      role="listbox"
      aria-multiselectable="true"
    >
      <div className={styles.optionList}>
        {filteredOptions.length === 0 ? (
          <div className={styles.noResults}>No results</div>
        ) : (
          filteredOptions.map((opt, idx) => {
            const isSelected = value.includes(opt.value);
            const isHighlighted = idx === activeIndex;
            const isMaxed =
              !isSelected && maxSelections !== undefined && value.length >= maxSelections;
            const optClasses = [
              styles.option,
              isHighlighted ? styles.optionHighlighted : '',
              isSelected ? styles.optionSelected : '',
              isMaxed || opt.disabled ? styles.optionMaxed : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={opt.value}
                className={optClasses}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => toggleOption(opt)}
              >
                {renderOption ? (
                  renderOption(opt, isSelected)
                ) : (
                  <>
                    {opt.icon && <span>{opt.icon}</span>}
                    <span>{opt.label}</span>
                    {isSelected && (
                      <span className={styles.checkmark}>
                        <CheckIcon />
                      </span>
                    )}
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
      htmlFor={wrapperId.current}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      {name &&
        value.map((v) => <input key={v} type="hidden" name={`${name}[]`} value={v} />)}
      <div
        ref={triggerRef}
        id={wrapperId.current}
        className={triggerAreaClasses}
        onClick={() => (isOpen ? closeMenu() : openMenu())}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        aria-invalid={!!error}
      >
        {value.length === 0 && !searchable && (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        {value.map((v, i) => (
          <span key={v} className={styles.pill}>
            {selectedLabels[i]}
            <button
              type="button"
              className={styles.pillRemove}
              onClick={(e) => removeValue(v, e)}
              aria-label={`Remove ${selectedLabels[i]}`}
            >
              &times;
            </button>
          </span>
        ))}
        {searchable && (
          <input
            ref={searchInputRef}
            className={styles.searchInput}
            type="text"
            placeholder={value.length === 0 ? placeholder : ''}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setActiveIndex(-1);
              if (!isOpen) openMenu();
            }}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={handleKeyDown}
          />
        )}
        <span className={styles.triggerRight}>
          {value.length > 0 && (
            <button
              type="button"
              className={styles.clearAll}
              onClick={(e) => {
                e.stopPropagation();
                onChange([]);
              }}
              aria-label="Clear all"
            >
              Clear
            </button>
          )}
          <ChevronDown
            className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
          />
        </span>
      </div>
      {isOpen && ReactDOM.createPortal(menu, document.body)}
    </FieldWrapper>
  );
}
