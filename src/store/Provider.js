import { useReducer, useState } from 'react';
import Context from './Context';
import nationalReducer, { nationalInitState } from './reducers/nationalReducer';
import warehouseReducer, { warehouseInitState } from './reducers/warehouseReducer';
import productReducer, { productInitState } from './reducers/productReducer';
import productTypeReducer, { productTypeInitState } from './reducers/productTypeReducer';
import productGroupReducer, { productGroupInitState } from './reducers/productGroupReducer';
import productUnitReducer, { productUnitInitState } from './reducers/productUnitReducer';
import supplierReducer, { supplierInitState } from './reducers/supplierReducer';
import WhImportReducer, { whImportInitState } from './reducers/wh-transactions/WhImportReducer';
import WhExportReducer, { whExportInitState } from './reducers/wh-transactions/WhExportReducer';
import WhTransferReducer, { whTransferInitState } from './reducers/wh-transactions/WhTransferReducer';
import WhInventoryReducer, { whInventoryInitState } from './reducers/wh-transactions/WhInventoryReducer';
import employeeReducer, { employeeInitState } from './reducers/employeeReducer';
import roleReducer, { roleInitState } from './reducers/roleReducer';
import userReducer, { userInitState } from './reducers/userReducer';

const Provider = ({ children }) => {
  const [nationalState, nationalDispatch] = useReducer(nationalReducer, nationalInitState);
  const [warehouseState, warehouseDispatch] = useReducer(warehouseReducer, warehouseInitState);
  const [productState, productDispatch] = useReducer(productReducer, productInitState);
  const [productTypeState, productTypeDispatch] = useReducer(productTypeReducer, productTypeInitState);
  const [productGroupState, productGroupDispatch] = useReducer(productGroupReducer, productGroupInitState);
  const [productUnitState, productUnitDispatch] = useReducer(productUnitReducer, productUnitInitState);
  const [supplierState, supplierDispatch] = useReducer(supplierReducer, supplierInitState);
  const [whImportState, whImportDispatch] = useReducer(WhImportReducer, whImportInitState);
  const [whExportState, whExportDispatch] = useReducer(WhExportReducer, whExportInitState);
  const [whTransferState, whTransferDispatch] = useReducer(WhTransferReducer, whTransferInitState);
  const [whInventoryState, whInventoryDispatch] = useReducer(WhInventoryReducer, whInventoryInitState);
  const [employeeState, employeeDispatch] = useReducer(employeeReducer, employeeInitState);
  const [roleState, roleDispatch] = useReducer(roleReducer, roleInitState);
  const [userState, userDispatch] = useReducer(userReducer, userInitState);

  const [isLoading, setIsLoading] = useState(false);

  const startLoading = () => {
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <Context.Provider
      value={{
        state: {
          nationalState,
          warehouseState,
          productState,
          productTypeState,
          productGroupState,
          productUnitState,
          supplierState,
          whImportState,
          whExportState,
          whTransferState,
          whInventoryState,
          employeeState,
          roleState,
          userState,
        },
        dispatch: {
          nationalDispatch,
          warehouseDispatch,
          productDispatch,
          productTypeDispatch,
          productGroupDispatch,
          productUnitDispatch,
          supplierDispatch,
          whImportDispatch,
          whExportDispatch,
          whTransferDispatch,
          whInventoryDispatch,
          employeeDispatch,
          roleDispatch,
          userDispatch,
        },
        loading: {
          isLoading,
          startLoading,
          stopLoading,
        },
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default Provider;
