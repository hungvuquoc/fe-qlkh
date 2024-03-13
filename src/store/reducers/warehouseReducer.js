import {
  LOADING_WAREHOUSE,
  SEARCH_WAREHOUSE,
  OPEN_DIALOG_ADD_WAREHOUSE,
  CLOSE_DIALOG_ADD_WAREHOUSE,
} from '../constants/warehouseConstants';

const warehouseInitState = {
  loading: false,
  shouldOpenAddDialog: false,
  warehouses: [],
  warehouse: {
    name: null,
    address: null,
    areas: [],
    deleted: false,
  },
  area: {
    name: null,
    numberOfFloors: null,
    locations: [],
    deleted: false,
  },
  location: {
    name: null,
    mapPoint: null,
    numberOfFloors: null,
    deleted: false,
    floors: [],
  },
  floor: {
    name: null,
    deleted: false,
  },
};

const warehouseReducer = (state = warehouseInitState, action) => {
  switch (action.type) {
    case SEARCH_WAREHOUSE:
      const newWarehouses = action ? action.data.content : state.warehouses;
      return {
        ...state,
        loading: false,
        shouldOpenAddDialog: false,
        warehouses: newWarehouses,
      };
    case OPEN_DIALOG_ADD_WAREHOUSE:
      return {
        ...state,
        shouldOpenAddDialog: true,
      };
    case CLOSE_DIALOG_ADD_WAREHOUSE:
      return {
        ...state,
        shouldOpenAddDialog: false,
      };
    default:
      throw Error('Warehouse Invalid Actions');
  }
};

export { warehouseInitState };
export default warehouseReducer;
