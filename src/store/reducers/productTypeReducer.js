import {
  LOADING_PRODUCT_TYPE,
  SEARCH_PRODUCT_TYPE,
  OPEN_DIALOG_ADD_PRODUCT_TYPE,
  CLOSE_DIALOG_ADD_PRODUCT_TYPE,
} from '../constants/productTypeConstants';

const productTypeInitState = {
  loading: false,
  shouldOpenAddDialog: false,
  productTypes: [],
  productType: {
    name: null,
    code: null,
    deleted: false,
  },
  totalPages: 0,
};

const productTypeReducer = (state = productTypeInitState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT_TYPE:
      const newProductTypes = action ? action.data.content : state.productTypes;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        shouldOpenAddDialog: false,
        productTypes: newProductTypes,
        totalPages: newTotalPages,
      };
    case OPEN_DIALOG_ADD_PRODUCT_TYPE:
      return {
        ...state,
        shouldOpenAddDialog: true,
      };
    case CLOSE_DIALOG_ADD_PRODUCT_TYPE:
      return {
        ...state,
        shouldOpenAddDialog: false,
      };
    default:
      throw Error('Product Type Invalid Actions');
  }
};

export { productTypeInitState };
export default productTypeReducer;
