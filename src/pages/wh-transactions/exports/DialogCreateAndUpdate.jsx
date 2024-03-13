import classNames from 'classnames/bind';
import style from './DialogCreateAndUpdate.module.scss';
import { useEffect, useState } from 'react';
import InputFieldsV2, { INPUT_TEXT, INPUT_SELECT, INPUT_DATE, CONATINER } from '~/components/input-field-v2';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import WarehouseApi from '~/store/api/WarehouseApi';
import WhExportApi from '~/store/api/wh-transactions/WhExportApi';
import WarehouseDialog from './sub-dialog/WarehouseDialog';
import useStore, { LOADING } from '~/store/hooks';
import { formatDatetime, formatData, FieldType, somePropertyNotEmpty } from '~/utils/common';

const cx = classNames.bind(style);

const dataFormat = {
  type: FieldType.int,
  warehouseId: FieldType.int,
  productTypeId: FieldType.int,
  inputDate: FieldType.datetime,
  status: FieldType.int,
  documentNumber: null,
  documentDate: FieldType.datetime,
  containerNumber: null,
  sealNumber: null,
  orderNumber: null,
  consumerName: null,
  note: null,
  items: {
    productId: FieldType.int,
    unitSourceId: FieldType.int,
    unitTargetId: FieldType.int,
    quantityTarget: FieldType.int,
    productDetailId: FieldType.int,
    consignmentNumber: null,
    quantityTarget: FieldType.double,
    details: {
      quantity: FieldType.double,
      floorId: FieldType.int,
      inputDate: FieldType.datetime,
    },
  },
};

function DialogCreateAndUpdate({ id, handleClose }) {
  const [toggle, setToggle] = useState(1);
  const [whExport, setWhImport] = useState({
    type: 0,
    warehouse: null,
    warehouseId: null,
    productTypeId: null,
    code: null,
    inputDate: null,
    status: 0,
    documentNumber: null,
    documentDate: null,
    containerNumber: null,
    sealNumber: null,
    orderNumber: null,
    consumerName: null,
    note: null,
    items: [],
  });
  const [errors, setErrors] = useState({
    type: '',
    warehouseId: '',
    productTypeId: '',
    inputDate: '',
    status: '',
    documentDate: '',
    items: '',
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);
  const [itemData, setItemData] = useState(null);
  const { startLoading, stopLoading } = useStore(LOADING);
  const [statusFinished, setStatusFinished] = useState(false);

  useEffect(() => {
    fetchDataWarehouses();
  }, []);

  useEffect(() => {
    if (id) {
      fetchDataById();
    }
  }, [id]);

  useEffect(() => {
    if (whExport?.warehouseId) {
      fetchDataProductTypes();
    } else {
      setProductTypes([]);
    }
  }, [whExport.warehouseId]);

  useEffect(() => {
    if (whExport.productTypeId) {
      fetchDataProducts();
      setWhImport((prev) => ({
        ...prev,
        items: [],
      }));
    } else {
      setProducts([]);
    }
  }, [whExport.productTypeId]);

  const fetchDataById = async () => {
    try {
      const resp = await WhExportApi.getById(id);
      const newItems = [];
      Array.from(resp?.items).forEach((item) => {
        const newDetails = [];
        [...item.details].forEach((detail) => {
          newDetails.push({
            floorId: detail.floor.id,
            floor: detail.floor,
            quantity: detail.quantity,
            mapPoint: detail.mapPoint,
            inputDate: detail.inputDate,
          });
        });

        newItems.push({
          product: item.product,
          productId: item.product.id,
          unitSourceId: item.unitSource.id,
          unitTargetId: item.unitTarget.id,
          unitTarget: item.unitTarget,
          productDetailId: item.productDetail.id,
          productDetail: item.productDetail,
          consignmentNumber: item.consignmentNumber,
          quantityTarget: item.quantityTarget,
          quantitySource: null,
          details: newDetails,
        });
      });

      const newWhImport = {
        ...whExport,
        code: resp.code,
        status: resp.status,
        inputDate: formatDatetime(resp.inputDate, 'yyyy-MM-DD'),
        warehouse: resp.warehouse,
        warehouseId: resp.warehouse.id,
        productTypeId: resp.productType.id,
        documentNumber: resp.documentNumber,
        documentDate: resp.documentDate ? formatDatetime(resp.documentDate, 'yyyy-MM-DD') : null,
        containerNumber: resp.containerNumber,
        sealNumber: resp.sealNumber,
        orderNumber: resp.orderNumber,
        consumerName: resp.consumerName,
        note: resp.note,
        items: newItems,
      };
      setStatusFinished(resp.status === 1 ? true : false);
      setWhImport(newWhImport);
      setProductTypes(resp.warehouse.productTypes);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataWarehouses = async () => {
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setWarehouses(warehouseResp.content);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataProductTypes = async () => {
    try {
      const productTypeResp = await WarehouseApi.getProductTypeInStock({ warehouseId: whExport.warehouseId });
      setProductTypes(productTypeResp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataProducts = async () => {
    try {
      const productResp = await WarehouseApi.getProductInStock({
        warehouseId: whExport.warehouseId,
        typeId: whExport.productTypeId,
        deleted: false,
      });
      setProducts([...productResp]);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleTab = (index) => {
    setToggle(index);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setWhImport((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewItem = () => {
    if (!products || products.length === 0) {
      return;
    }

    if (whExport.warehouseId) {
      setShowWarehouseDialog(true);
    }
  };

  const handleChangeWarehouse = (event) => {
    const { name, value } = event.target;
    const warehouse = warehouses.find((e) => e.id === parseInt(value));

    if (warehouse) {
      setWhImport((prev) => ({
        ...prev,
        [name]: value,
        warehouse: warehouse,
        productType: null,
        productTypeId: null,
      }));
    } else {
      setWhImport((prev) => ({
        ...prev,
        [name]: value,
        warehouse: null,
        productType: null,
        productTypeId: null,
      }));
    }
  };

  const configInputFieldV2s = [
    {
      type: CONATINER,
      classNames: ['form-input'],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'code',
          value: whExport.code,
          title: 'Mã phiếu',
          disabled: true,
          placeholder: 'Tự động tạo',
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
          field: 'type',
          defaultValue: whExport?.type,
          title: 'Loại phiếu',
          disabled: statusFinished,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: [
            {
              id: 0,
              name: 'Sản xuất',
            },
            {
              id: 1,
              name: 'Bán hàng',
            },
            {
              id: 2,
              name: 'Trả hàng',
            },
          ],
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              type: '',
            }));
          },
          error: errors?.type,
          handleBlur: () => {
            validateType();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          field: 'status',
          defaultValue: whExport.status,
          title: 'Trạng thái',
          disabled: statusFinished,
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
            setErrors((prev) => ({
              ...prev,
              status: '',
            }));
          },
          error: errors?.status,
          handleBlur: () => {
            validateStatus();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_DATE,
          field: 'inputDate',
          value: whExport.inputDate,
          title: 'Ngày lập phiếu',
          disabled: statusFinished,
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              inputDate: '',
            }));
          },
          error: errors?.inputDate,
          handleBlur: () => {
            validateInputDate();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          field: 'warehouseId',
          defaultValue: whExport.warehouseId,
          title: 'Kho hàng',
          disabled: statusFinished,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: warehouses,
          handleChange: (event) => {
            handleChangeWarehouse(event);
            setErrors((prev) => ({
              ...prev,
              warehouseId: '',
            }));
          },
          error: errors?.warehouseId,
          handleBlur: () => {
            validateWarehouseId();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          field: 'productTypeId',
          defaultValue: whExport.productTypeId,
          title: 'Loại hàng hóa',
          disabled: statusFinished,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: productTypes,
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              productTypeId: '',
            }));
          },
          error: errors?.productTypeId,
          handleBlur: () => {
            validateProductTypeId();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_TEXT,
          field: 'documentNumber',
          value: whExport.documentNumber,
          title: 'Số chứng từ',
          disabled: statusFinished,
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
          field: 'documentDate',
          value: whExport.documentDate,
          title: 'Ngày chứng từ',
          disabled: statusFinished ? statusFinished : whExport?.documentNumber ? false : true,
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              documentDate: '',
            }));
          },
          error: errors?.documentDate,
          handleBlur: () => {
            validateDocumentDate();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_TEXT,
          field: 'containerNumber',
          value: whExport.containerNumber,
          title: 'Số container',
          hidden: whExport?.type != 2,
          disabled: statusFinished,
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
          type: INPUT_TEXT,
          field: 'sealNumber',
          value: whExport.sealNumber,
          title: 'Số seal',
          hidden: whExport?.type != 2,
          disabled: statusFinished,
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
          type: INPUT_TEXT,
          field: 'orderNumber',
          value: whExport.orderNumber,
          title: 'Mã đơn hàng',
          hidden: whExport?.type != 1,
          disabled: statusFinished,
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
          type: INPUT_TEXT,
          field: 'consumerName',
          value: whExport.consumerName,
          title: 'Khách hàng',
          hidden: whExport?.type != 1,
          disabled: statusFinished,
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
          type: INPUT_TEXT,
          field: 'note',
          value: whExport.note,
          title: 'Ghi chú',
          disabled: statusFinished,
          handleChange: (event) => {
            handleChangeInput(event);
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
      ],
    },
  ];

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
      field: 'product.name',
      classNames: {
        col: ['col-fit', 'product'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Chất lượng',
      field: 'productDetail.tag',
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
      field: 'unitTarget.tag',
      classNames: {
        col: ['col-fit', 'unit-target'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Số lượng xuất',
      field: 'quantityTarget',
      classNames: {
        col: ['col-fit', 'quantity-target'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_BUTTON,
      title: 'Thao tác',
      classNames: ['column-fit', 'action'],
      classNames: {
        col: ['col-fit', 'action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: ['button-container'],
      },
      render: [
        {
          content: 'Sửa',
          hidden: statusFinished,
          classNames: ['button-search', 'button-edit'],
          handleClick: ({ rowIndex, rowData, event }) => {
            setItemIndex(rowIndex);
            setItemData(rowData);
            setShowWarehouseDialog(true);
          },
        },
        {
          content: 'Xóa',
          hidden: statusFinished,
          classNames: ['button-search', 'button-delete'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteItem(rowIndex);
          },
        },
        {
          content: 'Xem',
          hidden: !statusFinished,
          classNames: ['button-search', 'button-view'],
          handleClick: ({ rowIndex, rowData, event }) => {
            setItemIndex(rowIndex);
            setItemData(rowData);
            setShowWarehouseDialog(true);
          },
        },
      ],
    },
  ];

  const handleDeleteItem = (rowIndex) => {
    const newDataItems = [...whExport.items].filter((item, index) => index !== rowIndex);

    setWhImport((prev) => ({
      ...prev,
      items: newDataItems,
    }));
  };

  const handleCloseWarehouseDialog = () => {
    setItemIndex(null);
    setItemData(null);
    setShowWarehouseDialog(false);
  };

  const handleConfirmWarehouseDialog = (item) => {
    console.log(item);
    const newDataItems = [...whExport.items];
    if (itemIndex != null && itemIndex != undefined) {
      newDataItems[itemIndex] = { ...item };
    } else {
      newDataItems.push({ ...item });
    }

    setWhImport((prev) => ({
      ...prev,
      items: newDataItems,
    }));

    setItemIndex(null);
    setItemData(null);
    setShowWarehouseDialog(false);
  };

  const handleSave = async () => {
    if (
      validateType() ||
      validateStatus() ||
      validateWarehouseId() ||
      validateProductTypeId() ||
      validateInputDate() ||
      validateDocumentDate() ||
      validateItems()
    ) {
      return;
    }

    console.log(whExport);
    startLoading();
    try {
      const dataReq = formatData(whExport, dataFormat);
      console.log(dataReq);
      if (id) {
        const resp = await WhExportApi.update(id, dataReq);
      } else {
        const resp = await WhExportApi.add(dataReq);
      }
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const validateType = () => {
    if (whExport?.type == -1) {
      setErrors((prev) => ({
        ...prev,
        type: 'Không bỏ trống',
      }));
      return true;
    }
  };

  const validateWarehouseId = () => {
    if (!whExport?.warehouseId || whExport?.warehouseId == -1) {
      setErrors((prev) => ({
        ...prev,
        warehouseId: 'Không bỏ trống',
      }));
      return true;
    }
  };

  const validateProductTypeId = () => {
    if (!whExport?.productTypeId || whExport?.productTypeId == -1) {
      setErrors((prev) => ({
        ...prev,
        productTypeId: 'Không bỏ trống',
      }));
      return true;
    }
  };

  const validateInputDate = () => {
    if (!whExport?.inputDate) {
      setErrors((prev) => ({
        ...prev,
        inputDate: 'Không bỏ trống',
      }));
      return true;
    }
  };

  const validateDocumentDate = () => {
    if (whExport?.documentNumber && !whExport?.documentDate) {
      setErrors((prev) => ({
        ...prev,
        documentDate: 'Không bỏ trống',
      }));
      return true;
    }
  };

  const validateStatus = () => {
    if (whExport?.status == -1) {
      setErrors((prev) => ({
        ...prev,
        status: 'Không bỏ trống',
      }));
      return true;
    }
  };

  const validateItems = () => {
    if (whExport?.items?.length == 0) {
      setErrors((prev) => ({
        ...prev,
        items: 'Không được bỏ trống',
      }));
      return true;
    }
  };
  return (
    <>
      {showWarehouseDialog && (
        <WarehouseDialog
          statusFinished={statusFinished}
          warehouseId={whExport.warehouseId}
          item={itemData}
          dataProducts={statusFinished ? [itemData.product] : products}
          handleClose={handleCloseWarehouseDialog}
          handleConfirm={handleConfirmWarehouseDialog}
        />
      )}
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <span className={cx('close')} onClick={() => handleClose()}>
                &times;
              </span>
              <h4>Phiếu xuất kho</h4>
            </div>
            <div className={cx('modal-body')}>
              <div className={cx('modal-body_container')}>
                <div className={cx('tab-container')}>
                  <div className={cx('tab', { 'active-tab': toggle === 1 })} onClick={() => toggleTab(1)}>
                    Phần chính
                  </div>
                  {/* <div className={cx('tab', { 'active-tab': toggle === 2 })} onClick={() => toggleTab(2)}>
                    Tệp đính kèm
                  </div> */}
                </div>
              </div>
              <div className={cx('content-tabs')}>
                <div className={cx('content', { 'active-content': toggle === 1 })}>
                  <div>
                    <InputFieldsV2 datas={configInputFieldV2s} cx={cx} />
                  </div>
                  {!statusFinished && (
                    <button className={cx('button-search', 'button-add')} onClick={handleAddNewItem}>
                      Thêm hàng hóa
                    </button>
                  )}

                  <div className={cx('view-table')}>
                    <TableV3
                      columns={configTableV3}
                      datas={whExport.items}
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
