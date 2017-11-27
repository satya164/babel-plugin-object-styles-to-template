/* @flow */

const path = require('path');
const tester = require('babel-plugin-tester');

tester({
  plugin: require('../index'),
  pluginName: 'object-styles-to-template',
  fixtures: path.join(__dirname, '..', '__fixtures__'),
});
