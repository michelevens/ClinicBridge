import { api } from './client';
import type { ClinicalNote, PaginatedResponse } from '@/types';

interface NoteFilters {
  patient_id?: number;
  provider_id?: number;
  status?: string;
  template_type?: string;
  page?: number;
  per_page?: number;
}

export const noteApi = {
  list(filters?: NoteFilters): Promise<PaginatedResponse<ClinicalNote>> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.set(key, String(value));
        }
      });
    }
    const query = params.toString();
    return api.get(`/notes${query ? `?${query}` : ''}`);
  },

  get(id: number): Promise<ClinicalNote> {
    return api.get(`/notes/${id}`);
  },

  create(data: {
    patient_id: number;
    appointment_id?: number;
    template_type: string;
    content: string;
    date_of_service: string;
    session_duration_minutes?: number;
    diagnosis_codes?: string[];
  }): Promise<ClinicalNote> {
    return api.post('/notes', data);
  },

  update(id: number, data: Partial<ClinicalNote>): Promise<ClinicalNote> {
    return api.put(`/notes/${id}`, data);
  },

  sign(id: number): Promise<ClinicalNote> {
    return api.post(`/notes/${id}/sign`);
  },

  amend(id: number, content: string, reason: string): Promise<ClinicalNote> {
    return api.post(`/notes/${id}/amend`, { content, amendment_reason: reason });
  },
};
