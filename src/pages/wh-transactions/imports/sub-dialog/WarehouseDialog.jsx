import classNames from 'classnames/bind';
import style from './WarehouseDialog.module.scss';
import { useState, useEffect } from 'react';
import InputFields, { INPUT_TEXT, INPUT_NUMBER, INPUT_SELECT, CONATINER } from '~/components/inputFields';
import WarehouseApi from '~/store/api/WarehouseApi';

const cx = classNames.bind(style);

function WarehouseDialog({ modifyDate, statusFinished, warehouseId, item, handleClose, handleSave }) {
  const [itemNew, setItemNew] = useState({});
  const [totalQuantityImport, setTotalQuantityImport] = useState(0);
  const [totalQuantityAllocation, setTotalQuantityAllocation] = useState(0);
  const [details, setDetails] = useState([]);
  const [warehouse, setWarehouse] = useState({});
  const [locations, setLocations] = useState({});
  const [tableDataView, setTableDataView] = useState([]);
  const [locationChoises, setLocationChoises] = useState({});
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchDataWarehouse();
    setItemNew({ ...item });
    setTotalQuantityImport(item?.quantityTarget);
    if (item?.details && item?.details?.length > 0) {
      const details = [...item.details];
      setDetails(details);
      const newTotalAllocation = details.reduce((acc, cur) => acc + parseInt(cur.quantity), 0);
      setTotalQuantityAllocation(newTotalAllocation);
    } else {
      setDetails([]);
      setTotalQuantityAllocation(0);
      setLocationChoises({});
    }
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
    const newTableDataView =
      tableDataView && tableDataView?.length != 0
        ? [...tableDataView]
        : generateTableData(warehouse.rowNumber, warehouse.columnNumber);

    tableDataView?.map((row, rowIndex) =>
      row.map((cell, colIndex) => {
        const mapPoint = `${rowIndex}.${colIndex}`;

        if (mapPoint in locations) {
          const location = locations[mapPoint];
          location['status'] = 0;

          if (details.some((e) => e.mapPoint == mapPoint)) {
            location['status'] = 2;
          }

          newTableDataView[rowIndex][colIndex] = { ...location };
        }
      }),
    );

    setTableDataView(newTableDataView);
  }, [locations, details]);

  useEffect(() => {
    let newDetails = [];
    for (var detail of details) {
      const location = locations[detail?.mapPoint];
      if (location) {
        newDetails.push({ ...detail, notMapPoint: true });
      } else {
        newDetails.push({ ...detail, notMapPoint: false });
      }
    }
    if (newDetails?.length != 0) {
      console.log(newDetails);
      setDetails(newDetails);
    }
  }, [locations, details]);

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

  const fetchDataWarehouse = async () => {
    try {
      let warehouseResp = {};
      if (modifyDate) {
        warehouseResp = await WarehouseApi.getById(warehouseId, modifyDate);
      } else {
        warehouseResp = await WarehouseApi.getById(warehouseId);
      }
      setWarehouse(warehouseResp);
      let locations = {};
      for (const area of warehouseResp.areas) {
        locations = { ...locations, ...area.locations };
      }
      setLocations(locations);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveDetails = (index) => {
    if (!details || !locationChoises) {
      return;
    }

    const currentDetail = details[index];
    const newDetails = [...details];
    newDetails.splice(index, 1);

    const newLocationChoises = { ...locationChoises };
    delete newLocationChoises[currentDetail.mapPoint];

    setLocationChoises(newLocationChoises);
    setDetails(newDetails);
  };

  const handleSelectDetail = ({ detail, index }) => {
    // console.log(detail);
  };

  const handleOnClickLocation = ({ rowIndex, colIndex, data }) => {
    const mapPoint = data.mapPoint;

    if (!data.id) {
      return;
    }

    if (mapPoint in locationChoises) {
      return;
    }

    const oldQuantityAllocation = caculateTotalQuantityAllocation();
    if (oldQuantityAllocation >= totalQuantityImport) {
      alert('Số lượng phân bổ đã đủ');
      return;
    }

    setLocationChoises((prev) => ({
      ...prev,
      [mapPoint]: data,
    }));

    const detail = {
      floorId: null,
      quantity: 1,
      mapPoint: data.mapPoint,
      location: data,
    };

    setDetails((prev) => [...prev, detail]);

    // tìm kiếm xem có trong locations không thì thêm vào 3
  };

  const handleConfirm = () => {
    let countQuantity = 0;
    for (var detail of details) {
      if (!detail?.notMapPoint) {
        alert('Vị trí đã bị xóa, không thể phân bổ');
        return;
      }

      if (!detail?.floorId) {
        alert('Chưa chọn vị trí tầng');
        return;
      }
      countQuantity += parseInt(detail?.quantity);
    }

    if (countQuantity < totalQuantityImport) {
      alert(`Số lượng phân bổ đã đủ`);
      return;
    }

    handleSave({ item: { ...itemNew, details: [...details] } });
  };

  const inputFieldOverview = [
    {
      type: INPUT_TEXT,
      field: '',
      title: 'Hàng hóa',
      value: itemNew?.product?.name,
      disabled: true,
      classNames: {
        container: [cx('item-container')],
        label: [cx('item-label')],
        input: [cx('item-input')],
      },
    },
    {
      type: CONATINER,
      classNames: [cx('overview-container')],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: '',
          title: 'Dự định nhập',
          value: totalQuantityImport,
          disabled: true,
          classNames: {
            container: [cx('item-container')],
            label: [cx('item-label')],
            input: [cx('item-input')],
          },
        },
        {
          type: INPUT_TEXT,
          field: '',
          title: 'Đã phân bổ',
          value: totalQuantityAllocation,
          disabled: true,
          classNames: {
            container: [cx('item-container')],
            label: [cx('item-label')],
            input: [cx('item-input')],
          },
        },
      ],
    },
  ];

  const handleChangeDetailInput = ({ event, index }) => {
    const currentDetail = details[index];
    if (!currentDetail) {
      return;
    }

    const { name, value } = event.target;
    const newDetail = { ...currentDetail, [name]: value };

    const newDetails = [...details];
    newDetails[index] = newDetail;

    console.log(newDetail);

    setDetails(newDetails);
  };

  const caculateTotalQuantityAllocation = () => {
    return details.reduce((acc, cur) => acc + parseInt(cur.quantity), 0);
  };

  const handleChangeDetailQuantity = ({ event, index }) => {
    const { name, value } = event.target;
    if (parseInt(value) <= 0) {
      return;
    }

    const currentDetail = details[index];
    const oldQuantityAllocation = caculateTotalQuantityAllocation();
    if (value > currentDetail.quantity && oldQuantityAllocation >= totalQuantityImport) {
      alert('Số lượng phân bổ đã đủ');
      return;
    }

    handleChangeDetailInput({ event, index });
  };

  const createInputFieldDetail = ({ detail, index }) => {
    const location = detail.location;
    return [
      {
        type: CONATINER,
        classNames: [cx('detail-container')],
        inputFields: [
          {
            type: INPUT_TEXT,
            field: '',
            title: 'Vị trí',
            value: location.name,
            disabled: true,
            classNames: {
              container: [cx('item-container')],
              label: [cx('item-label')],
              input: [cx('item-input')],
            },
          },
          {
            type: INPUT_SELECT,
            field: 'floorId',
            disabled: statusFinished,
            defaultValue: detail.floorId,
            title: 'Tầng',
            options: location.floors,
            handleChange: (event) => {
              handleChangeDetailInput({ event, index });
            },
            classNames: {
              container: [cx('item-container')],
              label: [cx('item-label')],
              input: [cx('item-input')],
            },
          },
        ],
      },
      {
        type: INPUT_NUMBER,
        field: 'quantity',
        disabled: statusFinished,
        title: 'Số lượng',
        value: detail.quantity,
        handleChange: (event) => {
          handleChangeDetailQuantity({ event, index });
        },
        classNames: {
          container: [cx('item-container')],
          label: [cx('item-label')],
          input: [cx('item-input', 'input-quantity')],
        },
      },
    ];
  };

  return (
    <>
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <span className={cx('close')} onClick={() => handleClose()}>
                &times;
              </span>
              <h4>Phân bổ nhập kho</h4>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('modal-body__sidebar')}>
                <div className={cx('sidebar-container')}>
                  <div className={cx('sidebar-container__view')}>
                    <div className={cx('overview')}>
                      <InputFields datas={inputFieldOverview} />
                    </div>
                    <hr />
                    <div className={cx('detail')}>
                      {details.map((detail, index) => {
                        const inputFields = createInputFieldDetail({ detail, index });
                        return (
                          <div
                            key={index}
                            className={cx('detail-element', detail?.notMapPoint ? undefined : 'not-map-point')}
                          >
                            <span
                              hidden={statusFinished}
                              className={cx('close')}
                              onClick={() => handleRemoveDetails(index)}
                            >
                              &times;
                            </span>
                            <div onClick={() => handleSelectDetail({ detail, index })}>
                              <div className={cx('element__input')}>
                                <div>
                                  <InputFields datas={inputFields} />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <hr hidden={statusFinished} />
                  {!statusFinished && (
                    <div className={cx('sidebar-container__action')}>
                      <button className={cx('btn-save')} onClick={handleConfirm}>
                        Lưu
                      </button>
                    </div>
                  )}
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

export default WarehouseDialog;
