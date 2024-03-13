import axiosClient from '~/axiosClient';

const ROUTE = '/api/warehouse/';

const WarehouseApi = {
  getMapPointHasProductByWarehouseId: async (id) => {
    return await axiosClient.get(ROUTE + id + '/map-points/has-product');
  },
  getMapPointHasProductBy: async (id, data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + id + '/search/map-points/has-product', params);
  },
  getProductTypeInStock: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'in-stock/product-types', params);
  },
  getProductInStock: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'in-stock/products', params);
  },
  getProductDetailInStockBy: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'in-stock/product-details', params);
  },
  getUnitInStockBy: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'in-stock/units', params);
  },
  getConsignmentInStockBy: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'in-stock/consignments', params);
  },
  getFloorDetailBy: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'in-stock/floor-details', params);
  },
  getQuantityInStock: async (data) => {
    return await axiosClient.post(ROUTE + 'search/quantity-in-stock', data);
  },
  getById: async (id, modifyDate) => {
    const params = { params: { modifyDate: modifyDate } };
    return await axiosClient.get(ROUTE + id, params);
  },
  getLocationsById: async (id) => {
    return await axiosClient.get(ROUTE + id + '/locations');
  },
  report: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'report', params);
  },
  card: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'card', params);
  },
  searchProductFloorDetail: async (data) => {
    const params = { params: data };
    return await axiosClient.get(ROUTE + 'location/search/product', params);
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
};

export default WarehouseApi;
