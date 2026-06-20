import React, {
  cloneElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import {usePortal} from '../../hooks/usePortal';
import styles from './Popover.module.css';

export type PopoverPlacement =
  | 'bottom-start'
  | 'bottom-end'
  | 'bottom'
  | 'top-start'
  | 'top-end'
  | 'top';

export interface PopoverProps {
  /**
   * The interactive element that toggles the popover. Cloned with click +
   * aria-haspopup/aria-expanded/aria-controls wiring; its own onClick is kept.
   */
  trigger: React.ReactElement<{onClick?: (e: React.MouseEvent) => void}>;
  children: React.ReactNode;
  /** Controlled open state; pair with onOpenChange. Omit for uncontrolled. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: PopoverPlacement;
  /** Accessible name for the popover dialog. */
  ariaLabel?: string;
  className?: string;
}

const GAP = 8;

function computePosition(
  anchor: DOMRect,
  content: DOMRect,
  placement: PopoverPlacement,
): {top: number; left: number} {
  const isTop = placement.startsWith('top');
  const top = isTop ? anchor.top - content.height - GAP : anchor.bottom + GAP;

  let left: number;
  if (placement.endsWith('-end')) left = anchor.right - content.width;
  else if (placement.endsWith('-start')) left = anchor.left;
  else left = anchor.left + anchor.width / 2 - content.width / 2;

  // Keep within the viewport horizontally.
  const max = window.innerWidth - content.width - GAP;
  left = Math.max(GAP, Math.min(left, max));
  return {top, left};
}

function firstFocusable(container: HTMLElement): HTMLElement | null {
  return container.querySelector<HTMLElement>(
    'a, button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])',
  );
}

/**
 * Anchored, interactive floating content (unlike the read-only Tooltip). The
 * trigger exposes aria-haspopup="dialog" + aria-expanded + aria-controls; the
 * panel is a labelled non-modal dialog that closes on outside click or Escape
 * and returns focus to the trigger on keyboard dismissal.
 */
export function Popover({
  trigger,
  children,
  open: openProp,
  onOpenChange,
  placement = 'bottom-start',
  ariaLabel,
  className,
}: PopoverProps): React.JSX.Element {
  const contentId = useId();
  const controlled = openProp != null;
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlled ? openProp : internalOpen;

  const anchorRef = useRef<HTMLSpanElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{top: number; left: number} | null>(null);
  const portalEl = usePortal();

  const setOpen = useCallback(
    (next: boolean) => {
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [controlled, onOpenChange],
  );

  const position = useCallback(() => {
    if (!anchorRef.current || !contentRef.current) return;
    setPos(
      computePosition(
        anchorRef.current.getBoundingClientRect(),
        contentRef.current.getBoundingClientRect(),
        placement,
      ),
    );
  }, [placement]);

  // Position after the content mounts and on viewport changes while open.
  useLayoutEffect(() => {
    if (!open) {
      setPos(null);
      return;
    }
    position();
    const onScrollResize = () => position();
    window.addEventListener('scroll', onScrollResize, true);
    window.addEventListener('resize', onScrollResize);
    return () => {
      window.removeEventListener('scroll', onScrollResize, true);
      window.removeEventListener('resize', onScrollResize);
    };
  }, [open, position]);

  // Move focus into the popover when it opens.
  useEffect(() => {
    if (open && contentRef.current) {
      firstFocusable(contentRef.current)?.focus();
    }
  }, [open]);

  // Dismiss on outside pointer-down and on Escape (Escape returns focus).
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (!anchorRef.current?.contains(target) && !contentRef.current?.contains(target)) {
        setOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        firstFocusable(anchorRef.current as HTMLElement)?.focus();
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, setOpen]);

  const triggerOnClick = trigger.props.onClick;
  const clonedTrigger = cloneElement(trigger, {
    onClick: (e: React.MouseEvent) => {
      triggerOnClick?.(e);
      setOpen(!open);
    },
    'aria-haspopup': 'dialog',
    'aria-expanded': open,
    'aria-controls': open ? contentId : undefined,
  } as Record<string, unknown>);

  return (
    <span ref={anchorRef} className={styles.anchor}>
      {clonedTrigger}
      {open &&
        ReactDOM.createPortal(
          <div
            ref={contentRef}
            id={contentId}
            role="dialog"
            aria-label={ariaLabel}
            className={[styles.popover, className].filter(Boolean).join(' ')}
            style={
              pos
                ? {top: pos.top, left: pos.left}
                : // First paint before measurement: keep off-screen to avoid flash.
                  {top: 0, left: 0, visibility: 'hidden'}
            }
          >
            {children}
          </div>,
          portalEl,
        )}
    </span>
  );
}
