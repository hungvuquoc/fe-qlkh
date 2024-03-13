import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import Pagination from '~/components/pagination';
import TableV4, { TABLE_V4_COLUMN_INDEX, TABLE_V4_COLUMN_TEXT } from '~/components/table-v4/TableV4';
import InputFieldsV2, { INPUT_DATE, INPUT_SELECT } from '~/components/input-field-v2';
import { useEffect, useState } from 'react';
import WarehouseApi from '~/store/api/WarehouseApi';
import ProductUnitApi from '~/store/api/ProductUnitApi';
import OrganizationApi from '~/store/api/OrganizationApi';

const cx = classNames.bind(Style);

// {
//     createDate: '2023-02-02',
//     inCode: 'IMP202311000001',
//     outCode: '',
//     note: 'Xuất hàng',
//     inputDate: '2023-11-09',
//     inQuantity: 10.0,
//     outQuantity: 0.0,
//     stockQuantity: 10.0,
// },

function WhCard() {
  const [data, setData] = useState([]);
  const [searhData, setSearchData] = useState({
    startDate: null,
    endDate: null,
    warehouseId: null,
    productId: null,
  });
  const [organization, setOrganization] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [pageIndex, setPageIndex] = useState(1);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [warehouses, setWarehouses] = useState([]);
  const [warehouse, setWarehouse] = useState({});
  const [products, setProducts] = useState([]);
  const [product, setProduct] = useState({});
  const [unitReport, setUnitReport] = useState({});
  const [totalData, setTotalData] = useState({
    inQuantity: 0,
    outQuantity: 0,
    stockQuantity: 0,
  });

  useEffect(() => {
    fetchWarehouse();
    fetchOrganization();
  }, []);

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

  const fetchOrganization = async () => {
    try {
      const resp = await OrganizationApi.getInfo();
      setOrganization(resp);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCard();
  }, [searhData.startDate, searhData.endDate, searhData.warehouseId, searhData.productId]);

  const fetchCard = async () => {
    if (searhData.startDate && searhData.endDate && searhData.warehouseId && searhData.productId) {
      try {
        const cardResp = await WarehouseApi.card({
          pageIndex: pageIndex,
          pageSize: 10,
          startDate: searhData.startDate,
          endDate: searhData.endDate,
          warehouseId: searhData.warehouseId,
          productId: searhData.productId,
        });

        const newCards = cardResp?.content;

        if (newCards) {
          setData(newCards);

          let newStockQuantity = 0;
          let newInQuantity = 0;
          let newOutQuantity = 0;

          [...newCards].forEach((e) => {
            newStockQuantity += e.stockQuantity;
            newInQuantity += e.inQuantity;
            newOutQuantity += e.outQuantity;
          });

          setTotalData({
            stockQuantity: newStockQuantity,
            inQuantity: newInQuantity,
            outQuantity: newOutQuantity,
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    if (searhData.warehouseId && searhData.warehouseId != -1) {
      fetchProdudct();
      const newWarehouse = warehouses.find((e) => e.id == searhData.warehouseId);
      setWarehouse(newWarehouse);
    }
  }, [searhData.warehouseId]);

  const fetchProdudct = async () => {
    try {
      const productResp = await WarehouseApi.getProductInStock({
        warehouseId: searhData.warehouseId,
      });

      if (productResp) {
        setSearchData((prev) => ({
          ...prev,
          productId: null,
        }));
        setProducts(productResp);
        setUnitReport({});
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (searhData.productId && searhData.productId != -1) {
      fetchUnitReport();
      const newProduct = products.find((e) => e.id == searhData.productId);
      setProduct(newProduct);
    }
  }, [searhData.productId]);

  const fetchUnitReport = async () => {
    try {
      const unitResp = await ProductUnitApi.getDefaultByProductId(searhData.productId);
      if (unitResp) {
        setUnitReport(unitResp);
      }
    } catch (error) {
      console.log(error);
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
      title: 'Hàng hóa',
      field: 'productId',
      defaultValue: searhData?.productId,
      fieldValue: 'id',
      fieldDisplay: 'name',
      options: products,
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
        title: 'Ngày, tháng',
        classNames: ['create-date'],
      },
      {
        colSpan: 2,
        rowSpan: 1,
        title: 'Số hiệu chứng từ',
        classNames: ['code'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'Diễn giải',
        classNames: ['note'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'Ngày nhập, xuất',
        classNames: ['input-date'],
      },
      {
        colSpan: 3,
        rowSpan: 1,
        title: 'Số lượng',
        classNames: ['quantity'],
      },
      {
        colSpan: 1,
        rowSpan: 2,
        title: 'Ký xác nhận của kế toán',
        classNames: ['signature'],
      },
    ],
    [
      {
        title: 'Nhập',
        classNames: ['in-code'],
      },
      {
        title: 'Xuất',
        classNames: ['out-code'],
      },
      {
        title: 'Nhập',
        classNames: ['in-quantity'],
      },
      {
        title: 'Xuất',
        classNames: ['out-quantity'],
      },
      {
        title: 'Tồn',
        classNames: ['stock-quantity'],
      },
    ],
    [
      {
        title: 'A',
        classNames: ['stt'],
      },
      {
        title: 'B',
        classNames: ['create-date'],
      },
      {
        title: 'C',
        classNames: ['in-code'],
      },
      {
        title: 'D',
        classNames: ['out-code'],
      },
      {
        title: 'E',
        classNames: ['note'],
      },
      {
        title: 'F',
        classNames: ['input-date'],
      },
      {
        title: '1',
        classNames: ['in-quantity'],
      },
      {
        title: '2',
        classNames: ['out-quantity'],
      },
      {
        title: '3',
        classNames: ['stock-quantity'],
      },
      {
        title: 'G',
        classNames: ['signature'],
      },
    ],
  ];

  const configTableBody = [
    {
      type: TABLE_V4_COLUMN_INDEX,
      classNames: ['stt'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'createDate',
      classNames: ['create-date'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'inCode',
      classNames: ['in-code'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'outCode',
      classNames: ['out-code'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'note',
      classNames: ['note'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'inputDate',
      classNames: ['input-date'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'inQuantity',
      classNames: ['in-quantity'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'outQuantity',
      classNames: ['out-quantity'],
    },
    {
      type: TABLE_V4_COLUMN_TEXT,
      field: 'stockQuantity',
      classNames: ['stock-quantity'],
    },
  ];

  const configTableFood = [
    {
      colSpan: 5,
      data: 'Tổng',
      classNames: ['total'],
    },
    {
      data: 'X',
      classNames: ['note'],
    },
    {
      data: totalData.inQuantity,
      classNames: ['in-quantity'],
    },
    {
      data: totalData.outQuantity,
      classNames: ['out-quantity'],
    },
    {
      data: totalData.stockQuantity,
      classNames: ['stock-quantity'],
    },
    {
      data: 'X',
      classNames: ['signature'],
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
        <div className={cx('card-container')}>
          <div className={cx('view-title')}>
            <div className={cx('title-top')}>
              <div className={cx('left')}>
                <div className={cx('input-container')}>
                  <p className={cx('input-title')}>Đơn vị: </p>
                  <p className={cx('input-content')}>{organization?.name}</p>
                </div>
                <div className={cx('input-container')}>
                  <p className={cx('input-title')}>Địa chỉ: </p>
                  <p className={cx('input-content')}>{organization?.address}</p>
                </div>
              </div>
              <div className={cx('right')}>
                <p className={cx('main')}>Mẫu số S08 - DNN</p>
                <p className={cx('secondary')}>
                  (Ban hành theo thông tư số 200/2016 TT-BTC
                  <br />
                  Ngày 26/08/2016 của Bộ Tài Chính)
                </p>
              </div>
            </div>
            <div className={cx('title-center')}>
              <h4>THẺ KHO (SỔ KHO)</h4>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>Người lập thẻ: </p>
                <p className={cx('input-content')}></p>
              </div>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>Tờ số: </p>
                <p className={cx('input-content')}></p>
              </div>
            </div>
            <div className={cx('title-bottom')}>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>- Tên hàng hóa: </p>
                <p className={cx('input-content')}>{product?.name}</p>
              </div>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>- Mã hàng hóa: </p>
                <p className={cx('input-content')}>{product?.code}</p>
              </div>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>- Đơn vị tính: </p>
                <p className={cx('input-content')}>{unitReport?.name}</p>
              </div>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>- Kho hàng: </p>
                <p className={cx('input-content')}>{warehouse?.name}</p>
              </div>
            </div>
          </div>
          <div className={cx('view-table')}>
            <div className={cx('content')}>
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
          <div className={cx('view-footer')}>
            <div className={cx('footer-page')}>
              <p>- Sổ này có ...... trang, đánh số từ trang 01 đến ......</p>
              <div className={cx('input-container')}>
                <p className={cx('input-title')}>- Ngày mở sổ: </p>
                <p className={cx('input-content')}></p>
              </div>
            </div>
            <p style={{ margin: '0 30px', marginBlockEnd: '0px', textAlign: 'right', fontStyle: 'italic' }}>
              Ngày {currentDate.getDate()} tháng {currentDate.getMonth()} năm {currentDate.getFullYear()}
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 30px', paddingBottom: '150px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', marginBlockEnd: '0px' }}>Người lập</p>
                <p style={{ marginBlock: '0px', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', marginBlockEnd: '0px' }}>Kế toán trưởng</p>
                <p style={{ marginBlock: '0px', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 'bold', marginBlockEnd: '0px' }}>Người đại diện theo pháp luật</p>
                <p style={{ marginBlock: '0px', fontStyle: 'italic' }}>(Ký, ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>
        <div className={cx('pagination')}>
          <div className={cx('action')}>
            <Pagination pages={totalPages} setCurrentPage={setPageIndex}></Pagination>
          </div>
        </div>
      </div>
    </>
  );
}

export default WhCard;
