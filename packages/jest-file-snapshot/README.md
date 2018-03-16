This is basically `toMatchSnapshot`, except it writes the output to a file. This is useful for SVGs.

It's forked from [jest-image-snapshot](https://github.com/americanexpress/jest-image-snapshot).

## Usage

1. Extend Jest's expect

```js
const { toMatchFileSnapshot } = require("jest-file-snapshot");

expect.extend({ toMatchFileSnapshot });
```

Use toMatchFileSnapshot() in your tests!

```js
it('should demonstrate this matcher`s usage', () => {
  ...
  expect(string).toMatchFileSnapshot();
});
```

### Optional configuration

* `fileExtension`: Pass a file extension (with preceding dot: `.`)

```js
it('should export an SVG', () => {
  ...
  expect(image).toMatchImageSnapshot({ fileExtension: '.svg' });
});
```

Or if you want this globally,

```js
const { configureToMatchFileSnapshot } = require("jest-file-snapshot");

expect.extend({
  toMatchFileSnapshot: configureToMatchFileSnapshot({ fileExtension: ".svg" })
});

it('should export an SVG', () => {
  ...
  expect(image).toMatchImageSnapshot(); // uses .svg extension
});
```
