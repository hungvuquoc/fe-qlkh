import {
  SEARCH_NATIONAL,
  GET_NATIONAL,
  ADD_NATIONAL,
  EDIT_NATIONAL,
  UPDATE_NATIONAL,
} from '../constants/nationalConstants';

const NationalActions = {
  search: (data) => {
    return {
      type: SEARCH_NATIONAL,
      data,
    };
  },

  get: (data) => {
    return {
      type: GET_NATIONAL,
      data,
    };
  },

  add: (data) => {
    return {
      type: ADD_NATIONAL,
      data,
    };
  },

  edit: (data) => {
    return {
      type: EDIT_NATIONAL,
      data,
    };
  },

  update: (data) => {
    return {
      type: UPDATE_NATIONAL,
      data,
    };
  },
};

export default NationalActions;
