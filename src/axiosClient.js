import axios from 'axios';
import queryString from 'query-string';
import Configs from '~/appConfig';
import localStorageUtils, { ACCESS_TOKEN } from './utils/localStorageUtils';

// const axiosClient = axios.create({
//   baseURL: Configs.API_ENPOINT,
//   headers: {
//     'content-type': 'application/json',
//   },
//   paramsSerializer: (params) => queryString.stringify(params),
// });

const axiosClient = axios.create({
  baseURL: Configs.API_ENPOINT,
  paramsSerializer: (params) => queryString.stringify(params),
});
axiosClient.interceptors.request.use(async (config) => {
  // Handle token here ...
  const token = localStorageUtils.getSessionItem(ACCESS_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
axiosClient.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      if (response.status == 200) {
        return response.data;
      }
      const data = response.data;
      alert(data['message']);
    }
    return response;
  },
  (error) => {
    // Handle errors
    const data = error?.response?.data;
    if (data) {
      alert(data['message']);
    }
    throw error;
  },
);
export default axiosClient;
