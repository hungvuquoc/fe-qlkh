import classNames from 'classnames/bind';
import Style from './Index.module.scss';
import InputFieldsV2, { CONATINER, INPUT_TEXT } from '~/components/input-field-v2';
import { useEffect, useState } from 'react';
import useStore, { LOADING } from '~/store/hooks';
import OrganizationApi from '~/store/api/OrganizationApi';
import { hasAuthority } from '~/utils/common';
import { KEY_AUTHORITIES } from '~/utils/appConstant';

const cx = classNames.bind(Style);

function Organization() {
  const [organization, setOrganization] = useState({});
  const { startLoading, stopLoading } = useStore(LOADING);
  const [errors, setErrors] = useState({
    name: '',
    enterpriseCode: '',
    managerName: '',
    address: '',
    phone: '',
    email: '',
    description: '',
  });

  const [hasAuth, setHasAuth] = useState(hasAuthority(KEY_AUTHORITIES.ROOT));

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resp = await OrganizationApi.getInfo();
      setOrganization(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const configInputFieldV2s = [
    {
      type: CONATINER,
      classNames: ['form-input'],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'name',
          disabled: !hasAuth,
          value: organization?.name,
          title: 'Tên công ty',
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              name: '',
            }));
          },
          error: errors?.name,
          handleBlur: () => {
            validateName();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_TEXT,
          field: 'managerName',
          disabled: !hasAuth,
          value: organization?.managerName,
          title: 'Tên giám đốc',
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              managerName: '',
            }));
          },
          error: errors?.managerName,
          handleBlur: () => {
            validateManagerName();
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
      classNames: ['form-input'],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'enterpriseCode',
          disabled: !hasAuth,
          value: organization?.enterpriseCode,
          title: 'Mã cửa hàng',
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              enterpriseCode: '',
            }));
          },
          error: errors?.enterpriseCode,
          handleBlur: () => {
            validateEnterpriseCode();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_TEXT,
          field: 'address',
          disabled: !hasAuth,
          value: organization?.address,
          title: 'Địa chỉ',
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              address: '',
            }));
          },
          error: errors?.address,
          handleBlur: () => {
            validateAddress();
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
      classNames: ['form-input'],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'phone',
          disabled: !hasAuth,
          value: organization?.phone,
          title: 'Số điện thoại',
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              phone: '',
            }));
          },
          error: errors?.phone,
          handleBlur: () => {
            validatePhone();
          },
          classNames: {
            container: ['input-container'],
            label: [],
            input: [],
          },
        },
        {
          type: INPUT_TEXT,
          field: 'email',
          disabled: !hasAuth,
          value: organization?.email,
          title: 'Email',
          handleChange: (event) => {
            handleChangeInput(event);
            setErrors((prev) => ({
              ...prev,
              email: '',
            }));
          },
          error: errors?.email,
          handleBlur: () => {
            validateEmail();
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
      classNames: ['form-input'],
      inputFields: [
        {
          type: INPUT_TEXT,
          field: 'description',
          disabled: !hasAuth,
          value: organization?.description,
          title: 'Mô tả',
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

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setOrganization((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateName = () => {
    if (!organization?.name) {
      setErrors((prev) => ({
        ...prev,
        name: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateManagerName = () => {
    if (!organization?.managerName) {
      setErrors((prev) => ({
        ...prev,
        managerName: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateEnterpriseCode = () => {
    if (!organization?.enterpriseCode) {
      setErrors((prev) => ({
        ...prev,
        enterpriseCode: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateAddress = () => {
    if (!organization?.address) {
      setErrors((prev) => ({
        ...prev,
        address: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validatePhone = () => {
    if (!organization?.phone) {
      setErrors((prev) => ({
        ...prev,
        phone: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const validateEmail = () => {
    if (!organization?.email) {
      setErrors((prev) => ({
        ...prev,
        email: 'Không được bỏ trống',
      }));
      return true;
    }
  };

  const handleSave = async () => {
    validateName();
    validateManagerName();
    validateEnterpriseCode();
    validateAddress();
    validatePhone();
    validateEmail();

    if (
      validateName() ||
      validateManagerName() ||
      validateEnterpriseCode() ||
      validateAddress() ||
      validatePhone() ||
      validateEmail()
    ) {
      return;
    }

    startLoading();
    try {
      const resp = await OrganizationApi.update(organization);
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };
  return (
    <>
      <div className={cx('container')}>
        <div className={cx('form-input')}>
          <InputFieldsV2 datas={configInputFieldV2s} cx={cx} />
        </div>
        {hasAuth && (
          <div className={cx('action-button')}>
            <button className={cx('btn-save')} onClick={handleSave}>
              Lưu
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Organization;
