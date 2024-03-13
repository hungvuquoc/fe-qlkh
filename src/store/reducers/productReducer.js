import {
  LOADING_PRODUCT,
  SEARCH_PRODUCT,
  OPEN_DIALOG_ADD_PRODUCT,
  CLOSE_DIALOG_ADD_PRODUCT,
  DELETE_PRODUCT,
} from '../constants/productConstants';

const productInitState = {
  loading: false,
  shouldOpenAddDialog: false,
  products: [],
  product: {
    name: null,
    description: null,
    price: null,
    quantityStock: null,
    unit: null,
  },
  totalPages: 0,
};

const productReducer = (state = productInitState, action) => {
  switch (action.type) {
    case SEARCH_PRODUCT:
      const newProducts = action ? action.data.content : state.products;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        shouldOpenAddDialog: false,
        products: newProducts,
        totalPages: newTotalPages,
      };
    case OPEN_DIALOG_ADD_PRODUCT:
      return {
        ...state,
        shouldOpenAddDialog: true,
      };
    case CLOSE_DIALOG_ADD_PRODUCT:
      return {
        ...state,
        shouldOpenAddDialog: false,
      };
    default:
      throw Error('Product Invalid Actions');
  }
};

export { productInitState };
export default productReducer;
