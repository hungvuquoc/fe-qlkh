import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import Pagination from '~/components/pagination';
import TableV4, { TABLE_V4_COLUMN_INDEX, TABLE_V4_COLUMN_TEXT } from '~/components/table-v4/TableV4';
import InputFieldsV2, { INPUT_DATE, INPUT_SELECT } from '~/components/input-field-v2';
import { useEffect, useState } from 'react';
import WarehouseApi from '~/store/api/WarehouseApi';
import { formatDatetime } from '~/utils/common';

const cx = classNames.bind(Style);

function WhReport() {
  const [data, setData] = useState([]);
  const [searhData, setSearchData] = useState({
    startDate: null,
    endDate: null,
    warehouseId: null,
    productTypes: [],
    productTypeId: null,
  });
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [warehouses, setWarehouses] = useState([]);
  const [totalData, setTotalData] = useState({
    startStockQuantity: 0,
    startStockCost: 0,
    inQuantity: 0,
    inCost: 0,
    outQuantity: 0,
    outCost: 0,
    endStockQuantity: 0,
    endStockCost: 0,
  });

  useEffect(() => {
    fetchWarehouse();
  }, []);

  useEffect(() => {
    const newWarehouse = warehouses.find((e) => e.id == searhData.warehouseId);
    const newProductTypes = newWarehouse?.productTypes;

    if (newProductTypes) {
      setSearchData((prev) => ({
        ...prev,
        productTypes: newProductTypes,
      }));
    }
  }, [searhData.warehouseId]);

  useEffect(() => {
    fetchReport();
  }, [searhData.startDate, searhData.endDate, searhData.warehouseId, searhData.productTypeId]);

  const fetchWarehouse = async () => {
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '', useAccount: true });
      if (warehouseResp) {
        setWarehouses(warehouseResp.content);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchReport = async () => {
    if (searhData.startDate && searhData.endDate && searhData.warehouseId && searhData.productTypeId) {
      try {
        const reportResp = await WarehouseApi.report({
          pageIndex: pageIndex,
          pageSize: 20,
          startDate: formatDatetime(searhData.startDate),
          endDate: formatDatetime(searhData.endDate),
          warehouseId: searhData.warehouseId,
          productTypeId: searhData.productTypeId,
        });

        if (reportResp) {
          setData(reportResp);

          // const newStartStockQuantity = reportResp.reduce((acc, cur) => acc + parseInt(cur.startStockQuantity), 0);

          let newStartStockQuantity = 0;
          let newStartStockCost = 0;
          let newInQuantity = 0;
          let newInCost = 0;
          let newOutQuantity = 0;
          let newOutCost = 0;
          let newEndStockQuantity = 0;
          let newEndStockCost = 0;

          [...reportResp].forEach((e) => {
            newStartStockQuantity += e.startStockQuantity;
            newStartStockCost += e.startStockCost;
            newInQuantity += e.inQuantity;
            newInCost += e.inCost;
            newOutQuantity += e.outQuantity;
            newOutCost += e.outCost;
            newEndStockQuantity += e.endStockQuantity;
            newEndStockCost += e.endStockCost;
          });

          setTotalData({
            startStockQuantity: newStartStockQuantity,
            startStockCost: newStartStockCost,
            inQuantity: newInQuantity,
            inCost: newInCost,
            outQuantity: newOutQuantity,
            outCost: newOutCost,
            endStockQuantity: newEndStockQuantity,
            endStockCost: newEndStockCost,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const configInput = [
    {
      type: INPUT_DATE,
      title: 'Ngày bắt đầu',
      field: 'startDate',
      value: searhData?.startDate,
      handleChange: (event) => {
        handleChangeInput(event);
      },
      classNames: {
        container: ['input-container'],
        label: [],
        input: [],
      },
    },
    {
      type: INPUT_DATE,
      title: 'Ngày kết thúc',
      field: 'endDate',
      value: searhData?.endDate,
      handleChange: (event) => {
        handleChangeInput(event);
      },
      classNames: {
        container: ['input-container'],
        label: [],
        input: [],
      },
    },
    {
      type: INPUT_SELECT,
      title: 'Kho',
      field: 'warehouseId',
      defaultValue: searhData?.warehouseId,
      fieldValue: 'id',
      fieldDisplay: 'name',
      options: warehouses,
      handleChange: (event) => {
        handleChangeInput(event);
      },
      classNames: {
        container: ['input-container'],
        label: [],
        input: [],
      },
    },
    {
      type: INPUT_SELECT,
      title: 'Loại hàng hóa',
      field: 'productTypeId',
      defaultValue: searhData?.productTypeId,
      fieldValue: 'id',
      fieldDisplay: 'name',
      options: searhData?.productTypes,
      handleChange: (event) => {
        handleChangeInput(event);
      },
      classNames: {
        container: ['input-container'],
        label: [],
        input: [],
      },
    },
  ];

  const configTableHead = [
    [
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'STT',
        classNames: ['stt'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'Mã hàng hóa',
        classNames: ['product-code'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'Tên hàng hóa',
        classNames: ['product-name'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'Số lô',
        classNames: ['consignment-number'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'ĐVT',
        classNames: ['unit-name'],
      },
      {
        colSpan: 2,
        rowSpan: 1,
        title: 'Tồn đầu kỳ',
        classNames: ['start-stock'],
      },
      {
        colSpan: 2,
        rowSpan: 1,
        title: 'Nhập trong kỳ',
        classNames: ['in_'],
      },
      {
        colSpan: 2,
        rowSpan: 1,
        title: 'Xuất trong kỳ',
        classNames: ['out_'],
      },
      {
        colSpan: 2,
        rowSpan: 1,
        title: 'Tồn cuối kỳ',
        classNames: ['end-stock'],
      },
    ],
    [
      {
        title: 'SL',
        classNames: ['quantity'],
      },
      {
        title: 'Thành tiền',
        classNames: ['cost'],
      },
      {
        title: 'SL',
        classNames: ['quantity'],
      },
      {
        title: 'Thành tiền',
        classNames: ['cost'],
      },
      {
        title: 'SL',
        classNames: ['quantity'],
      },
      {
        title: 'Thành tiền',
        classNames: ['cost'],
      },
      {
        title: 'SL',
        classNames: ['quantity'],
      },
      {
        title: 'Thành tiền',
        classNames: ['cost'],
      },
    ],
  ];

  const configTableBody = [
    {
      type: TABLE_V4_COLUMN_INDEX,
      title: 'STT',
      classNames: ['stt'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Mã hàng hóa',
      field: 'productCode',
      classNames: ['product-code'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Tên hàng hóa',
      field: 'productName',
      classNames: ['product-name'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Tên hàng hóa',
      field: 'consignmentNumber',
      classNames: ['consignment-number'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'ĐVT',
      field: 'unitName',
      classNames: ['unit-name'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'SL',
      field: 'startStockQuantity',
      classNames: ['quantity'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Thành tiền',
      field: 'startStockCost',
      classNames: ['cost'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'SL',
      field: 'inQuantity',
      classNames: ['quantity'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Thành tiền',
      field: 'inCost',
      classNames: ['cost'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'SL',
      field: 'outQuantity',
      classNames: ['quantity'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Thành tiền',
      field: 'outCost',
      classNames: ['cost'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'SL',
      field: 'endStockQuantity',
      classNames: ['quantity'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      title: 'Thành tiền',
      field: 'endStockCost',
      classNames: ['cost'],
    },
  ];

  const configTableFood = [
    {
      colSpan: 5,
      data: 'Tổng',
      classNames: ['total'],
    },
    {
      data: totalData?.startStockQuantity,
      classNames: ['quantity'],
    },
    {
      data: totalData.startStockCost,
      classNames: ['cost'],
    },
    {
      data: totalData.inQuantity,
      classNames: ['quantity'],
    },
    {
      data: totalData.inCost,
      classNames: ['cost'],
    },
    {
      data: totalData.outQuantity,
      classNames: ['quantity'],
    },
    {
      data: totalData.outCost,
      classNames: ['cost'],
    },
    {
      data: totalData.endStockQuantity,
      classNames: ['quantity'],
    },
    {
      data: totalData.endStockCost,
      classNames: ['cost'],
    },
  ];

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setSearchData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <div className={cx('main-container')}>
        <div className={cx('search-container')}>
          <InputFieldsV2 datas={configInput} cx={cx} />
        </div>
        <div className={cx('report-container')}>
          <div className={cx('view-title')}>
            <h3>BÁO CÁO NHẬP XUẤT TỒN</h3>
            <span>
              {'('}từ ngày {searhData?.startDate ? formatDatetime(searhData.startDate, 'DD-MM-yyyy') : '.... '} đến ngày{' '}
              {searhData?.endDate ? formatDatetime(searhData.endDate, 'DD-MM-yyyy') : '....'}
              {')'}
            </span>
          </div>
          <div className={cx('view-table')}>
            <div className={cx('content')}>
              <table></table>
              <TableV4
                head={configTableHead}
                body={configTableBody}
                food={configTableFood}
                datas={data}
                cx={cx}
                emptyMessage={'Không có dữ liệu.'}
              />
            </div>
          </div>
          <div className={cx('view-pagination')}>
            <div className={cx('action')}>
              <Pagination pages={totalPages} setCurrentPage={setPageIndex}></Pagination>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhReport;
