import classNames from 'classnames/bind';
import style from './EditProductGroup.module.scss';
import ProductGroupApi from '~/store/api/ProductGroupApi';
import { useState, useEffect } from 'react';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_INPUT_CHECKBOX,
} from '~/components/table-v3/TableV3';

const cx = classNames.bind(style);

function EditProductGroup({ dataOld = [], handleClose, handleConfirm }) {
  const [groups, setGroups] = useState([]);
  const [dataNew, setDataNew] = useState(dataOld);
  const [search, setSearch] = useState('');

  const fetchData = async (condition = { pageIndex: 1, pageSize: 9999, keyword: '' }) => {
    try {
      const response = await ProductGroupApi.search(condition);
      const groupResp = response?.content.map((obj1) => ({
        ...obj1,
        checked: dataOld.some((obj2) => obj1.id === obj2.id),
      }));
      setGroups(groupResp);
    } catch (errors) {
      console.log(errors);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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
      field: 'checked',
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChecked(rowData, event);
      },
      classNames: {
        col: ['checked'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Mã',
      field: 'code',
      classNames: {
        col: ['code'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tên',
      field: 'name',
      classNames: {
        col: ['name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT_OPTIONS,
      title: 'Trạng thái',
      field: 'deleted',
      options: {
        false: 'Đã xóa',
        true: 'Đang dùng',
      },
      classNames: {
        col: ['deleted'],
        colHeader: ['col-header'],
        colBody: ['deleted-body'],
        cell: {
          true: ['deleted-true'],
          false: ['deleted-false'],
        },
      },
    },
  ];

  const handleChecked = (rowData, event) => {
    if (event.target.checked) {
      dataNew.push(rowData);
    } else {
      setDataNew(dataNew.filter((group) => group?.id !== rowData.id));
    }
    const groupNews = [...groups];
    groupNews.map((group) => {
      if (group.id === rowData.id) {
        group['checked'] = event.target.checked;
      }
    });

    setGroups(groupNews);
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleButtonSearch = () => {
    fetchData({ pageIndex: 1, pageSize: 9999, keyword: search });
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
              <div className={cx('body_search')}>
                <input className={cx('input-search')} type="text" value={search} onChange={handleSearchChange} />
                <button className={cx('button-search')} onClick={handleButtonSearch}>
                  Tìm kiếm
                </button>
              </div>
              <div className={cx('body_table')}>
                <TableV3 columns={configTableV3} datas={groups} cx={cx} emptyMessage={'Không có dữ liệu.'} />
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('body__action')}>
                <button className={cx('body__action--btn-save')} onClick={() => handleConfirm(dataNew)}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductGroup;
