/* @flow */

const path = require('path');
const tester = require('babel-plugin-tester');

tester({
  plugin: require('../index'),
  pluginName: 'libaria-object-styles',
  fixtures: path.join(__dirname, '..', '__fixtures__'),
});
