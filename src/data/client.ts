export interface RetryPolicy {
  /** Max retry attempts (default 3). */
  attempts?: number;
  /**
   * Whether to retry non-idempotent methods (POST, DELETE, PATCH).
   * Default false.
   */
  retryMutation?: boolean;
}

export interface ApiClientConfig {
  baseUrl: string;
  /**
   * Returns headers to attach to every request (e.g. Authorization).
   * Called per-request so token refresh is automatic.
   */
  getHeaders?: () => Record<string, string> | Promise<Record<string, string>>;
  /**
   * Called when the server responds 401. Opportunity to redirect to login.
   */
  onUnauthorized?: () => void;
  retry?: RetryPolicy;
  /**
   * Override the global fetch (for testing or custom middleware).
   */
  fetch?: typeof globalThis.fetch;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
}

export interface ApiError extends Error {
  status: number;
  /** Sanitized URL template (path values replaced with :param). */
  urlTemplate: string;
  method: string;
}

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

const IDEMPOTENT: Set<Method> = new Set(['GET', 'PUT']);
const RETRYABLE_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

/**
 * Replace path segments that look like IDs (numeric or UUID-shaped) with :param
 * so error logs never contain real values. Query strings are dropped entirely.
 */
export function sanitizeUrl(url: string): string {
  try {
    // Dummy base lets relative URLs (e.g. baseUrl '/api') parse; only the
    // pathname is used, so the base host is irrelevant for absolute URLs too.
    const u = new URL(url, 'http://localhost');
    const sanitized = u.pathname
      .split('/')
      .map((seg) =>
        /^\d+$/.test(seg) || /^[0-9a-f-]{36}$/i.test(seg) ? ':param' : seg,
      )
      .join('/');
    return sanitized;
  } catch {
    return '<invalid-url>';
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

function backoffMs(attempt: number, retryAfterMs?: number): number {
  if (retryAfterMs != null) return retryAfterMs;
  // Exponential backoff with full jitter: [0, base * 2^attempt]
  const base = 200;
  const cap = 10_000;
  const window = Math.min(cap, base * Math.pow(2, attempt));
  return Math.random() * window;
}

function makeApiError(
  message: string,
  status: number,
  method: string,
  url: string,
): ApiError {
  const err = new Error(message) as ApiError;
  err.name = 'ApiError';
  err.status = status;
  err.urlTemplate = sanitizeUrl(url);
  err.method = method;
  return err;
}

export interface ApiClient {
  get<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>>;
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiResponse<T>>;
  put<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiResponse<T>>;
  patch<T>(path: string, body?: unknown, init?: RequestInit): Promise<ApiResponse<T>>;
  delete<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>>;
}

export function createApiClient(config: ApiClientConfig): ApiClient {
  const {
    baseUrl,
    getHeaders,
    onUnauthorized,
    retry = {},
    fetch: fetchImpl = globalThis.fetch,
  } = config;

  const maxAttempts = retry.attempts ?? 3;
  const retryMutation = retry.retryMutation ?? false;

  async function request<T>(
    method: Method,
    path: string,
    body?: unknown,
    signal?: AbortSignal,
    init?: RequestInit,
  ): Promise<ApiResponse<T>> {
    const url = baseUrl.replace(/\/$/, '') + path;
    const extraHeaders = getHeaders ? await getHeaders() : {};
    const canRetry = IDEMPOTENT.has(method) || retryMutation;

    // Normalize through the Headers API so a caller-supplied Headers instance or
    // array of [name, value] tuples in init.headers is preserved rather than
    // dropped by a plain-object spread (which would silently omit auth/tenant
    // headers). Precedence: Content-Type < getHeaders() < per-call init.headers.
    const headers = new Headers({'Content-Type': 'application/json'});
    for (const [name, value] of Object.entries(extraHeaders)) headers.set(name, value);
    if (init?.headers) {
      new Headers(init.headers).forEach((value, name) => headers.set(name, value));
    }

    let lastErr: ApiError | null = null;

    for (let attempt = 0; attempt <= maxAttempts; attempt++) {
      const res = await fetchImpl(url, {
        ...init,
        method,
        headers,
        body: body != null ? JSON.stringify(body) : undefined,
        signal,
      });

      if (res.status === 401) {
        onUnauthorized?.();
        throw makeApiError('Unauthorized', 401, method, url);
      }

      if (res.ok) {
        const data: T = res.status === 204 ? (null as T) : await res.json();
        return {data, status: res.status};
      }

      const shouldRetry = canRetry && RETRYABLE_STATUSES.has(res.status) && attempt < maxAttempts;
      lastErr = makeApiError(`Request failed`, res.status, method, url);

      if (!shouldRetry) break;

      const retryAfterHeader = res.headers.get('Retry-After');
      const retryAfterMs = retryAfterHeader ? parseInt(retryAfterHeader, 10) * 1000 : undefined;
      await sleep(backoffMs(attempt, retryAfterMs));
    }

    throw lastErr ?? makeApiError('Request failed', 0, method, url);
  }

  return {
    get<T>(path: string, init?: RequestInit) {
      return request<T>('GET', path, undefined, init?.signal ?? undefined, init);
    },
    post<T>(path: string, body?: unknown, init?: RequestInit) {
      return request<T>('POST', path, body, init?.signal ?? undefined, init);
    },
    put<T>(path: string, body?: unknown, init?: RequestInit) {
      return request<T>('PUT', path, body, init?.signal ?? undefined, init);
    },
    patch<T>(path: string, body?: unknown, init?: RequestInit) {
      return request<T>('PATCH', path, body, init?.signal ?? undefined, init);
    },
    delete<T>(path: string, init?: RequestInit) {
      return request<T>('DELETE', path, undefined, init?.signal ?? undefined, init);
    },
  };
}
