import useStore, { WAREHOUSE } from '~/store/hooks';
import { useEffect, useState } from 'react';
import WarehouseActions from '~/store/actions/WarehouseActions';
import WarehouseApi from '~/store/api/WarehouseApi';
import DialogCreate2 from './DialogCreate2';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';
import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import { hasAuthorities } from '~/utils/common';
import { KEY_AUTHORITIES } from '~/utils/appConstant';

const cx = classNames.bind(Style);

// kho hang
const Warehouse = () => {
  const [state, dispatch] = useStore(WAREHOUSE);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [warehouseId, setWarehouseId] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [search, setSearch] = useState('');

  const [isShow, setIsShow] = useState(hasAuthorities([KEY_AUTHORITIES.ROOT, KEY_AUTHORITIES.WH_ROOT]));

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const fetchData = async () => {
    try {
      const response = await WarehouseApi.search({
        pageIndex: pageIndex,
        pageSize: pageSize,
        keyword: search,
        useAccount: true,
      });
      dispatch(WarehouseActions.search(response));
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialogCreate = () => {
    fetchData();
    setShowDialog(false);
    setWarehouseId(null);
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
      title: 'Mã kho',
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
      title: 'Tên kho',
      field: 'name',
      classNames: {
        col: ['name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Địa chỉ',
      field: 'address',
      classNames: {
        col: ['address'],
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
        true: 'Đã xóa',
        false: 'Đang dùng',
      },
      classNames: {
        col: ['deleted'],
        colHeader: ['col-header'],
        colBody: ['deleted-body'],
        cell: {
          true: ['delete-true'],
          false: ['delete-false'],
        },
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
          hidden: !isShow,
          classNames: ['button-search'],
          handleClick: ({ rowIndex, rowData, event }) => {
            setWarehouseId(rowData.id);
            setShowDialog(true);
          },
        },
        {
          content: 'Xóa',
          hidden: !isShow,
          classNames: ['button-search', 'button-delete'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteById(rowData.id);
          },
        },
      ],
    },
  ];

  const handleDeleteById = async (item) => {
    if (window.confirm(`Bạn muốn xóa kho này không`) === false) return;
    try {
      // await WarehouseApi.deleteById(item.id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleButtonSearch = () => {
    fetchData();
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  return (
    <>
      <div className={cx('container')}>
        <div className={cx('action')}>
          {/* <button className={cx('button-add')} onClick={() => setShowDialog(true)}>
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
        {showDialog && <DialogCreate2 id={warehouseId} handleClose={handleCloseDialogCreate} />}
        <div className={cx('view')}>
          <div className={cx('view-table')}>
            <TableV3 columns={configTableV3} datas={state.warehouses} cx={cx} emptyMessage={'Không có dữ liệu.'} />
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
};

export default Warehouse;
