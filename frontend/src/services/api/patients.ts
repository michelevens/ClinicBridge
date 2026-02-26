import { api } from './client';
import type { Patient, PaginatedResponse } from '@/types';

interface PatientFilters {
  search?: string;
  status?: string;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  per_page?: number;
}

export const patientApi = {
  list(filters?: PatientFilters): Promise<PaginatedResponse<Patient>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });
    }
    const query = params.toString();
    return api.get(`/patients${query ? `?${query}` : ''}`);
  },

  get(id: number): Promise<Patient> {
    return api.get(`/patients/${id}`);
  },

  create(data: Partial<Patient>): Promise<Patient> {
    return api.post('/patients', data);
  },

  update(id: number, data: Partial<Patient>): Promise<Patient> {
    return api.put(`/patients/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.delete(`/patients/${id}`);
  },
};
