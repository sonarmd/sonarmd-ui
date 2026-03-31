import React, {useMemo, useCallback} from 'react';
import styles from './KpiCard.module.css';

export interface KpiCardTrend {
  direction: 'up' | 'down' | 'flat';
  value: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
}

export interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: KpiCardTrend;
  icon?: React.ReactNode;
  isLoading?: boolean;
  onClick?: () => void;
  className?: string;
}

const TREND_SYMBOL: Record<KpiCardTrend['direction'], string> = {
  up: '↑',
  down: '↓',
  flat: '→',
};

function trendSentimentClass(trend: KpiCardTrend): string {
  const sentiment = trend.sentiment ?? 'neutral';
  if (sentiment === 'positive') return styles.positive;
  if (sentiment === 'negative') return styles.negative;
  return styles.neutral;
}

export const KpiCard = React.memo(function KpiCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  isLoading,
  onClick,
  className,
}: KpiCardProps): JSX.Element {
  const isInteractive = Boolean(onClick);

  const cardClasses = useMemo(
    () =>
      [
        styles.card,
        isInteractive ? styles.interactive : undefined,
        className,
      ]
        .filter(Boolean)
        .join(' '),
    [isInteractive, className],
  );

  const trendDisplay = useMemo(() => {
    if (!trend) return null;
    return {
      symbol: TREND_SYMBOL[trend.direction],
      sentimentClass: trendSentimentClass(trend),
    };
  }, [trend]);

  const handleClick = useCallback(() => {
    onClick?.();
  }, [onClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>): void => {
      if (onClick && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        onClick();
      }
    },
    [onClick],
  );

  if (isLoading) {
    return (
      <div className={cardClasses}>
        <div className={styles.header}>
          <div className={styles.skeletonTitle} />
        </div>
        <div className={styles.skeletonValue} />
      </div>
    );
  }

  return (
    <div
      className={cardClasses}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? handleClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
    >
      <div className={styles.header}>
        <span className={styles.title}>{title}</span>
        {icon && <span className={styles.icon}>{icon}</span>}
      </div>
      <span className={styles.value}>{value}</span>
      {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      {trendDisplay && trend && (
        <span className={[styles.trend, trendDisplay.sentimentClass].join(' ')}>
          {trendDisplay.symbol} {trend.value}
        </span>
      )}
    </div>
  );
});
