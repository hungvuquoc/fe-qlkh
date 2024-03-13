import classNames from 'classnames/bind';
import Style from './DialogCreateAndUpdate.module.scss';
import RoleApi from '~/store/api/RoleApi';
import { formatData, FieldType, somePropertyNotEmpty } from '~/utils/common';
import InputFieldsV2, { INPUT_TEXT, INPUT_SELECT } from '~/components/input-field-v2';
import { useEffect, useState } from 'react';
import useStore, { LOADING } from '~/store/hooks';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';
import WarehouseApi from '~/store/api/WarehouseApi';
import DialogChoicesAuthority from './DialogChoicesAuthority';

const cx = classNames.bind(Style);

const dataFormat = {
  name: null,
  description: null,
  warehouseId: FieldType.int,
  authorities: null,
};

function DialogCreateAndUpdate({ id, handleCloseDialog }) {
  const [role, setRole] = useState({
    name: null,
    description: null,
    warehouseId: null,
    warehouse: null,
    authorities: [],
  });

  const [errors, setError] = useState({
    name: null,
    description: null,
    warehouseId: null,
  });
  const [warehouses, setWarehouses] = useState([]);
  const [authorities, setAuthorities] = useState([]);
  const [authoritySelected, setAuthoritySelected] = useState([]);
  const [authorityView, setAuthorityView] = useState([]);
  const [disabled, setDisable] = useState(false);
  const { startLoading, stopLoading } = useStore(LOADING);
  const [showDialogChoiceAuthority, setShowDialogChoiceAuthority] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const configInputFieldV2 = [
    {
      type: INPUT_SELECT,
      title: 'Kho',
      field: 'warehouseId',
      defaultValue: role?.warehouseId,
      fieldValue: 'id',
      fieldDisplay: 'name',
      options: warehouses,
      error: errors?.warehouseId,
      handleBlur: (event) => {
        validateWarehouseId();
      },
      handleChange: (event) => {
        handleChangeInput(event);
        setError((prev) => ({
          ...prev,
          warehouseId: '',
        }));
      },
      classNames: {
        container: ['input-container'],
        label: [],
        input: [],
      },
    },
    {
      type: INPUT_TEXT,
      title: 'Tên Quyền',
      field: 'name',
      value: role?.name,
      error: errors?.name,
      handleBlur: (event) => {
        validateName();
      },
      handleChange: (event) => {
        handleChangeInput(event);
        setError((prev) => ({
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
      type: INPUT_TEXT,
      title: 'Mô tả',
      field: 'description',
      value: role?.description,
      error: errors?.description,
      handleBlur: (event) => {
        validateDescription();
      },
      handleChange: (event) => {
        handleChangeInput(event);
        setError((prev) => ({
          ...prev,
          description: '',
        }));
      },
      classNames: {
        container: ['input-container'],
        label: [],
        input: [],
      },
    },
  ];

  const configTableV3 = [
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
      title: 'Mã quyền',
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
            handleDeleteItem(rowData);
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

  const fetchData = async () => {
    try {
      const warehouseResp = await WarehouseApi.search({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setWarehouses(warehouseResp?.content);

      const authorityResp = await RoleApi.searchAuthorities({ pageIndex: 1, pageSize: 9999, keyword: '' });
      setAuthorities(authorityResp?.content);

      if (!id) {
        return;
      }

      const response = await RoleApi.getById(id);
      const newEmployee = {
        ...response,
        warehouseId: response?.warehouse?.id,
      };

      setRole(newEmployee);

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

  const handleDeleteItem = (item) => {
    const newAuthoritySelected = authoritySelected.filter((e) => e.name != item.name);
    setAuthoritySelected(newAuthoritySelected);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenDialogChoiceAuthority = () => {
    const newData = [...authorities].filter((e1) => !authoritySelected.some((e2) => e2.name == e1.name));
    setAuthorityView(newData);
    setShowDialogChoiceAuthority(true);
  };

  const handleConfirmDialogChoiceAuthority = (data) => {
    if (data) {
      setAuthoritySelected((prev) => [...prev, ...data]);
    }

    setShowDialogChoiceAuthority(false);
  };

  const handleSave = async () => {
    validateWarehouseId();
    validateName();
    validateDescription();

    if (somePropertyNotEmpty(errors)) {
      return;
    }

    startLoading();
    try {
      const authorityNames = [...authoritySelected].map((e) => e.name);
      const request = formatData({ ...role, authorities: authorityNames }, dataFormat);
      console.log(request);
      if (id) {
        const response = await RoleApi.update(id, request);
      } else {
        const response = await RoleApi.add(request);
      }
      handleCloseDialog();
    } catch (error) {
      console.log(error);
    } finally {
      stopLoading();
    }
  };

  const validateName = () => {
    if (!role?.name) {
      setError((prev) => ({
        ...prev,
        name: 'Không được bỏ trống',
      }));
    }
  };

  const validateDescription = () => {
    if (!role?.description) {
      setError((prev) => ({
        ...prev,
        description: 'Không được bỏ trống',
      }));
    }
  };

  const validateWarehouseId = () => {
    if (!role?.warehouseId) {
      setError((prev) => ({
        ...prev,
        warehouseId: 'Không được bỏ trống',
      }));
    }
  };

  return (
    <>
      {showDialogChoiceAuthority && (
        <DialogChoicesAuthority
          authorities={authorityView}
          handleCloseDialog={() => setShowDialogChoiceAuthority(false)}
          handleConfirm={handleConfirmDialogChoiceAuthority}
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
            <div className={cx('left')}>
              <div className={cx('fields')}>
                <InputFieldsV2 datas={configInputFieldV2} cx={cx} />
              </div>
              <div className={cx('btton-add-authority')}>
                <button onClick={handleOpenDialogChoiceAuthority}>Thêm quyền</button>
              </div>
            </div>
            <div className={cx('right')}>
              <TableV3 columns={configTableV3} datas={authoritySelected} cx={cx} emptyMessage={'Không có dữ liệu.'} />
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
