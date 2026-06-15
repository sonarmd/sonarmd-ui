import React, {useCallback, useEffect, useRef} from 'react';
import type {ECElementEvent} from 'echarts/core';
import {echarts, type ECOption} from '../echartsCore';
import {chartChrome, type ChartTheme} from '../chartTheme';
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

/** Resolve the active theme from the document attribute, falling back to the OS
 *  preference when no attribute is set (mirrors tokens.css). */
const currentTheme = (): ChartTheme => {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'dark' || attr === 'light') return attr;
  return typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
};

/**
 * The one place echarts is initialised, resized, themed, and disposed. Each
 * chart component is reduced to its option builder plus this element. A callback
 * ref owns the instance lifecycle so init/dispose track the canvas node across
 * loading and empty transitions without a stale effect. Theme chrome is layered
 * via setOption (no re-instantiation) and re-applied when data-theme changes.
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
  const resizeObsRef = useRef<ResizeObserver | null>(null);
  const themeObsRef = useRef<MutationObserver | null>(null);
  const mqlRef = useRef<MediaQueryList | null>(null);
  // Keep the latest option/onClick without re-initialising the instance.
  const optionRef = useRef(option);
  optionRef.current = option;
  const onClickRef = useRef(onClick);
  onClickRef.current = onClick;

  const throttledResize = useThrottle(() => instanceRef.current?.resize(), 200);

  const applyChrome = useCallback(() => {
    const chart = instanceRef.current;
    if (!chart) return;
    const opt = optionRef.current as Record<string, unknown>;
    const hasAxes = !!opt && ('xAxis' in opt || 'yAxis' in opt);
    chart.setOption(chartChrome(currentTheme(), hasAxes));
  }, []);

  const attach = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) {
        const chart = echarts.init(el, 'sonarmd', {renderer: 'canvas'});
        instanceRef.current = chart;
        chart.on('click', (params) => onClickRef.current?.(params as ECElementEvent));
        chart.setOption(optionRef.current, {notMerge: true, lazyUpdate: true});
        applyChrome();

        const resizeObs = new ResizeObserver(throttledResize);
        resizeObs.observe(el);
        resizeObsRef.current = resizeObs;

        // Re-theme in place when the document theme attribute changes.
        if (typeof MutationObserver !== 'undefined') {
          const themeObs = new MutationObserver(applyChrome);
          themeObs.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']});
          themeObsRef.current = themeObs;
        }
        // ...and when the OS preference changes while no attribute is set.
        if (typeof matchMedia !== 'undefined') {
          const mql = matchMedia('(prefers-color-scheme: dark)');
          mql.addEventListener('change', applyChrome);
          mqlRef.current = mql;
        }
      } else {
        resizeObsRef.current?.disconnect();
        resizeObsRef.current = null;
        themeObsRef.current?.disconnect();
        themeObsRef.current = null;
        mqlRef.current?.removeEventListener('change', applyChrome);
        mqlRef.current = null;
        instanceRef.current?.dispose();
        instanceRef.current = null;
      }
    },
    [throttledResize, applyChrome],
  );

  useEffect(() => {
    // notMerge replaces the option, wiping prior chrome - re-apply it.
    instanceRef.current?.setOption(option, {notMerge: true, lazyUpdate: true});
    applyChrome();
  }, [option, applyChrome]);

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
