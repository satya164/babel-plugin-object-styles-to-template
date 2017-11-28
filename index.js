/* @flow */

const dashify = text => text.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
const unitless = {
  animationIterationCount: true,
  borderImageOutset: true,
  borderImageSlice: true,
  borderImageWidth: true,
  boxFlex: true,
  boxFlexGroup: true,
  boxOrdinalGroup: true,
  columnCount: true,
  columns: true,
  flex: true,
  flexGrow: true,
  flexPositive: true,
  flexShrink: true,
  flexNegative: true,
  flexOrder: true,
  gridRow: true,
  gridRowEnd: true,
  gridRowSpan: true,
  gridRowStart: true,
  gridColumn: true,
  gridColumnEnd: true,
  gridColumnSpan: true,
  gridColumnStart: true,
  fontWeight: true,
  lineClamp: true,
  lineHeight: true,
  opacity: true,
  order: true,
  orphans: true,
  tabSize: true,
  widows: true,
  zIndex: true,
  zoom: true,

  // SVG-related properties
  fillOpacity: true,
  floodOpacity: true,
  stopOpacity: true,
  strokeDasharray: true,
  strokeDashoffset: true,
  strokeMiterlimit: true,
  strokeOpacity: true,
  strokeWidth: true,
};

module.exports = function(babel /*: any */) {
  const { types: t } = babel;

  return {
    visitor: {
      CallExpression(path /*: any */) {
        const { callee, arguments: args } = path.node;

        if (
          callee.name === 'css' &&
          args.length === 1 &&
          t.isObjectExpression(args[0])
        ) {
          const quasis = [];
          const expressions = [];

          let text = '';

          const indentation = '  ';
          const finalize = (expr, str) => {
            quasis.push(t.templateElement({ raw: text }));
            expressions.push(expr);
            text = str;
          };
          const serialize = (styles, level = 1) => {
            const indent = indentation.repeat(level);

            styles.forEach((prop, i) => {
              if (t.isObjectExpression(prop.value)) {
                if (i !== 0) {
                  text += '\n';
                }

                if (prop.computed) {
                  text += `\n${indent}`;
                  finalize(prop.key, ' {');
                } else {
                  let key;

                  if (t.isIdentifier(prop.key)) {
                    key = prop.key.name;
                  } else {
                    key = prop.key.value;
                  }

                  text += `\n${indent}${key} {`;
                }

                serialize(prop.value.properties, level + 1);
                text += `\n${indent}}`;
                return;
              }

              let key;

              if (prop.computed) {
                text += `\n${indent}`;
                finalize(prop.key, ': ');
              } else {
                if (t.isIdentifier(prop.key)) {
                  key = prop.key.name;
                } else {
                  key = prop.key.value;
                }

                text += `\n${indent}${dashify(key)}: `;
              }

              if (
                t.isStringLiteral(prop.value) ||
                t.isNumericLiteral(prop.value)
              ) {
                let value = prop.value.value;

                if (t.isNumericLiteral(prop.value) && key && !unitless[key]) {
                  value += 'px';
                }

                text += `${value};`;
              } else {
                finalize(prop.value, ';');
              }
            });
          };

          serialize(args[0].properties);
          quasis.push(t.templateElement({ raw: `${text}\n` }));

          const start = path.node.loc.start;

          path.replaceWith(
            t.taggedTemplateExpression(
              t.identifier('css'),
              t.templateLiteral(quasis, expressions)
            )
          );
          path.node.loc = { start };
          path.requeue();
        }
      },
    },
  };
};
