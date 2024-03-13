import { SEARCH_WH_INVENTORY } from '~/store/constants/wh-transactions/WhInventoryConstants';

const WhInventoryActions = {
  search: (data) => {
    return {
      type: SEARCH_WH_INVENTORY,
      data,
    };
  },
};

export default WhInventoryActions;
