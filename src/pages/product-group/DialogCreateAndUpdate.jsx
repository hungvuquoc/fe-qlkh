import classNames from 'classnames/bind';
import style from './DialogCreateAndUpdate.module.scss';
import { useState, useEffect } from 'react';
import ProductGroupApi from '~/store/api/ProductGroupApi';

const cx = classNames.bind(style);

const DialogCreateAndUpdate = ({ id, handleClose }) => {
  const [productGroupData, setProductGroupData] = useState({
    code: null,
    name: null,
    deleted: false,
  });

  const fetchData = async (id) => {
    try {
      const response = await ProductGroupApi.getById(id);
      setProductGroupData(response);
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

    setProductGroupData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (id != null) {
      try {
        await ProductGroupApi.update(id, productGroupData);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        await ProductGroupApi.add(productGroupData);
      } catch (error) {
        console.log(error);
      }
    }

    handleClose();
  };

  const onchangeDeleted = (event) => {
    setProductGroupData((prevData) => ({
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
                <div className={cx('form-label')}>Tên nhóm:</div>
                <input
                  id={id}
                  className={cx('form-input')}
                  type="text"
                  name="name"
                  value={productGroupData?.name || ''}
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
                      checked={productGroupData?.deleted === true}
                    />
                    <label htmlFor="deleted"> Đã xóa</label>
                    <input
                      type="radio"
                      id="noDeleted"
                      value="false"
                      name="statusDeleted"
                      onChange={(event) => onchangeDeleted(event)}
                      checked={productGroupData?.deleted === false}
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
