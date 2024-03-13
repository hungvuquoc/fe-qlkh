import moment from 'moment';
import { useCallback, useRef } from 'react';
import localStorageUtils from './localStorageUtils';
import { KEY_AUTHORITIES } from './appConstant';

export const hasAuthorities = (keys) => {
  let authorities = localStorageUtils.getAuthorities();
  if (authorities[KEY_AUTHORITIES.ROOT] || authorities[KEY_AUTHORITIES.WH_ROOT]) {
    return true;
  }

  for (var key of keys) {
    if (authorities[key]) {
      return true;
    }
  }

  return false;
};

export const hasAuthority = (key) => {
  let authorities = localStorageUtils.getAuthorities();
  if (authorities[key]) {
    return true;
  }

  return false;
};

export function isEmptyObj(obj) {
  for (var prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      return false;
    }
  }

  return true;
}

export const somePropertyNotEmpty = (obj) => {
  for (var prop in obj) {
    if (obj[prop] != '') {
      return true;
    }
  }

  return false;
};

export const formatDatetime = (value, regex) => {
  if (regex) {
    return moment(value).format(regex);
  }

  return moment(value).format('yyyy-MM-DD,HH:mm:ss').replace(',', 'T');
};

export function mapObjectToForm(formData, obj, parentKey) {
  if (!obj) {
    return;
  }

  if (obj instanceof Array) {
    Object.keys(obj).forEach((key) => {
      if (obj.hasOwnProperty(key) && obj[key]) {
        const value = obj[key];
        const propertyKey = parentKey ? `${parentKey}[${key}]` : key;
        if (typeof value === 'object') {
          mapObjectToForm(formData, value, propertyKey);
          return;
        }
        formData.append(propertyKey, value);
      }
    });
    return;
  }

  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      if (key !== 'isFileList' && obj.hasOwnProperty(key) && obj[key]) {
        const value = obj[key];
        const propertyKey = parentKey ? `${parentKey}.${key}` : key;
        if (value instanceof FileList) {
          const isFileList = obj['isFileList'];
          if (isFileList) {
            for (let i = 0; i < value.length; i++) {
              const fileKey = propertyKey + '[' + i + ']';
              formData.append(fileKey, value[i], value[i].name);
            }
          } else {
            formData.append(propertyKey, value[0], value[0].name);
          }
        } else if (value && typeof value === 'object') {
          mapObjectToForm(formData, value, propertyKey);
        } else {
          formData.append(propertyKey, value);
        }
      }
    });
    return;
  }
}

// thêm một object để lưu các formart -> đổi objFormat thành tên khác -> các field sử dụng (objField)
//
export const formatData = (objData, objFormat) => {
  if (objData == undefined) {
    return null;
  }

  if (objData instanceof Array) {
    const formatedData = [];

    Array.from(objData).forEach((od) => {
      formatedData.push(formatData(od, objFormat));
    });

    return formatedData;
  }

  if (typeof objData === 'object') {
    const formatedData = {};

    Object.keys(objFormat).forEach((key) => {
      const objDataValue = objData[key];
      const objFormatValue = objFormat[key];
      if (objDataValue instanceof Array) {
        formatedData[key] = formatData(objDataValue, objFormatValue);
      }

      formatedData[key] = formatData(objDataValue, objFormatValue);
    });

    return formatedData;
  }

  return formatFieldValue(objData, objFormat);
};

// format by field type
export const formatFieldValue = (value, fieldType) => {
  if (value == undefined) {
    return null;
  }

  if (!fieldType) {
    return value;
  }

  switch (fieldType) {
    case FieldType.datetime:
      return formatDatetime(value);
    case FieldType.int:
      return parseInt(value);
    case FieldType.double:
      return parseFloat(value);
    default:
      return value;
  }
};

// field type
export const FieldType = {
  int: 'int',
  datetime: 'datetime',
  double: 'double',
};

/// double click
export const useDoubleClick = (click, doubleClick, options) => {
  options = {
    timeout: 200,
    ...options,
  };

  const clickTimeout = useRef();

  const clearClickTimeout = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
    }
  };

  return useCallback(
    (event, data = {}) => {
      clearClickTimeout();
      if (click && event.detail === 1) {
        clickTimeout.current = setTimeout(() => {
          click({ event, ...data });
        }, options.timeout);
      }
      if (event.detail % 2 === 0) {
        doubleClick({ event, ...data });
      }
    },
    [click, doubleClick, options.timeout],
  );
};

// export function mapObjectToForm(formData, obj, parentKey) {
//   if (obj && typeof obj === 'object') {
//     Object.keys(obj).forEach((key) => {
//       const value = obj[key];
//       const formKey = parentKey ? `${parentKey}[${key}]` : key;
//       if (value instanceof FileList) {
//         for (let i = 0; i < value.length; i++) {
//           formData.append(formKey, value[i], value[i].name);
//         }
//       } else if (value && typeof value === 'object') {
//         mapObjectToForm(formData, value, formKey);
//       } else {
//         formData.append(formKey, value);
//       }
//     });
//   }
// }

// convert object to form data
