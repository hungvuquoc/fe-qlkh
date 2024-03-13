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
import WhTransferApi from '~/store/api/wh-transactions/WhTransferApi';
import WarehouseExportDialog from './export-dialog/WarehouseExportDialog';
import WarehouseImportDialog from './import-dialog/WarehouseImportDialog';
import useStore, { LOADING } from '~/store/hooks';
import { formatDatetime, formatData, FieldType } from '~/utils/common';

const cx = classNames.bind(style);

const dataFormat = {
  warehouseExportId: FieldType.int,
  warehouseImportId: FieldType.int,
  productTypeId: FieldType.int,
  inputDate: FieldType.datetime,
  status: FieldType.int,
  documentNumber: null,
  documentDate: FieldType.datetime,
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
      type: FieldType.int,
    },
  },
};

function DialogCreateAndUpdate({ id, handleClose }) {
  const [toggle, setToggle] = useState(1);
  const [whTransfer, setWhTransfer] = useState({
    warehouse: null,
    warehouseExportId: null,
    warehouseImportId: null,
    supplier: [],
    productTypeId: null,
    code: null,
    inputDate: null,
    status: 0,
    documentNumber: null,
    documentDate: null,
    note: null,
    items: [],
  });
  const [errors, setErrors] = useState({
    warehouseExportId: '',
    warehouseImportId: '',
    productTypeId: '',
    inputDate: '',
    status: '',
    documentNumber: '',
    documentDate: '',
    items: '',
  });
  const [products, setProducts] = useState([]);
  const [warehouseExports, setWarehouseExports] = useState([]);
  const [warehouseImports, setWarehouseImports] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [showWarehouseExportDialog, setShowWarehouseExportDialog] = useState(false);
  const [showWarehouseImportDialog, setShowWarehouseImportDialog] = useState(false);
  const [itemIndex, setItemIndex] = useState(null);
  const [itemData, setItemData] = useState(null);
  const [itemDataOld, setItemeDataOld] = useState(null);
  const { startLoading, stopLoading } = useStore(LOADING);
  const [disable, setDisable] = useState(false);

  useEffect(() => {
    fetchDataWarehouseExports();
    fetchDataWarehouseImports();
  }, []);

  useEffect(() => {
    if (id) {
      fetchDataById();
    }
  }, [id]);

  useEffect(() => {
    if (whTransfer?.warehouseExportId) {
      fetchDataProductTypes();
    } else {
      setProductTypes([]);
    }
  }, [whTransfer.warehouseExportId, whTransfer.warehouseImportId]);

  useEffect(() => {
    if (whTransfer.productTypeId) {
      fetchDataProducts();
      setWhTransfer((prev) => ({
        ...prev,
        items: [],
      }));
    } else {
      setProducts([]);
    }
  }, [whTransfer.productTypeId]);

  const fetchDataById = async () => {
    try {
      const resp = await WhTransferApi.getById(id);
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
            type: detail.type,
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
        ...whTransfer,
        code: resp.code,
        status: resp.status,
        inputDate: formatDatetime(resp.inputDate, 'yyyy-MM-DD'),
        warehouse: resp.warehouse,
        warehouseExportId: resp.warehouseExport.id,
        warehouseImportId: resp.warehouseImport.id,
        productTypeId: resp.productType.id,
        documentNumber: resp.documentNumber,
        documentDate: formatDatetime(resp.documentDate, 'yyyy-MM-DD'),
        note: resp.note,
        items: newItems,
      };
      setDisable(resp.status === 1 ? true : false);
      setWhTransfer(newWhImport);
      setProductTypes(resp.warehouse.productTypes);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataWarehouseExports = async () => {
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '', useAccount: true });
      setWarehouseExports(warehouseResp.content);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataWarehouseImports = async () => {
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setWarehouseImports(warehouseResp.content);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataProductTypes = async () => {
    try {
      const productTypeResp = await WarehouseApi.getProductTypeInStock({
        warehouseId: whTransfer.warehouseExportId,
        andInWarehouseId: whTransfer.warehouseImportId,
      });
      setProductTypes(productTypeResp);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataProducts = async () => {
    try {
      const productResp = await WarehouseApi.getProductInStock({
        warehouseId: whTransfer.warehouseExportId,
        typeId: whTransfer.productTypeId,
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

    setWhTransfer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddNewItem = () => {
    if (!products || products.length === 0) {
      return;
    }

    if (whTransfer.warehouseExportId) {
      setShowWarehouseExportDialog(true);
    }
  };

  const handleChangeWarehouse = (event) => {
    const { name, value } = event.target;
    const warehouse = warehouseExports.find((e) => e.id === parseInt(value));

    if (warehouse) {
      setWhTransfer((prev) => ({
        ...prev,
        [name]: value,
        warehouse: warehouse,
        productType: null,
        productTypeId: null,
      }));
    } else {
      setWhTransfer((prev) => ({
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
          value: whTransfer.code,
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
          field: 'status',
          defaultValue: whTransfer.status,
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
          value: whTransfer.inputDate,
          title: 'Ngày lập phiếu',
          disabled: disable,
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
          field: 'warehouseExportId',
          defaultValue: whTransfer.warehouseExportId,
          title: 'Kho xuất',
          disabled: disable,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: warehouseExports,
          handleChange: (event) => {
            handleChangeWarehouse(event);
            setErrors((prev) => ({
              ...prev,
              warehouseExportId: '',
            }));
          },
          error: errors?.warehouseExportId,
          handleBlur: () => {
            validateWarehouseExportId();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          field: 'warehouseImportId',
          defaultValue: whTransfer.warehouseImportId,
          title: 'Kho nhận',
          disabled: disable,
          placeholder: 'Hãy chọn',
          fieldValue: 'id',
          fieldDisplay: 'name',
          options: warehouseImports,
          handleChange: (event) => {
            handleChangeWarehouse(event);
            setErrors((prev) => ({
              ...prev,
              warehouseImportId: '',
            }));
          },
          error: errors?.warehouseImportId,
          handleBlur: () => {
            validateWarehouseImportId();
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
          defaultValue: whTransfer.productTypeId,
          title: 'Loại hàng hóa',
          disabled: disable,
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
          type: INPUT_TEXT,
          field: 'documentNumber',
          value: whTransfer.documentNumber,
          title: 'Số chứng từ',
          disabled: disable,
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
          value: whTransfer.documentDate,
          title: 'Ngày chứng từ',
          disabled: disable ? disable : whTransfer?.documentNumber ? false : true,
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
          field: 'note',
          value: whTransfer.note,
          title: 'Ghi chú',
          disabled: disable,
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
      classNames: {
        col: ['col-fit', 'action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: ['button-container'],
      },
      render: [
        {
          content: 'Tập hợp',
          hidden: disable,
          classNames: ['button-search', 'button-group'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleOpenWarehouseExportDialog({ rowIndex, rowData, event });
          },
        },
        {
          content: 'Phân bổ',
          hidden: disable,
          classNames: ['button-search', 'button-allocation'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleOpenWarehouseImportDialog({ rowIndex, rowData, event });
          },
        },
        {
          content: 'Xóa',
          hidden: disable,
          classNames: ['button-search', 'button-delete'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteItem(rowIndex);
          },
        },
        {
          content: 'Xem kho xuất',
          hidden: !disable,
          classNames: ['button-search', 'button-view'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleOpenWarehouseExportDialog({ rowIndex, rowData, event });
          },
        },
        {
          content: 'Xem kho nhập',
          hidden: !disable,
          classNames: ['button-search', 'button-view'],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleOpenWarehouseImportDialog({ rowIndex, rowData, event });
          },
        },
      ],
    },
  ];

  const handleDeleteItem = (rowIndex) => {
    const newDataItems = [...whTransfer.items].filter((item, index) => index !== rowIndex);

    setWhTransfer((prev) => ({
      ...prev,
      items: newDataItems,
    }));
  };

  const handleOpenWarehouseExportDialog = ({ rowIndex, rowData, event }) => {
    if (whTransfer.warehouseExportId) {
      setItemIndex(rowIndex);
      const itemDetailTypes = [...rowData.details].filter((e) => e.type == 0);
      const itemConvert = { ...rowData, details: itemDetailTypes };
      console.log(itemConvert);
      console.log(rowData);
      setItemData({ ...itemConvert });
      setShowWarehouseExportDialog(true);
    }
  };

  const handleCloseWarehouseExportDialog = () => {
    setItemIndex(null);
    setItemData(null);
    setShowWarehouseExportDialog(false);
  };

  const handleConfirmWarehouseExportDialog = (item) => {
    const newDataItems = [...whTransfer.items];
    const newDetails = [...item.details].map((e) => ({ ...e, type: 0 }));
    const newItem = { ...item, details: [...newDetails] };
    if (itemIndex != null && itemIndex != undefined) {
      newDataItems[itemIndex] = { ...newItem };
    } else {
      newDataItems.push({ ...newItem });
    }

    setWhTransfer((prev) => ({
      ...prev,
      items: newDataItems,
    }));

    setItemIndex(null);
    setItemData(null);
    setShowWarehouseExportDialog(false);
  };

  const handleOpenWarehouseImportDialog = ({ rowIndex, rowData, event }) => {
    if (whTransfer.warehouseImportId) {
      setItemIndex(rowIndex);
      const itemDetailTypes = [...rowData.details].filter((e) => e.type == 1);
      const itemDetailOld = [...rowData.details].filter((e) => e.type == 0);
      const itemConvert = { ...rowData, details: itemDetailTypes };
      setItemData({ ...itemConvert });
      setItemeDataOld([...itemDetailOld]);
      setShowWarehouseImportDialog(true);
    }
  };

  const handleCloseWarehouseImportDialog = () => {
    setItemIndex(null);
    setItemData(null);
    setShowWarehouseImportDialog(false);
  };

  const handleConfirmWarehouseImportDialog = (item) => {
    const newDataItems = [...whTransfer.items];
    const currentItem = newDataItems[itemIndex];

    const newDetailTypeImports = [...item.details].map((e) => ({ ...e, type: 1 }));
    const newDetailTypeExports = [...currentItem.details].filter((e) => e.type == 0);

    const newItem = { ...itemData, details: [...newDetailTypeExports, ...newDetailTypeImports] };

    newDataItems[itemIndex] = newItem;
    setWhTransfer((prev) => ({
      ...prev,
      items: newDataItems,
    }));

    setItemIndex(null);
    setItemData(null);
    setShowWarehouseImportDialog(false);
    setErrors((prev) => ({
      ...prev,
      items: '',
    }));
  };

  const handleSave = async () => {
    if (
      validateStatus() ||
      validateInputDate() ||
      validateWarehouseExportId() ||
      validateWarehouseImportId() ||
      validateProductType() ||
      validateDocumentDate() ||
      validateItems()
    ) {
      return;
    }

    startLoading();
    try {
      const dataReq = formatData(whTransfer, dataFormat);

      if (id) {
        const resp = await WhTransferApi.update(id, dataReq);
      } else {
        const resp = await WhTransferApi.add(dataReq);
      }
      handleClose();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const validateStatus = () => {
    if (whTransfer?.status == -1) {
      setErrors((prev) => ({
        ...prev,
        status: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateInputDate = () => {
    if (!whTransfer?.inputDate) {
      setErrors((prev) => ({
        ...prev,
        inputDate: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateWarehouseImportId = () => {
    if (!whTransfer?.warehouseImportId || whTransfer?.warehouseImportId == -1) {
      setErrors((prev) => ({
        ...prev,
        warehouseImportId: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateWarehouseExportId = () => {
    if (!whTransfer?.warehouseExportId || whTransfer?.warehouseExportId == -1) {
      setErrors((prev) => ({
        ...prev,
        warehouseExportId: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateProductType = () => {
    if (!whTransfer?.productTypeId || whTransfer?.productTypeId == -1) {
      setErrors((prev) => ({
        ...prev,
        productTypeId: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateDocumentDate = () => {
    if (whTransfer?.documentNumber && !whTransfer?.documentDate) {
      setErrors((prev) => ({
        ...prev,
        documentDate: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateItems = () => {
    if (whTransfer?.items?.length == 0) {
      alert('Chưa nhập hàng hóa');
      setErrors((prev) => ({
        ...prev,
        items: 'Không được bỏ trống',
      }));
      return true;
    }

    setErrors((prev) => ({
      ...prev,
      items: '',
    }));
    return false;
  };

  return (
    <>
      {showWarehouseExportDialog && (
        <WarehouseExportDialog
          statusFinished={disable}
          warehouseId={whTransfer.warehouseExportId}
          item={itemData}
          dataProducts={disable ? [itemData.product] : products}
          handleClose={() => {
            handleCloseWarehouseExportDialog();
            validateItems();
          }}
          handleConfirm={handleConfirmWarehouseExportDialog}
        />
      )}
      {showWarehouseImportDialog && (
        <WarehouseImportDialog
          statusFinished={disable}
          warehouseId={whTransfer.warehouseImportId}
          item={itemData}
          itemDetailOld={itemDataOld}
          handleClose={handleCloseWarehouseImportDialog}
          handleSave={handleConfirmWarehouseImportDialog}
        />
      )}
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
                  {!disable && (
                    <button className={cx('button-search', 'button-add')} onClick={handleAddNewItem}>
                      Thêm hàng hóa
                    </button>
                  )}
                  {errors?.items && <span className={cx('error')}>{errors?.items}</span>}
                  <div className={cx('view-table')}>
                    <TableV3
                      columns={configTableV3}
                      datas={whTransfer.items}
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
                {!disable && (
                  <button className={cx('body__action--btn-save')} onClick={handleSave}>
                    Lưu
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DialogCreateAndUpdate;
