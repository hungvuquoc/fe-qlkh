import { LOADING_USER } from '../constants/userConstants';

const userInitState = {
  loading: false,
  users: [],
  totalPages: 0,
};

const userReducer = (state = userInitState, action) => {
  switch (action.type) {
    case LOADING_USER:
      const newUsers = action ? action.data.content : state.users;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        users: newUsers,
        totalPages: newTotalPages,
      };
    default:
      throw Error('UserReducer Invalid Actions');
  }
};

export { userInitState };
export default userReducer;
