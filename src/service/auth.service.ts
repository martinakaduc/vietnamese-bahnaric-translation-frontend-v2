// import { useBoundStore, usePersistStore } from '../store';
import { BAHNAR_API_URL } from '../config';
import { ResponseData, User } from '../types';
import { axios } from '../utils/custom-axios';

const signUp = (username: string, password: string) => {
  return axios.post<string>(`${BAHNAR_API_URL}auth/signup`, { username, password });
};

const login = (username?: string, password?: string) => {
  return axios.post<
    ResponseData<{
      token: string;
    }>
  >(`${BAHNAR_API_URL}auth/login`, {
    username,
    password,
  });
};

const getUser = () => {
  return axios.get<ResponseData<User>>(`${BAHNAR_API_URL}auth/profile`);
};

const updateProfile = () => (data: Partial<User>) => {
  return axios.patch('/auth/profile', data);
};

const AuthService = {
  signUp,
  login,
  getUser,
  updateProfile,
};

export default AuthService;
