import classNames from 'classnames/bind';
import style from './DialogCreate.module.scss';
import useStore, { WAREHOUSE } from '~/store/hooks';
import { useDoubleClick } from '~/utils/common';
import { useState, useRef, useEffect } from 'react';
import WarehouseApi from '~/store/api/WarehouseApi';
import ProductTypeApi from '~/store/api/ProductTypeApi';
import DialogChoicesProductType from './DialogChoicesProductType';

const cx = classNames.bind(style);

/// status của location dùng để xét màu sắc của vị trí
/// [0] - bình thường, [1] - đã chọn, [2] - có sản phẩm, [3] - có sản phẩm cần tìm

const DialogCreate = ({ id, handleClose }) => {
  const [state, dispatch] = useStore(WAREHOUSE);
  const [warehouseData, setWarehouseData] = useState({
    name: null,
    address: null,
    areas: [],
    deleted: false,
    columnNumber: 20,
    rowNumber: 20,
    productTypeIds: [],
  });
  const [tableData, setTableData] = useState(() => {
    return Array.from({ length: 20 }).map((row, rowIndex) =>
      Array.from({ length: 20 }).map((cell, colIndex) => ({
        name: null,
        rowSpan: 1,
        colSpan: 1,
        status: 0,
        areaName: null,
        mapPoint: `${rowIndex + 1}.${colIndex + 1}`,
      })),
    );
  });
  const [tableDataView, setTableDataView] = useState();
  const [locations, setLocations] = useState({}); // các vị trí ban đầu khi trước khi update, dùng cho tiện đỡ phải vào từng thằng bên trong, không chình sửa
  const [areaIndex, setAreaIndex] = useState(null);
  const [showDialogChoiceProductType, setShowDialogChoiceProductType] = useState(false);
  const [productTypes, setProductTypes] = useState([]);

  useEffect(() => {
    fetchDataProductTypes();
  }, []);

  const fetchDataProductTypes = async () => {
    try {
      const producTypeResp = await ProductTypeApi.search({ pageSize: 9999, pageIndex: 1, deleted: false });
      const newProductType = producTypeResp?.content?.map((e) => ({ ...e, checked: false }));
      setProductTypes(newProductType);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initTableData = generateTableData(warehouseData.columnNumber, warehouseData.rowNumber);
    setTableData(initTableData);
    setTableDataView(initTableData);
  }, [warehouseData.columnNumber, warehouseData.rowNumber]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (id) {
          const warehouse = await WarehouseApi.getById(id);

          // const locations = await WarehouseApi.getLocationsById(id);
          let locations = {};
          let areas = [];
          for (const area of warehouse.areas) {
            locations = { ...locations, ...area.locations };
            const areaNew = {
              ...area,
              locationOlds: { ...area.locations },
              addLocations: {},
              deleteLocationIds: [],
            };
            areas.push(areaNew);
          }
          setLocations(locations);

          const newProductTypeIds = [...warehouse?.productTypes].map((e) => e.id);
          setWarehouseData({
            ...warehouse,
            areas: [...areas],
            oldAreas: [...areas],
            addAreas: [],
            deleteAreaIds: [],
            productTypeIds: newProductTypeIds || [],
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const tableDataViewNew = generateTableData(warehouseData.rowNumber, warehouseData.columnNumber);
    tableDataView?.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const mapPoint = `${rowIndex}.${colIndex}`;
        if (mapPoint in locations) {
          tableDataViewNew[rowIndex][colIndex] = locations[mapPoint];
        }
      }),
    );

    setTableDataView(tableDataViewNew);
  }, [locations]);

  const generateTableData = (rowNumber, columnNumber) => {
    const data = Array.from({ length: rowNumber }).map((row, rowIndex) =>
      Array.from({ length: columnNumber }).map((cell, colIndex) => ({
        name: null,
        rowSpan: 1,
        colSpan: 1,
        status: 0,
        areaIndex: null,
        areaName: null,
        mapPoint: `${rowIndex}.${colIndex}`,
      })),
    );
    return data;
  };

  ///
  ///
  ///

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
          locationOlds: {},
          addLocations: {},
          deleteLocationIds: [],
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

  const handleSelectLocation = ({ rowIndex, colIndex, data }) => {
    if (areaIndex == null) {
      return;
    }

    const mapPoint = `${rowIndex}.${colIndex}`;
    if (data.name) {
      // location có dữ liệu
      // thêm vào area theo điều kiện
      if (data.id) {
        // dữ liệu đã có trong db
        // thông báo và kiểm tra location đã được dùng chưa
        if (window.confirm(`Vị trí này đã được xếp vào khu vực khác. Bạn muốn thay đổi?`) === false) {
          return;
        }
        // xóa khỏi khu vực cũ (locations trong area), thêm id và deleteLocations của khu vực cũ
        const areaBefor = findAreaByMapPoint(warehouseData.areas, mapPoint);
        delete areaBefor.locations[mapPoint];

        areaBefor.deleteLocationIds.push(data.id);

        // thêm vào khu vực mới, thêm vào addLocations
        const areaAfter = warehouseData.areas[areaIndex];
        const newLocation = {
          name: areaAfter.name,
          rowSpan: 1,
          colSpan: 1,
          status: 1,
          numberOfFloors: areaAfter.numberOfFloors,
          mapPoint: `${rowIndex}.${colIndex}`,
          areaIndex: null,
          areaName: null,
        };
        areaAfter.addLocations[mapPoint] = newLocation;
        areaAfter.locations[mapPoint] = newLocation;
        tableDataView[rowIndex][colIndex] = newLocation;
        setTableDataView([...tableDataView]);
      } else {
        // dữ liệu mới hoàn toàn
        // xóa khỏi khu vực cũ
        const mapPoint = `${rowIndex}.${colIndex}`;
        const areaBefor = findAreaByMapPoint(warehouseData.areas, mapPoint);
        const areaAfter = warehouseData.areas[areaIndex];

        if (areaAfter && areaAfter.name === areaBefor.name) {
          return;
        }

        if (window.confirm(`Vị trí này đã được xếp vào khu vực khác. Bạn muốn thay đổi?`) === false) {
          return;
        }

        delete areaBefor.locations[mapPoint];
        delete areaBefor.addLocations[mapPoint];

        // thêm vào khu vực mới
        const newLocation = {
          name: areaAfter.name,
          rowSpan: 1,
          colSpan: 1,
          status: 1,
          numberOfFloors: areaAfter.numberOfFloors,
          mapPoint: `${rowIndex}.${colIndex}`,
          areaIndex: null,
          areaName: null,
        };
        areaAfter.addLocations[mapPoint] = newLocation;
        areaAfter.locations[mapPoint] = newLocation;
        tableDataView[rowIndex][colIndex] = newLocation;
        setTableDataView([...tableDataView]);
      }
    } else {
      // location chưa có dữ liệu
      // thêm mới luôn vào area
      const areaAfter = warehouseData.areas[areaIndex];
      const newLocation = {
        name: areaAfter.name,
        rowSpan: 1,
        colSpan: 1,
        status: 1,
        numberOfFloors: areaAfter.numberOfFloors,
        mapPoint: `${rowIndex}.${colIndex}`,
        areaIndex: null,
        areaName: null,
      };
      areaAfter.addLocations[mapPoint] = newLocation;
      areaAfter.locations[mapPoint] = newLocation;
      tableDataView[rowIndex][colIndex] = newLocation;
      setTableDataView([...tableDataView]);
    }
  };

  const handleDoubleClickToDelete = ({ rowIndex, colIndex, data }) => {
    const mapPoint = `${rowIndex}.${colIndex}`;
    if (data.name) {
      // location có dữ liệu
      // thêm vào area theo điều kiện
      if (data.id) {
        // dữ liệu đã có trong db
        // thông báo và kiểm tra location đã được dùng chưa
        if (window.confirm(`Vị trí này đã được xếp vào khu vực khác. Bạn muốn thay đổi?`) === false) {
          return;
        }
        // kiểm tra xem location có đang lưu trữ hàng hóa
        const hasUsed = false; // gọi api kiểm tra
        if (hasUsed) {
          alert('Vị trí còn hàng hóa, cần chuyển hết đồ trước khi thao tác');
          return;
        }
        // xóa khỏi khu vực cũ (locations trong area), thêm id và deleteLocations của khu vực cũ
        const areaBefor = findAreaByMapPoint(warehouseData.areas, mapPoint);
        delete areaBefor.locations[mapPoint];

        areaBefor.deleteLocationIds.push(data.id);

        // đặt lại giá trị khởi tạo
        const newLocation = {
          name: null,
          rowSpan: 1,
          colSpan: 1,
          status: 0,
          mapPoint: `${rowIndex}.${colIndex}`,
          areaIndex: null,
          areaName: null,
        };
        tableDataView[rowIndex][colIndex] = newLocation;
        setTableDataView([...tableDataView]);
      } else {
        // dữ liệu mới hoàn toàn
        // xóa khỏi khu vực cũ
        const areaBefor = findAreaByMapPoint(warehouseData.areas, mapPoint);
        delete areaBefor.locations[mapPoint];
        delete areaBefor.addLocations[mapPoint];
        // đặt lại giá trị khởi tạo
        const newLocation = {
          name: null,
          rowSpan: 1,
          colSpan: 1,
          status: 0,
          mapPoint: `${rowIndex}.${colIndex}`,
          areaIndex: null,
          areaName: null,
        };
        tableDataView[rowIndex][colIndex] = newLocation;
        setTableDataView([...tableDataView]);
      }
    } else {
      // location đang là gía trị khởi tạo
      // tìm xem lịch sử vị trí
      const location = locations[mapPoint];
      if (!location) {
        return;
      }
      // tìm vị trí ban đầu
      const areaBefor = findAreaByLocationId(warehouseData.areas, location.id);
      // xóa khỏi danh sách xóa (deleteLocationIds)
      const locationIdNews = [...areaBefor.deleteLocationIds].filter((id) => id !== location.id);
      areaBefor.deleteLocationIds = locationIdNews;
      // thêm lại khu vực
      let areaNews = [];
      for (const area of warehouseData.areas) {
        const isExistLocationId = [...area.deleteLocationIds].includes(id);
        if (!isExistLocationId) {
          areaNews.push(area);
        }
      }
      areaBefor.locations = { ...areaBefor.locations, [mapPoint]: location };

      tableDataView[rowIndex][colIndex] = location;
      setTableDataView([...tableDataView]);
    }
  };

  const handleClickLocation = useDoubleClick(handleSelectLocation, handleDoubleClickToDelete);

  const findAreaByMapPoint = (areas, mapPoint) => {
    for (const area of areas) {
      const locations = area.locations;
      if (mapPoint in locations) {
        return area;
      }
    }
    return null;
  };

  const findAreaByLocationId = (areas, id) => {
    for (const area of areas) {
      const isExistLocationId = [...area.deleteLocationIds].includes(id);
      if (isExistLocationId) {
        return area;
      }
    }
    return null;
  };

  const handleOpenDialogChoiceProductType = () => {
    const newData = [...productTypes].map((e1) => ({
      ...e1,
      checked: warehouseData?.productTypeIds.some((e2) => e2 == e1.id),
    }));

    setProductTypes(newData);
    setShowDialogChoiceProductType(true);
  };

  const handleConfirmDialogChoiceProductType = (data) => {
    if (data) {
      const newData = [...data].filter((e) => e.checked == true).map((e) => e.id);
      setWarehouseData((prev) => ({
        ...prev,
        productTypeIds: newData,
      }));
    }

    setShowDialogChoiceProductType(false);
  };

  const handleSave = async (event) => {
    try {
      if (id) {
        await WarehouseApi.update(id, warehouseData);
      } else {
        await WarehouseApi.add(warehouseData);
      }
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {showDialogChoiceProductType && (
        <DialogChoicesProductType
          productTypes={productTypes}
          handleCloseDialog={() => setShowDialogChoiceProductType(false)}
          handleConfirm={handleConfirmDialogChoiceProductType}
        />
      )}
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
                    <button onClick={handleOpenDialogChoiceProductType}>Loại hàng hóa</button>
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
                      {tableDataView?.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => (
                            <td
                              key={`${rowIndex}.${colIndex}`}
                              rowSpan={cell.rowSpan}
                              colSpan={cell.colSpan}
                              className={cx({ selected: cell.status === 1 })}
                              onClick={(event) => handleClickLocation(event, { rowIndex, colIndex, data: cell })}
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
