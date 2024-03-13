import axiosClient from '~/axiosClient';

const ROUTE = '/api/product-unit/';

const ProductUnitApi = {
  getById: async (id) => {
    return await axiosClient.get(ROUTE + id);
  },
  getDefaultByProductId: async (id) => {
    return await axiosClient.get(ROUTE + "default/product/" + id);
  },
  search: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'search', params);
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

export default ProductUnitApi;
