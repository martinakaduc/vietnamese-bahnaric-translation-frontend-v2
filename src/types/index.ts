export type ResponseData<T> = {
  success: boolean;
  code: number;
  message: string;
  payload: T;
};

export type Region = 'binhdinh' | 'kontum' | 'gialai';

// export type Translate = {
//   _id?: string;
//   src: string;
//   tgt: string;
//   isFavorite?: boolean;
//   userId: string;
//   createdAt: number;
//   deletedAt?: number;
// };

export type Translate = {
  payload: {
    src: string;
    tgt: string;
  };
};

export type SavedTranslation = {
  _id: string;
  src: string;
  tgt: string;
  userId: string;
  createdAt: number;
  __v: number;
  isFavorite?: boolean;
};

export type User = {
  settings: {
    region: string;
  };
  _id: string;
  name: string;
  username: string;
  password: string;
};

export type Profile = Omit<User, 'settings' | 'password'>;

export type Settings = User['settings'];

export type CountTranslation = {
  total: number;
  favorite: number;
};
