import classNames from 'classnames/bind';
import style from './Index.module.scss';
import DialogCreateAndUpdate from './DialogCreateAndUpdate';
import useStore, { WH_TRANSFER } from '~/store/hooks';
import { useState, useEffect } from 'react';
import WhTransferApi from '~/store/api/wh-transactions/WhTransferApi';
import WhTransferActions from '~/store/actions/wh-transactions/WhTransferAction';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';

const cx = classNames.bind(style);

function WhTransfer() {
  const [state, dispatch] = useStore(WH_TRANSFER);
  const [whTransferId, setWhTransferId] = useState(null);
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
      const response = await WhTransferApi.search(params);
      dispatch(WhTransferActions.search(response));
    } catch (error) {
      console.log(error);
    }
  };

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
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Kho xuất',
      field: 'warehouseExport?.name',
      classNames: {
        col: ['wh-export-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Kho nhập',
      field: 'warehouseImport?.name',
      classNames: {
        col: ['wh-import-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
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
      title: 'Số chứng từ',
      field: 'documentNumber',
      classNames: {
        col: ['document-number'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT_OPTIONS,
      title: 'Trạng thái',
      field: 'status',
      options: {
        0: 'Chưa hoàn thành',
        1: 'Đã hoàn thành',
      },
      classNames: {
        col: ['status'],
        colHeader: ['col-header'],
        colBody: ['status-body'],
        cell: {
          0: ['status-true'],
          1: ['status-false'],
        },
      },
    },
    {
      type: TABLE_V3_COLUMN_BUTTON,
      title: 'Thao tác',
      field: 'status',
      classNames: {
        col: ['row-action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: ['button-container'],
      },
      render: [
        {
          content: 'Sửa',
          hidden: (value) => {
            return value === 1;
          },
          classNames: ['button-search'],
          handleClick: ({ rowIndex, rowData, event }) => {
            setWhTransferId(rowData.id);
            setShowDialogCreate(true);
          },
        },
        {
          content: 'Xóa',
          hidden: (value) => {
            return value === 1;
          },
          classNames: ['button-search', 'button-delete'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteById(rowData.id);
          },
        },
        {
          content: 'Xem',
          hidden: (value) => {
            return value === 0;
          },
          classNames: ['button-search'],
          handleClick: ({ rowIndex, rowData, event }) => {
            setWhTransferId(rowData.id);
            setShowDialogCreate(true);
          },
        },
      ],
    },
  ];

  const handleDeleteById = async (id) => {
    if (window.confirm(`Bạn muốn xóa phiếu nhập kho này không`) === false) return;
    try {
      await WhTransferApi.deleteById(id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialogCreate = () => {
    setWhTransferId(null);
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
      <div className={cx('container')}>
        <div className={cx('action')}>
          {/* <button className={cx('button-add')} onClick={handleOpenDialogCreate}>
            Thêm mới
          </button> */}
          <button className={cx('button-add')}>Thêm mới</button>
          <div className={cx('search')}>
            <input
              className={cx('input-search')}
              type="text"
              placeholder="Mã hoặc tên"
              value={search}
              onChange={handleSearchChange}
            />
            <button className={cx('button-search')} onClick={handleButtonSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>
        {showDialogCreate && <DialogCreateAndUpdate id={whTransferId} handleClose={handleCloseDialogCreate} />}
        <div className={cx('view')}>
          <div className={cx('view-table')}>
            <TableV3 columns={configTableV3} datas={state.whTransfers} cx={cx} emptyMessage={'Không có dữ liệu.'} />
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

export default WhTransfer;
