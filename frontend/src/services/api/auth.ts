import { api } from './client';
import type { AuthResponse, LoginCredentials, RegisterData } from '@/types';

export const authApi = {
  register(data: RegisterData): Promise<AuthResponse> {
    return api.post('/auth/register', data);
  },

  login(credentials: LoginCredentials): Promise<AuthResponse> {
    return api.post('/auth/login', credentials);
  },

  logout(): Promise<void> {
    return api.post('/auth/logout');
  },

  me(): Promise<AuthResponse> {
    return api.get('/auth/me');
  },

  forgotPassword(email: string): Promise<{ message: string }> {
    return api.post('/auth/forgot-password', { email });
  },
};
