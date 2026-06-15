import React, {useEffect, useRef, useState} from 'react';
import styles from './Breadcrumbs.module.css';

export interface BreadcrumbItem {
  label: string;
  /** Link target. Rendered via renderLink (or a plain anchor by default). */
  href?: string;
  /** Click handler (used when there is no href, or alongside it). */
  onClick?: () => void;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  /**
   * Router-agnostic link renderer. Return your router's link element wrapping
   * `content`. Defaults to a plain <a href> (or a <button> when there is no
   * href). For react-router: `renderLink={(item, content) => <Link to={item.href!}>{content}</Link>}`.
   */
  renderLink?: (item: BreadcrumbItem, content: React.ReactNode) => React.ReactNode;
  /** Collapse the middle into an ellipsis menu when more than this many items. Defaults to 4. */
  maxItems?: number;
  className?: string;
}

const cx = (...parts: Array<string | undefined>): string => parts.filter(Boolean).join(' ');

const defaultRenderLink = (item: BreadcrumbItem, content: React.ReactNode): React.ReactNode =>
  item.href != null ? (
    <a className={styles.link} href={item.href} onClick={item.onClick}>
      {content}
    </a>
  ) : (
    <button type="button" className={styles.link} onClick={item.onClick}>
      {content}
    </button>
  );

interface CollapsedMenuProps {
  items: BreadcrumbItem[];
  renderLink: (item: BreadcrumbItem, content: React.ReactNode) => React.ReactNode;
}

function CollapsedMenu({items, renderLink}: CollapsedMenuProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!open) return undefined;
    const onPointerDown = (e: MouseEvent): void => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <li ref={ref} className={styles.item}>
      <button
        type="button"
        className={styles.ellipsis}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Show collapsed breadcrumbs"
        onClick={() => setOpen((o) => !o)}
      >
        ...
      </button>
      {open && (
        <ul className={styles.menu}>
          {items.map((item, i) => (
            <li key={`${item.label}-${i}`} className={styles.menuItem} onClick={() => setOpen(false)}>
              {renderLink(item, item.label)}
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}

/**
 * Accessible breadcrumb trail. Renders a nav landmark with an ordered list; the
 * last item is plain text with aria-current="page". With more than `maxItems`
 * entries the middle collapses into an ellipsis menu. Link rendering is
 * router-agnostic via `renderLink`.
 */
export const Breadcrumbs = React.memo(function Breadcrumbs({
  items,
  renderLink = defaultRenderLink,
  maxItems = 4,
  className,
}: BreadcrumbsProps): JSX.Element {
  const renderCrumb = (item: BreadcrumbItem, isLast: boolean): React.ReactNode =>
    isLast ? (
      <span className={styles.current} aria-current="page">
        {item.label}
      </span>
    ) : (
      renderLink(item, item.label)
    );

  const crumbs: React.ReactNode[] = [];
  if (items.length > maxItems) {
    const first = items[0];
    const last = items[items.length - 1];
    const middle = items.slice(1, -1);
    crumbs.push(
      <li key="first" className={styles.item}>
        {renderCrumb(first, false)}
      </li>,
      <CollapsedMenu key="menu" items={middle} renderLink={renderLink} />,
      <li key="last" className={styles.item}>
        {renderCrumb(last, true)}
      </li>,
    );
  } else {
    items.forEach((item, i) => {
      crumbs.push(
        <li key={`${item.label}-${i}`} className={styles.item}>
          {renderCrumb(item, i === items.length - 1)}
        </li>,
      );
    });
  }

  return (
    <nav aria-label="Breadcrumb" className={cx(styles.nav, className)}>
      <ol className={styles.list}>
        {crumbs.map((crumb, i) => (
          <React.Fragment key={i}>
            {i > 0 && (
              <li aria-hidden="true" className={styles.separator}>
                /
              </li>
            )}
            {crumb}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
});

Breadcrumbs.displayName = 'Breadcrumbs';
