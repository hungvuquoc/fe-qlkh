import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import useStore, { EMPLOYEE } from '~/store/hooks';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';
import { useEffect, useState } from 'react';
import DialogCreateAndUpdate from './DialogCreateAndUpdate';
import EmployeeApi from '~/store/api/EmployeeApi';
import EmployeeActions from '~/store/actions/EmployeeActions';

const cx = classNames.bind(Style);

function Employee() {
  const [state, dispatch] = useStore(EMPLOYEE);
  const [search, setSearch] = useState('');
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showDialog, setShowDialog] = useState(false);
  const [employeeId, setImployeeId] = useState(null);

  useEffect(() => {
    fetchData('');
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
      title: 'Họ tên',
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
      title: 'Ngày sinh',
      field: 'birthday',
      classNames: {
        col: ['birthday'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT_OPTIONS,
      title: 'Giới tính',
      field: 'gender',
      options: {
        0: 'Nam',
        1: 'Nữ',
        2: 'Khác',
      },
      classNames: {
        col: ['gender'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Số điện thoại',
      field: 'phone',
      classNames: {
        col: ['phone'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT_OPTIONS,
      title: 'Trạng thái',
      field: 'deleted',
      disabled: true,
      options: {
        false: 'Đang dùng',
        true: 'Không dùng',
      },
      classNames: {
        col: ['deleted'],
        colHeader: ['col-header'],
        colBody: ['deleted-body'],
        cell: {
          true: ['status-true'],
          false: ['status-false'],
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
            setImployeeId(rowData.id);
            setShowDialog(true);
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
    if (window.confirm(`Bạn muốn xóa nhân viên này không`) === false) return;
    try {
      await EmployeeApi.deleteById(id);
      fetchData(search);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async (keyword) => {
    try {
      const response = await EmployeeApi.search({ pageIndex: pageIndex, pageSize: pageSize, keyword: keyword });
      dispatch(EmployeeActions.search(response));
    } catch (error) {
      console.log('Employee: fetchData, ', error);
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
      {showDialog && <DialogCreateAndUpdate id={employeeId} handleCloseDialog={handleCloseDialog} />}
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
            <TableV3 columns={configTableV3} datas={state.employees} cx={cx} emptyMessage={'Không có dữ liệu.'} />
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

export default Employee;
