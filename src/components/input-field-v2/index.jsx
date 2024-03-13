const INPUT_TEXT = 'text';
const INPUT_NUMBER = 'number';
const INPUT_PASSWORD = 'password';
const INPUT_SELECT = 'select';
const INPUT_RADIO = 'radio';
const INPUT_DATE = 'date';

const CONATINER = 'container';

function InputFieldsV2({ datas = [], cx }) {
  const createInputText = (data, inputType, key) => {
    if (data?.hidden) {
      return <></>;
    }

    return (
      <div
        key={key}
        className={cx(data?.classNames?.container ? [...data?.classNames?.container] : 'form_item-container')}
      >
        {data.title && (
          <label
            htmlFor={data.field}
            className={cx(data?.classNames?.label ? [...data?.classNames?.label] : 'form-label')}
          >
            {data.title}
          </label>
        )}
        <input
          className={cx(data?.classNames?.input ? [...data?.classNames?.input] : 'form-input')}
          type={inputType}
          id={data.field}
          name={data.field}
          value={data.value ?? ''}
          disabled={data.disabled || false}
          placeholder={data.placeholder || ''}
          onBlur={(event) => {
            if (typeof data.handleBlur === 'function') {
              data.handleBlur(event);
            }
          }}
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
        {data?.error && <span className={cx('error')}>{data?.error}</span>}
      </div>
    );
  };

  const createInputSelect = (data, key) => {
    if (data?.hidden) {
      return <></>;
    }
    return (
      <div
        key={key}
        className={cx(data?.classNames?.container ? [...data?.classNames?.container] : 'form_item-container')}
      >
        {data.title && (
          <label
            htmlFor={data.field}
            className={cx(data?.classNames?.label ? [...data?.classNames?.label] : 'form-label')}
          >
            {data.title}
          </label>
        )}
        <select
          className={cx(data?.classNames?.input ? [...data?.classNames?.input] : 'form-input')}
          id={data.field}
          name={data.field}
          defaultValue={data.defaultValue}
          disabled={data.disabled || false}
          placeholder={data.placeholder || ''}
          onBlur={(event) => {
            if (typeof data.handleBlur === 'function') {
              data.handleBlur(event);
            }
          }}
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
          <option value={-1} selected={data.defaultValue ? false : true}>
            -- Hãy chọn --
          </option>
          {data?.options.map((item, index) => {
            if (typeof item === 'object') {
              return (
                <option
                  key={index}
                  value={eval(`item?.${data.fieldValue}`)}
                  selected={data.defaultValue == eval(`item?.${data.fieldValue}`)}
                >
                  {eval(`item?.${data.fieldDisplay}`)}
                </option>
              );
            }

            return (
              <option key={index} value={item} selected={data.defaultValue == item}>
                {item}
              </option>
            );
          })}
        </select>
        {data?.error && <span className={cx('error')}>{data?.error}</span>}
      </div>
    );
  };

  const createInputRadio = (data, key) => {
    if (data?.hidden) {
      return <></>;
    }
    return (
      <div key={key} className={cx('form_item-container')}>
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
        {data?.error && <span className={cx('error')}>{data?.error}</span>}
      </div>
    );
  };

  const createContainer = (data, key) => {
    if (data?.hidden) {
      return <></>;
    }
    return (
      <div
        key={key}
        className={cx(data?.classNames ? [...data?.classNames] : 'containers')}
        disabled={data.disabled || false}
      >
        {data?.inputFields?.map((item, index) => inputType(item, index))}
      </div>
    );
  };

  const inputType = (data, key) => {
    switch (data.type) {
      case INPUT_TEXT:
        return createInputText(data, 'text', key);
      case INPUT_PASSWORD:
        return createInputText(data, 'password', key);
      case INPUT_NUMBER:
        return createInputText(data, 'number', key);
      case INPUT_SELECT:
        return createInputSelect(data, key);
      case INPUT_RADIO:
        return createInputRadio(data, key);
      case INPUT_DATE:
        return createInputText(data, 'date', key);
      case CONATINER:
        return createContainer(data, key);
    }
  };

  return datas?.map((item, index) => inputType(item, index));
}

export { INPUT_TEXT, INPUT_NUMBER, INPUT_SELECT, INPUT_RADIO, INPUT_DATE, CONATINER };
export default InputFieldsV2;
