import { SEARCH_WH_EXPORT } from '~/store/constants/wh-transactions/WhExportConstants';

const WhExportActions = {
  search: (data) => {
    return {
      type: SEARCH_WH_EXPORT,
      data,
    };
  },
};

export default WhExportActions;
