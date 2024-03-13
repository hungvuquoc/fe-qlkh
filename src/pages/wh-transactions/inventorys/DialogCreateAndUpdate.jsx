import classNames from 'classnames/bind';
import Style from './DialogCreateAndUpdate.module.scss';
import useStore, { WH_INVENTORY, LOADING } from '~/store/hooks';
import WhInventoryApi from '~/store/api/wh-transactions/WhInventoryApi';
import { useState } from 'react';
import InputFieldsV2, { INPUT_TEXT, INPUT_SELECT, INPUT_DATE, CONATINER } from '~/components/input-field-v2';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
} from '~/components/table-v3/TableV3';
import { formatDatetime, formatData, FieldType } from '~/utils/common';

const cx = classNames.bind(Style);

const dataFormat = {
  warehouseId: FieldType.int,
  productTypeId: FieldType.int,
  inputDate: FieldType.datetime,
  status: FieldType.int,
  note: null,
  items: {
    productId: FieldType.int,
    unitCheckId: FieldType.int,
    productDetailId: FieldType.int,
    consignmentNumber: null,
    quantityReal: FieldType.double,
    quantityFake: FieldType.double,
  },
};

function DialogCreateAndUpdate({ id, handleClose }) {
  const [toggle, setToggle] = useState(1);
  const { startLoading, stopLoading } = useStore(LOADING);
  const [disable, setDisable] = useState(false);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [whInventory, setWhInventory] = useState({
    warehouse: null,
    warehouseId: null,
    productTypeId: null,
    code: null,
    inputDate: null,
    status: 0,
    note: null,
    items: [],
  });

  const inputFields = [
    {
      type: CONATINER,
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'code',
          value: whInventory.code,
          title: 'Mã phiếu',
          disabled: true,
          placeholder: 'Tự động tạo',
          handleChange: (event) => {
            handleChangeInput(event);
          },
        },
        {
          type: INPUT_SELECT,
          field: 'status',
          defaultValue: whInventory.status,
          title: 'Trạng thái',
          disabled: disable,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: [
            {
              id: 0,
              name: 'Chưa hoàn thành',
            },
            {
              id: 1,
              name: 'Đã hoàn thành',
            },
          ],
          handleChange: (event) => {
            handleChangeInput(event);
          },
        },
        {
          type: INPUT_DATE,
          field: 'inputDate',
          value: whInventory.inputDate,
          title: 'Ngày lập phiếu',
          disabled: disable,
          handleChange: (event) => {
            handleChangeInput(event);
          },
        },
        {
          type: INPUT_SELECT,
          field: 'warehouseId',
          defaultValue: whInventory.warehouseId,
          title: 'Kho',
          disabled: disable,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: warehouses,
          handleChange: (event) => {
            handleChangeWarehouse(event);
          },
        },
        {
          type: INPUT_SELECT,
          field: 'productTypeId',
          defaultValue: whInventory.productTypeId,
          title: 'Loại hàng hóa',
          disabled: disable,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: productTypes,
          handleChange: (event) => {
            handleChangeInput(event);
          },
        },
        {
          type: INPUT_TEXT,
          field: 'note',
          value: whInventory.note,
          title: 'Ghi chú',
          disabled: disable,
          handleChange: (event) => {
            handleChangeInput(event);
          },
        },
      ],
    },
  ];

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setWhInventory((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeWarehouse = (event) => {
    const { value } = event.target;
    const warehouse = warehouses.find((e) => e.id === parseInt(value));

    if (warehouse) {
      setWhInventory((prev) => ({
        ...prev,
        warehouseId: value,
        warehouse: warehouse,
        productType: null,
        productTypeId: null,
      }));
    } else {
      setWhInventory((prev) => ({
        ...prev,
        warehouseId: null,
        warehouse: null,
        productType: null,
        productTypeId: null,
      }));
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
      title: 'Vị trí',
      field: 'floorName',
      classNames: {
        col: ['col-fit', 'floor-name'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Số lô',
      field: 'consignmentNumber',
      classNames: {
        col: ['col-fit', 'consignment-number'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Hàng hóa',
      field: 'productName',
      classNames: {
        col: ['col-fit', 'product-name'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Chất lượng',
      field: 'productDetailName',
      classNames: {
        col: ['col-fit', 'product-detail'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Đơn vị tính',
      field: 'unitCheckName',
      classNames: {
        col: ['col-fit', 'unit-check-name'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'SL hệ thống',
      field: 'quantityFake',
      classNames: {
        col: ['col-fit', 'quantity-fake'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'SL kiểm kê',
      field: 'quantityReal',
      classNames: {
        col: ['col-fit', 'quantity-real'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Chênh lệch',
      field: 'calculate',
      classNames: {
        col: ['col-fit', 'calculate'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT_OPTIONS,
      title: 'Hướng xử lý',
      field: 'action',
      options: {
        export: 'Xuất kho',
        import: 'Nhập kho',
      },
      classNames: {
        col: ['col-fit', 'action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
  ];

  const handleAddNewItem = () => {};

  const handleSave = async () => {};

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
              <div className={cx('modal-body_container')}>
                <div className={cx('tab-container')}>
                  <div className={cx('tab', { 'active-tab': toggle === 1 })} onClick={() => setToggle(1)}>
                    Phần chính
                  </div>
                  <div className={cx('tab', { 'active-tab': toggle === 2 })} onClick={() => setToggle(2)}>
                    Tệp đính kèm
                  </div>
                </div>
              </div>
              <div className={cx('content-tabs')}>
                <div className={cx('content', { 'active-content': toggle === 1 })}>
                  <div>
                    <InputFieldsV2 datas={inputFields} cx={cx} />
                  </div>
                  <button hidden={disable} className={cx('btn-add-item')} onClick={handleAddNewItem}>
                    Thêm hàng kiểm
                  </button>
                  <div className={cx('view-table')}>
                    <TableV3
                      columns={configTableV3}
                      datas={whInventory.items}
                      cx={cx}
                      emptyMessage={'Không có dữ liệu.'}
                    />
                  </div>
                </div>
                <div className={cx('content', { 'active-content': toggle === 2 })}>Tệp đính kèm</div>
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('body__action')}>
                <button className={cx('body__action--btn-save')} onClick={handleSave}>
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DialogCreateAndUpdate;
