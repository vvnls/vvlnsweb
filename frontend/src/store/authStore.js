import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set) => ({
  user: null,
  status: 'idle', // idle | loading | ready

  async fetchMe() {
    set({ status: 'loading' });
    try {
      const { data } = await api.get('/auth/me');
      set({ user: data.user, status: 'ready' });
    } catch {
      set({ user: null, status: 'ready' });
    }
  },

  async login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    set({ user: data.user, status: 'ready' });
    return data.user;
  },

  async logout() {
    await api.post('/auth/logout');
    set({ user: null });
  },
}));