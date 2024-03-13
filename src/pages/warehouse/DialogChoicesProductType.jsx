import classNames from 'classnames/bind';
import Style from './DialogChoicesProductType.module.scss';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_INPUT_CHECKBOX,
} from '~/components/table-v3/TableV3';
import { useEffect, useState } from 'react';

const cx = classNames.bind(Style);

function DialogChoicesProductType({ productTypes = [], handleCloseDialog, handleConfirm }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (productTypes) {
      setData(productTypes);
    }
  }, []);
  const configTableV3 = [
    {
      type: TABLE_V3_COLUMN_INDEX,
      title: 'STT',
      classNames: {
        col: ['tb-stt'],
        colHeader: ['col-header'],
        colBody: ['col-body'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_INPUT_CHECKBOX,
      title: 'Chọn',
      field: 'checked',
      handleChange: ({ rowIndex, rowData, event }) => {
        handleCheckItem({ rowIndex, rowData, event });
      },
      classNames: {
        col: ['tb-checked'],
        colHeader: ['col-header'],
        colBody: ['col-body'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Mã',
      field: 'code',
      classNames: {
        col: ['tb-code'],
        colHeader: ['col-header'],
        colBody: ['col-body', 'text-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tên',
      field: 'name',
      classNames: {
        col: ['tb-name'],
        colHeader: ['col-header'],
        colBody: ['col-body', 'text-left'],
        cell: [],
      },
    },
  ];

  const handleCheckItem = ({ rowIndex, rowData, event }) => {
    const newItem = {
      ...rowData,
      checked: !rowData.checked,
    };
    const newData = [...data];
    newData[rowIndex] = newItem;

    setData(newData);
  };

  const handleSave = () => {
    const newData = data.filter((e) => e.checked == true);
    handleConfirm(newData);
  };

  return (
    <>
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('content-header')}>
            <span className={cx('close')} onClick={() => handleCloseDialog()}>
              &times;
            </span>
            <h2></h2>
          </div>
          <div className={cx('content-body')}>
            <TableV3 columns={configTableV3} datas={data} cx={cx} emptyMessage={'Không có dữ liệu.'} />
          </div>
          <div className={cx('content-footer')}>
            <div className={cx('body__action')}>
              <button className={cx('body__action--btn-save')} onClick={handleSave}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DialogChoicesProductType;
