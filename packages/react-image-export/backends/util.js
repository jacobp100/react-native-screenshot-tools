import { lineFontSize, lineHeight } from "../layout/textLayout";

module.exports.enumerateLines = (lines, callback) => {
  lines.reduce((top, line) => {
    const { text, attributedStyles } = line;
    const y = top + (lineHeight(line) - lineFontSize(line)) / 2;

    attributedStyles.reduce((x, { start, end, style }, i) => {
      const body =
        i === attributedStyles.length - 1
          ? text.slice(start, end).replace(/\s*$/, "")
          : text.slice(start, end);
      return callback({ x, y, body, style, i });
    }, 0);

    return top + lineHeight(line);
  }, 0);
};
