import { API_URL } from '../config';
import { axios } from '../utils/custom-axios';

import type { Response } from '../types/response';
import type { User } from '../types/user';

const getUserProfile = () => axios.get<Response<User>>(`${API_URL}me`);

const updateProfile = (data: Partial<User>) => axios.patch(`${API_URL}auth/profile`, data);

const UserService = {
  getUserProfile,
  updateProfile,
};

export default UserService;
