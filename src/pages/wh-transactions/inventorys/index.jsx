import classNames from 'classnames/bind';
import style from './Index.module.scss';
import DialogCreateAndUpdate from './DialogCreateAndUpdate';
import useStore, { WH_INVENTORY } from '~/store/hooks';
import { useState, useEffect } from 'react';
import WhInventoryApi from '~/store/api/wh-transactions/WhInventoryApi';
import WhInventoryActions from '~/store/actions/wh-transactions/WhInventoryAction';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';

const cx = classNames.bind(style);

function WhInventory() {
  const [state, dispatch] = useStore(WH_INVENTORY);
  const [whInventoryId, setWhInventoryId] = useState(null);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDialogCreate, setShowDialogCreate] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData({ pageIndex: pageIndex, pageSize: pageSize, keyword: search });
  }, [pageIndex]);

  const fetchData = async (data = { pageIndex: pageIndex, pageSize: pageSize, keyword: '' }) => {
    try {
      const params = { params: { ...data } };
      const response = await WhInventoryApi.search(params);
      dispatch(WhInventoryActions.search(response));
    } catch (error) {
      console.log(error);
    }
  };

  const configTableV3 = [
    {
      type: TABLE_V3_COLUMN_INDEX,
      title: 'STT',
      classNames: {
        col: ['col-fit', 'stt'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Số phiếu',
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
      title: 'Kho xuất',
      field: 'warehouse?.name',
      classNames: {
        col: ['warehouse-name'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Ngày tạo',
      field: 'createDate',
      classNames: {
        col: ['create-date'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Ngày kiểm',
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
      title: 'Ghi chú',
      field: 'note',
      classNames: {
        col: ['note'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Trạng thái',
      field: 'status',
      classNames: {
        col: ['status'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_BUTTON,
      title: 'Thao tác',
      classNames: {
        col: ['row-action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
      render: [
        {
          content: 'Sửa',
          classNames: [],
          handleClick: ({ rowIndex, rowData, event }) => {
            setWhInventoryId(rowData.id);
            setShowDialogCreate(true);
          },
        },
        {
          content: 'Xóa',
          classNames: [],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteById(rowData.id);
          },
        },
      ],
    },
  ];

  const handleDeleteById = async (item) => {
    if (window.confirm(`Bạn muốn xóa phiếu kiểm kê kho này không`) === false) return;
    try {
      await WhInventoryApi.deleteById(item.id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialogCreate = () => {
    setWhInventoryId(null);
    setShowDialogCreate(true);
  };

  const handleCloseDialogCreate = () => {
    fetchData({ pageIndex: pageIndex, pageSize: pageSize, keyword: search });
    setShowDialogCreate(false);
  };

  const handleButtonSearch = () => {
    fetchData({ pageIndex: pageIndex, pageSize: pageSize, keyword: search });
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };
  return (
    <>
      {showDialogCreate && <DialogCreateAndUpdate id={whInventoryId} handleClose={handleCloseDialogCreate} />}
      <div className={cx('container')}>
        <div className={cx('action')}>
          {/* <button className={cx('button-add')} onClick={handleOpenDialogCreate}>
            Thêm mới
          </button> */}
          <button className={cx('button-add')}>Thêm mới</button>
          <div className={cx('search')}>
            <input type="text" placeholder="Mã hoặc tên" value={search} onChange={handleSearchChange} />
            <button onClick={handleButtonSearch}>Tìm kiếm</button>
          </div>
        </div>
        <div className={cx('view')}>
          <div className={cx('view-table')}>
            <TableV3 columns={configTableV3} datas={state.whInventorys} cx={cx} emptyMessage={'Không có dữ liệu.'} />
          </div>
          <div className={cx('view-pagination')}>
            <div className={cx('view-pagination__action')}>
              <Pagination pages={state.totalPages} setCurrentPage={setPageIndex}></Pagination>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhInventory;
