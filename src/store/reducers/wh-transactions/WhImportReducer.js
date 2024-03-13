import { SEARCH_WH_IMPORT } from '~/store/constants/wh-transactions/WhImportConstants';
import { formatDatetime } from '~/utils/common';

const whImportInitState = {
  loading: false,
  whImports: [],
  whImport: {
    warehouseName: null,
    code: null,
    documentNumber: null,
    documentDate: null,
    status: null,
  },
  totalPages: 0,
};

const WhImportReducer = (state = whImportInitState, action) => {
  switch (action.type) {
    case SEARCH_WH_IMPORT:
      const newWhImports = action?.data ? action.data.content : state.whImport;
      const newTotalPages = action?.data ? action.data.totalPages : state.totalPages;
      return {
        ...state,
        whImports: newWhImports.map((e) => {
          if (e.documentDate) {
            return { ...e, documentDate: formatDatetime(e.documentDate, 'yyyy-MM-DD') };
          }
          return e;
        }),
        totalPages: newTotalPages,
      };
    default:
      throw Error('WhImport Invalid Actions');
  }
};

export { whImportInitState };
export default WhImportReducer;
