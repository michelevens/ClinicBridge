import type { ApiError } from '@/types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'clinicbridge_token';

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

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const token = getToken();

  const headers: HeadersInit = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      clearToken();
    }
    throw new HttpError(response.status, data);
  }

  return data as T;
}

export const api = {
  setToken,
  clearToken,
  getToken,

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
