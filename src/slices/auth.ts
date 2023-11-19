import { StateCreator } from 'zustand';

export interface TAuthState {
  isAuthenticated: boolean;
  token: string;
}

export interface TAuthActions {
  setToken: (token: string) => void;
  logOut: () => void;
}

export interface TAuthSlice extends TAuthState, TAuthActions {}

const initializeState = (): TAuthState => ({
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token') || '',
});

export const initialState = {
  isAuthenticated: false,
  token: '',
};

export const AuthSlice: StateCreator<TAuthSlice, [['zustand/devtools', never]], [], TAuthSlice> = (
  set
) => ({
  ...initializeState(),
  setToken: (token) => {
    localStorage.setItem('token', JSON.stringify(token));
    set({ isAuthenticated: true, token });
  },
  logOut: () => {
    localStorage.removeItem('token');
    set({ isAuthenticated: false, token: '' });
  },
});
