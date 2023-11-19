import axios, { AxiosInstance } from 'axios';
import _ from 'lodash';

import useBoundStore from '../store';

let callback401: (error: any) => void = () => {
  useBoundStore.use.logout();
};

export function set401Callback(cb: any) {
  callback401 = cb;
}

const axiosInstance: AxiosInstance = axios.create();

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (!_.isEmpty(response) && response.status === 401 && !_.isNull(callback401)) {
      callback401(response.data.error);
    }

    return Promise.reject(error);
  }
);

axiosInstance.interceptors.request.use(
  (config: any) => {
    config.headers.authorization = `Bearer ${JSON.parse(localStorage.getItem('token') as string)}`;
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Credentials'] = 'true';
    config.headers['Access-Control-Max-Age'] = '1800';
    config.headers['Access-Control-Allow-Headers'] =
      'Content-Type, X-Auth-Token, Origin, Authorization';
    config.headers['Access-Control-Allow-Methods'] = 'PUT, POST, GET, DELETE, PATCH, OPTIONS';
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export { axiosInstance as axios };
