import { useEffect, useState, type ReactNode } from 'react';
import { api } from '@/services/api/client';
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types';
import { AuthContext, type AuthState } from './auth-context';

export { AuthContext } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    practice: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    let cancelled = false;
    api.get<AuthResponse>('/auth/me').then(
      (data) => {
        if (!cancelled) {
          setState({
            user: data.user,
            practice: data.practice,
            isAuthenticated: true,
            isLoading: false,
          });
        }
      },
      () => {
        if (!cancelled) {
          setState({
            user: null,
            practice: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      }
    );
    return () => {
      cancelled = true;
    };
  }, []);

  async function refreshUser() {
    try {
      const data = await api.get<AuthResponse>('/auth/me');
      setState({
        user: data.user,
        practice: data.practice,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      setState({
        user: null,
        practice: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }

  async function login(credentials: LoginCredentials) {
    await api.csrfCookie();
    const data = await api.post<AuthResponse>('/auth/login', credentials);
    setState({
      user: data.user,
      practice: data.practice,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  async function register(data: RegisterData) {
    await api.csrfCookie();
    const response = await api.post<AuthResponse>('/auth/register', data);
    setState({
      user: response.user,
      practice: response.practice,
      isAuthenticated: true,
      isLoading: false,
    });
  }

  async function logout() {
    await api.post('/auth/logout');
    setState({
      user: null,
      practice: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
