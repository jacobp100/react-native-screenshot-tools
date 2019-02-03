const { max, map } = require("lodash/fp");
const { lineHeight } = require("../layout/textLayout");

module.exports.textAligns = {
  left: 0,
  center: 0.5,
  right: 1
};

module.exports.enumerateLines = (
  backend,
  lines,
  callback,
  initialY = 0,
  initialX = 0
) => {
  lines.reduce((top, line) => {
    const { text, attributedStyles } = line;

    const runs = attributedStyles.map(({ style, start, end }, i) => ({
      body:
        i === attributedStyles.length - 1
          ? text.slice(start, end).replace(/\s*$/, "")
          : text.slice(start, end),
      style
    }));

    const sizes = runs.map(({ body, style }) =>
      backend.measureText(body, style)
    );
    const maxAscent = max(map("emHeightAscent", sizes));
    const maxDecent = max(map("emHeightDescent", sizes));
    const blockHeight = maxAscent + maxDecent;
    const linePadding = (lineHeight(line) - blockHeight) / 2;

    const y = top + linePadding + maxAscent;

    runs.reduce(
      (x, { body, style }, i) => callback({ x, y, body, style, i }),
      typeof initialX === "function" ? initialX(runs) : initialX
    );

    return top + lineHeight(line);
  }, initialY);
};
