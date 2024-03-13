import classNames from 'classnames/bind';
import Style from './DialogDetail.module.scss';
import TableV3, { TABLE_V3_COLUMN_INDEX, TABLE_V3_COLUMN_TEXT } from '~/components/table-v3/TableV3';
import Pagination from '~/components/pagination';
import { useEffect, useState } from 'react';
import WarehouseApi from '~/store/api/WarehouseApi';
import { formatDatetime } from '~/utils/common';

const cx = classNames.bind(Style);

function DialogDetail({ locationName, locationId, handleClose }) {
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [dataTableView, setDataTableView] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await WarehouseApi.searchProductFloorDetail({ pageSize, pageIndex, locationId });
      setDataTableView([...resp?.content].map((e) => ({ ...e, inputDate: formatDatetime(e.inputDate, 'yyyy-MM-DD') })));
      setTotalPages(resp?.totalPages);
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
      title: 'Hàng hóa',
      field: 'productName',
      classNames: {
        col: ['product-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Chất lượng',
      field: 'productDetailName',
      classNames: {
        col: ['product-detail-name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Đơn vị',
      field: 'productUnitName',
      classNames: {
        col: ['product-unit-name'],
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
      title: 'Số lượng',
      field: 'quantity',
      classNames: {
        col: ['quantity'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
  ];

  return (
    <>
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <span className={cx('close')} onClick={() => handleClose()}>
                &times;
              </span>
              <h2>{locationName}</h2>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('view-table')}>
                <TableV3 columns={configTableV3} datas={dataTableView} cx={cx} emptyMessage={'Không có dữ liệu.'} />
              </div>
              <div className={cx('view-pagination')}>
                <div className={cx('view-pagination__action')}>
                  <Pagination pages={totalPages} setCurrentPage={setPageIndex}></Pagination>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DialogDetail;
