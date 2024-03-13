import axiosClient from '~/axiosClient';

const ROUTE = '/api/national/';

const NationalApi = {
  search: async (data) => {
    return await axiosClient.post(ROUTE + 'search', data);
  },

  getById: async (id) => {
    return await axiosClient.get(ROUTE + id);
  },

  add: async (data) => {
    return await axiosClient.post(ROUTE, data);
  },

  update: async (data) => {
    return await axiosClient.put(ROUTE, data);
  },
};

export default NationalApi;
