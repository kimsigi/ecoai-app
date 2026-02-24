import { create } from 'zustand';
import { AuthState } from './auth.type';

export const useAuthStore = create<AuthState>(set => ({
    accessToken: null,
    setToken: token => set({ accessToken: token }),
}));
