import { SEARCH_SUPPLIER, OPEN_DIALOG_ADD_SUPPLIER, CLOSE_DIALOG_ADD_SUPPLIER } from '../constants/supplierConstants';

const SupplierActions = {
  search: (data) => {
    return {
      type: SEARCH_SUPPLIER,
      data,
    };
  },

  openDialogAdd: () => {
    return {
      type: OPEN_DIALOG_ADD_SUPPLIER,
      data: true,
    };
  },

  closeDialogAdd: () => {
    return {
      type: CLOSE_DIALOG_ADD_SUPPLIER,
      data: false,
    };
  },
};

export default SupplierActions;
