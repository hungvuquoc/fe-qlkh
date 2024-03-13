import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import useStore, { LOADING } from '~/store/hooks';
import { useEffect, useState } from 'react';
import WarehouseApi from '~/store/api/WarehouseApi';
import WarehouseMap from '~/components/warehouse-map';
import DialogDetail from './DialogDetail';

const cx = classNames.bind(Style);

function WhMap() {
  const { startLoading, stopLoading } = useStore(LOADING);
  const [warehouses, setWarehouses] = useState([]);
  const [warehouse, setWarehouse] = useState({});
  const [warehouseId, setWarehouseId] = useState(null);

  const [locations, setLocations] = useState({});
  const [mapPointHasProduct, setMapPointHasProduct] = useState([]);
  const [mapPointHasProductSearch, setMapPointHasProductSearch] = useState([]);

  const [location, setLocation] = useState({});
  const [showDetail, setShowDetail] = useState(false);

  const [tableDataView, setTableDataView] = useState([]);

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    startLoading();
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '', useAccount: true });
      const newWarehouses = warehouseResp?.content;
      if (newWarehouses) {
        const topWarehouse = newWarehouses[0];
        setWarehouseId(topWarehouse?.id);
        setWarehouses(newWarehouses);
      }
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  useEffect(() => {
    if (warehouseId) {
      fetchWarehouseAndInit();
    }
  }, [warehouseId]);

  const fetchWarehouseAndInit = async () => {
    try {
      const warehouseResp = await WarehouseApi.getById(warehouseId);

      setWarehouse(warehouseResp);
      let newLocations = {};
      for (const area of warehouseResp.areas) {
        newLocations = { ...newLocations, ...area.locations };
      }
      setLocations(newLocations);

      const newTableDataView = generateTableData(warehouseResp.rowNumber, warehouseResp.columnNumber);
      setTableDataView(newTableDataView);

      const mapPointHasProductResp = await WarehouseApi.getMapPointHasProductByWarehouseId(warehouseId);
      setMapPointHasProduct(mapPointHasProductResp);
    } catch (error) {
      console.log(error);
    }
  };

  const generateTableData = (rowNumber, columnNumber) => {
    const data = Array.from({ length: rowNumber }).map((row, rowIndex) =>
      Array.from({ length: columnNumber }).map((cell, colIndex) => ({
        name: null,
        rowSpan: 1,
        colSpan: 1,
        status: -1,
        areaIndex: null,
        areaName: null,
        mapPoint: `${rowIndex}.${colIndex}`,
      })),
    );
    return data;
  };

  useEffect(() => {
    const newTableDataView = [...tableDataView];

    tableDataView?.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const mapPoint = `${rowIndex}.${colIndex}`;

        if (mapPoint in locations) {
          const location = locations[mapPoint];
          location['status'] = 0;

          if (mapPointHasProduct.some((e) => e == mapPoint)) {
            location['status'] = 1;
          }

          if (mapPointHasProductSearch.some((e) => e == mapPoint)) {
            location['status'] = 2;
          }

          newTableDataView[rowIndex][colIndex] = { ...location };
        }
      }),
    );

    setTableDataView(newTableDataView);
  }, [locations, mapPointHasProduct, mapPointHasProductSearch]);

  const handleOnClickLocation = ({ rowIndex, colIndex, cell }) => {
    if (cell && cell?.status !== -1) {
      setLocation(cell);
      setShowDetail(true);
    }
  };

  const handleCloseDialogDetail = () => {
    setLocation(null);
    setShowDetail(false);
  };

  return (
    <>
      {showDetail && (
        <DialogDetail className={location?.name} locationId={location?.id} handleClose={handleCloseDialogDetail} />
      )}
      <div className={cx('container')}>
        <div className={cx('action')}>
          <div className={cx('tab-container')}>
            {warehouses?.map((wh, index) => (
              <div
                className={cx('tab', { 'active-tab': warehouseId === wh?.id })}
                onClick={() => setWarehouseId(wh?.id)}
              >
                {wh?.name}
              </div>
            ))}
          </div>
        </div>
        <div className={cx('view')}>
          <div className={cx('view-map')}>
            <WarehouseMap cx={cx} dataView={tableDataView} handleOnClickLocation={handleOnClickLocation} />
            {tableDataView?.length == 0 && <span>Không có kho</span>}
          </div>
        </div>
      </div>
    </>
  );
}

export default WhMap;
