import {useCallback, useReducer} from 'react';

export type MutationStatus = 'idle' | 'loading' | 'success' | 'error';

export interface MutationState<T> {
  status: MutationStatus;
  data: T | undefined;
  error: Error | undefined;
}

export interface MutationResult<T, V> extends MutationState<T> {
  mutate: (vars: V) => Promise<T>;
  reset: () => void;
}

export interface MutationOptions<T, V> {
  onSuccess?: (data: T, vars: V) => void;
  onError?: (error: Error, vars: V) => void;
}

type Action<T> =
  | {type: 'loading'}
  | {type: 'success'; data: T}
  | {type: 'error'; error: Error}
  | {type: 'reset'};

function reducer<T>(state: MutationState<T>, action: Action<T>): MutationState<T> {
  switch (action.type) {
    case 'loading':
      return {status: 'loading', data: undefined, error: undefined};
    case 'success':
      return {status: 'success', data: action.data, error: undefined};
    case 'error':
      return {status: 'error', data: undefined, error: action.error};
    case 'reset':
      return {status: 'idle', data: undefined, error: undefined};
    default:
      return state;
  }
}

export function useMutation<T, V = void>(
  mutator: (vars: V) => Promise<T>,
  options: MutationOptions<T, V> = {},
): MutationResult<T, V> {
  const {onSuccess, onError} = options;
  const [state, dispatch] = useReducer(reducer<T>, {
    status: 'idle',
    data: undefined,
    error: undefined,
  });

  const mutate = useCallback(
    async (vars: V): Promise<T> => {
      dispatch({type: 'loading'});
      try {
        const data = await mutator(vars);
        dispatch({type: 'success', data});
        onSuccess?.(data, vars);
        return data;
      } catch (raw) {
        const error = raw instanceof Error ? raw : new Error(String(raw));
        dispatch({type: 'error', error});
        onError?.(error, vars);
        throw error;
      }
    },
    [mutator, onSuccess, onError],
  );

  const reset = useCallback(() => dispatch({type: 'reset'}), []);

  return {...state, mutate, reset};
}
