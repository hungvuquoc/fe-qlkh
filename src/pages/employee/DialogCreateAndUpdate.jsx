import classNames from 'classnames/bind';
import Style from './DialogCreateAndUpdate.module.scss';
import EmployeeApi from '~/store/api/EmployeeApi';
import { formatDatetime, formatData, FieldType, somePropertyNotEmpty } from '~/utils/common';
import InputFieldsV2, { INPUT_TEXT, INPUT_SELECT, INPUT_DATE, CONATINER } from '~/components/input-field-v2';
import { useEffect, useState } from 'react';
import useStore, { LOADING } from '~/store/hooks';

const cx = classNames.bind(Style);

const dataFormat = {
  name: null,
  gender: FieldType.int,
  phone: null,
  birthday: FieldType.datetime,
  deleted: null,
};

function DialogCreateAndUpdate({ id, handleCloseDialog }) {
  const [employee, setEmployee] = useState({
    code: null,
    name: null,
    gender: null,
    phone: null,
    birthday: null,
    deleted: null,
  });
  const [disabled, setDisable] = useState(false);
  const { startLoading, stopLoading } = useStore(LOADING);

  const [errors, setErrors] = useState({
    name: '',
    gender: '',
    phone: '',
    birthday: '',
    deleted: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const configInputFieldV2 = [
    {
      type: CONATINER,
      classNames: ['item-container'],
      inputFields: [
        {
          type: INPUT_TEXT,
          title: 'Mã',
          field: 'code',
          value: employee?.code,
          disabled: true,
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          title: 'Trạng thái',
          field: 'deleted',
          defaultValue: employee?.deleted,
          fieldValue: 'value',
          fieldDisplay: 'displayName',
          disabled: disabled,
          error: errors?.deleted,
          options: [
            {
              value: false,
              displayName: 'Đang sử dùng',
            },
            {
              value: true,
              displayName: 'Không dùng',
            },
          ],
          handleBlur: (event) => {
            validateDeleted();
          },
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              deleted: '',
            }));
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
      ],
    },
    {
      type: CONATINER,
      classNames: ['item-container'],
      inputFields: [
        {
          type: INPUT_TEXT,
          title: 'Họ tên',
          field: 'name',
          value: employee?.name,
          error: errors?.name,
          handleBlur: (event) => {
            validateName();
          },
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              name: '',
            }));
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_SELECT,
          title: 'Giới tính',
          field: 'gender',
          defaultValue: employee?.gender,
          fieldValue: 'value',
          fieldDisplay: 'displayName',
          disabled: disabled,
          options: [
            {
              value: 0,
              displayName: 'Nam',
            },
            {
              value: 1,
              displayName: 'Nữ',
            },
            {
              value: 2,
              displayName: 'Khác',
            },
          ],
          error: errors?.gender,
          handleBlur: (event) => {
            validateGender();
          },
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              gender: '',
            }));
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
      ],
    },
    {
      type: CONATINER,
      classNames: ['item-container'],
      inputFields: [
        {
          type: INPUT_TEXT,
          title: 'Số điện thoại',
          field: 'phone',
          value: employee?.phone,
          error: errors?.phone,
          handleBlur: (event) => {
            validatePhone();
          },
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              name: '',
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
          title: 'Ngày sinh',
          field: 'birthday',
          value: employee?.birthday,
          disabled: disabled,
          error: errors?.birthday,
          handleBlur: (event) => {
            validateBirthday();
          },
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              phone: '',
            }));
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

  const fetchData = async () => {
    if (!id) {
      return;
    }

    try {
      const response = await EmployeeApi.getById(id);
      const newEmployee = {
        ...response,
      };

      setEmployee(newEmployee);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setEmployee((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    validateName();
    validateGender();
    validateDeleted();
    validatePhone();
    validateBirthday();

    if (somePropertyNotEmpty(errors)) {
      return;
    }

    startLoading();
    try {
      const request = formatData(employee, dataFormat);
      console.log(request);
      if (id) {
        const response = await EmployeeApi.update(id, request);
      } else {
        const response = await EmployeeApi.add(request);
      }
      handleCloseDialog();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const validateName = () => {
    if (!employee?.name) {
      setErrors((prev) => ({
        ...prev,
        name: 'Không được bỏ trống',
      }));
    }
  };

  const validateGender = () => {
    if (!employee?.gender) {
      setErrors((prev) => ({
        ...prev,
        gender: 'Không được bỏ trống',
      }));
    }
  };

  const validatePhone = () => {
    if (!employee?.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Không được bỏ trống',
      }));
    }
  };

  const validateBirthday = () => {
    if (!employee?.birthday) {
      setErrors((prev) => ({
        ...prev,
        birthday: 'Không được bỏ trống',
      }));
    }
  };

  const validateDeleted = () => {
    if (!employee?.deleted) {
      setErrors((prev) => ({
        ...prev,
        deleted: 'Không được bỏ trống',
      }));
    }
  };

  return (
    <>
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('header')}>
            <span className={cx('close')} onClick={() => handleCloseDialog()}>
              &times;
            </span>
            <h2></h2>
          </div>
          <div className={cx('body')}>
            <InputFieldsV2 datas={configInputFieldV2} cx={cx} />
          </div>
          <div className={cx('footer')}>
            <div className={cx('body__action')}>
              <button className={cx('body__action--btn-save')} onClick={handleSave}>
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DialogCreateAndUpdate;
