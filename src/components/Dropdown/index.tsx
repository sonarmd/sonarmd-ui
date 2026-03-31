import React, { useCallback, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { FieldWrapper } from '../FieldWrapper';
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

export function Dropdown({
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

  const selectedOption = options.find((o) => o.value === value) ?? null;

  const filteredOptions = searchable && searchQuery
    ? options.filter((o) => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const positionMenu = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const menuHeight = 280; // estimated max height
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

  const selectOption = useCallback(
    (opt: DropdownOption) => {
      if (opt.disabled) return;
      onChange(opt.value);
      closeMenu();
    },
    [onChange, closeMenu],
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

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
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
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filteredOptions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && filteredOptions[activeIndex]) {
        selectOption(filteredOptions[activeIndex]);
      }
    } else if (e.key === 'Escape') {
      closeMenu();
    }
  };

  const triggerClasses = [
    styles.trigger,
    styles[size],
    isOpen ? styles.triggerOpen : '',
    error ? styles.triggerError : '',
    disabled ? styles.triggerDisabled : '',
  ]
    .filter(Boolean)
    .join(' ');

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
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleMenuKeyDown}
        />
      )}
      <div className={styles.optionList}>
        {filteredOptions.length === 0 ? (
          <div className={styles.noResults}>No results</div>
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
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => selectOption(opt)}
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
        onClick={() => (isOpen ? closeMenu() : openMenu())}
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
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              aria-label="Clear selection"
            >
              <XIcon />
            </button>
          )}
          <ChevronDown className={`${styles.chevron}${isOpen ? ` ${styles.chevronOpen}` : ''}`} />
        </span>
      </button>
      {isOpen && ReactDOM.createPortal(menu, document.body)}
    </FieldWrapper>
  );
}


