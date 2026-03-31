import React, {useCallback, useLayoutEffect, useMemo, useRef, useState} from 'react';
import {Link} from 'react-router-dom';
import {Tooltip} from '../Tooltip';
import styles from './Sidebar.module.css';

export interface NavItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  to?: string;
  badge?: string | number;
  children?: NavItem[];
  disabled?: boolean;
}

export interface SidebarProps {
  items: NavItem[];
  activeKey: string;
  onNavigate: (key: string) => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

function ChevronRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CollapseIcon({collapsed}: {collapsed: boolean}) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{transform: collapsed ? 'rotate(180deg)' : undefined, transition: 'transform 0.2s'}}
    >
      <path
        d="M10 4L6 8l4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

interface NavItemRowProps {
  item: NavItem;
  activeKey: string;
  onNavigate: (key: string) => void;
  collapsed: boolean;
  depth?: number;
}

function NavItemRow({item, activeKey, onNavigate, collapsed, depth = 0}: NavItemRowProps) {
  const [open, setOpen] = useState(false);
  const subItemsRef = useRef<HTMLDivElement>(null);
  const contentHeightRef = useRef<number | undefined>(undefined);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = item.key === activeKey;
  const isDisabled = item.disabled ?? false;

  useLayoutEffect(() => {
    if (subItemsRef.current) {
      contentHeightRef.current = subItemsRef.current.scrollHeight;
    }
  });

  const handleClick = useCallback(() => {
    if (isDisabled) return;
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      onNavigate(item.key);
    }
  }, [isDisabled, hasChildren, onNavigate, item.key]);

  const itemClasses = useMemo(
    () =>
      [styles.item, isActive ? styles.itemActive : '', isDisabled ? styles.itemDisabled : '']
        .filter(Boolean)
        .join(' '),
    [isActive, isDisabled],
  );

  const itemContent = (
    <>
      {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
      {!collapsed && (
        <>
          <span className={styles.itemLabel}>{item.label}</span>
          {item.badge != null && (
            <span className={styles.itemBadge}>{item.badge}</span>
          )}
          {hasChildren && (
            <span className={`${styles.itemArrow}${open ? ` ${styles.itemArrowOpen}` : ''}`}>
              <ChevronRightIcon />
            </span>
          )}
        </>
      )}
    </>
  );

  const itemEl = item.to && !hasChildren ? (
    <Link
      to={item.to}
      className={itemClasses}
      data-nav-key={item.key}
      aria-current={isActive ? 'page' : undefined}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : undefined}
    >
      {itemContent}
    </Link>
  ) : (
    <button
      type="button"
      className={itemClasses}
      onClick={handleClick}
      data-nav-key={item.key}
      aria-expanded={hasChildren ? open : undefined}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
    >
      {itemContent}
    </button>
  );

  const wrappedItem = collapsed ? (
    <Tooltip content={item.label} placement="right">
      {itemEl}
    </Tooltip>
  ) : (
    itemEl
  );

  return (
    <>
      {wrappedItem}
      {hasChildren && !collapsed && (
        <div
          ref={subItemsRef}
          className={styles.subItems}
          style={{
            height: open ? (contentHeightRef.current ?? subItemsRef.current?.scrollHeight ?? 'auto') : 0,
          }}
        >
          {item.children!.map((child) => (
            <NavItemRow
              key={child.key}
              item={child}
              activeKey={activeKey}
              onNavigate={onNavigate}
              collapsed={collapsed}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </>
  );
}

function flattenItems(items: NavItem[]): NavItem[] {
  const result: NavItem[] = [];
  for (const item of items) {
    result.push(item);
    if (item.children?.length) {
      result.push(...flattenItems(item.children));
    }
  }
  return result;
}

export const Sidebar = React.memo(function Sidebar({
  items,
  activeKey,
  onNavigate,
  collapsed = false,
  onToggleCollapse,
  header,
  footer,
}: SidebarProps): JSX.Element {
  const sidebarClassName = useMemo(
    () => `${styles.sidebar}${collapsed ? ` ${styles.collapsed}` : ''}`,
    [collapsed],
  );

  const itemsByKey = useMemo(
    () => new Map(flattenItems(items).map((i) => [i.key, i])),
    [items],
  );

  const handleToggleCollapse = useCallback(() => {
    onToggleCollapse?.();
  }, [onToggleCollapse]);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      const key = (e.target as HTMLElement).closest('[data-nav-key]')?.getAttribute('data-nav-key');
      if (!key) return;
      const item = itemsByKey.get(key);
      if (!item || item.disabled) return;
      if (!item.children?.length) {
        onNavigate(key);
      }
    },
    [itemsByKey, onNavigate],
  );

  return (
    <nav
      className={sidebarClassName}
      aria-label="Main navigation"
      onClick={handleNavClick}
    >
      {header && <div className={styles.header}>{header}</div>}
      {onToggleCollapse && (
        <div className={styles.collapseToggle}>
          <button
            type="button"
            className={styles.collapseBtn}
            onClick={handleToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <CollapseIcon collapsed={collapsed} />
          </button>
        </div>
      )}
      <div className={styles.nav}>
        {items.map((item) => (
          <NavItemRow
            key={item.key}
            item={item}
            activeKey={activeKey}
            onNavigate={onNavigate}
            collapsed={collapsed}
          />
        ))}
      </div>
      {footer && <div className={styles.footer}>{footer}</div>}
    </nav>
  );
});
