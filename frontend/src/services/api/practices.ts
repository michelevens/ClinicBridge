import { api } from './client';
import type { Practice, PracticeInvite, User } from '@/types';

export const practiceApi = {
  get(): Promise<Practice> {
    return api.get('/practice');
  },

  update(data: Partial<Practice>): Promise<Practice> {
    return api.put('/practice', data);
  },

  getStaff(): Promise<User[]> {
    return api.get('/practice/staff');
  },

  invite(data: { email: string; role: string }): Promise<PracticeInvite> {
    return api.post('/practice/invite', data);
  },

  getInvites(): Promise<PracticeInvite[]> {
    return api.get('/practice/invites');
  },

  revokeInvite(id: number): Promise<void> {
    return api.delete(`/practice/invites/${id}`);
  },

  updateStaffRole(userId: number, role: string): Promise<User> {
    return api.put(`/practice/staff/${userId}/role`, { role });
  },

  removeStaff(userId: number): Promise<void> {
    return api.delete(`/practice/staff/${userId}`);
  },
};
