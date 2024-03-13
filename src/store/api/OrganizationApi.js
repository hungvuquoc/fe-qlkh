import axiosClient from '~/axiosClient';

const ROUTE = '/api/organization/';

const OrganizationApi = {
  getInfo: async () => {
    return await axiosClient.get(ROUTE + 'info');
  },

  update: async (data) => {
    return await axiosClient.put(ROUTE + 'info', data);
  },
};

export default OrganizationApi;
