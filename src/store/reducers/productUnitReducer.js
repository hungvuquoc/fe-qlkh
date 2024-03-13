import {
  LOADING_PRODUCT_UNIT,
  SEARCH_PRODUCT_UNIT,
  OPEN_DIALOG_ADD_PRODUCT_UNIT,
  CLOSE_DIALOG_ADD_PRODUCT_UNIT,
} from '../constants/productUnitConstants';

const productUnitInitState = {
  loading: false,
  shouldOpenAddDialog: false,
  productUnits: [],
  productUnit: {
    name: null,
    code: null,
    deleted: false,
  },
  totalPages: 0,
};

const productUnitReducer = (state = productUnitInitState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT_UNIT:
      const newProductUnits = action ? action.data.content : state.productUnits;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        shouldOpenAddDialog: false,
        productUnits: newProductUnits,
        totalPages: newTotalPages,
      };
    case OPEN_DIALOG_ADD_PRODUCT_UNIT:
      return {
        ...state,
        shouldOpenAddDialog: true,
      };
    case CLOSE_DIALOG_ADD_PRODUCT_UNIT:
      return {
        ...state,
        shouldOpenAddDialog: false,
      };
    default:
      throw Error('Product Unit Invalid Actions');
  }
};

export { productUnitInitState };
export default productUnitReducer;
