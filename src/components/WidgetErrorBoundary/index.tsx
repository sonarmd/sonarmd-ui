import React from 'react';
import {Button} from '../Button';
import styles from './WidgetErrorBoundary.module.css';

const SmallAlertIcon = (): React.JSX.Element => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M12 3L22 20H2L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <line x1="12" y1="10" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="12" cy="17.5" r="0.75" fill="currentColor" />
  </svg>
);

export interface WidgetErrorBoundaryProps {
  children: React.ReactNode;
  /**
   * Custom fallback rendered inside the widget frame. If omitted, the
   * built-in compact card renders with a retry button.
   */
  fallback?: React.ReactNode;
  /** Sentry-compatible error reporter. Called once per catch. */
  onError?: (error: Error, info: React.ErrorInfo) => void;
  /** Reset the boundary when any element changes identity (e.g. query key). */
  resetKeys?: unknown[];
}

interface BoundaryState {
  caught: boolean;
}

export class WidgetErrorBoundary extends React.Component<WidgetErrorBoundaryProps, BoundaryState> {
  state: BoundaryState = {caught: false};

  static getDerivedStateFromError(): BoundaryState {
    return {caught: true};
  }

  componentDidCatch(error: Error, info: React.ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  componentDidUpdate(prev: WidgetErrorBoundaryProps): void {
    if (!this.state.caught) return;
    const {resetKeys = []} = this.props;
    const prevKeys = (prev.resetKeys ?? []) as unknown[];
    if (resetKeys.some((k, i) => k !== prevKeys[i])) {
      this.setState({caught: false});
    }
  }

  private handleReset = (): void => {
    this.setState({caught: false});
  };

  render(): React.ReactNode {
    const {caught} = this.state;
    const {children, fallback} = this.props;

    if (!caught) return children;
    if (fallback != null) return fallback;

    return (
      <div className={styles.root} role="alert">
        <div className={styles.inner}>
          <div className={styles.icon}><SmallAlertIcon /></div>
          <p className={styles.title}>Could not load</p>
          <p className={styles.message}>An error occurred.</p>
          <div className={styles.retry}>
            <Button variant="secondary" size="sm" onClick={this.handleReset}>
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
