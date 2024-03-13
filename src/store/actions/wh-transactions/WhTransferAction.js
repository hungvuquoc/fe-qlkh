import { SEARCH_WH_TRANSFER } from '~/store/constants/wh-transactions/WhTransferConstants';

const WhTransferActions = {
  search: (data) => {
    return {
      type: SEARCH_WH_TRANSFER,
      data,
    };
  },
};

export default WhTransferActions;
