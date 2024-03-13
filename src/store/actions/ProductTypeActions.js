import {
  SEARCH_PRODUCT_TYPE,
  OPEN_DIALOG_ADD_PRODUCT_TYPE,
  CLOSE_DIALOG_ADD_PRODUCT_TYPE,
} from '../constants/productTypeConstants';

const ProductTypeActions = {
  search: (data) => {
    return {
      type: SEARCH_PRODUCT_TYPE,
      data,
    };
  },

  openDialogAdd: () => {
    return {
      type: OPEN_DIALOG_ADD_PRODUCT_TYPE,
      data: true,
    };
  },

  closeDialogAdd: () => {
    return {
      type: CLOSE_DIALOG_ADD_PRODUCT_TYPE,
      data: false,
    };
  },
};

export default ProductTypeActions;
