# babel-plugin-object-styles-to-template

Babel plugin to transpile object styles to template literal.

The plugin will convert styles written in object syntax to tagged template literal which libraries like [Linaria](https://github.com/callstack/linaria) can consume.

## Usage

Install the plugin:

```sh
yarn add --dev babel-plugin-object-styles-to-template
```

Then include it in your `.babelrc`:

```json
{
  "plugins": [
    "object-styles-to-template"
  ]
}
```

## Example

When you write the following:

```js
const container = css({
  flex: 1,
  padding: 10,
  backgroundColor: 'orange',
  color: colors.white,

  '&:hover': {
    backgroundColor: 'tomato',
  }
});
```

It's transpiled to:

```js
const container = css`
  flex: 1;
  padding: 10px;
  background-color: orange;
  color: ${colors.white};

  &:hover {
    background-color: tomato;
  }
`;
```
