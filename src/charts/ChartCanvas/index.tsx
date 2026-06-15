import React, {useCallback, useEffect, useRef} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {echarts, type ECOption} from '../echartsCore';
import {useThrottle} from '../../hooks/useThrottle';
import {Skeleton} from '../../components/Skeleton';
import {EmptyState} from '../../components/EmptyState';
import styles from './ChartCanvas.module.css';

export interface ChartCanvasProps {
  /** A fully built echarts option object. */
  option: ECOption;
  /** Canvas height in px. */
  height?: number;
  isLoading?: boolean;
  isEmpty?: boolean;
  emptyMessage?: string;
  /** Raw echarts click event; the chart maps it back to its datum. */
  onClick?: (params: ECElementEvent) => void;
  className?: string;
}

const cx = (...parts: Array<string | undefined>): string => parts.filter(Boolean).join(' ');

/**
 * The one place echarts is initialised, resized, themed, and disposed. Each
 * chart component is reduced to its option builder plus this element. A callback
 * ref owns the instance lifecycle so init/dispose track the canvas node across
 * loading and empty transitions without a stale effect.
 */
export const ChartCanvas = React.memo(function ChartCanvas({
  option,
  height = 400,
  isLoading = false,
  isEmpty = false,
  emptyMessage,
  onClick,
  className,
}: ChartCanvasProps): JSX.Element {
  const instanceRef = useRef<ReturnType<typeof echarts.init> | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  // Keep the latest option/onClick without re-initialising the instance.
  const optionRef = useRef(option);
  optionRef.current = option;
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  const throttledResize = useThrottle(() => instanceRef.current?.resize(), 200);

  const attach = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) {
        const chart = echarts.init(el, 'sonarmd', {renderer: 'canvas'});
        instanceRef.current = chart;
        chart.on('click', (params) => onClickRef.current?.(params as ECElementEvent));
        chart.setOption(optionRef.current, {notMerge: true, lazyUpdate: true});
        const observer = new ResizeObserver(throttledResize);
        observer.observe(el);
        observerRef.current = observer;
      } else {
        observerRef.current?.disconnect();
        observerRef.current = null;
        instanceRef.current?.dispose();
        instanceRef.current = null;
      }
    },
    [throttledResize],
  );

  useEffect(() => {
    instanceRef.current?.setOption(option, {notMerge: true, lazyUpdate: true});
  }, [option]);

  if (isLoading) {
    return (
      <div className={cx(styles.root, className)}>
        <Skeleton variant="rect" width="100%" height={height} />
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className={cx(styles.root, className)}>
        <EmptyState title={emptyMessage ?? 'No data available'} />
      </div>
    );
  }

  return <div ref={attach} className={cx(styles.root, className)} style={{height, width: '100%'}} />;
});

ChartCanvas.displayName = 'ChartCanvas';
