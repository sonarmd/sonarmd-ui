import React, {forwardRef, HTMLAttributes, ReactNode, useCallback, useEffect, useRef, useState} from 'react';
import styles from './AppShell.module.css';

export interface AppShellProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** The sidebar column (typically a Sidebar component). */
  sidebar: ReactNode;
  /** Optional context rail on the trailing edge. Collapses first at md breakpoint. */
  contextRail?: ReactNode;
  /** Main content. */
  children: ReactNode;
  /** Override the breakpoint (px) at which context rail collapses. Default 1024. */
  contextRailBreakpoint?: number;
  /** Override the breakpoint (px) at which sidebar collapses. Default 768. */
  sidebarBreakpoint?: number;
}

/**
 * 3-column layout: sidebar | content | context-rail.
 * Context rail collapses first (to an overlay drawer), then sidebar.
 * Uses container queries where supported, ResizeObserver fallback.
 */
export const AppShell = forwardRef<HTMLDivElement, AppShellProps>(function AppShell(
  {
    sidebar,
    contextRail,
    children,
    contextRailBreakpoint = 1024,
    sidebarBreakpoint = 768,
    className,
    ...rest
  },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [railCollapsed, setRailCollapsed] = useState(false);
  const [railDrawerOpen, setRailDrawerOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const measure = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const w = el.offsetWidth;
    setRailCollapsed(w < contextRailBreakpoint);
    setSidebarCollapsed(w < sidebarBreakpoint);
  }, [contextRailBreakpoint, sidebarBreakpoint]);

  useEffect(() => {
    measure();
    const obs = new ResizeObserver(measure);
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, [measure]);

  // Nullish check: React callers commonly pass `null` to omit an optional node,
  // and a null rail must not trigger the rail layout or the collapsed toggle.
  const hasRail = contextRail != null;

  // Drive the sidebar's own collapse from the responsive breakpoint. Below the
  // breakpoint we force collapsed; above it we defer to whatever the consumer
  // passed, so a manual collapse toggle still works. Non-element children (rare)
  // pass through untouched.
  const sidebarEl = React.isValidElement<{collapsed?: boolean}>(sidebar)
    ? React.cloneElement(sidebar, {
        collapsed: sidebarCollapsed || sidebar.props.collapsed,
      })
    : sidebar;

  return (
    <div
      ref={(node) => {
        (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={[
        styles.root,
        sidebarCollapsed ? styles.sidebarCollapsed : '',
        railCollapsed ? styles.railCollapsed : '',
        hasRail ? styles.hasRail : '',
        className,
      ].filter(Boolean).join(' ')}
      data-sidebar-collapsed={sidebarCollapsed || undefined}
      {...rest}
    >
      <div className={styles.sidebar}>{sidebarEl}</div>

      <main className={styles.content}>
        {children}
      </main>

      {hasRail && (
        <>
          {!railCollapsed && (
            <aside className={styles.rail}>{contextRail}</aside>
          )}
          {railCollapsed && (
            <>
              <button
                className={styles.railToggle}
                aria-label="Open context panel"
                aria-expanded={railDrawerOpen}
                onClick={() => setRailDrawerOpen((v) => !v)}
                type="button"
              />
              {railDrawerOpen && (
                <>
                  <div
                    className={styles.backdrop}
                    aria-hidden="true"
                    onClick={() => setRailDrawerOpen(false)}
                  />
                  <aside className={styles.drawer} aria-label="Context panel">
                    {contextRail}
                  </aside>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
});
