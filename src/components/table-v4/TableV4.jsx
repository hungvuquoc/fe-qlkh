const TABLE_V4_COLUMN_INPUT_TEXT = 'TABLE_V4_COLUMN_INPUT_TEXT';
const TABLE_V4_COLUMN_INPUT_NUMBER = 'TABLE_V4_COLUMN_INPUT_NUMBER';
const TABLE_V4_COLUMN_INPUT_CHECKBOX = 'TABLE_V4_COLUMN_INPUT_CHECKBOX';
const TABLE_V4_COLUMN_INPUT_DATE = 'TABLE_V4_COLUMN_INPUT_DATE';
const TABLE_V4_COLUMN_SELECT = 'TABLE_V4_COLUMN_SELECT';
const TABLE_V4_COLUMN_TEXT = 'TABLE_V4_COLUMN_TEXT';
const TABLE_V4_COLUMN_TEXT_OPTIONS = 'TABLE_V4_COLUMN_TEXT_OPTIONS';
const TABLE_V4_COLUMN_INDEX = 'TABLE_V4_COLUMN_INDEX';
const TABLE_V4_COLUMN_BUTTON = 'TABLE_V4_COLUMN_BUTTON';

function TableV4({ head = [], body = [], food = [], datas = [], cx = {}, emptyMessage }) {
  const createTextOption = (data) => {
    if (data?.hidden) {
      return <></>;
    }

    return <div className={data?.classNames}>{data?.options[data.value]}</div>;
  };

  const createText = (data) => {
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
          data.handlClick(event);
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
        defaultValue={-1}
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
        {data?.options.map((item, index) => {
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
          if (button?.hidden) {
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
    const newClassNames = [cx(config?.subClassNames ? [...config?.subClassNames] : undefined)];
    const newOptions = config?.options;

    if (config?.fieldOptions) {
      newOptions = eval(`rowData?.${config.fieldOptions}`);
    }
    return {
      hidden: config.hidden,
      className: newClassNames,
      id: config.field,
      name: config.field,
      value: eval(`rowData?.${config.field}`),
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
        } else {
          throw new Error('handleChange is not function');
        }
      },
      handleClick: (event) => {
        if (typeof config.handleClick === 'function') {
          config.handleClick({ rowIndex, rowData, event });
        } else {
          throw new Error('handleClick is not function');
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
      case TABLE_V4_COLUMN_INPUT_TEXT:
        return createInputType(data, 'text');
      case TABLE_V4_COLUMN_INPUT_NUMBER:
        return createInputType(data, 'number');
      case TABLE_V4_COLUMN_INPUT_CHECKBOX:
        return createInputType(data, 'checkbox');
      case TABLE_V4_COLUMN_INPUT_DATE:
        return createInputType(data, 'date');
      case TABLE_V4_COLUMN_SELECT:
        return createSelect(data);
      case TABLE_V4_COLUMN_TEXT:
        return createText(data);
      case TABLE_V4_COLUMN_TEXT_OPTIONS:
        return createTextOption(data);
      case TABLE_V4_COLUMN_INDEX:
        return rowIndex + 1;
      case TABLE_V4_COLUMN_BUTTON:
        return createButton(data);
      default:
        throw Error('TableV4 type not found');
    }
  };

  return (
    <>
      <table className={cx('table')}>
        <thead className={cx('header')}>
          {head.map((cols, trIndex) => (
            <tr key={`tr-${trIndex}`}>
              {cols.map((col, thIndex) => (
                <th
                  key={`th-${thIndex}`}
                  colSpan={col?.colSpan || 1}
                  rowSpan={col?.rowSpan || 1}
                  className={cx(col?.classNames ? [...col?.classNames] : undefined)}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className={cx('body')}>
          {datas.length === 0 ? (
            <tr className={cx('notification')}>
              <td colSpan={body.length}>{typeof emptyMessage === 'string' ? emptyMessage : 'Không có phần tử nào.'}</td>
            </tr>
          ) : (
            datas.map((row, trIndex) => (
              <tr key={`tr-${trIndex}`}>
                {body.map((col, tdIndex) => (
                  <td
                    key={`td-${tdIndex}`}
                    colSpan={col?.colSpan || 1}
                    rowSpan={col?.rowSpan || 1}
                    className={cx(col?.classNames ? [...col?.classNames] : undefined)}
                  >
                    {createCell(trIndex, row, col)}
                  </td>
                ))}
              </tr>
            ))
          )}
          {food?.length !== 0 && (
            <tr>
              {food.map((col, tdIndex) => (
                <td
                  key={`td-${tdIndex}`}
                  colSpan={col?.colSpan || 1}
                  rowSpan={col?.rowSpan || 1}
                  className={cx(col?.classNames ? [...col?.classNames] : undefined)}
                >
                  {col.data}
                </td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </>
  );
}

export {
  TABLE_V4_COLUMN_INPUT_TEXT,
  TABLE_V4_COLUMN_INPUT_NUMBER,
  TABLE_V4_COLUMN_INPUT_CHECKBOX,
  TABLE_V4_COLUMN_INPUT_DATE,
  TABLE_V4_COLUMN_SELECT,
  TABLE_V4_COLUMN_TEXT,
  TABLE_V4_COLUMN_TEXT_OPTIONS,
  TABLE_V4_COLUMN_INDEX,
  TABLE_V4_COLUMN_BUTTON,
};
export default TableV4;
