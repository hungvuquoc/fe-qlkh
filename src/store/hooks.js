import { useContext } from 'react';
import Context from './Context';

const NATIONAL = 'api/national';
const WAREHOUSE = 'api/warehouse';
const PRODUCT = 'api/product';
const PRODUCT_TYPE = 'api/product-type';
const PRODUCT_GROUP = 'api/product-group';
const PRODUCT_UNIT = 'api/product-unit';
const SUPPLIER = 'api/supplier';
const WH_IMPORT = 'api/wh-import';
const WH_EXPORT = 'api/wh-export';
const WH_TRANSFER = 'api/wh-transfer';
const WH_INVENTORY = 'api/wh-inventory';
const EMPLOYEE = 'api/employee';
const ROLE = 'api/role';
const USER = 'api/user';
const LOADING = 'api/loading';

const useStore = (type) => {
  const { state, dispatch, loading } = useContext(Context);

  switch (type) {
    case NATIONAL:
      return [state.nationalState, dispatch.nationalDispatch];
    case WAREHOUSE:
      return [state.warehouseState, dispatch.warehouseDispatch];
    case PRODUCT:
      return [state.productState, dispatch.productDispatch];
    case PRODUCT_TYPE:
      return [state.productTypeState, dispatch.productTypeDispatch];
    case PRODUCT_GROUP:
      return [state.productGroupState, dispatch.productGroupDispatch];
    case PRODUCT_UNIT:
      return [state.productUnitState, dispatch.productUnitDispatch];
    case SUPPLIER:
      return [state.supplierState, dispatch.supplierDispatch];
    case WH_IMPORT:
      return [state.whImportState, dispatch.whImportDispatch];
    case WH_EXPORT:
      return [state.whExportState, dispatch.whExportDispatch];
    case WH_TRANSFER:
      return [state.whTransferState, dispatch.whTransferDispatch];
    case WH_INVENTORY:
      return [state.whInventoryState, dispatch.whInventoryDispatch];
    case EMPLOYEE:
      return [state.employeeState, dispatch.employeeDispatch];
    case ROLE:
      return [state.roleState, dispatch.roleDispatch];
    case USER:
      return [state.userState, dispatch.userDispatch];
    case LOADING:
      return { ...loading };
    default:
      throw Error('Hooks Invalid Store Type');
  }
};

export {
  NATIONAL,
  WAREHOUSE,
  PRODUCT,
  PRODUCT_TYPE,
  PRODUCT_GROUP,
  PRODUCT_UNIT,
  SUPPLIER,
  WH_IMPORT,
  WH_EXPORT,
  WH_TRANSFER,
  WH_INVENTORY,
  EMPLOYEE,
  ROLE,
  USER,
  LOADING,
};
export default useStore;
