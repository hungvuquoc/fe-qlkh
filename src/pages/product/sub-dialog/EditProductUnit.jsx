import classNames from 'classnames/bind';
import style from './EditProductUnit.module.scss';
import ProductUnitApi from '~/store/api/ProductUnitApi';
import { useEffect, useState } from 'react';
import { COLUMN_TEXT, COLUMN_SELECT, COLUMN_ACTION } from '~/components/table/Table';
import Table from '~/components/table/Table';

import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_BUTTON,
  TABLE_V3_COLUMN_INPUT_CHECKBOX,
} from '~/components/table-v3/TableV3';

const cx = classNames.bind(style);

function EditProductUnit({ dataOld = [], handleClose, handleConfirm }) {
  // tránh việc index thay đổi ở unitViews khi search, vì dùng index làm key,
  // xóa theo key là index dù có search làm thay đổi thứ tự nhưng index đã đánh dấu cũng không đổi
  const [units, setUnits] = useState(() => {
    const data = dataOld?.map((item, index) => ({ ...item, index: index }));
    return data;
  }, []);

  // dùng cho việc hiển thị
  const [unitViews, setUnitViews] = useState(() => {
    const data = dataOld?.map((item, index) => ({ ...item, index: index }));
    return data;
  }, []);

  const [search, setSearch] = useState('');

  const [dataItem, setDataItem] = useState({
    tag: '',
    unitId: '',
    name: '',
    ratio: 0,
    default: false,
    useReport: false,
  });

  const [unitMain, setUnitMain] = useState([]);

  ////// useEffect

  useEffect(() => {
    fetchDataUnitMain();
  }, []);

  ////// function
  const fetchDataUnitMain = async () => {
    try {
      const response = await ProductUnitApi.search({ pageIndex: 1, pageSize: 9999 });
      setUnitMain(response?.content);
    } catch (error) {
      console.log('edit product unit: ', error);
    }
  };

  const columns = [
    { type: COLUMN_TEXT, title: 'Đơn vị', field: 'name' },
    { type: COLUMN_TEXT, title: 'Tỷ lệ', field: 'ratio' },
    {
      type: COLUMN_SELECT,
      title: 'Mặc định',
      field: 'default',
      classNames: [],
      onChange: (event, item) => {
        handleChangeUnitDefaul(item);
      },
    },
    {
      type: COLUMN_SELECT,
      title: 'Báo cáo',
      field: 'useReport',
      classNames: [],
      onChange: (event, item) => {
        handleChangeUnitReport(item);
      },
    },
    {
      type: COLUMN_ACTION,
      title: 'Thao tác',
      render: [
        {
          content: 'Xóa',
          classNames: [],
          onClick: ({ index, item }) => {
            handleDeleteItem(index, item);
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
        col: ['stt'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Đơn vị',
      field: 'name',
      classNames: {
        col: ['name'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Tỷ lệ',
      field: 'ratio',
      classNames: {
        col: ['ratio'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_INPUT_CHECKBOX,
      title: 'Mặc định',
      field: 'default',
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeUnitDefaul(rowData);
      },
      classNames: {
        col: ['default'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_INPUT_CHECKBOX,
      title: 'Báo cáo',
      field: 'useReport',
      handleChange: ({ rowIndex, rowData, event }) => {
        handleChangeUnitReport(rowData);
      },
      classNames: {
        col: ['use-report'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_BUTTON,
      title: 'Thao tác',
      classNames: {
        col: ['row-action'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
      render: [
        {
          content: 'Xóa',
          classNames: [],
          handleClick: ({ rowIndex, rowData, event }) => {
            handleDeleteItem(rowIndex, rowData);
          },
        },
      ],
    },
  ];

  const handleDeleteItem = (index, item) => {
    const unitViewNew = [...unitViews];
    unitViewNew.splice(index, 1);
    setUnitViews(unitViewNew);

    setUnits(units.filter((unit) => unit?.index !== item.index));
  };

  const handleChangeUnitDefaul = (item) => {
    const unitViewNews = unitViews
      .map((element) => ({
        ...element,
        default: element.index === item.index,
      }))
      .map((element) => ({
        ...element,
        tag: createTag(element),
      }));
    setUnitViews(unitViewNews);

    const unitNews = units
      .map((element) => ({
        ...element,
        default: element.index === item.index,
      }))
      .map((element) => ({
        ...element,
        tag: createTag(element),
      }));
    setUnits(unitNews);
  };

  const handleChangeUnitReport = (item) => {
    const unitViewNews = unitViews
      .map((element) => ({
        ...element,
        useReport: element.index === item.index,
      }))
      .map((element) => ({
        ...element,
        tag: createTag(element),
      }));
    setUnitViews(unitViewNews);

    const unitNews = units
      .map((element) => ({
        ...element,
        useReport: element.index === item.index,
      }))
      .map((element) => ({
        ...element,
        tag: createTag(element),
      }));
    setUnits(unitNews);
  };

  const handleAddItem = () => {
    const currentIndex = findMaxIndex();
    const tagNew = createTag(dataItem);
    const itemNew = { ...dataItem, index: currentIndex + 1, tag: tagNew };

    units.push(itemNew);
    setUnitViews(units);
    setDataItem({
      tag: '',
      unitId: '',
      name: '',
      ratio: 0,
      default: false,
      useReport: false,
    });
  };

  const findMaxIndex = () => {
    if (units.length === 0) {
      return 0;
    }

    const lastUnit = units[units.length - 1];

    return lastUnit.index;
  };

  const createTag = (data) => {
    let tag = data.name + ' - ' + data.ratio;
    if (data.default) {
      tag += ' - Mặc định';
    }
    if (data.useReport) {
      tag += ' - Báo cáo';
    }

    return tag;
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleButtonSearch = () => {
    const unitViewNews = unitViews.filter((item) => {
      return item?.code.includes(search) || item?.name.includes(search);
    });

    setUnitViews(unitViewNews);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;

    setDataItem((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeSelectUnitType = (event) => {
    const { value } = event.target;
    if (parseInt(value) === -1) {
      return;
    }
    const data = unitMain.find((e) => e.id === parseInt(value));

    setDataItem((prev) => ({
      ...prev,
      name: data.name,
      unitId: data.id,
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
              <div className={cx('body_search')}>
                <input type="text" value={search} onChange={handleSearchChange} />
                <button onClick={handleButtonSearch}>Tìm kiếm</button>
              </div>
              <div className={cx('body_form')}>
                <div className={cx('body_container-form_item')}>
                  <div className={cx('form_item-container')}>
                    <div className={cx('form-label')}>
                      <label htmlFor="unit">Đơn chuyển đổi</label>
                    </div>
                    <div className={cx('form-input')}>
                      <select name="unit" id="unit" onChange={(event) => handleChangeSelectUnitType(event)}>
                        <option value={-1}>-- Chọn đơn vị --</option>
                        {unitMain?.map((item, index) => (
                          <option key={index} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className={cx('form_item-container')}>
                    <div className={cx('form-label')}>
                      <label htmlFor="ratio">Tỷ lệ (so với tỉ lệ gốc)</label>
                    </div>
                    <div className={cx('form-input')}>
                      <input
                        type="number"
                        name="ratio"
                        id="ratio"
                        value={dataItem.price}
                        onChange={(event) => handleChangeInput(event)}
                      />
                    </div>
                  </div>
                  <button className={cx('button-search')} onClick={handleAddItem}>
                    Thêm mới
                  </button>
                </div>
              </div>
              <div className={cx('body_table')}>
                <TableV3 columns={configTableV3} datas={unitViews} cx={cx} emptyMessage={'Không có dữ liệu.'} />
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('body__action')}>
                <button className={cx('body__action--btn-save')} onClick={() => handleConfirm(units)}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditProductUnit;
