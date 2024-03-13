import classNames from 'classnames/bind';
import style from './DialogCreateAndUpdate.module.scss';
import { useState, useEffect } from 'react';
import { mapObjectToForm, somePropertyNotEmpty } from '~/utils/common';
import ProductApi from '~/store/api/ProductApi';
import ProductTypeApi from '~/store/api/ProductTypeApi';
import Tag from '~/components/tag/Tag';
import EditProductGroup from './sub-dialog/EditProductGroup';
import EditProductSupplier from './sub-dialog/EditProductSupplier';
import EditProductDetail from './sub-dialog/EditProductDetail';
import EditProductUnit from './sub-dialog/EditProductUnit';

const cx = classNames.bind(style);

const DialogCreateAndUpdate = ({ id, handleClose }) => {
  const [showDialotEditGroup, setShowDialogEditGroup] = useState(false);
  const [showDialotEditSupplier, setShowDialogEditSupplier] = useState(false);
  const [showDialotEditDetail, setShowDialogEditDetail] = useState(false);
  const [showDialotEditUnit, setShowDialogEditUnit] = useState(false);
  const [productTypeData, setProductTypeData] = useState([]);
  const [errors, setErrors] = useState({
    code: '',
    name: '',
    namePrint: '',
    typeId: -1,
    deleted: '',
    addGroups: '',
    addSuppliers: '',
    addDetails: '',
    addUnits: '',
  });
  const [productData, setProductData] = useState({
    code: null,
    name: null,
    namePrint: null,
    typeId: -1,
    deleted: false,
    note: null,
    groups: [],
    groupOlds: [],
    addGroups: [],
    deleteGroups: [],
    suppliers: [],
    supplierOlds: [],
    addSuppliers: [],
    deleteSuppliers: [],
    details: [],
    detailOlds: [],
    addDetails: [],
    deleteDetails: [],
    units: [],
    unitOlds: [],
    addUnits: [],
    deleteUnits: [],
  });

  const fetchData = async (id) => {
    try {
      const response = await ProductApi.getById(id);
      setProductData({
        ...response,
        typeId: response.type.id,
        groupOlds: [...response.groups],
        addGroups: [],
        deleteGroups: [],
        supplierOlds: [...response.suppliers],
        addSuppliers: [],
        deleteSuppliers: [],
        detailOlds: [...response.details],
        addDetails: [],
        deleteDetails: [],
        unitOlds: [...response.units],
        addUnits: [],
        deleteUnits: [],
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchProductType = async () => {
    try {
      const response = await ProductTypeApi.search({ pageSize: 9999, pageIndex: 1 });
      setProductTypeData(response?.content);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProductType();
  }, []);

  useEffect(() => {
    if (id != null) {
      fetchData(id);
    }
  }, [id]);

  const handleSave = async () => {
    validateName();
    validateNamePrint();
    validateTypeId();
    validateGroup(productData.addGroups);
    validateDetail(productData.addDetails);
    validateSupplier(productData.addSuppliers);
    validateUint(productData.addUnits);

    if (somePropertyNotEmpty(errors)) {
      return;
    }

    const data = {
      name: productData.name,
      namePrint: productData.namePrint,
      typeId: productData.typeId,
      deleted: productData.deleted,
      note: productData.note,
      addGroupIds: [...productData.addGroups],
      deleteGroupIds: [...productData.deleteGroups],
      addSupplierIds: [...productData.addSuppliers],
      deleteSupplierIds: [...productData.deleteSuppliers],
      addDetails: [...productData.addDetails],
      deleteDetailIds: [...productData.deleteDetails],
      addUnits: [...productData.addUnits],
      deleteUnitIds: [...productData.deleteUnits],
    };

    if (id != null) {
      try {
        console.log(data);
        const formData = new FormData();
        mapObjectToForm(formData, data, '');
        await ProductApi.update(id, formData);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();
        mapObjectToForm(formData, data, '');
        await ProductApi.add(formData);
      } catch (error) {
        console.log(error);
      }
    }

    handleClose();
  };

  const onchangeDeleted = (event) => {
    setProductData((prevData) => ({
      ...prevData,
      deleted: JSON.parse(event.target.value),
    }));
  };

  const handleDeleteGroupItem = (index, item) => {
    const groupOldIds = new Set(productData.groupOlds.map((obj) => obj.id));

    // xoa trong add
    const addGroups = [...productData.addGroups].filter((id) => id !== item.id);

    const deleteGroups = [...productData.deleteGroups];
    if (groupOldIds.has(item.id)) {
      // them vao delete
      deleteGroups.push(item.id);
    }

    const newGroup = productData.groups;
    newGroup.splice(index, 1);

    validateGroup(newGroup);
    setProductData((prevData) => ({
      ...prevData,
      groups: [...newGroup],
      addGroups: addGroups,
      deleteGroups: deleteGroups,
    }));
  };

  const handleDeleteSupplierItem = (index, item) => {
    const supplierOldIds = new Set(productData.supplierOlds.map((obj) => obj.id));

    // xoa trong add
    const addSuppliers = [...productData.addSuppliers].filter((id) => id !== item.id);

    const deleteSuppliers = [...productData.deleteSuppliers];
    if (supplierOldIds.has(item.id)) {
      // them vao delete
      deleteSuppliers.push(item.id);
    }

    const newSuppliers = productData.suppliers;
    newSuppliers.splice(index, 1);

    validateSupplier(newSuppliers);
    setProductData((prevData) => ({
      ...prevData,
      suppliers: [...newSuppliers],
      addSuppliers: addSuppliers,
      deleteSuppliers: deleteSuppliers,
    }));
  };

  const handleDeleteDetailItem = (index, item) => {
    const detailOldIds = new Set(productData.detailOlds.map((obj) => obj.id));

    // xoa trong add
    const addDetails = [...productData.addDetails].filter((id) => id !== item.id);

    const deleteDetails = [...productData.deleteDetails];
    if (detailOldIds.has(item.id)) {
      // them vao delete
      deleteDetails.push(item.id);
    }

    const newDetails = productData.details;
    newDetails.splice(index, 1);

    validateDetail(newDetails);
    setProductData((prevData) => ({
      ...prevData,
      details: [...newDetails],
      addDetails: addDetails,
      deleteDetails: deleteDetails,
    }));
  };

  const handleDeleteUnitItem = (index, item) => {
    const unitOldIds = new Set(productData.unitOlds.map((obj) => obj.id));

    // xoa trong add
    const addUnits = [...productData.addUnits].filter((id) => id !== item.id);

    const deleteUnits = [...productData.deleteUnits];
    if (unitOldIds.has(item.id)) {
      // them vao delete
      deleteUnits.push(item.id);
    }

    const newUnits = productData.units;
    newUnits.splice(index, 1);

    validateUint(newUnits);
    setProductData((prevData) => ({
      ...prevData,
      units: [...newUnits],
      addUnits: addUnits,
      deleteUnits: deleteUnits,
    }));
  };

  /// dialog edit group
  const handleConfirmDialogEditGroup = (dataNew) => {
    setShowDialogEditGroup(false);

    const groupOldIds = new Set(productData.groupOlds.map((obj) => obj.id));
    const newGroupIds = new Set(dataNew.map((obj) => obj.id));

    const addGroups = [...newGroupIds].filter((id) => !groupOldIds.has(id));
    const deleteGroups = [...groupOldIds].filter((id) => !newGroupIds.has(id));

    validateGroup(dataNew);
    setProductData((prev) => ({
      ...prev,
      groups: [...dataNew],
      addGroups: addGroups,
      deleteGroups: deleteGroups,
    }));
  };

  const handleConfirmDialogEditSupplier = (dataNew) => {
    setShowDialogEditSupplier(false);

    const supplierOldIds = new Set(productData.supplierOlds.map((obj) => obj.id));
    const newSupplierIds = new Set(dataNew.map((obj) => obj.id));

    const addSuppliers = [...newSupplierIds].filter((id) => !supplierOldIds.has(id));
    const deleteSuppliers = [...supplierOldIds].filter((id) => !newSupplierIds.has(id));

    validateSupplier(dataNew);
    setProductData((prev) => ({
      ...prev,
      suppliers: [...dataNew],
      addSuppliers: addSuppliers,
      deleteSuppliers: deleteSuppliers,
    }));
  };

  const handleConfirmDialogEditDetail = (dataNew) => {
    setShowDialogEditDetail(false);

    const detailOldIds = new Set(productData.detailOlds.map((obj) => obj.id));
    const newDetailIds = new Set(
      dataNew
        .filter((obj) => {
          return obj.id !== undefined || obj.id !== null;
        })
        .map((obj) => obj.id),
    );

    const addDetails = dataNew.filter((obj) => {
      return obj.id === undefined || obj.id === null;
    });
    const deleteDetails = [...detailOldIds].filter((id) => !newDetailIds.has(id));

    validateDetail(dataNew);
    setProductData((prev) => ({
      ...prev,
      details: [...dataNew],
      addDetails: addDetails,
      deleteDetails: deleteDetails,
    }));
  };

  const handleConfirmDialogEditUnit = (dataNew) => {
    setShowDialogEditUnit(false);

    const unitOldIds = new Set(productData.unitOlds.map((obj) => obj.id));
    const newUnitIds = new Set(
      dataNew
        .filter((obj) => {
          return obj.id !== undefined || obj.id !== null;
        })
        .map((obj) => obj.id),
    );

    // const addUnits = dataNew.filter((obj) => {
    //   return (
    //     obj.id === undefined || obj.id === null || (obj.id !== null && (obj.default === true || obj.useReport === true))
    //   );
    // });

    const deleteUnits = [...unitOldIds].filter((id) => !newUnitIds.has(id));

    validateUint(dataNew);
    setProductData((prev) => ({
      ...prev,
      units: [...dataNew],
      addUnits: [...dataNew],
      deleteUnits: deleteUnits,
    }));
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setProductData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setErrors((prev) => ({ ...prev, name: '' }));
  }, [productData?.name]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, namePrint: '' }));
  }, [productData?.namePrint]);

  useEffect(() => {
    setErrors((prev) => ({ ...prev, typeId: '' }));
  }, [productData?.typeId]);

  const validateName = () => {
    if (!productData?.name) {
      setErrors((prev) => ({ ...prev, name: 'Không được bỏ trống' }));
    }
  };

  const validateNamePrint = () => {
    if (!productData?.namePrint) {
      setErrors((prev) => ({ ...prev, namePrint: 'Không được bỏ trống' }));
    }
  };

  const validateTypeId = () => {
    if (!productData?.typeId || productData?.typeId == -1) {
      setErrors((prev) => ({ ...prev, typeId: 'Không được bỏ trống' }));
      return;
    }
  };

  const validateGroup = (data) => {
    if (!id && data?.length == 0) {
      setErrors((prev) => ({ ...prev, addGroups: 'Chọn nhóm sản phẩm' }));
      return;
    }
  };

  const validateDetail = (data) => {
    if (data?.length == 0) {
      setErrors((prev) => ({ ...prev, addDetails: 'Nhập giá sản phẩm' }));
      return;
    }
  };

  const validateSupplier = (data) => {
    if (data?.length == 0) {
      setErrors((prev) => ({ ...prev, addSuppliers: 'Chọn nhà cung cấp sản phẩm' }));
      return;
    }
  };

  const validateUint = (data) => {
    if (data?.length == 0) {
      setErrors((prev) => ({ ...prev, addUnits: 'Nhập đơn vị tính' }));
      return;
    }
  };

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
                <div className={cx('body_container-image')}>image</div>
                <div className={cx('body_container-form')}>
                  <div className={cx('body_container-form_item')}>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="product-name">Tên</label>
                      </div>
                      <div className={cx('form-input')}>
                        <input
                          type="text"
                          name="name"
                          id="product-name"
                          value={productData?.name}
                          onBlur={validateName}
                          onChange={(event) => handleChangeInput(event)}
                        />
                      </div>
                      {errors?.name && <span className={cx('error')}>{errors?.name}</span>}
                    </div>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="product-name-print">Tên in</label>
                      </div>
                      <div className={cx('form-input')}>
                        <input
                          type="text"
                          name="namePrint"
                          id="product-name-print"
                          onBlur={validateNamePrint}
                          value={productData?.namePrint}
                          onChange={(event) => handleChangeInput(event)}
                        />
                        {errors?.namePrint && <span className={cx('error')}>{errors?.namePrint}</span>}
                      </div>
                    </div>
                  </div>
                  <div className={cx('body_container-form_item')}>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="type">Loại</label>
                      </div>
                      <div className={cx('form-input')}>
                        <select
                          name="typeId"
                          id="typeId"
                          defaultValue={productData.typeId}
                          onBlur={validateTypeId}
                          onChange={(event) => handleChangeInput(event)}
                        >
                          <option value={-1}>-- Chọn loại --</option>
                          {productTypeData?.map((item, index) => (
                            <option key={index} value={item.id} selected={productData?.type?.id === item.id}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                        {errors?.typeId && <span className={cx('error')}>{errors?.typeId}</span>}
                      </div>
                    </div>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label>Trạng thái</label>
                      </div>
                      <div className={cx('form-input')}>
                        <input
                          type="radio"
                          id="deleted"
                          value={true}
                          name="statusDeleted"
                          onChange={(event) => onchangeDeleted(event)}
                          checked={productData?.deleted === true}
                        />
                        <label htmlFor="deleted"> Đã xóa</label>
                        &nbsp;&nbsp;&nbsp;
                        <input
                          type="radio"
                          id="noDeleted"
                          value={false}
                          name="statusDeleted"
                          onChange={(event) => onchangeDeleted(event)}
                          checked={productData?.deleted === false}
                        />
                        <label htmlFor="noDeleted"> Chưa xóa</label>
                      </div>
                    </div>
                  </div>
                  <div className={cx('body_container-form_item')}>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="productName">Ghi chú</label>
                      </div>
                      <div className={cx('form-input')}>
                        <input
                          type="text"
                          name="note"
                          id="productName"
                          value={productData?.note}
                          onChange={(event) => handleChangeInput(event)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={cx('body_container-form_item')}>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="productName">Nhóm</label>
                      </div>
                      {showDialotEditGroup && (
                        <EditProductGroup
                          dataOld={productData?.groups}
                          handleClose={() => {
                            setShowDialogEditGroup(false);
                            validateGroup(productData?.groups);
                          }}
                          handleConfirm={handleConfirmDialogEditGroup}
                        />
                      )}
                      <div className={cx('form-input', 'form-tag')}>
                        <div className={cx('tag')}>
                          <Tag data={productData?.groups} handleDelete={handleDeleteGroupItem} />
                          {errors?.addGroups && <span className={cx('error')}>{errors?.addGroups}</span>}
                        </div>
                        <button
                          className={cx('button-search')}
                          onClick={() => {
                            setShowDialogEditGroup(true);
                            setErrors((prev) => ({ ...prev, addGroups: '' }));
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="productNamePrint">Nhà cung cấp</label>
                      </div>
                      {showDialotEditSupplier && (
                        <EditProductSupplier
                          dataOld={productData?.suppliers}
                          handleClose={() => {
                            setShowDialogEditSupplier(false);
                            validateSupplier(productData?.suppliers);
                          }}
                          handleConfirm={handleConfirmDialogEditSupplier}
                        />
                      )}
                      <div className={cx('form-input', 'form-tag')}>
                        <div className={cx('tag')}>
                          <Tag data={productData?.suppliers} handleDelete={handleDeleteSupplierItem} />
                          {errors?.addSuppliers && <span className={cx('error')}>{errors?.addSuppliers}</span>}
                        </div>
                        <button
                          className={cx('button-search')}
                          onClick={() => {
                            setShowDialogEditSupplier(true);
                            setErrors((prev) => ({ ...prev, addSuppliers: '' }));
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className={cx('body_container-form_item')}>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="productName">Giá</label>
                      </div>
                      {showDialotEditDetail && (
                        <EditProductDetail
                          dataOld={productData?.details}
                          handleClose={() => {
                            setShowDialogEditDetail(false);
                            validateDetail(productData?.details);
                          }}
                          handleConfirm={handleConfirmDialogEditDetail}
                        />
                      )}
                      <div className={cx('form-input', 'form-tag')}>
                        <div className={cx('tag')}>
                          <Tag fieldName="tag" data={productData?.details} handleDelete={handleDeleteDetailItem} />
                          {errors?.addDetails && <span className={cx('error')}>{errors?.addDetails}</span>}
                        </div>
                        <button
                          className={cx('button-search')}
                          onClick={() => {
                            setShowDialogEditDetail(true);
                            setErrors((prev) => ({ ...prev, addDetails: '' }));
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                    <div className={cx('form_item-container')}>
                      <div className={cx('form-label')}>
                        <label htmlFor="productNamePrint">Đơn vị tính</label>
                      </div>
                      {showDialotEditUnit && (
                        <EditProductUnit
                          dataOld={productData?.units}
                          handleClose={() => {
                            setShowDialogEditUnit(false);
                            validateUint(productData?.units);
                          }}
                          handleConfirm={handleConfirmDialogEditUnit}
                        />
                      )}
                      <div className={cx('form-input', 'form-tag')}>
                        <div className={cx('tag')}>
                          <Tag fieldName="tag" data={productData?.units} handleDelete={handleDeleteUnitItem} />
                          {errors?.addUnits && <span className={cx('error')}>{errors?.addUnits}</span>}
                        </div>
                        <button
                          className={cx('button-search')}
                          onClick={() => {
                            setShowDialogEditUnit(true);
                            setErrors((prev) => ({ ...prev, addUnits: '' }));
                          }}
                        >
                          Thêm
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
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
};

export default DialogCreateAndUpdate;
