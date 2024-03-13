import { SEARCH_WH_TRANSFER } from '~/store/constants/wh-transactions/WhTransferConstants';
import { formatDatetime } from '~/utils/common';

const whTransferInitState = {
  loading: false,
  whTransfers: [],
  whTransfer: {
    warehouseName: null,
    code: null,
    documentNumber: null,
    documentDate: null,
    status: null,
  },
  totalPages: 0,
};

const WhTransferReducer = (state = whTransferInitState, action) => {
  switch (action.type) {
    case SEARCH_WH_TRANSFER:
      const newWhTransfers = action?.data ? action.data.content : state.whTransfers;
      const newTotalPages = action?.data ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        whTransfers: newWhTransfers.map((e) => {
          if (e.documentDate) {
            return { ...e, documentDate: formatDatetime(e.documentDate, 'yyyy-MM-DD') };
          }
          return e;
        }),
        totalPages: newTotalPages,
      };
    default:
      throw Error('WhTransfer Invalid Actions');
  }
};

export { whTransferInitState };
export default WhTransferReducer;
