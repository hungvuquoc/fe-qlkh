import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import useStore, { USER } from '~/store/hooks';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';
import { useEffect, useState } from 'react';
import DialogCreateAndUpdate from './DialogCreateAndUpdate';
import UserApi from '~/store/api/UserApi';
import UserActions from '~/store/actions/UserActions';

const cx = classNames.bind(Style);

function User() {
  const [state, dispatch] = useStore(USER);
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDialog, setShowDialog] = useState(false);
  const [UserId, setUserId] = useState(null);

  useEffect(() => {
    fetchData('');
  }, []);

  const fetchData = async (keyword) => {
    try {
      const response = await UserApi.search({ pageIndex: pageIndex, pageSize: pageSize, keyword: keyword });
      dispatch(UserActions.search(response));
    } catch (error) {
      console.log('Employee: fetchData, ', error);
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
      title: 'Tên nhân viên',
      field: 'employeeName',
      classNames: {
        col: ['employee-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tên đăng nhập',
      field: 'username',
      classNames: {
        col: ['username'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Email',
      field: 'email',
      classNames: {
        col: ['email'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT_OPTIONS,
      title: 'Trạng thái',
      field: 'active',
      options: {
        false: 'Khóa',
        true: 'Kích hoạt',
      },
      classNames: {
        col: ['active'],
        colHeader: ['col-header'],
        colBody: ['active-body'],
        cell: {
          false: ['status-true'],
          true: ['status-false'],
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
          handleClick: ({ rowData }) => {
            setUserId(rowData.id);
            setShowDialog(true);
          },
        },
        {
          content: 'Tạo mật khẩu',
          classNames: ['button-search'],
          handleClick: ({ rowData }) => {
            // handleDeleteById(rowData.id);
          },
        },
        {
          content: 'Xóa',
          classNames: ['button-search', 'button-delete'],
          handleClick: ({ rowData }) => {
            handleDeleteById(rowData.id);
          },
        },
      ],
    },
  ];

  const handleDeleteById = async (id) => {
    if (window.confirm(`Bạn muốn xóa quyền này không`) === false) return;
    try {
      await UserApi.deleteById(id);
      fetchData(search);
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseDialog = () => {
    fetchData(search);
    setShowDialog(false);
  };

  const handleChangeInputSearch = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleClickButtonSearch = () => {
    fetchData(search);
  };

  return (
    <>
      {showDialog && <DialogCreateAndUpdate id={UserId} handleCloseDialog={handleCloseDialog} />}
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
              onChange={handleChangeInputSearch}
            />
            <button className={cx('button-search')} onClick={handleClickButtonSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>
        <div className={cx('view')}>
          <div className={cx('view-table')}>
            <TableV3 columns={configTableV3} datas={state.users} cx={cx} emptyMessage={'Không có dữ liệu.'} />
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

export default User;
