const rewireReactHotLoader = require('react-app-rewire-hot-loader');
const { alias } = require('react-app-rewire-alias');

module.exports = function override(config, env) {
  config = rewireReactHotLoader(config, env);
  alias({
    '@assets': 'src/main/assets',
    '@Components': 'src/main/Components',
    '@Pages': 'src/main/Pages',
    '@Util': 'src/main/Util',
  })(config);

  return config;
};
