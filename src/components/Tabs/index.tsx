import React, {useCallback, useRef} from 'react';
import styles from './Tabs.module.css';

export interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

export interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (key: string) => void;
  variant?: 'underline' | 'pills';
  size?: 'sm' | 'md';
  className?: string;
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  className,
}: TabsProps): JSX.Element {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, currentKey: string) => {
      const enabledTabs = tabs.filter((t) => !t.disabled);
      const currentIndex = enabledTabs.findIndex((t) => t.key === currentKey);
      let nextIndex = -1;

      if (e.key === 'ArrowRight') {
        nextIndex = (currentIndex + 1) % enabledTabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = enabledTabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const nextKey = enabledTabs[nextIndex].key;
      onChange(nextKey);
      tabRefs.current.get(nextKey)?.focus();
    },
    [tabs, onChange],
  );

  const variantClass = styles[variant];
  const sizeClass = size === 'sm' ? styles.sm : '';

  return (
    <div
      role="tablist"
      className={[styles.tablist, variantClass, sizeClass, className].filter(Boolean).join(' ')}
    >
      {tabs.map((tab) => {
        const isSelected = tab.key === activeTab;
        const isDisabled = tab.disabled ?? false;

        return (
          <button
            key={tab.key}
            ref={(el) => {
              if (el) tabRefs.current.set(tab.key, el);
              else tabRefs.current.delete(tab.key);
            }}
            role="tab"
            type="button"
            className={styles.tab}
            aria-selected={isSelected}
            aria-disabled={isDisabled || undefined}
            disabled={isDisabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => {
              if (!isDisabled) onChange(tab.key);
            }}
            onKeyDown={(e) => handleKeyDown(e, tab.key)}
          >
            {tab.icon && tab.icon}
            {tab.label}
            {tab.badge != null && (
              <span className={styles.tabBadge}>{tab.badge}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
