import classNames from 'classnames/bind';
import style from './DialogCreateAndUpdate.module.scss';
import { useEffect, useState } from 'react';
import ProductApi from '~/store/api/ProductApi';
import WarehouseApi from '~/store/api/WarehouseApi';
import SupplierApi from '~/store/api/SupplierApi';
import WhImportApi from '~/store/api/wh-transactions/WhImportApi';
import WarehouseDialog from './sub-dialog/WarehouseDialog';
import useStore, { LOADING } from '~/store/hooks';
import { formatDatetime, formatData, FieldType, somePropertyNotEmpty } from '~/utils/common';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_INPUT_TEXT,
  TABLE_V3_COLUMN_SELECT,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import InputFieldsV2, { CONATINER, INPUT_DATE, INPUT_TEXT, INPUT_SELECT } from '~/components/input-field-v2';

const cx = classNames.bind(style);

const dataFormat = {
  type: FieldType.int,
  warehouseId: FieldType.int,
  supplierId: FieldType.int,
  productTypeId: FieldType.int,
  inputDate: FieldType.datetime,
  status: FieldType.int,
  documentNumber: null,
  documentDate: FieldType.datetime,
  containerNumber: null,
  sealNumber: null,
  orderNumber: null,
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
    },
  },
};

function DialogCreateAndUpdate({ id, handleClose }) {
  const [toggle, setToggle] = useState(1);
  const [whImport, setWhImport] = useState({
    type: 1,
    warehouse: null,
    warehouseId: null,
    supplier: [],
    supplierId: null,
    productTypeId: null,
    code: null,
    inputDate: null,
    status: 0,
    documentNumber: null,
    documentDate: null,
    containerNumber: null,
    sealNumber: null,
    orderNumber: null,
    note: null,
    items: [],
  });

  const [errors, setErrors] = useState({
    type: '',
    warehouseId: '',
    supplierId: '',
    productTypeId: '',
    code: '',
    inputDate: '',
    status: '',
    documentDate: '',
    items: '',
  });
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [showWarehouseDialog, setShowWarehouseDialog] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);
  const [itemData, setItemData] = useState(null);
  const { startLoading, stopLoading } = useStore(LOADING);
  const [statusFinished, setStatusFinished] = useState(false);

  useEffect(() => {
    fetchDataWarehouses();
    fetchDataSupplier();
  }, []);

  useEffect(() => {
    if (id) {
      fetchDataWhImportById();
    }
  }, [id]);

  const fetchDataWhImportById = async () => {
    try {
      const resp = await WhImportApi.getById(id);
      let newItems = [];
      [...resp.items].forEach((item, index) => {
        const newDetails = [];
        [...item.details].forEach((detail) => {
          newDetails.push({
            floorId: detail.floor.id,
            quantity: detail.quantity,
            mapPoint: detail.location.mapPoint,
            location: detail.location,
          });
        });
        const newUnits = [...item?.product?.units].map((unit) => ({ ...unit, name: unit.tag }));
        const newProductDetails = [...item.product.details].map((detail) => ({ ...detail, name: detail.tag }));
        newItems.push({
          product: item.product,
          productId: item.product.id,
          units: newUnits,
          unitSourceId: item.unitSource.id,
          unitTargetId: item.unitTarget.id,
          productDetails: newProductDetails,
          productDetailId: item.productDetail.id,
          consignmentNumber: item.consignmentNumber,
          quantityTarget: item.quantityTarget,
          quantitySource: null,
          details: newDetails,
        });
      });
      const newWhImport = {
        ...whImport,
        createDate: resp.createDate,
        modifyDate: resp.modifyDate,
        code: resp.code,
        type: resp.type,
        status: resp.status,
        inputDate: formatDatetime(resp.inputDate, 'yyyy-MM-DD'),
        warehouse: resp.warehouse,
        warehouseId: resp.warehouse.id,
        supplierId: resp?.supplier?.id,
        productTypeId: resp.productType.id,
        documentNumber: resp.documentNumber,
        documentDate: resp.documentDate ? formatDatetime(resp.documentDate, 'yyyy-MM-DD') : null,
        containerNumber: resp.containerNumber,
        sealNumber: resp.sealNumber,
        orderNumber: resp.orderNumber,
        note: resp.note,
        items: newItems,
      };
      setStatusFinished(resp?.status === 1 ? true : false);
      setWhImport(newWhImport);
      setProductTypes(resp.warehouse.productTypes);
      // setWhImport
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataWarehouses = async () => {
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '', useAccount: true });
      setWarehouses(warehouseResp.content);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataSupplier = async () => {
    try {
      const supplierResp = await SupplierApi.search({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setSuppliers(supplierResp.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (whImport.productTypeId) {
      let req = {
        pageIndex: 1,
        pageSize: 9999,
        keyword: '',
        'typeIds[0]': whImport.productTypeId,
      };

      if (whImport?.type == 0) {
        req['supplierIds[0]'] = whImport.supplierId;
      }
      fetchDataProducts(req);

      setWhImport((prev) => ({
        ...prev,
        items: [],
      }));
    } else {
      setProducts([]);
    }
  }, [whImport.productTypeId, whImport.supplierId]);

  const fetchDataProducts = async (data) => {
    try {
      const productResp = await ProductApi.getBy(data);
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

    const newItem = {
      product: null,
      productId: null,
      units: [],
      unitSourceId: null,
      unitTargetId: null,
      productDetails: [],
      productDetailId: null,
      consignmentNumber: null,
      quantityTarget: null,
      quantitySource: null,
      details: [],
    };

    const newItems = [...whImport.items, newItem];

    setWhImport((prev) => ({
      ...prev,
      items: [...newItems],
    }));
  };

  const handleChangeWarehouse = (event) => {
    const { name, value } = event.target;
    const warehouse = warehouses.find((e) => e.id === parseInt(value));

    if (warehouse) {
      setProductTypes(warehouse.productTypes);
      setWhImport((prev) => ({
        ...prev,
        [name]: value,
        warehouse: warehouse,
        productType: null,
        productTypeId: null,
      }));
    } else {
      setProductTypes([]);
    }
  };

  const inputFieldV2s = [
    {
      type: CONATINER,
      classNames: ['form-input'],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'code',
          value: whImport?.code,
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
          defaultValue: whImport?.type,
          title: 'Loại phiếu',
          disabled: statusFinished,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: [
            {
              id: 0,
              name: 'Mua hàng',
            },
            {
              id: 1,
              name: 'Sản xuất',
            },
          ],
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              type: '',
              supplierId: '',
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
          defaultValue: whImport?.status,
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
          value: whImport?.inputDate,
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
          type: INPUT_TEXT,
          field: 'documentNumber',
          value: whImport?.documentNumber,
          title: 'Số chứng từ',
          disabled: statusFinished,
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              documentDate: '',
            }));
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
          value: whImport?.documentDate,
          title: 'Ngày chứng từ',
          disabled: statusFinished ? statusFinished : whImport?.documentNumber ? false : true,
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
          type: INPUT_SELECT,
          field: 'warehouseId',
          defaultValue: whImport?.warehouseId,
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
            validateWarehouse();
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
          defaultValue: whImport?.productTypeId,
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
            validateProductType();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          field: 'supplierId',
          defaultValue: whImport?.supplierId,
          title: 'Nhà cung cấp',
          hidden: whImport?.type == 1,
          disabled: statusFinished,
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: suppliers,
          handleChange: (event) => {
            setErrors((prev) => ({
              ...prev,
              supplierId: '',
            }));
            handleChangeInput(event);
          },
          error: errors?.supplierId,
          handleBlur: () => {
            validateSupplier();
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
          value: whImport?.containerNumber,
          title: 'Số container',
          hidden: whImport?.type == 1,
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
          value: whImport?.sealNumber,
          title: 'Số seal',
          hidden: whImport?.type == 1,
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
          value: whImport?.orderNumber,
          title: 'Mã đơn hàng',
          hidden: whImport?.type == 1,
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
          value: whImport?.note,
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
      type: TABLE_V3_COLUMN_INPUT_TEXT,
      title: 'Số lô',
      field: 'consignmentNumber',
      disabled: statusFinished,
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeInputItem({ rowIndex, rowData, event });
      },
      classNames: {
        col: ['col-fit', 'consignment-number'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_SELECT,
      title: 'Hàng hóa',
      field: 'productId',
      disabled: statusFinished,
      fieldDefaultValue: 'productId',
      optionFieldValue: 'id',
      ontionFieldDisplay: 'name',
      options: products,
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeSelectProduct({ rowIndex, rowData, event });
      },
      classNames: {
        col: ['col-fit', 'product'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_SELECT,
      title: 'Chất lượng',
      field: 'productDetailId',
      disabled: statusFinished,
      fieldDefaultValue: 'productDetailId',
      optionFieldValue: 'id',
      ontionFieldDisplay: 'name',
      fieldOptions: 'productDetails',
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeInputItem({ rowIndex, rowData, event });
      },
      classNames: {
        col: ['col-fit', 'product-detail'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_SELECT,
      title: 'Đơn vị tính',
      field: 'unitTargetId',
      disabled: statusFinished,
      fieldDefaultValue: 'unitTargetId',
      optionFieldValue: 'id',
      ontionFieldDisplay: 'name',
      fieldOptions: 'units',
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeInputItem({ rowIndex, rowData, event });
      },
      classNames: {
        col: ['col-fit', 'unit-target'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_INPUT_TEXT,
      title: 'Số lượng nhập',
      field: 'quantityTarget',
      disabled: statusFinished,
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeInputItem({ rowIndex, rowData, event });
      },
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
      classNames: {
        col: ['col-fit', 'action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: ['button-container'],
      },
      render: [
        {
          content: 'Phân bổ',
          hidden: statusFinished,
          classNames: ['button-search', 'button-allocation'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleOpenWarehouseDialog(rowIndex, rowData);
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

  const handleChangeInputItem = ({ rowIndex, rowData, event }) => {
    const { name, value } = event.target;

    const newDataItem = { ...rowData, [name]: value };
    const newDataItems = [...whImport.items];
    newDataItems[rowIndex] = newDataItem;

    console.log(newDataItem);

    setWhImport((prev) => ({
      ...prev,
      items: newDataItems,
    }));
  };

  const handleChangeSelectProduct = ({ rowIndex, rowData, event }) => {
    const { name, value } = event.target;

    const product = products.find((e) => e.id === parseInt(value));
    if (product) {
      const units = [...product.units].map((item) => ({ ...item, name: item.tag }));
      const unitSource = units.find((unit) => unit.default === true);

      const productDetails = [...product.details].map((item) => ({ ...item, name: item.tag }));

      const newDataItem = {
        ...rowData,
        productId: value,
        product: product,
        unitTargetId: null,
        unitSourceId: unitSource.id,
        units: units,
        productDetailId: null,
        productDetails: productDetails,
      };
      const newDataItems = [...whImport.items];
      newDataItems[rowIndex] = newDataItem;

      setWhImport((prev) => ({
        ...prev,
        items: newDataItems,
      }));
    } else {
      const newDataItem = {
        ...rowData,
        productId: null,
        unitTargetId: null,
        unitSourceId: null,
        units: [],
        productDetailId: null,
        details: [],
      };

      const newDataItems = [...whImport.items];
      newDataItems[rowIndex] = newDataItem;

      setWhImport((prev) => ({
        ...prev,
        items: newDataItems,
      }));
    }
  };

  const handleDeleteItem = (rowIndex) => {
    const newDataItems = [...whImport.items].filter((item, index) => index !== rowIndex);

    setWhImport((prev) => ({
      ...prev,
      items: newDataItems,
    }));
  };

  const handleCloseWarehouseDialog = () => {
    setItemIndex(null);
    setShowWarehouseDialog(false);
  };

  const handleOpenWarehouseDialog = (index, item) => {
    if (
      whImport.warehouseId &&
      item?.productId &&
      item?.productDetailId &&
      item?.unitTargetId &&
      item.quantityTarget &&
      parseInt(item.quantityTarget) > 0
    ) {
      setItemIndex(index);
      setItemData(item);
      setShowWarehouseDialog(true);
    } else {
      alert('Cần nhập đầy đủ thông tin hàng hóa');
    }
  };

  const handleConfirmChangeWarehouseDialog = ({ item }) => {
    console.log(item);
    const newDataItems = [...whImport.items];
    newDataItems[itemIndex] = { ...item };

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
      validateInputDate() ||
      validateDocumentDate() ||
      validateWarehouse() ||
      validateProductType() ||
      validateSupplier() ||
      validateItems()
    ) {
      return;
    }

    startLoading();
    try {
      const dataReq = formatData(whImport, dataFormat);
      if (id) {
        const resp = await WhImportApi.update(id, dataReq);
      } else {
        const resp = await WhImportApi.add(dataReq);
      }
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const validateType = () => {
    if (whImport?.type == -1) {
      setErrors((prev) => ({
        ...prev,
        type: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateStatus = () => {
    if (whImport?.status == -1) {
      setErrors((prev) => ({
        ...prev,
        status: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateInputDate = () => {
    if (!whImport?.inputDate) {
      setErrors((prev) => ({
        ...prev,
        inputDate: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateDocumentDate = () => {
    if (whImport?.documentNumber && !whImport?.documentDate) {
      setErrors((prev) => ({
        ...prev,
        documentDate: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateWarehouse = () => {
    if (!whImport?.warehouseId || whImport?.warehouseId == -1) {
      setErrors((prev) => ({
        ...prev,
        warehouseId: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateProductType = () => {
    if (!whImport?.productTypeId || whImport?.productTypeId == -1) {
      setErrors((prev) => ({
        ...prev,
        productTypeId: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateSupplier = () => {
    if (whImport?.type == 0 && (!whImport?.supplierId || whImport?.supplierId == -1)) {
      setErrors((prev) => ({
        ...prev,
        supplierId: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateItems = () => {
    if (whImport?.items?.length == 0) {
      alert('Chưa nhập hàng hóa');
      setErrors((prev) => ({
        ...prev,
        items: 'Không được bỏ trống',
      }));
      return true;
    }

    whImport?.items.forEach((item, index) => {
      if (
        !item?.productId ||
        !item?.productDetailId ||
        !item?.unitTargetId ||
        !item.quantityTarget ||
        !parseInt(item.quantityTarget) > 0
      ) {
        alert(`Dòng số ${index}: Chưa điền đủ thông tin hàng hóa`);
        setErrors((prev) => ({
          ...prev,
          items: `Dòng số ${index + 1}: Chưa điền đủ thông tin hàng hóa`,
        }));
        return true;
      }
    });

    setErrors((prev) => ({
      ...prev,
      items: '',
    }));
  };
  return (
    <>
      {showWarehouseDialog && (
        <WarehouseDialog
          modifyDate={
            id && whImport?.status == 1 ? (whImport?.modifyDate ? whImport?.modifyDate : whImport?.createDate) : null
          }
          warehouseId={whImport.warehouseId}
          item={itemData}
          statusFinished={statusFinished}
          handleClose={handleCloseWarehouseDialog}
          handleSave={handleConfirmChangeWarehouseDialog}
        />
      )}
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('modal-content')}>
            <div className={cx('modal-header')}>
              <span className={cx('close')} onClick={() => handleClose()}>
                &times;
              </span>
              <h4>Phiếu nhập kho</h4>
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
                  {/* <InputFields datas={inputFields} /> */}
                  <InputFieldsV2 datas={inputFieldV2s} cx={cx} />
                  {!statusFinished && (
                    <button className={cx('button-search', 'button-add')} onClick={handleAddNewItem}>
                      Thêm hàng hóa
                    </button>
                  )}

                  <div className={cx('view-table')}>
                    <TableV3
                      columns={configTableV3}
                      datas={whImport?.items}
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
                <button hidden={statusFinished} className={cx('body__action--btn-save')} onClick={handleSave}>
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
