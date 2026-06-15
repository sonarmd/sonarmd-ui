import React from 'react';
import {Button} from '../Button';
import styles from './AppErrorBoundary.module.css';

const AlertIcon = (): JSX.Element => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M24 6L44 40H4L24 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <line x1="24" y1="20" x2="24" y2="30" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="24" cy="35" r="1.5" fill="currentColor" />
  </svg>
);

export interface AppErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Custom fallback. If omitted, the built-in full-page error card renders.
   */
  fallback?: React.ReactNode;
  /**
   * Sentry-compatible error reporter. Called once per error boundary catch.
   * PHI-safe: the raw error is passed here for reporting; it is NOT rendered
   * to the user unless showDetail=true.
   */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /**
   * When any element of this array changes identity, the boundary resets.
   * Typically: [location.key] to auto-recover on route change.
   */
  resetKeys?: unknown[];
  /**
   * Render the raw error message in the fallback. ONLY use for internal tools;
   * never enable in consumer-facing UI (PHI-safe default: false).
   */
  showDetail?: boolean;
}

interface BoundaryState {
  caught: boolean;
  error: Error | null;
}

export class AppErrorBoundary extends React.Component<AppErrorBoundaryProps, BoundaryState> {
  state: BoundaryState = {caught: false, error: null};

  static getDerivedStateFromError(error: Error): BoundaryState {
    return {caught: true, error};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prev: AppErrorBoundaryProps): void {
    if (!this.state.caught) return;
    const {resetKeys = []} = this.props;
    const prevKeys = (prev.resetKeys ?? []) as unknown[];
    if (resetKeys.some((k, i) => k !== prevKeys[i])) {
      this.setState({caught: false, error: null});
    }
  }

  private handleReset = (): void => {
    this.setState({caught: false, error: null});
  };

  render(): React.ReactNode {
    const {caught, error} = this.state;
    const {children, fallback, showDetail} = this.props;

    if (!caught) return children;
    if (fallback != null) return fallback;

    return (
      <div className={styles.root} role="alert">
        <div className={styles.inner}>
          <div className={styles.icon}><AlertIcon /></div>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.message}>
            An unexpected error occurred. Please try again or contact support if
            the problem persists.
          </p>
          {showDetail && error && (
            <pre className={styles.detail}>{error.message}</pre>
          )}
          <div className={styles.actions}>
            <Button variant="primary" onClick={this.handleReset}>
              Try again
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
