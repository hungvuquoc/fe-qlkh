import classNames from 'classnames/bind';
import style from './WarehouseExportDialog.module.scss';
import { useState, useEffect } from 'react';
import InputFieldsV2, { INPUT_TEXT, INPUT_NUMBER, INPUT_SELECT, CONATINER } from '~/components/input-field-v2';
import WarehouseApi from '~/store/api/WarehouseApi';
import DetailDialog from './DetailDialog';

const cx = classNames.bind(style);

// status: [0] Không có sản phẩm - trắng
// status: [1] có sản phẩm - vàng
// status: [2] có sản phẩm cần tìm - xanh lá cây
// status: [3] đã xuất hàng - tím
// status: [4] ô đã xuất lúc trước không đủ hàng - đỏ

function WarehouseExportDialog({
  statusFinished = false,
  warehouseId,
  item,
  dataProducts = [],
  handleClose,
  handleConfirm,
}) {
  const [itemNew, setItemNew] = useState({});
  const [totalQuantityAllocation, setTotalQuantityAllocation] = useState(0);
  const [details, setDetails] = useState([]); // các tầng đã xuất hàng
  const [warehouse, setWarehouse] = useState({});
  const [locations, setLocations] = useState({}); //  dữ liệu các vị trí có trong warehouse
  const [locationHasExported, setLocationHasExported] = useState({}); // các vị trí đã xuất hàng -- không dùng
  const [mapPointHasProduct, setMapPointHasProduct] = useState([]);
  const [mapPointHasProductSearch, setMapPointHasProductSearch] = useState([]);

  const [tableDataView, setTableDataView] = useState([]);

  const [allFloorDetails, setAllFloorDetails] = useState([]); // các tầng có hàng của location
  const [oldFloorDetails, setOldFloorDetails] = useState([]);

  const [mapPointSelected, setMapPointSelected] = useState(null);

  const [productDetails, setProductDetails] = useState([]);
  const [units, setUnits] = useState([]);
  const [consignments, setConsignments] = useState([]);
  const [showDetailDialog, setShowDetailDialog] = useState(false); // hiện dialog chọn details

  const [dataChanged, setDataChanged] = useState(false);

  const inputFieldOverview = [
    {
      type: CONATINER,
      classNames: ['overview-container'],
      inputFields: [
        {
          type: INPUT_SELECT,
          title: 'Hàng hóa',
          field: 'productId',
          disabled: statusFinished,
          options: dataProducts,
          defaultValue: itemNew.productId,
          fieldValue: 'id',
          fieldDisplay: 'name',
          handleChange: (event) => {
            handleChangeItemInput({ event });
            setDetails([]);
            setDataChanged(true);
          },
          classNames: {
            container: ['input-container'],
          },
        },
        {
          type: INPUT_SELECT,
          title: 'Chất lượng',
          field: 'productDetailId',
          disabled: statusFinished,
          options: statusFinished ? [itemNew.productDetail] : productDetails,
          defaultValue: itemNew.productDetailId,
          fieldValue: 'id',
          fieldDisplay: 'tag',
          handleChange: (event) => {
            handleChangeItemInput({ event });
            setDetails([]);
            setDataChanged(true);
          },
          classNames: {
            container: ['input-container'],
          },
        },
        {
          type: INPUT_SELECT,
          title: 'Đơn vị',
          field: 'unitTargetId',
          disabled: statusFinished,
          options: statusFinished ? [itemNew.unitTarget] : units,
          defaultValue: itemNew.unitTargetId,
          fieldValue: 'id',
          fieldDisplay: 'tag',
          handleChange: (event) => {
            handleChangeItemInput({ event });
            setDetails([]);
            setDataChanged(true);
          },
          classNames: {
            container: ['input-container'],
          },
        },
      ],
    },
    {
      type: CONATINER,
      classNames: ['overview-container'],
      inputFields: [
        {
          type: INPUT_SELECT,
          title: 'Số lô',
          field: 'consignmentNumber',
          disabled: statusFinished,
          options: statusFinished ? [itemNew.consignmentNumber] : consignments,
          defaultValue: itemNew.consignmentNumber,
          handleChange: (event) => {
            handleChangeItemInput({ event });
            setDetails([]);
            setDataChanged(true);
          },
          classNames: {
            container: ['input-container'],
          },
        },
        {
          type: INPUT_NUMBER,
          field: 'quantityTarget',
          title: 'Dự định xuất',
          disabled: statusFinished,
          value: itemNew.quantityTarget,
          classNames: {
            container: ['input-container'],
          },
          handleChange: (event) => {
            const { value } = event.target;
            if (value < totalQuantityAllocation) {
              if (window.confirm('Sẽ phải tập hợp lại nếu tiếp tục giảm số') == true) {
                setDetails([]);
                handleChangeItemInput({ event });
                return;
              }
              return;
            }
            handleChangeItemInput({ event });
          },
        },
        {
          type: INPUT_TEXT,
          field: '',
          title: 'Đã tập hợp',
          value: totalQuantityAllocation,
          disabled: true,
          classNames: {
            container: ['input-container'],
          },
        },
      ],
    },
  ];

  useEffect(() => {
    fetchDataWarehouseAndInit();
  }, []);

  useEffect(() => {
    if (details && details?.length > 0) {
      const newTotalAllocation = details.reduce((acc, cur) => acc + parseInt(cur.quantity), 0);
      setTotalQuantityAllocation(newTotalAllocation);
    } else {
      setTotalQuantityAllocation(0);
    }
  }, [details]);

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

          if (details.some((e) => e.mapPoint == mapPoint)) {
            location['status'] = 3;
          }

          newTableDataView[rowIndex][colIndex] = { ...location };
        }
      }),
    );

    setTableDataView(newTableDataView);
  }, [locations, mapPointHasProduct, mapPointHasProductSearch, details]);

  useEffect(() => {
    if (!statusFinished) {
      if (itemNew.productId && itemNew.productId != -1) {
        fetchDataProductDetails();
      } else {
        setProductDetails([]);
        setUnits([]);
        setConsignments([]);
      }

      setMapPointHasProductSearch([]);
      if (dataChanged) {
        setItemNew((prev) => ({
          ...prev,
          productDetailId: null,
          unitTargetId: null,
          consignmentNumber: null,
        }));
      }
    }
  }, [itemNew.productId]);

  useEffect(() => {
    if (!statusFinished) {
      if (itemNew.productDetailId && itemNew.productDetailId != -1) {
        fetchDataUnits();
      } else {
        setUnits([]);
        setConsignments([]);
      }

      setMapPointHasProductSearch([]);
      if (dataChanged) {
        setItemNew((prev) => ({
          ...prev,
          unitTargetId: null,
          consignmentNumber: null,
        }));
      }
    }
  }, [itemNew.productDetailId]);

  useEffect(() => {
    if (!statusFinished) {
      if (itemNew.unitTargetId && itemNew.unitTargetId != -1) {
        fetchDataConsignments();
      } else {
        setConsignments([]);
      }

      setMapPointHasProductSearch([]);
      if (dataChanged) {
        setItemNew((prev) => ({
          ...prev,
          consignmentNumber: null,
        }));
      }
    }
  }, [itemNew.unitTargetId]);

  useEffect(() => {
    if (!statusFinished) {
      if (itemNew.consignmentNumber) {
        getMapPointHasProductBy();
      } else {
        setMapPointHasProductSearch([]);
      }
    }
  }, [itemNew.consignmentNumber]);

  const fetchDataProductDetails = async () => {
    try {
      const productDetailsResp = await WarehouseApi.getProductDetailInStockBy({
        warehouseId: warehouseId,
        productId: itemNew.productId,
      });

      setProductDetails(productDetailsResp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataUnits = async () => {
    try {
      const unitsResp = await WarehouseApi.getUnitInStockBy({
        warehouseId: warehouseId,
        productId: itemNew.productId,
        productDetailId: itemNew.productDetailId,
      });

      setUnits(unitsResp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataConsignments = async () => {
    try {
      const consigmmentsResp = await WarehouseApi.getConsignmentInStockBy({
        warehouseId: warehouseId,
        productId: itemNew.productId,
        productDetailId: itemNew.productDetailId,
        unitId: itemNew.unitTargetId,
      });

      setConsignments(consigmmentsResp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataWarehouseAndInit = async () => {
    try {
      const warehouseResp = await WarehouseApi.getById(warehouseId);

      setWarehouse(warehouseResp);
      let newLocations = {};
      for (const area of warehouseResp.areas) {
        newLocations = { ...newLocations, ...area.locations };
      }

      const newTableDataView = generateTableData(warehouseResp.rowNumber, warehouseResp.columnNumber);

      setLocations(newLocations);
      setTableDataView(newTableDataView);
      if (!statusFinished) {
        const mapPointHasProductResp = await WarehouseApi.getMapPointHasProductByWarehouseId(warehouseId);
        setMapPointHasProduct(mapPointHasProductResp);
      }

      if (item) {
        setItemNew({ ...item });
        if (item?.details && item?.details?.length > 0) {
          const itemResp = await WarehouseApi.getQuantityInStock([item]);
          const detailResp = [...itemResp[0].details];

          const newDetails = [...item.details].map((e) => {
            const dt = detailResp.find((d) => (d.floorId = e.floorId && d.inputDate == e.inputDate));
            return {
              ...e,
              quantityTarget: dt.quantity,
            };
          });
          setDetails(newDetails);
          const newTotalAllocation = newDetails.reduce((acc, cur) => acc + parseInt(cur.quantity), 0);
          setTotalQuantityAllocation(newTotalAllocation);
        } else {
          setDetails([]);
          setTotalQuantityAllocation(0);
          setLocationHasExported({});
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getMapPointHasProductBy = async () => {
    try {
      const mapPoints = await WarehouseApi.getMapPointHasProductBy(warehouseId, {
        warehouseId: warehouseId,
        productId: itemNew.productId,
        productDetailId: itemNew.productDetailId,
        unitId: itemNew.unitTargetId,
        consignmentNumber: itemNew.consignmentNumber,
      });

      setMapPointHasProductSearch(mapPoints);
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

  const handleChangeItemInput = ({ event }) => {
    const { name, value } = event.target;

    let filelName;
    let fileData;
    switch (name) {
      case 'productId':
        filelName = 'product';
        fileData = [...dataProducts].find((e) => e.id == value);
        break;
      case 'productDetailId':
        filelName = 'productDetail';
        fileData = [...productDetails].find((e) => e.id == value);
        break;
      case 'unitTargetId':
        filelName = 'unitTarget';
        fileData = [...units].find((e) => e.id == value);
        break;
    }

    if (filelName) {
      setItemNew((prev) => ({
        ...prev,
        [name]: value,
        [filelName]: fileData,
      }));
      return;
    }

    setItemNew((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteItemDetail = (index) => {
    if (!details || !locationHasExported) {
      return;
    }

    const newDetails = [...details];
    newDetails.splice(index, 1);

    setDetails(newDetails);
  };

  const handleOnClickLocation = async ({ rowIndex, colIndex, data }) => {
    const mapPoint = data.mapPoint;
    if (statusFinished || !data.id || (data.status !== 2 && data.status !== 3) || mapPoint in locationHasExported) {
      return;
    }

    if (!itemNew.quantityTarget || itemNew.quantityTarget <= 0) {
      alert('Chưa nhập số lượng dự định xuất');
      return;
    }

    const oldQuantityAllocation = caculateTotalQuantityAllocation();
    if (oldQuantityAllocation >= itemNew.quantityTarget) {
      alert('Số lượng đã đủ');
      return;
    }

    try {
      const floorDetailResp = await WarehouseApi.getFloorDetailBy({
        warehouseId: warehouseId,
        productId: itemNew.productId,
        productDetailId: itemNew.productDetailId,
        unitId: itemNew.unitTargetId,
        consignmentNumber: itemNew.consignmentNumber,
        locationId: data.id,
      });

      setAllFloorDetails([...floorDetailResp]);
      setMapPointSelected(mapPoint);
    } catch (error) {
      console.log(error);
      return;
    }

    const newOldFloorDetails = [...details].filter((item) => item.mapPoint == mapPoint);
    setOldFloorDetails(newOldFloorDetails);

    setShowDetailDialog(true);
  };

  const caculateTotalQuantityAllocation = () => {
    return details.reduce((acc, cur) => acc + parseInt(cur.quantity), 0);
  };

  const createInputFieldDetail = ({ detail, index }) => {
    const location = locations[detail.mapPoint];
    return [
      {
        type: CONATINER,
        classNames: ['detail-container'],
        inputFields: [
          {
            type: INPUT_TEXT,
            field: '',
            title: 'Vị trí',
            value: location.name,
            disabled: true,
            classNames: {
              container: ['item-container'],
            },
          },
          {
            type: INPUT_TEXT,
            field: '',
            title: 'Tầng',
            value: detail.floorName || detail.floor.name,
            disabled: true,
            classNames: {
              container: ['item-container'],
            },
          },
        ],
      },
      {
        type: CONATINER,
        classNames: ['detail-container'],
        inputFields: [
          {
            type: INPUT_TEXT,
            field: '',
            title: 'Số lượng tồn',
            hidden: statusFinished,
            value: detail.quantityTarget,
            disabled: true,
            classNames: {
              container: ['item-container'],
            },
          },
          {
            type: INPUT_TEXT,
            field: '',
            title: 'Số lượng xuất',
            value: detail.quantity,
            disabled: true,
            classNames: {
              container: ['item-container'],
            },
          },
        ],
      },
    ];
  };

  const handleConfirmDetail = (detailSelected) => {
    const newDetails = [...details].filter((e) => e.mapPoint != mapPointSelected);
    if (detailSelected) {
      newDetails.push(...detailSelected);
    }

    setDetails(newDetails);
    setMapPointSelected(null);
    setShowDetailDialog(false);
  };

  const handleSave = () => {
    handleConfirm({ ...itemNew, details: [...details] });
    // console.log({ item: { ...itemNew, details: [...details] } });
  };

  return (
    <>
      {showDetailDialog && (
        <DetailDialog
          totalQuantityExport={itemNew.quantityTarget}
          totalQuantityExported={totalQuantityAllocation}
          allData={allFloorDetails}
          oldData={oldFloorDetails}
          handleConfirm={handleConfirmDetail}
          handleClose={() => setShowDetailDialog(false)}
        />
      )}
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <span className={cx('close')} onClick={() => handleClose()}>
                &times;
              </span>
              <h2></h2>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('modal-body__sidebar')}>
                <div className={cx('sidebar-container')}>
                  <div className={cx('sidebar-container__view')}>
                    <div className={cx('overview')}>
                      <InputFieldsV2 datas={inputFieldOverview} cx={cx} />
                    </div>
                    <hr />
                    <div className={cx('detail')}>
                      {details.map((detail, index) => {
                        const inputFields = createInputFieldDetail({ detail, index });
                        return (
                          <div key={index} className={cx('detail-element')}>
                            <span
                              hidden={statusFinished}
                              className={cx('close')}
                              onClick={() => handleDeleteItemDetail(index)}
                            >
                              &times;
                            </span>
                            <div className={cx('element__input')}>
                              <InputFieldsV2 datas={inputFields} cx={cx} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr hidden={statusFinished} />
                  <div hidden={statusFinished} className={cx('sidebar-container__action')}>
                    <button hidden={statusFinished} className={cx('btn-save')} onClick={handleSave}>
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
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
                              className={cx({
                                location: cell.status === 0,
                                'has-product': cell.status === 1,
                                'has-product-search': cell.status === 2,
                                'has-export': cell.status === 3,
                              })}
                              onClick={() => handleOnClickLocation({ rowIndex, colIndex, data: cell })}
                            >
                              {cell.areaName ? cell.areaName : cell.name}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WarehouseExportDialog;
