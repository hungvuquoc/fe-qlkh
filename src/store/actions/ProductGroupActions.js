import {
  SEARCH_PRODUCT_GROUP,
  OPEN_DIALOG_ADD_PRODUCT_GROUP,
  CLOSE_DIALOG_ADD_PRODUCT_GROUP,
} from '../constants/productGroupConstants';

const ProductGroupActions = {
  search: (data) => {
    return {
      type: SEARCH_PRODUCT_GROUP,
      data,
    };
  },

  openDialogAdd: () => {
    return {
      type: OPEN_DIALOG_ADD_PRODUCT_GROUP,
      data: true,
    };
  },

  closeDialogAdd: () => {
    return {
      type: CLOSE_DIALOG_ADD_PRODUCT_GROUP,
      data: false,
    };
  },
};

export default ProductGroupActions;
