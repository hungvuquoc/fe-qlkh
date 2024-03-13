import { LOADING_USER } from '../constants/userConstants';

const UserActions = {
  search: (data) => {
    return {
      type: LOADING_USER,
      data,
    };
  },
};

export default UserActions;
