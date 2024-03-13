import axiosClient from '~/axiosClient';

const ROUTE = '/api/wh-exports/';

const WhExportApi = {
  getById: async (id) => {
    return await axiosClient.get(ROUTE + id);
  },
  search: async (data) => {
    return await axiosClient.get(ROUTE + 'search', data);
  },
  add: async (data) => {
    return await axiosClient.post(ROUTE, data);
  },
  update: async (id, data) => {
    return await axiosClient.put(ROUTE + id, data);
  },
  deleteById: async (id) => {
    return await axiosClient.delete(ROUTE + id);
  },
};

export default WhExportApi;
