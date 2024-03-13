import {
  SEARCH_PRODUCT_UNIT,
  OPEN_DIALOG_ADD_PRODUCT_UNIT,
  CLOSE_DIALOG_ADD_PRODUCT_UNIT,
} from '../constants/productUnitConstants';

const ProductUnitActions = {
  search: (data) => {
    return {
      type: SEARCH_PRODUCT_UNIT,
      data,
    };
  },

  openDialogAdd: () => {
    return {
      type: OPEN_DIALOG_ADD_PRODUCT_UNIT,
      data: true,
    };
  },

  closeDialogAdd: () => {
    return {
      type: CLOSE_DIALOG_ADD_PRODUCT_UNIT,
      data: false,
    };
  },
};

export default ProductUnitActions;
