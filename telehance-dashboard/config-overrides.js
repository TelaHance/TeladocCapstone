const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const { alias, configPaths } = require('react-app-rewire-alias');

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);
  return alias(configPaths('./tsconfig.paths.json'))(config)
};
