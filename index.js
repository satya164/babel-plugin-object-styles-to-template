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

export default function(babel) {
  const { types: t } = babel;

  return {
    name: 'ast-transform', // not required
    visitor: {
      CallExpression(path) {
        const { callee, arguments: args } = path.node;

        if (callee.name === 'css' && args.length === 1) {
          const quasis = [];
          const expressions = [];

          let text = '';

          const serialize = (styles, indent = '  ') =>
            styles.forEach(prop => {
              if (t.isObjectExpression(prop.value)) {
                if (prop.computed) {
                  text += `\n\n${indent}`;
                  quasis.push(t.templateElement({ raw: text }));
                  expressions.push(prop.key);
                  text = ' {';
                } else {
                  if (t.isIdentifier(prop.key)) {
                    key = prop.key.name;
                  } else {
                    key = prop.key.value;
                  }

                  text += `\n\n${indent}${key} {`;
                }

                serialize(prop.value.properties, '    ');
                text += '\n  }';
                return;
              }

              let key;

              if (prop.computed) {
                text += `\n${indent}`;
                quasis.push(t.templateElement({ raw: text }));
                expressions.push(prop.key);
                text = ': ';
              } else {
                if (t.isIdentifier(prop.key)) {
                  key = prop.key.name;
                } else {
                  key = prop.key.value;
                }

                text += `\n${indent}${dashify(key)}: `;
              }

              if (t.isStringLiteral(prop.value)) {
                text += `${prop.value.value};`;
              } else if (t.isNumericLiteral(prop.value)) {
                if (unitless[key]) {
                  text += `${prop.value.value};`;
                } else {
                  text += `${prop.value.value}px;`;
                }
              } else {
                quasis.push(t.templateElement({ raw: text }));
                expressions.push(prop.value);
                text = ';';
              }
            });

          serialize(args[0].properties);
          quasis.push(t.templateElement({ raw: `${text}\n` }));

          path.replaceWith(
            t.taggedTemplateExpression(
              t.identifier('css'),
              t.templateLiteral(quasis, expressions)
            )
          );
          path.requeue();
        }
      },
    },
  };
}
