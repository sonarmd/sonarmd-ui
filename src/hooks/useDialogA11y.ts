import {useCallback, useEffect, useRef} from 'react';

const FOCUSABLE_SELECTOR =
  'a, button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])';

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR));
}

export interface UseDialogA11yOptions {
  open: boolean;
  onClose: () => void;
  /** The portal element the dialog renders into; its body siblings are made inert. */
  portalEl: HTMLElement;
  /** Close on Escape. Default true. */
  closeOnEscape?: boolean;
}

export interface DialogA11y<T extends HTMLElement> {
  /** Attach to the dialog content element (focus trap root + focus target). */
  containerRef: React.RefObject<T | null>;
  /** Attach to onKeyDown of the dialog content to trap Tab focus. */
  onKeyDown: (e: React.KeyboardEvent<T>) => void;
}

/**
 * The shared accessibility behavior for modal overlays (Modal, Drawer): body
 * scroll lock, Escape-to-close, focus restoration, initial focus, background
 * inert containment, and a Tab focus trap. One implementation so dialog-like
 * surfaces never copy this logic. Reduced motion is handled centrally in CSS.
 */
export function useDialogA11y<T extends HTMLElement>({
  open,
  onClose,
  portalEl,
  closeOnEscape = true,
}: UseDialogA11yOptions): DialogA11y<T> {
  const containerRef = useRef<T | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);
  const focusableRef = useRef<HTMLElement[]>([]);

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Escape to close.
  useEffect(() => {
    if (!open || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, closeOnEscape, onClose]);

  // Remember the trigger and restore focus to it on close.
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement;
    } else {
      prevFocusRef.current?.focus();
    }
  }, [open]);

  // Focus the first focusable element on open; prime the trap cache.
  useEffect(() => {
    if (!open || !containerRef.current) return;
    focusableRef.current = getFocusableElements(containerRef.current);
    focusableRef.current[0]?.focus();
  }, [open]);

  // Contain assistive tech: mark every sibling of the dialog's portal inert
  // while open; restore exactly what this effect changed (nested dialogs compose).
  useEffect(() => {
    if (!open) return;
    const changed: HTMLElement[] = [];
    for (const node of Array.from(document.body.children)) {
      if (!(node instanceof HTMLElement) || node.contains(portalEl) || node === portalEl) continue;
      if (node.inert) continue;
      node.inert = true;
      node.setAttribute('aria-hidden', 'true');
      changed.push(node);
    }
    return () => {
      for (const node of changed) {
        node.inert = false;
        node.removeAttribute('aria-hidden');
      }
    };
  }, [open, portalEl]);

  const onKeyDown = useCallback((e: React.KeyboardEvent<T>) => {
    if (e.key !== 'Tab' || !containerRef.current) return;
    const focusable = focusableRef.current;
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  return {containerRef, onKeyDown};
}
