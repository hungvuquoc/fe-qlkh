import {
  SEARCH_WAREHOUSE,
  OPEN_DIALOG_ADD_WAREHOUSE,
  CLOSE_DIALOG_ADD_WAREHOUSE,
} from '../constants/warehouseConstants';

const WarehouseActions = {
  search: (data) => {
    return {
      type: SEARCH_WAREHOUSE,
      data,
    };
  },

  openDialogAdd: () => {
    return {
      type: OPEN_DIALOG_ADD_WAREHOUSE,
      data: true,
    };
  },

  closeDialogAdd: () => {
    return {
      type: CLOSE_DIALOG_ADD_WAREHOUSE,
      data: false,
    };
  },
};

export default WarehouseActions;
