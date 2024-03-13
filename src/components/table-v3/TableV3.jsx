const TABLE_V3_COLUMN_INPUT_TEXT = 'TABLE_V3_COLUMN_INPUT_TEXT';
const TABLE_V3_COLUMN_INPUT_NUMBER = 'TABLE_V3_COLUMN_INPUT_NUMBER';
const TABLE_V3_COLUMN_INPUT_CHECKBOX = 'TABLE_V3_COLUMN_INPUT_CHECKBOX';
const TABLE_V3_COLUMN_INPUT_DATE = 'TABLE_V3_COLUMN_INPUT_DATE';
const TABLE_V3_COLUMN_SELECT = 'TABLE_V3_COLUMN_SELECT';
const TABLE_V3_COLUMN_TEXT = 'TABLE_V3_COLUMN_TEXT';
const TABLE_V3_COLUMN_TEXT_OPTIONS = 'TABLE_V3_COLUMN_TEXT_OPTIONS';
const TABLE_V3_COLUMN_INDEX = 'TABLE_V3_COLUMN_INDEX';
const TABLE_V3_COLUMN_BUTTON = 'TABLE_V3_COLUMN_BUTTON';

function TableV3({ columns = [], datas = [], cx = {}, classRow = 'class-row', emptyMessage }) {
  const createTextOption = (data) => {
    if (data?.hidden) {
      return <></>;
    }

    return <div className={data?.classNames}>{data?.options[data.value]}</div>;
  };

  const createText = (data) => {
    // console.log(data);
    if (data?.hidden) {
      return <></>;
    }

    return <div className={data?.classNames}>{data.value}</div>;
  };

  const createInputType = (data, inputType) => {
    if (data?.hidden) {
      return <></>;
    }

    if (inputType === 'checkbox') {
      return (
        <input
          type="checkbox"
          name={data.name}
          onChange={(event) => data.handleChange(event)}
          checked={data.value || false}
          className={data?.classNames}
        />
      );
    }

    let defaultValue;
    switch (inputType) {
      case 'text':
        defaultValue = '';
        break;
      case 'number':
        defaultValue = 0;
        break;
    }

    return (
      <input
        className={data?.classNames}
        type={inputType}
        id={data.id}
        name={data.name}
        value={data.value ?? defaultValue}
        disabled={data.disabled || false}
        placeholder={data.placeholder || ''}
        onChange={(event) => {
          data.handleChange(event);
        }}
        onClick={(event) => {
          data.handleClick(event);
        }}
      />
    );
  };

  const createSelect = (data) => {
    if (data?.hidden) {
      return <></>;
    }

    return (
      <select
        className={data?.classNames}
        id={data.id}
        name={data.name}
        defaultValue={data.value}
        disabled={data.disabled || false}
        onChange={(event) => {
          data.handleChange(event);
        }}
        onClick={(event) => {
          data.handleClick(event);
        }}
      >
        <option value={-1} selected={data.value ? false : true}>
          -- Hãy chọn --
        </option>
        {data?.options &&
          data?.options.map((item, index) => {
            if (typeof item === 'object') {
              return (
                <option
                  key={index}
                  value={eval(`item?.${data.optionFieldValue}`)}
                  selected={data.value == eval(`item?.${data.optionFieldValue}`)}
                >
                  {eval(`item?.${data.ontionFieldDisplay}`)}
                </option>
              );
            }

            return (
              <option key={index} value={item} selected={data.value == item}>
                {item}
              </option>
            );
          })}
      </select>
    );
  };

  const createButton = (data) => {
    if (data?.hidden) {
      return <></>;
    }

    return (
      <div className={data?.classNames}>
        {data?.render?.map((button, index) => {
          if (typeof button?.hidden === 'function') {
            const bl = button?.hidden(data.value);
            if (bl) {
              return <></>;
            }
          } else if (button?.hidden) {
            return <></>;
          }
          return (
            <button
              key={index}
              hidden={button?.hidden}
              disabled={button?.disabled}
              className={cx(button?.classNames ? [...button?.classNames] : undefined)}
              onClick={(event) => {
                data.buttonHandleClick(event, button?.handleClick);
              }}
            >
              {button.content}
            </button>
          );
        })}
      </div>
    );
  };

  const convertData = (rowIndex, rowData, config) => {
    const newValue = eval(`rowData?.${config.field}`);
    let cellClass = config?.classNames?.cell;
    let newClassNames = [];
    if (cellClass && cellClass instanceof Array) {
      newClassNames = [cx([...cellClass])];
    } else if (typeof cellClass === 'object') {
      newClassNames = [cx(cellClass[newValue])];
    }
    let newOptions = config?.options;

    if (config?.fieldOptions) {
      newOptions = eval(`rowData?.${config.fieldOptions}`);
    }
    return {
      hidden: config.hidden,
      classNames: newClassNames,
      id: config.field,
      name: config.field,
      value: newValue,
      options: newOptions,
      optionFieldValue: config.optionFieldValue,
      ontionFieldDisplay: config.ontionFieldDisplay,
      disabled: config.disabled,
      placeholder: config.placeholder,
      inputFields: config.inputFields,
      render: config.render,
      handleChange: (event) => {
        if (typeof config.handleChange === 'function') {
          config.handleChange({ rowIndex, rowData, event });
        }
      },
      handleClick: (event) => {
        if (typeof config.handleClick === 'function') {
          config.handleClick({ rowIndex, rowData, event });
        }
      },
      buttonHandleClick: (event, func) => {
        if (typeof func === 'function') {
          func({ rowIndex, rowData, event });
        } else {
          throw new Error('buttonHandleClick is not function');
        }
      },
    };
  };

  const createCell = (rowIndex, rowData, config) => {
    const data = convertData(rowIndex, rowData, config);
    switch (config.type) {
      case TABLE_V3_COLUMN_INPUT_TEXT:
        return createInputType(data, 'text');
      case TABLE_V3_COLUMN_INPUT_NUMBER:
        return createInputType(data, 'number');
      case TABLE_V3_COLUMN_INPUT_CHECKBOX:
        return createInputType(data, 'checkbox');
      case TABLE_V3_COLUMN_INPUT_DATE:
        return createInputType(data, 'date');
      case TABLE_V3_COLUMN_SELECT:
        return createSelect(data);
      case TABLE_V3_COLUMN_TEXT:
        return createText(data);
      case TABLE_V3_COLUMN_TEXT_OPTIONS:
        return createTextOption(data);
      case TABLE_V3_COLUMN_INDEX:
        return rowIndex + 1;
      case TABLE_V3_COLUMN_BUTTON:
        return createButton(data);
      default:
        throw Error('TableV3 type not found');
    }
  };

  return (
    <>
      <table className={cx('table')}>
        <thead className={cx('header')}>
          <tr>
            {columns.map((column, columnIndex) => (
              <th
                key={`column-${columnIndex}`}
                className={cx(
                  column?.classNames?.col ? [...column?.classNames?.col] : undefined,
                  column?.classNames?.colHeader ? [...column?.classNames?.colHeader] : undefined,
                )}
              >
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
                    className={cx([
                      column?.classNames?.col ? [...column?.classNames?.col] : undefined,
                      column?.classNames?.colBody ? [...column?.classNames?.colBody] : undefined,
                      rowIndex % 2 !== 0 ? classRow : undefined,
                    ])}
                  >
                    {createCell(rowIndex, row, column)}
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
  TABLE_V3_COLUMN_INPUT_TEXT,
  TABLE_V3_COLUMN_INPUT_NUMBER,
  TABLE_V3_COLUMN_INPUT_CHECKBOX,
  TABLE_V3_COLUMN_INPUT_DATE,
  TABLE_V3_COLUMN_SELECT,
  TABLE_V3_COLUMN_TEXT,
  TABLE_V3_COLUMN_TEXT_OPTIONS,
  TABLE_V3_COLUMN_INDEX,
  TABLE_V3_COLUMN_BUTTON,
};
export default TableV3;
