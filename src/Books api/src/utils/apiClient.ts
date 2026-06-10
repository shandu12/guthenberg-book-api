/**
 * API client that automatically adds JWT token to requests
 * Used for making authenticated API calls
 */

export interface APIClientOptions extends RequestInit {
  params?: Record<string, string | number>;
}

export async function apiClient(
  url: string,
  options: APIClientOptions = {}
): Promise<Response> {
  const { params, ...fetchOptions } = options;

  // Build URL with query params
  let finalUrl = url;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    finalUrl = `${url}?${searchParams.toString()}`;
  }

  // Get token from localStorage (set by redux-persist)
  let token: string | null = null;
  
  if (typeof window !== 'undefined') {
    try {
      const persistedState = localStorage.getItem('persist:root');
      if (persistedState) {
        const state = JSON.parse(persistedState);
        const userState = JSON.parse(state.user);
        token = userState?.current?.token;
      }
    } catch (error) {
      console.error('Failed to get token from localStorage:', error);
    }
  }

  // Setup headers
  const headers = new Headers(fetchOptions.headers as HeadersInit);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(finalUrl, {
    ...fetchOptions,
    headers,
  });

  // If unauthorized, token may be expired
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      // Redirect to login
      window.location.href = '/user/login';
    }
  }

  return response;
}

/**
 * Helper for GET requests
 */
export async function apiGet<T>(url: string, options?: APIClientOptions): Promise<T> {
  const response = await apiClient(url, { ...options, method: 'GET' });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}

/**
 * Helper for POST requests
 */
export async function apiPost<T>(
  url: string,
  body?: unknown,
  options?: APIClientOptions
): Promise<T> {
  const response = await apiClient(url, {
    ...options,
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }
  return response.json();
}
