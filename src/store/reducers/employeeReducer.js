import { LOADING_EMPLOYEE } from '../constants/employeeConstants';
import { formatDatetime } from '~/utils/common';

const employeeInitState = {
  loading: false,
  employees: [],
  totalPages: 0,
};

const employeeReducer = (state = employeeInitState, action) => {
  switch (action.type) {
    case LOADING_EMPLOYEE:
      const newEmployees = action ? action.data.content : state.employees;
      const newTotalPages = action ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        loading: false,
        employees: newEmployees.map((e) => ({ ...e, documentDate: formatDatetime(e.documentDate, 'yyyy-MM-DD') })),
        totalPages: newTotalPages,
      };
    default:
      throw Error('Employee Invalid Actions');
  }
};

export { employeeInitState };
export default employeeReducer;
