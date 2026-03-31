import React, {useCallback, useMemo, useRef} from 'react';
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

export const Tabs = React.memo(function Tabs({
  tabs,
  activeTab,
  onChange,
  variant = 'underline',
  size = 'md',
  className,
}: TabsProps): JSX.Element {
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  const tabsRef = useRef(tabs);
  tabsRef.current = tabs;

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const currentTabs = tabsRef.current;
      const currentActiveTab = activeTabRef.current;
      const enabledTabs = currentTabs.filter((t) => !t.disabled);
      const currentIndex = enabledTabs.findIndex((t) => t.key === currentActiveTab);
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
    [onChange],
  );

  const handleTabClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const key = e.currentTarget.dataset.tabKey;
      if (key) onChange(key);
    },
    [onChange],
  );

  const tablistClassName = useMemo(() => {
    const variantClass = styles[variant];
    const sizeClass = size === 'sm' ? styles.sm : '';
    return [styles.tablist, variantClass, sizeClass, className].filter(Boolean).join(' ');
  }, [variant, size, className]);

  return (
    <div role="tablist" className={tablistClassName} onKeyDown={handleKeyDown}>
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
            data-tab-key={tab.key}
            onClick={handleTabClick}
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
});
