import classNames from 'classnames/bind';
import style from './Index.module.scss';

const INPUT_TEXT = 'text';
const INPUT_NUMBER = 'number';
const INPUT_SELECT = 'select';
const INPUT_RADIO = 'radio';
const INPUT_DATE = 'date';

const CONATINER = 'container';

function InputFields({ datas = [], styleCustom = {} }) {
  const cx = classNames.bind({ ...style, ...styleCustom });

  const createInputText = (data, inputType, key) => {
    if (data?.hidden) {
      return <></>;
    }

    return (
      <div
        key={key}
        className={cx(data?.classNames?.container ? [...data?.classNames?.container] : 'form_item-container')}
      >
        {!data?.notHasTitle && (
          <div className={cx(data?.classNames?.label ? [...data?.classNames?.label] : 'form-label')}>
            <label htmlFor={data.field}>{data.title}</label>
          </div>
        )}
        <div className={cx(data?.classNames?.input ? [...data?.classNames?.input] : 'form-input')}>
          <input
            className={cx(data?.classNames?.input ? [...data?.classNames?.input] : 'form-input')}
            type={inputType}
            name={data.field}
            id={data.field}
            value={data?.value ?? ''}
            disabled={data?.disabled || false}
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

  const createInputSelect = (data, key) => {
    if (data?.hidden) {
      return <></>;
    }
    return (
      <div
        key={key}
        className={cx(data?.classNames?.container ? [...data?.classNames?.container] : 'form_item-container')}
      >
        {!data?.notHasTitle && (
          <div className={cx(data?.classNames?.label ? [...data?.classNames?.label] : 'form-label')}>
            <label htmlFor={data.field}>{data.title}</label>
          </div>
        )}
        <div className={cx(data?.classNames?.input ? [...data?.classNames?.input] : 'form-input')}>
          <select
            className={cx(data?.classNames?.input ? [...data?.classNames?.input] : 'form-input')}
            name={data.field}
            id={data.field}
            defaultValue={data.defaultValue}
            disabled={data.disabled}
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
            <option value={-1}>-- Hãy chọn --</option>
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
      </div>
    );
  };

  const createContainer = (data, key) => {
    if (data?.hidden) {
      return <></>;
    }
    return (
      <div key={key} className={cx(data?.classNames ? [...data?.classNames] : 'containers')}>
        {data?.inputFields?.map((item, index) => (
          <div key={index}>{inputType(item)}</div>
        ))}
      </div>
    );
  };

  const inputType = (data, key) => {
    switch (data.type) {
      case INPUT_TEXT:
        return createInputText(data, 'text', key);
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
export default InputFields;
