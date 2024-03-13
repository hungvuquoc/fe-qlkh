import classNames from 'classnames/bind';
import style from './DialogCreateAndUpdate.module.scss';
import { useState, useEffect } from 'react';
import SupplierApi from '~/store/api/SupplierApi';

const cx = classNames.bind(style);

const DialogCreateAndUpdate = ({ id, handleClose }) => {
  const [supplier, setSupplier] = useState({
    code: null,
    name: null,
    deleted: false,
  });

  const fetchData = async (id) => {
    try {
      const response = await SupplierApi.getById(id);
      setSupplier(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchData(id);
    }
  }, [id]);

  const handleProductInputChange = (event) => {
    const { name, value } = event.target;

    setSupplier((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (id != null) {
      try {
        await SupplierApi.update(id, supplier);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await SupplierApi.add(supplier);
      } catch (error) {
        console.log(error);
      }
    }

    handleClose();
  };

  const onchangeDeleted = (event) => {
    setSupplier((prevData) => ({
      ...prevData,
      deleted: JSON.parse(event.target.value),
    }));
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
              <div className={cx('form-group')}>
                <div className={cx('form-label')}>Tên đơn vị:</div>
                <input
                  id={id}
                  className={cx('form-input')}
                  type="text"
                  name="name"
                  value={supplier?.name || ''}
                  onChange={handleProductInputChange}
                />
              </div>
              {id != null && (
                <div className={cx('form-group')}>
                  <div className={cx('form-label')}>Trạng thái:</div>
                  <div className={cx('form-input')}>
                    <input
                      type="radio"
                      id="deleted"
                      value="true"
                      name="statusDeleted"
                      onChange={(event) => onchangeDeleted(event)}
                      checked={supplier?.deleted === true}
                    />
                    <label htmlFor="deleted"> Đã xóa</label>
                    <input
                      type="radio"
                      id="noDeleted"
                      value="false"
                      name="statusDeleted"
                      onChange={(event) => onchangeDeleted(event)}
                      checked={supplier?.deleted === false}
                    />
                    <label htmlFor="noDeleted"> Chưa xóa</label>
                  </div>
                </div>
              )}
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
