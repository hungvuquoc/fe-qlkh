const { override, useBabelRc } = require('customize-cra');

module.exports = override(useBabelRc());

module.exports.resolve = {
  fallback: {
    http: require.resolve('stream-http'),
  },
};
