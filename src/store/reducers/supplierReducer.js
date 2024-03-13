import {
  LOADING_SUPPLIER,
  SEARCH_SUPPLIER,
  OPEN_DIALOG_ADD_SUPPLIER,
  CLOSE_DIALOG_ADD_SUPPLIER,
} from '../constants/supplierConstants';

const supplierInitState = {
  loading: false,
  shouldOpenAddDialog: false,
  suppliers: [],
  supplier: {
    name: null,
    code: null,
    deleted: false,
  },
  totalPages: 0,
};

const supplierReducer = (state = supplierInitState, action) => {
  switch (action.type) {
    case SEARCH_SUPPLIER:
      const newSuppliers = action ? action.data.content : state.suppliers;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        shouldOpenAddDialog: false,
        suppliers: newSuppliers,
        totalPages: newTotalPages,
      };
    case OPEN_DIALOG_ADD_SUPPLIER:
      return {
        ...state,
        shouldOpenAddDialog: true,
      };
    case CLOSE_DIALOG_ADD_SUPPLIER:
      return {
        ...state,
        shouldOpenAddDialog: false,
      };
    default:
      throw Error('Supplier Invalid Actions');
  }
};

export { supplierInitState };
export default supplierReducer;
