import {useRef, useCallback, useSyncExternalStore} from 'react';

/** A single field's validation contract. Schema-agnostic, no data layer. */
export interface FieldRules {
  required?: boolean | string;
  pattern?: {value: RegExp; message: string};
  /** Custom validator. Return an error string, or undefined when valid. */
  validate?: (value: unknown, values: Record<string, unknown>) => string | undefined;
}

interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string | undefined>;
  touched: Record<string, boolean>;
  submitCount: number;
}

const isEmpty = (v: unknown): boolean =>
  v == null || v === '' || (Array.isArray(v) && v.length === 0);

/** Coerce a stored value into something a native input accepts as defaultValue. */
const toInputValue = (v: unknown): string | number | readonly string[] | undefined => {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return v;
  if (Array.isArray(v) && v.every((x): x is string => typeof x === 'string')) return v;
  return String(v);
};

/**
 * Minimal external store. Field components subscribe to their own slice via
 * useSyncExternalStore, so a keystroke re-renders only the field that changed,
 * never the whole form. No context re-render churn, no data layer.
 */
class FormStore {
  state: FormState;
  rules: Record<string, FieldRules> = {};
  private listeners = new Set<() => void>();

  constructor(initial: Record<string, unknown>) {
    this.state = {values: {...initial}, errors: {}, touched: {}, submitCount: 0};
  }

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => {
      this.listeners.delete(fn);
    };
  };

  private emit(): void {
    this.listeners.forEach((l) => l());
  }

  getValue = (name: string): unknown => this.state.values[name];
  getError = (name: string): string | undefined => this.state.errors[name];

  setValue(name: string, value: unknown): void {
    const errors = this.state.errors[name]
      ? {...this.state.errors, [name]: this.runField(name, value)}
      : this.state.errors;
    this.state = {...this.state, values: {...this.state.values, [name]: value}, errors};
    this.emit();
  }

  setTouched(name: string): void {
    this.state = {...this.state, touched: {...this.state.touched, [name]: true}};
    this.emit();
  }

  setErrors(errs: Record<string, string>): void {
    this.state = {...this.state, errors: {...this.state.errors, ...errs}};
    this.emit();
  }

  reset(initial: Record<string, unknown>): void {
    this.state = {values: {...initial}, errors: {}, touched: {}, submitCount: 0};
    this.emit();
  }

  runField(name: string, value: unknown): string | undefined {
    const r = this.rules[name];
    if (!r) return undefined;
    if (r.required && isEmpty(value)) {
      return typeof r.required === 'string' ? r.required : 'This field is required.';
    }
    if (r.pattern && typeof value === 'string' && value !== '' && !r.pattern.value.test(value)) {
      return r.pattern.message;
    }
    if (r.validate) return r.validate(value, this.state.values);
    return undefined;
  }

  validateAll(): Record<string, string> {
    const errors: Record<string, string> = {};
    for (const name of Object.keys(this.rules)) {
      const e = this.runField(name, this.state.values[name]);
      if (e) errors[name] = e;
    }
    this.state = {...this.state, errors, submitCount: this.state.submitCount + 1};
    this.emit();
    return errors;
  }
}

/**
 * Props produced by register(), spreadable onto @sonarmd field components.
 *
 * The binding is uncontrolled: it seeds the input with `defaultValue` and syncs
 * every change into the store, so the field owns its own text and never freezes
 * waiting on a parent re-render. Live value/error for a single field comes from
 * the subscribing `useField(name)`; submit-time errors surface through the
 * subscribed `FormErrorSummary`.
 */
export interface FieldBinding {
  name: string;
  defaultValue: string | number | readonly string[] | undefined;
  onChange: (arg: unknown) => void;
  onBlur: () => void;
}

export interface UseFormReturn<T extends Record<string, unknown>> {
  /** Bind a field by name (and optionally its rules). */
  register: (name: keyof T & string, rules?: FieldRules) => FieldBinding;
  /** Subscribe to a single field's {value, error} (field-local re-render). */
  useField: (name: keyof T & string) => {value: unknown; error: string | undefined};
  /** Wrap your submit handler; runs validation first. */
  handleSubmit: (onValid: (values: T) => void | Promise<void>) => (e?: {preventDefault: () => void}) => void;
  /** Inject server-side errors without any data layer. */
  setErrors: (errs: Partial<Record<keyof T & string, string>>) => void;
  /** Current errors snapshot (for an error summary). */
  getErrors: () => Record<string, string | undefined>;
  reset: () => void;
  store: FormStore;
}

export function useForm<T extends Record<string, unknown>>(
  opts: {defaultValues?: Partial<T>} = {},
): UseFormReturn<T> {
  const initial = (opts.defaultValues ?? {}) as Record<string, unknown>;
  const storeRef = useRef<FormStore | null>(null);
  if (storeRef.current === null) storeRef.current = new FormStore(initial);
  const store = storeRef.current;

  const register = useCallback(
    (name: keyof T & string, rules?: FieldRules): FieldBinding => {
      if (rules) store.rules[name] = rules;
      return {
        name,
        defaultValue: toInputValue(store.getValue(name)),
        onChange: (arg: unknown) => {
          const next =
            arg && typeof arg === 'object' && 'target' in (arg as object)
              ? (arg as {target: HTMLInputElement}).target.value
              : arg;
          store.setValue(name, next);
        },
        onBlur: () => store.setTouched(name),
      };
    },
    [store],
  );

  const useFieldHook = (name: keyof T & string) => {
    const value = useSyncExternalStore(store.subscribe, () => store.getValue(name));
    const error = useSyncExternalStore(store.subscribe, () => store.getError(name));
    return {value, error};
  };

  const handleSubmit = useCallback(
    (onValid: (values: T) => void | Promise<void>) => (e?: {preventDefault: () => void}) => {
      e?.preventDefault();
      const errs = store.validateAll();
      if (Object.keys(errs).length === 0) {
        void onValid(store.state.values as T);
      }
    },
    [store],
  );

  const setErrors = useCallback(
    (errs: Partial<Record<keyof T & string, string>>) =>
      store.setErrors(errs as Record<string, string>),
    [store],
  );

  const getErrors = useCallback(() => store.state.errors, [store]);
  const reset = useCallback(() => store.reset(initial), [store, initial]);

  return {register, useField: useFieldHook, handleSubmit, setErrors, getErrors, reset, store};
}
