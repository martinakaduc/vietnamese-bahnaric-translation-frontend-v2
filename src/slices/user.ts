import { StateCreator } from 'zustand';

import AuthService from '../service/auth.service';

import { TAuthSlice } from './auth';

import type { User } from '../types';

export interface TUserState extends User {}

export interface TUserActions {
  getUserProfile: () => Promise<void>;
}

export interface TUserSlice extends TUserActions {
  user: TUserState;
}

export const initialState: TUserState = {
  settings: {
    region: 'binhdinh',
  },
  _id: '',
  name: '',
  username: '',
  password: '',
};

export const UserSlice: StateCreator<
  TUserSlice & TAuthSlice,
  [['zustand/devtools', never]],
  [],
  TUserSlice
> = (set) => ({
  user: initialState,
  getUserProfile: async () => {
    try {
      const { data } = await AuthService.getUser();
      set((state) => ({
        user: {
          ...state.user,
          settings: data.payload?.settings,
          username: data.payload?.username,
          name: data.payload?.name,
          _id: data.payload?._id,
          password: data.payload?.password,
        },
        isAuthenticated: true,
      }));
    } catch (error: any) {
      set({ user: { ...initialState }, isAuthenticated: false });
    }
  },
});
