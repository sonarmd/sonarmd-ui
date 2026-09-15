import React, {useCallback, useId, useMemo, useRef, useState} from 'react';
import styles from './Accordion.module.css';

export interface AccordionItem {
  /** Stable key, used for expansion state and generated ids. */
  key: string;
  title: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** 'single' collapses siblings on open; 'multiple' allows many open. Default 'single'. */
  type?: 'single' | 'multiple';
  /** Uncontrolled initial open keys. */
  defaultExpandedKeys?: string[];
  /** Controlled open keys; pair with onExpandedChange. */
  expandedKeys?: string[];
  onExpandedChange?: (keys: string[]) => void;
  /** Heading level for each item header (2-6). Default 3. */
  headingLevel?: 2 | 3 | 4 | 5 | 6;
  className?: string;
}

function ChevronDown(): React.JSX.Element {
  return (
    <svg className={styles.chevron} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/**
 * A vertically stacked set of disclosure sections (WAI-ARIA accordion). Each
 * header is a real button exposing aria-expanded + aria-controls; each panel is
 * a labelled region. Headers are all tab-focusable; Arrow Up/Down, Home, and
 * End move focus between them. Panel height animates (respecting reduced motion
 * centrally).
 */
export function Accordion({
  items,
  type = 'single',
  defaultExpandedKeys,
  expandedKeys,
  onExpandedChange,
  headingLevel = 3,
  className,
}: AccordionProps): React.JSX.Element {
  const baseId = useId();
  const controlled = expandedKeys != null;
  const [internal, setInternal] = useState<string[]>(defaultExpandedKeys ?? []);
  const open = controlled ? expandedKeys : internal;
  const openSet = useMemo(() => new Set(open), [open]);

  const headerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  const setOpen = useCallback(
    (next: string[]) => {
      if (!controlled) setInternal(next);
      onExpandedChange?.(next);
    },
    [controlled, onExpandedChange],
  );

  const toggle = useCallback(
    (key: string) => {
      const isOpen = openSet.has(key);
      if (type === 'single') {
        setOpen(isOpen ? [] : [key]);
      } else {
        const next = isOpen ? open.filter((k) => k !== key) : [...open, key];
        setOpen(next);
      }
    },
    [openSet, type, open, setOpen],
  );

  const handleHeaderKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement>) => {
      const enabled = items.filter((i) => !i.disabled);
      const currentKey = e.currentTarget.dataset.key;
      const idx = enabled.findIndex((i) => i.key === currentKey);
      if (idx < 0) return;
      let nextIdx = -1;
      if (e.key === 'ArrowDown') nextIdx = (idx + 1) % enabled.length;
      else if (e.key === 'ArrowUp') nextIdx = (idx - 1 + enabled.length) % enabled.length;
      else if (e.key === 'Home') nextIdx = 0;
      else if (e.key === 'End') nextIdx = enabled.length - 1;
      else return;
      e.preventDefault();
      headerRefs.current.get(enabled[nextIdx].key)?.focus();
    },
    [items],
  );

  const Heading = `h${headingLevel}` as keyof React.JSX.IntrinsicElements;

  return (
    <div className={[styles.accordion, className].filter(Boolean).join(' ')}>
      {items.map((item) => {
        const isOpen = openSet.has(item.key);
        const headerId = `${baseId}-${item.key}-header`;
        const panelId = `${baseId}-${item.key}-panel`;
        return (
          <div key={item.key} className={styles.item} data-open={isOpen || undefined}>
            <Heading className={styles.heading}>
              <button
                ref={(el) => {
                  if (el) headerRefs.current.set(item.key, el);
                  else headerRefs.current.delete(item.key);
                }}
                type="button"
                id={headerId}
                className={styles.header}
                aria-expanded={isOpen}
                aria-controls={panelId}
                disabled={item.disabled}
                data-key={item.key}
                onClick={() => toggle(item.key)}
                onKeyDown={handleHeaderKeyDown}
              >
                <span className={styles.title}>{item.title}</span>
                <ChevronDown />
              </button>
            </Heading>
            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className={styles.panel}
              hidden={!isOpen}
            >
              <div className={styles.panelInner}>{item.content}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
