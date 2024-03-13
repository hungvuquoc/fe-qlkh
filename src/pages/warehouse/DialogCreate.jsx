import classNames from 'classnames/bind';
import style from './DialogCreate.module.scss';
import useStore, { WAREHOUSE } from '~/store/hooks';
import { useState, useRef, useEffect } from 'react';
import WarehouseApi from '~/store/api/WarehouseApi';

const cx = classNames.bind(style);

const initTableData = Array.from({ length: 20 }).map((row, rowIndex) =>
  Array.from({ length: 20 }).map((cell, colIndex) => ({
    name: `${rowIndex + 1}-${colIndex + 1}`,
    rowSpan: 1,
    colSpan: 1,
    status: 0,
    areaName: null,
    mapPoint: `${rowIndex + 1}.${colIndex + 1}`,
  })),
);

const initWarehouseData = {
  name: null,
  address: null,
  areas: [],
  deleted: false,
  columnNumber: 20,
  rowNumber: 20,
};

/// status của location dùng để xét màu sắc của vị trí
/// [0] - bình thường, [1] - đã chọn, [2] - có sản phẩm, [3] - có sản phẩm cần tìm

const DialogCreate = ({ id, handleClose }) => {
  const [state, dispatch] = useStore(WAREHOUSE);
  const [warehouseData, setWarehouseData] = useState(initWarehouseData);
  const [tableData, setTableData] = useState(initTableData);
  const [tableDataView, setTableDataView] = useState(initTableData);
  const [areaIndex, setAreaIndex] = useState(null);

  useEffect(() => {
    if (id) {
      fetchWarehouseData();
    }
  }, []);

  const fetchWarehouseData = async () => {
    try {
      if (id) {
        const warehouseResp = await WarehouseApi.getById(id);
        setWarehouseData(warehouseResp);
      } else {
        // setWarehouseData(initWarehouseData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const init = Array.from({ length: warehouseData.rowNumber }).map((row, rowIndex) =>
      Array.from({ length: warehouseData.columnNumber }).map((cell, colIndex) => ({
        name: `${rowIndex}-${colIndex}`,
        rowSpan: 1,
        colSpan: 1,
        status: 0,
        areaName: null,
        deleted: null,
        mapPoint: `${rowIndex}.${colIndex}`,
        numberOfFloors: 2,
      })),
    );
    setTableData(init);
    setTableDataView(init);
    if (id) {
      fetchWarehouse();
    }
  }, [warehouseData.columnNumber, warehouseData.rowNumber, id]);

  const fetchWarehouse = async () => {
    try {
      const warehouseResp = await WarehouseApi.getById(id);
      const locationsResponse = await WarehouseApi.getLocationsById(id);
      const locationNews = { ...locationsResponse };
      const tableDataViewNew = [...tableDataView];
      tableDataView.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          const mapPoint = `${rowIndex}.${colIndex}`;
          if (mapPoint in locationNews) {
            tableDataViewNew[rowIndex][colIndex] = locationNews[mapPoint];
          }
        }),
      );

      setTableDataView(tableDataViewNew);
      setWarehouseData(warehouseResp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleWarehouseInputChange = (event) => {
    const { name, value } = event.target;
    setWarehouseData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAreaInputChange = (event, index) => {
    const { name, value } = event.target;
    const updatedAreas = [...warehouseData.areas];
    updatedAreas[index][name] = value;

    setWarehouseData((prevData) => ({
      ...prevData,
      areas: updatedAreas,
    }));
  };

  const addNewArea = () => {
    setWarehouseData((prevData) => ({
      ...prevData,
      areas: [
        ...prevData.areas,
        {
          name: null,
          numberOfFloors: 2,
          locations: {},
        },
      ],
    }));
  };

  const handleRemoveArea = (index) => {
    const updatedAreas = [...warehouseData.areas];
    updatedAreas.splice(index, 1);
    setAreaIndex(null);
    setWarehouseData((prevData) => ({
      ...prevData,
      areas: updatedAreas,
    }));
  };

  const handleSelectArea = (index) => {
    setAreaIndex(index);
  };

  const handleSelectLocation = (rowIndex, colIndex) => {
    if (areaIndex == null) {
      return;
    }
    const areas = [...warehouseData.areas];
    const mapPoint = `${rowIndex}.${colIndex}`;
    const areaCurrent = areas[areaIndex];
    areas.splice(areaIndex, 1); // xóa đi để vào hasUsedLocation kiểm tra, nêu đang xử dụng ở area khác

    const hasUsed = hasUsedLocation(areas, mapPoint);
    if (hasUsed && window.confirm(`Vị trí này đã được xếp vào khu vực [${areaCurrent.name}]`) === true) {
      removeLocationHasUsed(areas, mapPoint);
      const locations = areaCurrent.locations;
      const location = tableDataView[rowIndex][colIndex]; // sau này cho cho phép đổi tên.
      const newLocation = {
        ...location,
        name: areaCurrent.name,
        status: 1,
        numberOfFloors: areaCurrent.numberOfFloors,
      };
      locations[mapPoint] = newLocation;
      tableDataView[rowIndex][colIndex] = newLocation;
      setTableDataView([...tableDataView]);
      return;
    }
    if (!hasUsed) {
      const locations = areaCurrent.locations;
      const location = tableDataView[rowIndex][colIndex]; // sau này cho cho phép đổi tên.
      const newLocation = {
        ...location,
        name: areaCurrent.name,
        status: 1,
        numberOfFloors: areaCurrent.numberOfFloors,
      };
      locations[mapPoint] = newLocation;
      tableDataView[rowIndex][colIndex] = newLocation;
      setTableDataView([...tableDataView]);
    }
  };

  const hasUsedLocation = (areas, mapPoint) => {
    for (const area of areas) {
      if (mapPoint in area.locations) {
        return true;
      }
    }
    return false;
  };

  const removeLocationHasUsed = (areas, mapPoint) => {
    for (const area of areas) {
      const locations = area.locations;
      if (mapPoint in locations) {
        delete locations[mapPoint];
        return;
      }
    }
  };

  const handleSave = async () => {
    try {
      await WarehouseApi.add(warehouseData);
      console.log(warehouseData);
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('modal-content')}>
            {/* header */}
            <div className={cx('modal-header')}>
              <span className={cx('close')} onClick={() => handleClose()}>
                &times;
              </span>
            </div>
            {/* body */}
            <div className={cx('modal-body')}>
              <div className={cx('modal-body__sidebar')}>
                {/* sidebar */}
                <div className={cx('warehouse-container')}>
                  <div className={cx('warehouse-container__input')}>
                    <label>Tên kho:</label>
                    <input
                      type="text"
                      name="name"
                      value={warehouseData.name || ''}
                      onChange={handleWarehouseInputChange}
                    />
                  </div>
                  <div className={cx('warehouse-container__input')}>
                    <label>Địa chỉ:</label>
                    <input
                      type="text"
                      name="address"
                      value={warehouseData.address || ''}
                      onChange={handleWarehouseInputChange}
                    />
                  </div>
                  <div className={cx('warehouse-container__input')}>
                    <label>Số cột:</label>
                    <input
                      type="number"
                      name="column"
                      value={warehouseData.columnNumber || ''}
                      onChange={handleWarehouseInputChange}
                      readOnly
                    />
                  </div>
                  <div className={cx('warehouse-container__input')}>
                    <label>Số hàng:</label>
                    <input
                      type="number"
                      name="row"
                      value={warehouseData.rowNumber || ''}
                      onChange={handleWarehouseInputChange}
                      readOnly
                    />
                  </div>
                </div>
                <div className={cx('area-container')}>
                  <div className={cx('area-container__action')}>
                    <button onClick={addNewArea}>Thêm khu vực</button>
                  </div>
                  <div className={cx('area-container__view')}>
                    {warehouseData.areas.map((area, index) => (
                      <div key={index} className={cx('area-element')}>
                        <span className={cx('close')} onClick={() => handleRemoveArea(index)}>
                          &times;
                        </span>
                        <div onClick={() => handleSelectArea(index)}>
                          <div className={cx('area-element__input')}>
                            <label>Tên khu vực:</label>
                            <input
                              type="text"
                              name="name"
                              value={area.name || ''}
                              onChange={(event) => handleAreaInputChange(event, index)}
                            />
                          </div>
                          <div className={cx('area-element__input')}>
                            <label>Số lượng tầng:</label>
                            <input
                              type="number"
                              name="numberOfFloors"
                              value={area.numberOfFloors || ''}
                              onChange={(event) => handleAreaInputChange(event, index)}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* content (location, action) */}
              <div className={cx('modal-body__main-content')}>
                <div className={cx('main-content__view')}>
                  <table>
                    <tbody>
                      {tableDataView.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td
                              key={`${rowIndex}.${colIndex}`}
                              rowSpan={cell.rowSpan}
                              colSpan={cell.colSpan}
                              className={cx({ selected: cell.status === 1 })}
                              onClick={() => handleSelectLocation(rowIndex, colIndex)}
                            >
                              {cell.areaName ? cell.areaName : cell.name}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className={cx('main-content__action')}>
                  <button className={cx('button--save')} onClick={handleSave}>
                    Lưu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DialogCreate;
