import axiosClient from '~/axiosClient';

const ROUTE_LOGIN = '/api/login';
const ROUTE_GET_INFO = '/user';

const SecurityApi = {
  login: async (data) => {
    return await axiosClient.post(ROUTE_LOGIN, data);
  },
  getInfo: async () => {
    return await axiosClient.get(ROUTE_GET_INFO);
  },
};

export default SecurityApi;
