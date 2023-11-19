import { create, StoreApi, UseBoundStore } from 'zustand';
import { devtools } from 'zustand/middleware';

import { AuthSlice, TAuthSlice, initialState as authInitialState } from './slices/auth';
import { UserSlice, TUserSlice, initialState as userInitialState } from './slices/user';

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never;

const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(_store: S) => {
  let store = _store as WithSelectors<typeof _store>;
  store.use = {};
  for (let k of Object.keys(store.getState())) {
    (store.use as any)[k] = () => store((s) => s[k as keyof typeof s]);
  }

  return store;
};

export interface TCommonActions {
  logout: () => void;
}

const useBoundStoreBase = create<TUserSlice & TCommonActions & TAuthSlice>()(
  devtools((...a) => ({
    ...UserSlice(...a),
    ...AuthSlice(...a),
    logout: () => {
      localStorage.clear();
      a[0]({ ...authInitialState, ...userInitialState });
    },
  }))
);

const useBoundStore = createSelectors(useBoundStoreBase);

export default useBoundStore;
