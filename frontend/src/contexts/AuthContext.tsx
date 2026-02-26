import { createContext, useCallback, useEffect, useState, type ReactNode } from 'react';
import { api } from '@/services/api/client';
import type { AuthResponse, LoginCredentials, RegisterData, User, Practice } from '@/types';

interface AuthState {
  user: User | null;
  practice: Practice | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    practice: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const refreshUser = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    const data = await api.post<AuthResponse>('/auth/login', credentials);
    setState({
      user: data.user,
      practice: data.practice,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await api.post<AuthResponse>('/auth/register', data);
    setState({
      user: response.user,
      practice: response.practice,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await api.post('/auth/logout');
    setState({
      user: null,
      practice: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}
