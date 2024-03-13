import { SEARCH_WH_INVENTORY } from '~/store/constants/wh-transactions/WhInventoryConstants';

const whInventoryInitState = {
  loading: false,
  whInventorys: [],
  whInventory: {
    warehouseName: null,
    code: null,
    documentNumber: null,
    documentDate: null,
    status: null,
  },
  totalPages: 0,
};

const WhInventoryReducer = (state = whInventoryInitState, action) => {
  switch (action.type) {
    case SEARCH_WH_INVENTORY:
      const newWhInventorys = action?.data ? action.data.content : state.whInventorys;
      const newTotalPages = action?.data ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        whInventorys: newWhInventorys,
        totalPages: newTotalPages,
      };
    default:
      throw Error('WhInventory Invalid Actions');
  }
};

export { whInventoryInitState };
export default WhInventoryReducer;
