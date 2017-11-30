const { createMacro } = require('babel-macros');

const plugin = require('./index.js');

module.exports = createMacro(css);

function css({ references, babel }) {
  references.default.forEach(reference => {
    if (reference.parentPath.type === 'CallExpression')
      plugin(babel).visitor.CallExpression(reference.parentPath);
  });
}
