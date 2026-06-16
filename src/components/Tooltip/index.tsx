import React, {
  cloneElement,
  useCallback,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks/usePortal';
import styles from './Tooltip.module.css';

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

interface Position {
  top: number;
  left: number;
}

const arrowClassMap: Record<NonNullable<TooltipProps['placement']>, string> = {
  top: styles.arrowTop,
  bottom: styles.arrowBottom,
  left: styles.arrowLeft,
  right: styles.arrowRight,
};

export const Tooltip = React.memo(function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
  className,
}: TooltipProps): React.JSX.Element {
  const id = useId();
  const tooltipId = `tooltip-${id.replace(/:/g, '')}`;

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  const triggerRef = useRef<Element | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  // Rule 6: timer lives in a ref, not state
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const portalEl = usePortal();

  const show = useCallback(() => {
    timerRef.current = setTimeout(() => setVisible(true), delay);
  }, [delay]);

  const hide = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setVisible(false);
  }, []);

  // Rule 8: position measurement runs before paint (useLayoutEffect)
  useLayoutEffect(() => {
    if (!visible || !triggerRef.current || !tooltipRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const tooltipEl = tooltipRef.current;
    const tooltipWidth = tooltipEl.offsetWidth;
    const tooltipHeight = tooltipEl.offsetHeight;

    let top = 0;
    let left = 0;

    switch (placement) {
      case 'top':
        top = rect.top - tooltipHeight - 8;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'bottom':
        top = rect.bottom + 8;
        left = rect.left + rect.width / 2 - tooltipWidth / 2;
        break;
      case 'left':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.left - tooltipWidth - 8;
        break;
      case 'right':
        top = rect.top + rect.height / 2 - tooltipHeight / 2;
        left = rect.right + 8;
        break;
    }

    setPosition({ top, left });
  }, [visible, placement]);

  const tooltipClasses = [styles.tooltip, className].filter(Boolean).join(' ');

  // React 19 types ReactElement.props as `unknown` and passes ref as a regular
  // prop. View the child through its DOM-attribute shape so we can read its
  // handlers and existing ref, and merge ours in via cloneElement.
  type TriggerProps = React.HTMLAttributes<HTMLElement> & { ref?: React.Ref<Element> };
  const child = children as React.ReactElement<TriggerProps>;

  const trigger = cloneElement(child, {
    'aria-describedby': visible ? tooltipId : undefined,
    ref: (node: Element | null) => {
      triggerRef.current = node;
      // React 19 passes ref as a prop; React 18 (still an allowed peer) stores
      // it on the element. Read both so a consumer ref on the child is preserved.
      const existingRef =
        child.props.ref ?? (child as { ref?: React.Ref<Element> }).ref;
      if (typeof existingRef === 'function') {
        existingRef(node);
      } else if (existingRef && typeof existingRef === 'object') {
        (existingRef as React.MutableRefObject<Element | null>).current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
      show();
      child.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
      hide();
      child.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent<HTMLElement>) => {
      show();
      child.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent<HTMLElement>) => {
      hide();
      child.props.onBlur?.(e);
    },
  });

  return (
    <>
      {trigger}
      {visible &&
        ReactDOM.createPortal(
          <div
            id={tooltipId}
            ref={tooltipRef}
            className={tooltipClasses}
            role="tooltip"
            style={{ top: position.top, left: position.left }}
          >
            {content}
            <span className={[styles.arrow, arrowClassMap[placement]].join(' ')} />
          </div>,
          portalEl,
        )}
    </>
  );
});
