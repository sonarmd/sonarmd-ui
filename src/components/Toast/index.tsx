import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import ReactDOM from 'react-dom';
import { usePortal } from '../../hooks/usePortal';
import styles from './Toast.module.css';

// -- Types --------------------------------------------------------------------

export interface ToastItem {
  id: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

// Backwards-compatible alias: previously the single context value shape.
// Now reflects the dispatch context (addToast + removeToast) which is the
// stable, dispatch-only surface. State (the toast array) is on ToastStateContext.
export interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
}

// -- Reducer -------------------------------------------------------------------

type ToastAction =
  | { type: 'ADD'; toast: ToastItem; maxToasts: number }
  | { type: 'REMOVE'; id: string };

function toastReducer(state: ToastItem[], action: ToastAction): ToastItem[] {
  switch (action.type) {
    case 'ADD': {
      const next = [...state, action.toast];
      return next.length > action.maxToasts ? next.slice(next.length - action.maxToasts) : next;
    }
    case 'REMOVE':
      return state.filter((t) => t.id !== action.id);
  }
}

// -- Contexts ------------------------------------------------------------------

// State context: consumers re-render when the toast list changes
const ToastStateContext = createContext<ToastItem[]>([]);

// Dispatch context: stable - consumers NEVER re-render due to toast list changes
const ToastDispatchContext = createContext<{
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
} | null>(null);

export function useToast() {
  const dispatch = useContext(ToastDispatchContext);
  if (!dispatch) throw new Error('useToast must be used within a ToastProvider');
  return dispatch;
}

export function useToastState(): ToastItem[] {
  return useContext(ToastStateContext);
}

// -- Icons ---------------------------------------------------------------------

function ToastIcon({ variant }: { variant: ToastItem['variant'] }): React.JSX.Element {
  switch (variant) {
    case 'info':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="var(--smd-color-primary-50)" strokeWidth="1.5" fill="none" />
          <path d="M8 7v5" stroke="var(--smd-color-primary-50)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="4.5" r="0.75" fill="var(--smd-color-primary-50)" />
        </svg>
      );
    case 'success':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="var(--smd-color-positive-30)" strokeWidth="1.5" fill="none" />
          <path d="M5 8l2.5 2.5L11 5.5" stroke="var(--smd-color-positive-30)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'warning':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M8 2L14.5 13.5H1.5L8 2Z" stroke="var(--smd-color-warning-30)" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M8 6v4" stroke="var(--smd-color-warning-30)" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="8" cy="11.5" r="0.75" fill="var(--smd-color-warning-30)" />
        </svg>
      );
    case 'error':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="8" cy="8" r="7" stroke="var(--smd-color-negative-30)" strokeWidth="1.5" fill="none" />
          <path d="M5.5 5.5l5 5M10.5 5.5l-5 5" stroke="var(--smd-color-negative-30)" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
  }
}

function CloseIcon(): React.JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// -- ToastItemComponent --------------------------------------------------------

interface ToastItemComponentProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
  isLeft: boolean;
}

const ToastItemComponent = React.memo(function ToastItemComponent({
  toast,
  onRemove,
  isLeft,
}: ToastItemComponentProps): React.JSX.Element {
  const duration = toast.duration !== undefined ? toast.duration : 5000;

  // Rule 6: timer state lives in refs, not React state - avoids re-renders
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(duration);
  const startTimeRef = useRef<number>(Date.now());
  // paused drives the CSS class - kept as state since it affects rendering
  const [paused, setPaused] = React.useState(false);

  const handleDismiss = useCallback(() => {
    onRemove(toast.id);
  }, [onRemove, toast.id]);

  const startTimer = useCallback(() => {
    if (duration === 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, remainingRef.current);
  }, [duration, onRemove, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current -= Date.now() - startTimeRef.current;
    }
    setPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setPaused(false);
    startTimer();
  }, [startTimer]);

  const handleActionClick = useCallback(() => {
    toast.action!.onClick();
    onRemove(toast.id);
  }, [toast.action, onRemove, toast.id]);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  const toastClasses = [
    styles.toast,
    styles[toast.variant],
    isLeft ? styles.toastLeft : '',
    duration > 0 && paused ? styles.progressPaused : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={toastClasses}
      role="status"
      aria-live="polite"
      onMouseEnter={pauseTimer}
      onMouseLeave={resumeTimer}
    >
      <div className={styles.toastBody}>
        <span className={styles.toastIcon}>
          <ToastIcon variant={toast.variant} />
        </span>
        <div className={styles.toastContent}>
          {toast.title && <div className={styles.toastTitle}>{toast.title}</div>}
          <div className={styles.toastMessage}>{toast.message}</div>
        </div>
        <button
          type="button"
          className={styles.toastClose}
          onClick={handleDismiss}
          aria-label="Close notification"
        >
          <CloseIcon />
        </button>
      </div>
      {toast.action && (
        <div className={styles.toastAction}>
          <button
            type="button"
            className={styles.toastActionBtn}
            onClick={handleActionClick}
          >
            {toast.action.label}
          </button>
        </div>
      )}
      {duration > 0 && (
        <div className={styles.progress}>
          <div
            className={styles.progressBar}
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </div>
  );
});

// -- ToastContainer ------------------------------------------------------------

const positionClassMap: Record<NonNullable<ToastProviderProps['position']>, string> = {
  'top-right': styles.topRight,
  'top-left': styles.topLeft,
  'bottom-right': styles.bottomRight,
  'bottom-left': styles.bottomLeft,
};

interface ToastContainerProps {
  position: NonNullable<ToastProviderProps['position']>;
}

// Reads from ToastStateContext - re-renders only when toast list changes
const ToastContainer = React.memo(function ToastContainer({
  position,
}: ToastContainerProps): React.JSX.Element {
  const toasts = useToastState();
  const { removeToast } = useToast();
  const isLeft = position === 'top-left' || position === 'bottom-left';
  const containerClasses = [styles.container, positionClassMap[position]].join(' ');

  return (
    <div className={containerClasses} aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItemComponent
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
          isLeft={isLeft}
        />
      ))}
    </div>
  );
});

// -- ToastProvider -------------------------------------------------------------

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps): React.JSX.Element {
  const [toasts, dispatch] = useReducer(toastReducer, []);

  // Rule 6: maxToasts stored in ref so addToast callback never needs to change
  const maxToastsRef = useRef(maxToasts);
  maxToastsRef.current = maxToasts;

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>): string => {
    const id = Math.random().toString(36).slice(2);
    dispatch({ type: 'ADD', toast: { ...toast, id }, maxToasts: maxToastsRef.current });
    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE', id });
  }, []);

  // useMemo keeps the dispatch context object reference stable
  const dispatchValue = useMemo(() => ({ addToast, removeToast }), [addToast, removeToast]);

  const portalEl = usePortal();

  return (
    <ToastDispatchContext.Provider value={dispatchValue}>
      {children}
      {ReactDOM.createPortal(
        <ToastStateContext.Provider value={toasts}>
          <ToastContainer position={position} />
        </ToastStateContext.Provider>,
        portalEl,
      )}
    </ToastDispatchContext.Provider>
  );
}
