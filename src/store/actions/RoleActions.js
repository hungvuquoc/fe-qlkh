import { LOADING_ROLE } from '../constants/roleConstants';

const RoleActions = {
  search: (data) => {
    return {
      type: LOADING_ROLE,
      data,
    };
  },
};

export default RoleActions;
