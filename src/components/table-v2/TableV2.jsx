import classNames from 'classnames/bind';
import Style from './TableV2.module.scss';

const COLUMN_TEXT = 'text';
const COLUMN_ACTION = 'action';
const COLUMN_STATUS = 'status';
const COLUMN_SELECT = 'select';
const COLUMN_INDEX = 'index';

const COLUMN_INPUT_TEXT = 'input_text';
const COLUMN_INPUT_NUMBER = 'input_number';
const COLUMN_INPUT_SELECT = 'input_select';
const COLUMN_INPUT_RADIO = 'input_radio';
const COLUMN_INPUT_DATE = 'input_date';

function TableV2({ columns = [], datas = [], styleCustom = {}, emptyMessage }) {
  const cx = classNames.bind({ ...Style, ...styleCustom });

  const columnType = (row, rowIndex, column) => {
    switch (column.type) {
      case COLUMN_INDEX:
        return rowIndex + 1;
      case COLUMN_TEXT:
        return eval(`row?.${column.field}`);
      case COLUMN_ACTION:
        return column?.render?.map((action, actionIndex) => {
          return action?.content ? (
            <button
              key={`row-${rowIndex}-button-${actionIndex}`}
              className={action.classNames?.length > 0 ? action.classNames.join(' ') : undefined}
              onClick={() => action.handleClick({ index: rowIndex, item: row })}
            >
              {action.content}
            </button>
          ) : (
            <button
              key={`row-${rowIndex}-button-${actionIndex}`}
              className={action.classNames?.length > 0 ? action.classNames.join(' ') : undefined}
              onClick={() => action.handleClick({ index: rowIndex, item: row })}
            >
              {action?.contentStatus[eval(`action?.${action.field}`) || false]}
            </button>
          );
        });
      case COLUMN_STATUS:
        return column.status[eval(`row?.${column.field}`)];
      case COLUMN_SELECT:
        return (
          <input
            type="checkbox"
            name={column.field}
            onChange={(event) => column.handleChange({ rowIndex, row, event })}
            checked={eval(`row?.${column.field}`) || false}
            className={column?.classNames?.length > 0 ? column?.classNames.join(' ') : undefined}
          />
        );
      case COLUMN_INPUT_TEXT:
        return createInputText(
          {
            field: column.field,
            value: eval(`row?.${column.field}`),
            title: '',
            handleChange: (event) => {
              if (typeof column.handleChange === 'function') {
                column.handleChange({ rowIndex, row, event });
              }
            },
          },
          'text',
        );
      case COLUMN_INPUT_NUMBER:
        return createInputText(
          {
            field: column.field,
            value: eval(`row?.${column.field}`),
            title: '',
            handleChange: (event) => {
              if (typeof column.handleChange === 'function') {
                column.handleChange({ rowIndex, row, event });
              }
            },
          },
          'number',
        );
      case COLUMN_INPUT_SELECT:
        const newOptions = column?.fieldOptions ? eval(`row?.${column.fieldOptions}`) || [] : [...column?.options];

        return createInputSelect({
          field: column.field,
          title: '',
          defaultValue: eval(`row?.${column.field}`),
          options: newOptions,
          handleChange: (event) => {
            if (typeof column.handleChange === 'function') {
              column.handleChange({ rowIndex, row, event });
            }
          },
        });
    }
  };

  const createInputText = (data, inputType) => {
    if (data?.hidden) {
      return <></>;
    }
    const newValue = data?.value ? data?.value : inputType === 'number' ? 0 : '';
    return (
      <div className={cx('form_item-container')}>
        {!data?.notHasTitle && (
          <div className={cx('form-label')}>
            <label htmlFor={data.field}>{data.title}</label>
          </div>
        )}
        <div className={cx('form-input')}>
          <input
            type={inputType}
            name={data.field}
            id={data.field}
            value={newValue}
            placeholder={data?.title && data?.notHasTitle ? data?.title : ''}
            onChange={(event) => {
              if (typeof data.handleChange === 'function') {
                data.handleChange(event);
              }
            }}
            onClick={(event) => {
              if (typeof data.handleOnClick === 'function') {
                data.handleOnClick(event);
              }
            }}
          />
        </div>
      </div>
    );
  };

  const createInputSelect = (data) => {
    if (data?.hidden) {
      return <></>;
    }

    return (
      <div className={cx('form_item-container')}>
        {!data?.notHasTitle && (
          <div className={cx('form-label')}>
            <label htmlFor={data.field}>{data.title}</label>
          </div>
        )}
        <div className={cx('form-input')}>
          <select
            name={data.field}
            id={data.field}
            defaultValue={data.defaultValue}
            onChange={(event) => {
              if (typeof data.handleChange === 'function') {
                data.handleChange(event);
              }
            }}
            onClick={(event) => {
              if (typeof data.handleOnClick === 'function') {
                data.handleOnClick(event);
              }
            }}
          >
            <option
              value={-1}
              selected={data.defaultValue == -1 || data.defaultValue == null || data.defaultValue == ''}
            >
              -- Hãy chọn --
            </option>
            {data?.options.map((item, index) => (
              <option key={index} value={item.id} selected={data.defaultValue == item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  const createInputRadio = (data) => {
    if (data?.hidden) {
      return <></>;
    }
    return (
      <div className={cx('form_item-container')}>
        {!data?.notHasTitle && (
          <div className={cx('form-label')}>
            <label htmlFor={data.field}>{data.title}</label>
          </div>
        )}
        <div className={cx('form-input')}>
          {data?.options.map((item, index) => (
            <div key={index}>
              <input
                type="radio"
                name={data.field}
                id={`${data.field}-${index}`}
                value={item.value}
                onChange={(event) => {
                  if (typeof data.handleChange === 'function') {
                    data.handleChange(event);
                  }
                }}
                checked={data.defaultValue === item.value}
              />
              <label htmlFor={`${data.field}-${index}`}> {item.display}</label>
              &nbsp;&nbsp;&nbsp;
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <table className={cx('table')}>
        <thead className={cx('header')}>
          <tr>
            {columns.map((column, columnIndex) => (
              <th key={`column-${columnIndex}`} className={column?.classNames ? [...column?.classNames] : undefined}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={cx('body')}>
          {datas.length === 0 ? (
            <tr className={cx('notification')}>
              <td colSpan={columns.length}>
                {typeof emptyMessage === 'string' ? emptyMessage : 'Không có phần tử nào.'}
              </td>
            </tr>
          ) : (
            datas.map((row, rowIndex) => (
              <tr key={`row-${rowIndex}`}>
                {columns.map((column, columnIndex) => (
                  <td
                    key={`row-${rowIndex}-column-${columnIndex}`}
                    className={column?.classNames ? [...column?.classNames] : undefined}
                  >
                    {columnType(row, rowIndex, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export {
  COLUMN_ACTION,
  COLUMN_TEXT,
  COLUMN_STATUS,
  COLUMN_SELECT,
  COLUMN_INDEX,
  COLUMN_INPUT_TEXT,
  COLUMN_INPUT_NUMBER,
  COLUMN_INPUT_SELECT,
  COLUMN_INPUT_RADIO,
  COLUMN_INPUT_DATE,
};
export default TableV2;
