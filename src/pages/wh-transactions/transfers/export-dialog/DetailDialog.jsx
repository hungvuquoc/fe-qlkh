import classNames from 'classnames/bind';
import style from './DetailDialog.module.scss';
import { useEffect, useState } from 'react';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_INPUT_CHECKBOX,
  TABLE_V3_COLUMN_INPUT_NUMBER,
} from '~/components/table-v3/TableV3';
import { formatDatetime } from '~/utils/common';

const cx = classNames.bind(style);

function DetailDialog({ totalQuantityExport, totalQuantityExported, allData, oldData, handleConfirm, handleClose }) {
  const [data, setData] = useState([]); // dữ liệu dùng để hiển thị
  const [dataDetails, setDataDetails] = useState([]); // danh sách các item details được chọn
  const [newTotalQuantityExported, setNewTotalQuantityExported] = useState(totalQuantityExported);

  const configTableV3 = [
    {
      type: TABLE_V3_COLUMN_INDEX,
      title: 'STT',
      classNames: {
        col: ['stt'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_INPUT_CHECKBOX,
      title: 'Chọn',
      field: 'selected',
      classNames: {
        col: ['selected'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
      handleChange: ({ rowIndex, rowData, event }) => {
        handleCheckItem(rowIndex, rowData, event);
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tầng',
      field: 'floorName',
      classNames: {
        col: ['floor-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Ngày nhập',
      field: 'inputDate',
      classNames: {
        col: ['input-date'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Số lượng tồn',
      field: 'quantityTarget',
      classNames: {
        col: ['quantity-target'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_INPUT_NUMBER,
      title: 'Số lượng xuất',
      field: 'quantity',
      classNames: {
        col: ['quantity'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeQuantity(rowIndex, rowData, event);
      },
    },
  ];

  useEffect(() => {
    if (!allData) {
      return;
    }

    if (oldData) {
      const dataNew = [...allData].map((element) => {
        const oldItem = [...oldData].find(
          (item) => item.floorId === element.floorId && item.inputDate === element.inputDate,
        );
        if (oldItem) {
          return {
            ...element,
            selected: true,
            quantity: oldItem.quantity,
          };
        }

        return {
          ...element,
          selected: false,
        };
      });
      setData(dataNew);
      setDataDetails(oldData);
      return;
    }
    const dataNew = [...allData].map((element) => ({
      ...element,
      selected: false,
    }));
    setData(dataNew);
  }, []);

  useEffect(() => {
    if (dataDetails) {
      const newTotal = dataDetails.reduce((pre, cur) => pre + cur.quantity, 0);
      setNewTotalQuantityExported(newTotal);
    }
  }, [dataDetails]);

  const handleCheckItem = (rowIndex, row, event) => {
    const { name } = event.target;

    let newQuantity = row['quantity'] ? row['quantity'] : 0;

    if (!row[name]) {
      setDataDetails((prev) => [...prev, { ...row, quantity: newQuantity }]);
    } else {
      const newDataDetails = [...dataDetails].filter(
        (detail) => detail.floorId !== row.floorId && detail.inputDate !== row.inputDate,
      );
      setDataDetails(newDataDetails);
      newQuantity = 0;
    }

    const newData = [...data];
    newData[rowIndex] = { ...row, quantity: newQuantity, [name]: !row[name] };
    setData(newData);
  };

  const handleChangeQuantity = (rowIndex, row, event) => {
    const { name, value } = event.target;

    if (!row.selected || value <= 0) {
      return;
    }

    if (value > row.quantityTarget) {
      alert('Số lượng vượt đã tối đa');
      return;
    }

    const newDataDetails = [...dataDetails].map((e) => {
      if (e.floorId === row.floorId && e.inputDate === row.inputDate) {
        return { ...e, quantity: parseInt(value) };
      } else {
        return { ...e };
      }
    });

    setDataDetails(newDataDetails);
    console.log(newDataDetails);

    const newData = [...data];
    newData[rowIndex] = { ...row, [name]: parseInt(value) };
    setData(newData);
  };

  const handleSave = () => {
    handleConfirm(dataDetails);
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
              <h2></h2>
            </div>
            <div className={cx('modal-body')}>
              <div>Dự định xuất: {totalQuantityExport}</div>
              <div>Đã xuất: {newTotalQuantityExported}</div>
              <div className={cx('view-table')}>
                <TableV3 columns={configTableV3} datas={data} cx={cx} emptyMessage={'Không có dữ liệu.'} />
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('body__action')}>
                <button className={cx('body__action--btn-save')} onClick={handleSave}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DetailDialog;
