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
}: TooltipProps): JSX.Element {
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

  const trigger = cloneElement(children, {
    'aria-describedby': visible ? tooltipId : undefined,
    ref: (node: Element | null) => {
      triggerRef.current = node;
      const existingRef = (children as React.ReactElement & { ref?: React.Ref<unknown> }).ref;
      if (typeof existingRef === 'function') {
        existingRef(node);
      } else if (existingRef && typeof existingRef === 'object') {
        (existingRef as React.MutableRefObject<Element | null>).current = node;
      }
    },
    onMouseEnter: (e: React.MouseEvent) => {
      show();
      children.props.onMouseEnter?.(e);
    },
    onMouseLeave: (e: React.MouseEvent) => {
      hide();
      children.props.onMouseLeave?.(e);
    },
    onFocus: (e: React.FocusEvent) => {
      show();
      children.props.onFocus?.(e);
    },
    onBlur: (e: React.FocusEvent) => {
      hide();
      children.props.onBlur?.(e);
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
