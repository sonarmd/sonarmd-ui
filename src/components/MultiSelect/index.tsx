import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { List, RowComponentProps } from 'react-window';
import { FieldWrapper } from '../FieldWrapper';
import type { DropdownOption } from '../Dropdown';
import { usePortal } from '../../hooks/usePortal';
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

export const MultiSelect = React.memo(function MultiSelect({
  label,
  error,
  hint,
  size = 'md',
  required,
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  disabled = false,
  maxSelections,
  renderOption,
  className,
  name,
}: MultiSelectProps): JSX.Element {
  const wrapperId = useId();
  const listboxId = `${wrapperId}-listbox`;
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuStyle, setMenuStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLDivElement>(null);
  const triggerButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Rule 9: stable ref for keyboard handler
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

  // Rule 6: value ref for stable handlers
  const valueRef = useRef(value);
  valueRef.current = value;

  // Rule 8: portal container
  const portalEl = usePortal();

  // Rule 4: filtered options via useMemo
  const filteredOptions = useMemo(
    () =>
      searchable && searchQuery
        ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
        : options,
    [options, searchable, searchQuery],
  );

  // Rule 4: selected values Set
  const selectedSet = useMemo(() => new Set(value), [value]);

  // Rule 7: lookup map for data-attribute handlers
  const optionsByValue = useMemo(
    () => new Map(options.map((o) => [o.value, o])),
    [options],
  );

  // Rule 4: selected labels for pill display
  const selectedLabels = useMemo(
    () => value.map((v) => options.find((o) => o.value === v)?.label ?? v),
    [value, options],
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

  // Rule 7: data-attribute handler for option toggles
  const handleOptionClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const val = (e.target as HTMLElement)
        .closest('[data-option-value]')
        ?.getAttribute('data-option-value');
      if (!val) return;
      const opt = optionsByValue.get(val);
      if (!opt || opt.disabled) return;
      const current = valueRef.current;
      const isSelected = selectedSet.has(val);
      if (isSelected) {
        onChange(current.filter((v) => v !== val));
      } else {
        if (maxSelections !== undefined && current.length >= maxSelections) return;
        onChange([...current, val]);
      }
    },
    [optionsByValue, selectedSet, onChange, maxSelections],
  );

  // Rule 7: data-attribute handler for pill removals
  const handlePillRemove = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const val = (e.currentTarget as HTMLElement)
        .closest('[data-pill-value]')
        ?.getAttribute('data-pill-value');
      if (val) onChange(valueRef.current.filter((v) => v !== val));
    },
    [onChange],
  );

  // Rule 3: stable clear all handler
  const handleClearAll = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onChange([]);
    },
    [onChange],
  );

  // Rule 3: stable trigger click handler
  const handleTriggerClick = useCallback(() => {
    isOpen ? closeMenu() : openMenu();
  }, [isOpen, closeMenu, openMenu]);

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

  // Focus the combobox control when the menu opens so keyboard nav works even
  // when opened by clicking the non-interactive trigger area.
  useEffect(() => {
    if (!isOpen) return;
    const target = searchable ? searchInputRef.current : triggerButtonRef.current;
    setTimeout(() => target?.focus(), 0);
  }, [isOpen, searchable]);

  // Rule 9: stable keyboard handler reading from activeIndexRef
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
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
        const idx = activeIndexRef.current;
        if (idx >= 0 && filteredOptions[idx]) {
          const opt = filteredOptions[idx];
          if (!opt.disabled) {
            const current = valueRef.current;
            const isSelected = selectedSet.has(opt.value);
            if (isSelected) {
              onChange(current.filter((v) => v !== opt.value));
            } else {
              if (maxSelections !== undefined && current.length >= maxSelections) return;
              onChange([...current, opt.value]);
            }
          }
        }
      }
    },
    [isOpen, openMenu, closeMenu, filteredOptions, selectedSet, onChange, maxSelections],
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setActiveIndex(-1);
    if (!isOpen) openMenu();
  }, [isOpen, openMenu]);

  const handleSearchClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Rule 2: triggerAreaClasses via useMemo
  const triggerAreaClasses = useMemo(
    () =>
      [
        styles.triggerArea,
        isOpen ? styles.triggerAreaOpen : '',
        error ? styles.triggerAreaError : '',
        disabled ? styles.triggerAreaDisabled : '',
      ]
        .filter(Boolean)
        .join(' '),
    [isOpen, error, disabled],
  );

  // Combobox semantics shared by the searchable input and the non-searchable
  // button trigger. The control is named by the FieldWrapper label when present,
  // otherwise by the placeholder. aria-controls is only set while the listbox
  // exists, so it never dangles.
  const triggerAria = {
    id: wrapperId,
    'aria-haspopup': 'listbox' as const,
    'aria-expanded': isOpen,
    'aria-controls': isOpen ? listboxId : undefined,
    'aria-invalid': !!error,
    'aria-label': label ? undefined : placeholder,
  };

  // Rule 12: react-window for large option lists
  const useVirtualList = filteredOptions.length > 100;

  const virtualRowProps = useMemo(
    () => ({
      filteredOptions,
      selectedSet,
      activeIndex,
      maxSelections,
      valueLength: value.length,
      renderOption,
    }),
    [filteredOptions, selectedSet, activeIndex, maxSelections, value.length, renderOption],
  );

  type MultiSelectRowProps = {
    filteredOptions: DropdownOption[];
    selectedSet: Set<string>;
    activeIndex: number;
    maxSelections?: number;
    valueLength: number;
    renderOption?: (option: DropdownOption, isSelected: boolean) => React.ReactNode;
  };

  const OptionRow = useCallback(
    ({
      index,
      style,
      filteredOptions: opts,
      selectedSet: selSet,
      activeIndex: ai,
      maxSelections: maxSel,
      valueLength: valLen,
      renderOption: ro,
    }: RowComponentProps<MultiSelectRowProps>) => {
      const opt = opts[index];
      const isSelected = selSet.has(opt.value);
      const isHighlighted = index === ai;
      const isMaxed = !isSelected && maxSel !== undefined && valLen >= maxSel;
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
    },
    [],
  );

  const menu = (
    <div
      ref={menuRef}
      id={listboxId}
      className={styles.menu}
      style={menuStyle}
      role="listbox"
      aria-multiselectable="true"
    >
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
            const isSelected = selectedSet.has(opt.value);
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
                data-option-value={opt.value}
                onMouseEnter={() => setActiveIndex(idx)}
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
      htmlFor={wrapperId}
      required={required}
      error={error}
      hint={hint}
      className={className}
    >
      {name &&
        value.map((v) => <input key={v} type="hidden" name={`${name}[]`} value={v} />)}
      <div ref={triggerRef} className={triggerAreaClasses} onClick={handleTriggerClick}>
        {value.length === 0 && !searchable && (
          <span className={styles.placeholder}>{placeholder}</span>
        )}
        {value.map((v, i) => (
          <span key={v} className={styles.pill} data-pill-value={v}>
            {selectedLabels[i]}
            <button
              type="button"
              className={styles.pillRemove}
              onClick={handlePillRemove}
              aria-label={`Remove ${selectedLabels[i]}`}
            >
              &times;
            </button>
          </span>
        ))}
        {searchable && (
          <input
            {...triggerAria}
            ref={searchInputRef}
            className={styles.searchInput}
            type="text"
            role="combobox"
            aria-autocomplete="list"
            aria-required={required}
            placeholder={value.length === 0 ? placeholder : ''}
            value={searchQuery}
            onChange={handleSearchChange}
            onClick={handleSearchClick}
            onKeyDown={handleKeyDown}
            disabled={disabled}
          />
        )}
        <span className={styles.triggerRight}>
          {value.length > 0 && (
            <button
              type="button"
              className={styles.clearAll}
              onClick={handleClearAll}
              aria-label="Clear all"
            >
              Clear
            </button>
          )}
          {searchable ? (
            <ChevronDown
              className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
            />
          ) : (
            <button
              {...triggerAria}
              ref={triggerButtonRef}
              type="button"
              className={styles.comboToggle}
              onKeyDown={handleKeyDown}
              disabled={disabled}
            >
              <ChevronDown
                className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`}
              />
            </button>
          )}
        </span>
      </div>
      {isOpen && ReactDOM.createPortal(menu, portalEl)}
    </FieldWrapper>
  );
});
