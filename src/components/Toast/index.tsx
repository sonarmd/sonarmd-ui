import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import ReactDOM from 'react-dom';
import styles from './Toast.module.css';

// ── Types ────────────────────────────────────────────────────────────────────

export interface ToastItem {
  id: string;
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  duration?: number;
  action?: { label: string; onClick: () => void };
}

export interface ToastContextValue {
  addToast: (toast: Omit<ToastItem, 'id'>) => string;
  removeToast: (id: string) => void;
}

export interface ToastProviderProps {
  children: React.ReactNode;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  maxToasts?: number;
}

// ── Context ───────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ToastIcon({ variant }: { variant: ToastItem['variant'] }): JSX.Element {
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

function CloseIcon(): JSX.Element {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ── ToastItemComponent ────────────────────────────────────────────────────────

interface ToastItemComponentProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
  isLeft: boolean;
}

function ToastItemComponent({ toast, onRemove, isLeft }: ToastItemComponentProps): JSX.Element {
  const duration = toast.duration !== undefined ? toast.duration : 5000;
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const remainingRef = useRef(duration);
  const startedAtRef = useRef<number>(Date.now());

  const startTimer = useCallback(() => {
    if (duration === 0) return;
    startedAtRef.current = Date.now();
    timerRef.current = setTimeout(() => {
      onRemove(toast.id);
    }, remainingRef.current);
  }, [duration, onRemove, toast.id]);

  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
      remainingRef.current -= Date.now() - startedAtRef.current;
    }
    setPaused(true);
  }, []);

  const resumeTimer = useCallback(() => {
    setPaused(false);
    startTimer();
  }, [startTimer]);

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
          onClick={() => onRemove(toast.id)}
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
            onClick={() => {
              toast.action!.onClick();
              onRemove(toast.id);
            }}
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
}

// ── ToastProvider ─────────────────────────────────────────────────────────────

const positionClassMap: Record<NonNullable<ToastProviderProps['position']>, string> = {
  'top-right': styles.topRight,
  'top-left': styles.topLeft,
  'bottom-right': styles.bottomRight,
  'bottom-left': styles.bottomLeft,
};

export function ToastProvider({
  children,
  position = 'top-right',
  maxToasts = 5,
}: ToastProviderProps): JSX.Element {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback(
    (toast: Omit<ToastItem, 'id'>): string => {
      const id = Math.random().toString(36).slice(2);
      setToasts((prev) => {
        const next = [...prev, { ...toast, id }];
        return next.length > maxToasts ? next.slice(next.length - maxToasts) : next;
      });
      return id;
    },
    [maxToasts],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const isLeft = position === 'top-left' || position === 'bottom-left';
  const containerClasses = [styles.container, positionClassMap[position]].join(' ');

  const portal = ReactDOM.createPortal(
    <div className={containerClasses} aria-label="Notifications">
      {toasts.map((toast) => (
        <ToastItemComponent
          key={toast.id}
          toast={toast}
          onRemove={removeToast}
          isLeft={isLeft}
        />
      ))}
    </div>,
    document.body,
  );

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {portal}
    </ToastContext.Provider>
  );
}
