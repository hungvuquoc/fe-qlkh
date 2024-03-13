import { LOADING_ROLE } from '../constants/roleConstants';

const roleInitState = {
  loading: false,
  roles: [],
  totalPages: 0,
};

const roleReducer = (state = roleInitState, action) => {
  switch (action.type) {
    case LOADING_ROLE:
      const newRoles = action ? action.data.content : state.roles;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        roles: newRoles,
        totalPages: newTotalPages,
      };
    default:
      throw Error('RoleReducer Invalid Actions');
  }
};

export { roleInitState };
export default roleReducer;
