import { SEARCH_WH_IMPORT } from '~/store/constants/wh-transactions/WhImportConstants';

const WhImportActions = {
  search: (data) => {
    return {
      type: SEARCH_WH_IMPORT,
      data,
    };
  },
};

export default WhImportActions;
