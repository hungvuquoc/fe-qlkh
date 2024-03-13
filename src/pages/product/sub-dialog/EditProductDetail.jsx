import classNames from 'classnames/bind';
import style from './EditProductDetail.module.scss';
import { useState } from 'react';
import TableV3, {
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_BUTTON,
} from '~/components/table-v3/TableV3';

const cx = classNames.bind(style);

function EditProductDetail({ dataOld = [], handleClose, handleConfirm }) {
  const [details, setDetails] = useState(() => {
    const data = dataOld?.map((item, index) => ({ ...item, index: index }));
    return data;
  }, []);

  const [detailViews, setDetailViews] = useState(() => {
    const data = dataOld?.map((item, index) => ({ ...item, index: index }));
    return data;
  }, []);

  const [search, setSearch] = useState('');

  const [dataItem, setDataItem] = useState({
    size: '',
    quality: '',
    price: 0,
  });

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
      title: 'Kích thước',
      field: 'size',
      classNames: {
        col: ['size'],
        colHeader: ['col-header'],
        colBody: [],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Chất lượng',
      field: 'quantity',
      classNames: {
        col: ['quantity'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
        cell: [],
      },
    },
    {
      type: TABLE_V3_COLUMN_TEXT,
      title: 'Giá',
      field: 'price',
      classNames: {
        col: ['price'],
        colHeader: ['col-header'],
        colBody: ['col-body-left'],
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
    //
    const detailViewNew = [...detailViews];
    detailViewNew.splice(index, 1);
    setDetailViews(detailViewNew);

    setDetails(details.filter((detail) => detail?.index !== item.index));

    console.log(item);
  };

  const handleAddItem = () => {
    const currentIndex = findMaxIndex();
    const tagNew = createTag(dataItem);
    const itemNew = { ...dataItem, index: currentIndex + 1, tag: tagNew };

    details.push(itemNew);
    setDetailViews(details);
    setDataItem({
      size: '',
      quality: '',
      price: 0,
    });
  };

  const findMaxIndex = () => {
    if (details.length === 0) {
      return 0;
    }

    const lastDetail = details[details.length - 1];

    return lastDetail.index;
  };

  const createTag = (data) => {
    let tag = '';
    if (data.size) {
      tag += data.size;
    } else {
      tag += 'N/A';
    }
    tag += ' - ';
    if (data.quality) {
      tag += data.quality;
    } else {
      tag += 'N/A';
    }
    tag += ' - ';
    if (data.price) {
      tag += data.price;
    } else {
      tag += 'N/A';
    }

    return tag;
  };

  const handleSearchChange = (event) => {
    const { value } = event.target;
    setSearch(value);
  };

  const handleButtonSearch = () => {
    const detailViewNews = detailViews.filter((item) => {
      return item?.code.includes(search) || item?.name.includes(search);
    });

    setDetailViews(detailViewNews);
  };

  const handleChangeInput = (event) => {
    const { name, value } = event.target;
    setDataItem((prev) => ({
      ...prev,
      [name]: value,
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
                <input className={cx('input-search')} type="text" value={search} onChange={handleSearchChange} />
                <button className={cx('button-search')} onClick={handleButtonSearch}>
                  Tìm kiếm
                </button>
              </div>
              <div className={cx('body_form')}>
                <div className={cx('body_container-form_item')}>
                  <div className={cx('form_item-container')}>
                    <div className={cx('form-label')}>
                      <label htmlFor="size">Kích thước</label>
                    </div>
                    <div className={cx('form-input')}>
                      <input
                        type="text"
                        name="size"
                        id="size"
                        value={dataItem.size}
                        onChange={(event) => handleChangeInput(event)}
                      />
                    </div>
                  </div>
                  <div className={cx('form_item-container')}>
                    <div className={cx('form-label')}>
                      <label htmlFor="quality">Chất lượng</label>
                    </div>
                    <div className={cx('form-input')}>
                      <input
                        type="text"
                        name="quality"
                        id="quality"
                        value={dataItem.quality}
                        onChange={(event) => handleChangeInput(event)}
                      />
                    </div>
                  </div>
                  <div className={cx('form_item-container')}>
                    <div className={cx('form-label')}>
                      <label htmlFor="price">Giá</label>
                    </div>
                    <div className={cx('form-input')}>
                      <input
                        type="number"
                        name="price"
                        id="price"
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
                <TableV3 columns={configTableV3} datas={detailViews} cx={cx} emptyMessage={'Không có dữ liệu.'} />
              </div>
            </div>
            <div className={cx('modal-footer')}>
              <div className={cx('body__action')}>
                <button className={cx('body__action--btn-save')} onClick={() => handleConfirm(details)}>
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

export default EditProductDetail;
