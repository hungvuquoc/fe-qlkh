import classNames from 'classnames/bind';
import Style from './DialogCreateAndUpdate.module.scss';
import RoleApi from '~/store/api/RoleApi';
import UserApi from '~/store/api/UserApi';
import { formatData, FieldType, somePropertyNotEmpty } from '~/utils/common';
import InputFieldsV2, { INPUT_TEXT, INPUT_SELECT } from '~/components/input-field-v2';
import { useEffect, useState } from 'react';
import useStore, { LOADING } from '~/store/hooks';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import DialogChoices from './DialogChoice';
import EmployeeApi from '~/store/api/EmployeeApi';

const cx = classNames.bind(Style);

const dataFormat = {
  employeeId: FieldType.int,
  email: null,
  active: null,
  roles: null,
  authorities: null,
  genCode: null,
};

function DialogCreateAndUpdate({ id, handleCloseDialog }) {
  const [user, setUser] = useState({
    employeeId: null,
    employee: null,
    email: null,
    active: null,
    roles: [],
    authorities: [],
    genCode: true,
  });
  const [errors, setErrors] = useState({
    employeeId: '',
    email: '',
    active: '',
    roles: '',
    authorities: '',
  });

  const [disabled, setDisable] = useState(false);
  const { startLoading, stopLoading } = useStore(LOADING);
  const [employees, setEmployees] = useState([]);

  const [authorities, setAuthorities] = useState([]);
  const [authoritySelected, setAuthoritySelected] = useState([]);
  const [authorityView, setAuthorityView] = useState([]);
  const [showDialogChoiceAuthority, setShowDialogChoiceAuthority] = useState(false);

  const [roles, setRoles] = useState([]);
  const [roleSelected, setRoleSelected] = useState([]);
  const [roleView, setRoleView] = useState([]);
  const [showDialogChoiceRole, setShowDialogChoiceRole] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const authorityResp = await RoleApi.searchAuthorities({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setAuthorities(authorityResp?.content);

      const roleResp = await RoleApi.search({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setRoles(roleResp?.content);

      if (!id) {
        const employeeResp = await EmployeeApi.search({ pageIndex: 1, pageSize: 9999, keyword: '', notAccount: true });
        setEmployees(employeeResp?.content);
        return;
      }

      const response = await UserApi.getById(id);

      const newEmployee = {
        ...response,
        employeeId: response?.employee?.id,
        genCode: false,
      };

      const employeeSelected = response?.employee;
      if (employeeSelected) {
        setEmployees([employeeSelected]);
        setDisable(true);
      } else {
        const employeeResp = await EmployeeApi.search({ pageIndex: 1, pageSize: 9999, keyword: '', notAccount: true });
        setEmployees(employeeResp?.content);
      }

      setUser(newEmployee);

      const roleNames = response?.roles;
      if (roleNames) {
        const newRoleSelected = [...roleResp?.content].filter((e1) => roleNames.some((e2) => e1.name == e2));
        setRoleSelected(newRoleSelected);
      }

      const authorityNames = response?.authorities;
      if (authorityNames) {
        const newAuthoritySelected = [...authorityResp?.content].filter((e1) =>
          authorityNames.some((e2) => e1.name == e2),
        );
        setAuthoritySelected(newAuthoritySelected);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const configInputFieldV2 = [
    {
      type: INPUT_SELECT,
      title: 'Nhân viên',
      field: 'employeeId',
      disabled: disabled,
      defaultValue: user?.employeeId,
      fieldValue: 'id',
      fieldDisplay: 'tag',
      options: employees,
      error: errors?.employeeId,
      handleBlur: () => {
        validateEmployeeId();
      },
      handleChange: (event) => {
        handleChangeInput(event);
        setErrors((prev) => ({
          ...prev,
          employeeId: '',
        }));
      },
      classNames: {
        container: ['input-container', 'employee'],
        label: [],
        input: [],
      },
    },
    {
      type: INPUT_TEXT,
      title: 'Email',
      field: 'email',
      value: user?.email,
      error: errors?.email,
      handleBlur: () => {
        validateEmail();
      },
      handleChange: (event) => {
        handleChangeInput(event);
        setErrors((prev) => ({
          ...prev,
          email: '',
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
      title: 'Trạng thái',
      field: 'active',
      defaultValue: user?.active,
      fieldValue: 'value',
      fieldDisplay: 'display',
      options: [
        {
          value: true,
          display: 'Kích hoạt',
        },
        {
          value: false,
          display: 'Khóa',
        },
      ],
      error: errors?.active,
      handleBlur: () => {
        validateActive();
      },
      handleChange: (event) => {
        handleChangeInput(event);
        setErrors((prev) => ({
          ...prev,
          active: '',
        }));
      },
      classNames: {
        container: ['input-container', 'main-action'],
        label: [],
        input: [],
      },
    },
  ];

  const configRoleTableV3 = [
    {
      type: TABLE_V3_COLUMN_INDEX,
      title: 'STT',
      classNames: {
        col: ['tb-stt'],
        colHeader: ['col-header'],
        colBody: ['col-body'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tên vai trò',
      field: 'name',
      classNames: {
        col: ['tb-name'],
        colHeader: ['col-header'],
        colBody: ['col-body', 'text-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Mô tả',
      field: 'description',
      classNames: {
        col: ['tb-description'],
        colHeader: ['col-header'],
        colBody: ['col-body', 'text-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_BUTTON,
      title: 'Thao tác',
      render: [
        {
          content: 'Xóa',
          classNames: [],
          handleClick: ({ rowData }) => {
            handleDeleteRoleItem(rowData);
          },
        },
      ],
      classNames: {
        col: ['tb-action'],
        colHeader: ['col-header'],
        colBody: ['col-body'],
        cell: [],
      },
    },
  ];

  const configAuthorityTableV3 = [
    {
      type: TABLE_V3_COLUMN_INDEX,
      title: 'STT',
      classNames: {
        col: ['tb-stt'],
        colHeader: ['col-header'],
        colBody: ['col-body'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tên quyền',
      field: 'name',
      classNames: {
        col: ['tb-name'],
        colHeader: ['col-header'],
        colBody: ['col-body', 'text-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Mô tả',
      field: 'description',
      classNames: {
        col: ['tb-description'],
        colHeader: ['col-header'],
        colBody: ['col-body', 'text-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_BUTTON,
      title: 'Thao tác',
      render: [
        {
          content: 'Xóa',
          classNames: [],
          handleClick: ({ rowData }) => {
            handleDeleteAuthorityItem(rowData);
          },
        },
      ],
      classNames: {
        col: ['tb-action'],
        colHeader: ['col-header'],
        colBody: ['col-body'],
        cell: [],
      },
    },
  ];

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteRoleItem = (item) => {
    const newRoleSelected = roleSelected.filter((e) => e.name != item.name);
    setRoleSelected(newRoleSelected);
  };

  const handleDeleteAuthorityItem = (item) => {
    const newAuthoritySelected = authoritySelected.filter((e) => e.name != item.name);
    setAuthoritySelected(newAuthoritySelected);
  };

  const handleOpenDialogChoiceRole = () => {
    setErrors((prev) => ({
      ...prev,
      roles: '',
    }));
    const newData = [...roles].filter((e1) => !roleSelected.some((e2) => e2.name == e1.name));
    setRoleView(newData);
    setShowDialogChoiceRole(true);
  };

  const handleOpenDialogChoiceAuthority = () => {
    setErrors((prev) => ({
      ...prev,
      authorities: '',
    }));
    const newData = [...authorities].filter((e1) => !authoritySelected.some((e2) => e2.name == e1.name));
    setAuthorityView(newData);
    setShowDialogChoiceAuthority(true);
  };

  const handleConfirmDialogChoiceRole = (data) => {
    console.log(data);
    if (data) {
      setRoleSelected((prev) => [...prev, ...data]);
    }

    setShowDialogChoiceRole(false);
  };

  const handleConfirmDialogChoiceAuthority = (data) => {
    console.log(data);
    if (data) {
      setAuthoritySelected((prev) => [...prev, ...data]);
    }

    setShowDialogChoiceAuthority(false);
  };

  const handleSave = async () => {
    validateEmployeeId();
    validateActive();
    validateEmail();
    validateAuthorities();
    validateRole();

    if (somePropertyNotEmpty(errors)) {
      return;
    }

    startLoading();
    try {
      const authorityNames = [...authoritySelected].map((e) => e.name);
      const roleNames = [...roleSelected].map((e) => e.name);
      const request = formatData({ ...user, roles: roleNames, authorities: authorityNames }, dataFormat);
      if (disabled) {
        delete request['employeeId'];
      }
      console.log(request);
      if (id) {
        const response = await UserApi.update(id, request);
      } else {
        const response = await UserApi.add(request);
      }
      handleCloseDialog();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const validateEmployeeId = () => {
    if (!user?.employeeId) {
      setErrors((prev) => ({
        ...prev,
        employeeId: 'Không được bỏ trống',
      }));
    }
  };

  const validateEmail = () => {
    if (!user?.email) {
      setErrors((prev) => ({
        ...prev,
        email: 'Không được bỏ trống',
      }));
    }
  };

  const validateActive = () => {
    if (!user?.active) {
      setErrors((prev) => ({
        ...prev,
        active: 'Không được bỏ trống',
      }));
    }
  };

  const validateRole = () => {
    // if (user?.roles.length == 0) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     roles: 'Không được bỏ trống',
    //   }));
    // }
  };

  const validateAuthorities = () => {
    // if (user?.authorities.length == 0) {
    //   setErrors((prev) => ({
    //     ...prev,
    //     authorities: 'Không được bỏ trống',
    //   }));
    // }
  };

  return (
    <>
      {showDialogChoiceAuthority && (
        <DialogChoices
          dialogName="Danh sách quyền"
          data={authorityView}
          handleCloseDialog={() => {
            setShowDialogChoiceAuthority(false);
            validateAuthorities();
          }}
          handleConfirm={(data) => {
            handleConfirmDialogChoiceAuthority(data);
            validateAuthorities();
          }}
        />
      )}
      {showDialogChoiceRole && (
        <DialogChoices
          dialogName="Danh sách vai trò"
          data={roleView}
          handleCloseDialog={() => {
            setShowDialogChoiceRole(false);
            validateRole();
          }}
          handleConfirm={(data) => {
            handleConfirmDialogChoiceRole(data);
            validateRole();
          }}
        />
      )}
      <div className={cx('dialog-container')}>
        <div className={cx('dialog-content')}>
          <div className={cx('content-header')}>
            <span className={cx('close')} onClick={() => handleCloseDialog()}>
              &times;
            </span>
            <h2></h2>
          </div>
          <div className={cx('content-body')}>
            <div className={cx('main')}>
              <InputFieldsV2 datas={configInputFieldV2} cx={cx} />
            </div>
            <div className={cx('role')}>
              <button className={cx('button-search')} onClick={handleOpenDialogChoiceRole}>
                Thêm vai trò
              </button>
              {errors?.roles && <span className={cx('error')}>{errors?.roles}</span>}
              <div className={cx('table-view')}>
                <TableV3 columns={configRoleTableV3} datas={roleSelected} cx={cx} emptyMessage={'Không có dữ liệu.'} />
              </div>
            </div>
            <div className={cx('authority')}>
              <button className={cx('button-search')} onClick={handleOpenDialogChoiceAuthority}>
                Thêm quyền
              </button>
              {errors?.authorities && <span className={cx('error')}>{errors?.authorities}</span>}
              <div className={cx('table-view')}>
                <TableV3
                  columns={configAuthorityTableV3}
                  datas={authoritySelected}
                  cx={cx}
                  emptyMessage={'Không có dữ liệu.'}
                />
              </div>
            </div>
          </div>
          <div className={cx('content-footer')}>
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
