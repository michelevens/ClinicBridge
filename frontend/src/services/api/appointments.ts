import { api } from './client';
import type { Appointment, AppointmentTypeConfig } from '@/types';

interface AppointmentFilters {
  date?: string;
  start_date?: string;
  end_date?: string;
  provider_id?: number;
  patient_id?: number;
  status?: string;
}

export const appointmentApi = {
  list(filters?: AppointmentFilters): Promise<Appointment[]> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });
    }
    const query = params.toString();
    return api.get(`/appointments${query ? `?${query}` : ''}`);
  },

  get(id: number): Promise<Appointment> {
    return api.get(`/appointments/${id}`);
  },

  create(data: Partial<Appointment>): Promise<Appointment> {
    return api.post('/appointments', data);
  },

  update(id: number, data: Partial<Appointment>): Promise<Appointment> {
    return api.put(`/appointments/${id}`, data);
  },

  cancel(id: number): Promise<void> {
    return api.delete(`/appointments/${id}`);
  },

  checkIn(id: number): Promise<Appointment> {
    return api.post(`/appointments/${id}/check-in`);
  },

  complete(id: number): Promise<Appointment> {
    return api.post(`/appointments/${id}/complete`);
  },
};

export const appointmentTypeApi = {
  list(): Promise<AppointmentTypeConfig[]> {
    return api.get('/appointment-types');
  },

  create(data: Partial<AppointmentTypeConfig>): Promise<AppointmentTypeConfig> {
    return api.post('/appointment-types', data);
  },

  update(id: number, data: Partial<AppointmentTypeConfig>): Promise<AppointmentTypeConfig> {
    return api.put(`/appointment-types/${id}`, data);
  },

  delete(id: number): Promise<void> {
    return api.delete(`/appointment-types/${id}`);
  },
};
