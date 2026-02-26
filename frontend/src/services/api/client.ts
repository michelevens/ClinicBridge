import type { ApiError } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const BACKEND_URL = BASE_URL.replace(/\/api$/, '');

class HttpError extends Error {
  status: number;
  data: ApiError;

  constructor(status: number, data: ApiError) {
    super(data.message);
    this.name = 'HttpError';
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new HttpError(response.status, data);
  }

  return data as T;
}

async function getCsrfCookie(): Promise<void> {
  await fetch(`${BACKEND_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

export const api = {
  csrfCookie: getCsrfCookie,

  get<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'GET' });
  },

  post<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  put<T>(endpoint: string, body?: unknown): Promise<T> {
    return request<T>(endpoint, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    });
  },

  delete<T>(endpoint: string): Promise<T> {
    return request<T>(endpoint, { method: 'DELETE' });
  },
};

export { HttpError };
