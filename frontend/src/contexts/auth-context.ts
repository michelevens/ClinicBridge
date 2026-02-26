import { createContext } from 'react';
import type { LoginCredentials, RegisterData, User, Practice } from '@/types';

export interface AuthState {
  user: User | null;
  practice: Practice | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
