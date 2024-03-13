import {
  SEARCH_PRODUCT,
  OPEN_DIALOG_ADD_PRODUCT,
  CLOSE_DIALOG_ADD_PRODUCT,
  DELETE_PRODUCT,
} from '../constants/productConstants';

const ProductActions = {
  search: (data) => {
    return {
      type: SEARCH_PRODUCT,
      data,
    };
  },

  openDialog: () => {
    return {
      type: OPEN_DIALOG_ADD_PRODUCT,
      data: true,
    };
  },

  closeDialog: () => {
    return {
      type: CLOSE_DIALOG_ADD_PRODUCT,
      data: false,
    };
  },
  deleteById: (id) => {
    return {
      type: DELETE_PRODUCT,
      data: id,
    };
  },
};

export default ProductActions;
