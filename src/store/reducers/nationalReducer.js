import {
  SEARCH_NATIONAL,
  GET_NATIONAL,
  ADD_NATIONAL,
  EDIT_NATIONAL,
  UPDATE_NATIONAL,
} from '../constants/nationalConstants';

const nationalInitState = {
  loading: false,
  shouldOpenEditDialog: false,
  national: {},
  nationals: [],
};

const nationalReducer = (state = nationalInitState, action) => {
  switch (action.type) {
    case SEARCH_NATIONAL:
      const newNationals = action ? action.data.content : state.nationals;
      return {
        ...state,
        loading: false,
        shouldOpenEditDialog: false,
        nationals: newNationals,
      };
    case GET_NATIONAL:
      return {
        ...state,
        loading: false,
        national: action.data,
      };

    case ADD_NATIONAL:
      return {
        ...state,
        loading: false,
        nationals: action.data,
      };

    case EDIT_NATIONAL:
      return {
        ...state,
        loading: false,
        shouldOpenEditDialog: true,
        national: action.data,
      };

    case UPDATE_NATIONAL:
      return {
        ...state,
        loading: false,
        shouldOpenEditDialog: false,
        nationals: action.data,
      };
    default:
      throw Error('National Invalid Actions');
  }
};

export { nationalInitState };
export default nationalReducer;
