import { LOADING_EMPLOYEE } from '../constants/employeeConstants';

const EmployeeActions = {
  search: (data) => {
    return {
      type: LOADING_EMPLOYEE,
      data,
    };
  },
};

export default EmployeeActions;
