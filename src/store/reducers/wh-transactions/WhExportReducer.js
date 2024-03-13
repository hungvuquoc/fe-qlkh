import { SEARCH_WH_EXPORT } from '~/store/constants/wh-transactions/WhExportConstants';
import { formatDatetime } from '~/utils/common';

const whExportInitState = {
  loading: false,
  whExports: [],
  whExport: {
    warehouseName: null,
    code: null,
    documentNumber: null,
    documentDate: null,
    status: null,
  },
  totalPages: 0,
};

const WhExportReducer = (state = whExportInitState, action) => {
  switch (action.type) {
    case SEARCH_WH_EXPORT:
      const newWhExports = action?.data ? action.data.content : state.whExport;
      const newTotalPages = action?.data ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        whExports: newWhExports.map((e) => {
          if (e.documentDate) {
            return { ...e, documentDate: formatDatetime(e.documentDate, 'yyyy-MM-DD') };
          }
          return e;
        }),
        totalPages: newTotalPages,
      };
    default:
      throw Error('WhExport Invalid Actions');
  }
};

export { whExportInitState };
export default WhExportReducer;
