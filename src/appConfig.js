export default Object.freeze({
  API_ENPOINT: 'http://localhost:8080',
});

const convertJsonToFormData = (formData = new FormData(), data, parentKey = null) => {
  if (data && typeof data === 'object') {
    Object.keys(data).forEach((key) => {
      const value = data[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;
      if (value instanceof FileList) {
        for (let i = 0; i < value.length; i++) {
          formData.append(formKey, value[i], value[i].name);
        }
      } else if (value && typeof value === 'object') {
        convertJsonToFormData(formData, value, formKey);
      } else {
        formData.append(formKey, value);
      }
    });
  }
  return formData;
};
