import {
  LOADING_PRODUCT_GROUP,
  SEARCH_PRODUCT_GROUP,
  OPEN_DIALOG_ADD_PRODUCT_GROUP,
  CLOSE_DIALOG_ADD_PRODUCT_GROUP,
} from '../constants/productGroupConstants';

const productGroupInitState = {
  loading: false,
  shouldOpenAddDialog: false,
  productGroups: [],
  productGroup: {
    name: null,
    code: null,
    deleted: false,
  },
  totalPages: 0,
};

const productGroupReducer = (state = productGroupInitState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT_GROUP:
      const newProductGroups = action ? action.data.content : state.productGroups;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        shouldOpenAddDialog: false,
        productGroups: newProductGroups,
        totalPages: newTotalPages,
      };
    case OPEN_DIALOG_ADD_PRODUCT_GROUP:
      return {
        ...state,
        shouldOpenAddDialog: true,
      };
    case CLOSE_DIALOG_ADD_PRODUCT_GROUP:
      return {
        ...state,
        shouldOpenAddDialog: false,
      };
    default:
      throw Error('Product Group Invalid Actions');
  }
};

export { productGroupInitState };
export default productGroupReducer;
