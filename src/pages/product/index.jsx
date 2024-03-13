import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';
import IndexStyle from './Index.module.scss';
import classNames from 'classnames/bind';
import useStore, { PRODUCT } from '~/store/hooks';
import { useEffect, useState } from 'react';
import ProductActions from '~/store/actions/ProductActions';
import ProductApi from '~/store/api/ProductApi';
import DiaglogCreateAndUpdate from '~/pages/product/DialogCreateAndUpdate';

const cx = classNames.bind(IndexStyle);

function Product() {
  const [showDialogCreate, setShowDialogCreate] = useState(false);
  const [state, dispatch] = useStore(PRODUCT);
  const [productId, setProductId] = useState(null);
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchData({ pageIndex: pageIndex, pageSize: pageSize, keyword: search });
  }, [pageIndex]);

  const fetchData = async (params = { pageIndex: pageIndex, pageSize: pageSize, keyword: '' }) => {
    try {
      const response = await ProductApi.search(params);
      dispatch(ProductActions.search(response));
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
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tên để in',
      field: 'namePrint',
      classNames: {
        col: ['name-print'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Loại',
      field: 'type.name',
      classNames: {
        col: ['type-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
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
          classNames: ['button-search'],
          handleClick: ({ rowIndex, rowData, event }) => {
            setProductId(rowData.id);
            setShowDialogCreate(true);
          },
        },
        {
          content: 'Xóa',
          classNames: ['button-search', 'button-delete'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteById(rowData.id);
          },
        },
      ],
    },
  ];

  const handleDeleteById = async (item) => {
    if (window.confirm(`Bạn muốn xóa nhóm hàng hóa này không [${item.id}-${item.name}]`) === false) return;
    try {
      await ProductApi.deleteById(item.id);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenDialogCreate = () => {
    setProductId(null);
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
        {showDialogCreate && <DiaglogCreateAndUpdate id={productId} handleClose={handleCloseDialogCreate} />}
        <div className={cx('view')}>
          <div className={cx('view-table')}>
            <TableV3 columns={configTableV3} datas={state.products} cx={cx} emptyMessage={'Không có dữ liệu.'} />
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

export default Product;
