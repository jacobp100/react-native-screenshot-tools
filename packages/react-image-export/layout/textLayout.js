import * as LineBreaker from "linebreak";

const max = numbers => numbers.reduce(Math.max, 0);

const lineWidth = (backend, { text, attributedStyles }) =>
  attributedStyles.reduce((x, { start, end, style }, i) => {
    let body = text.slice(start, end);
    // Trim trailling whitespace
    if (i === attributedStyles.length - 1) {
      body = body.replace(/\s+$/, "");
    }
    return x + backend.measureText(body, style);
  }, 0);

const lineHeight = line =>
  max(line.attributedStyles.map(({ style }) => style.lineHeight));

module.exports.lineWidth = lineWidth;
module.exports.lineHeight = lineHeight;

module.exports.lineFontSize = line =>
  max(line.attributedStyles.map(({ style }) => style.fontSize));

const textSlice = (textStyle, start, end) => ({
  text: textStyle.text.slice(start, end),
  attributedStyles: textStyle.attributedStyles
    .filter(a => a.end > start && a.start < end)
    .map(a => ({
      start: Math.max(a.start - start, 0),
      end: Math.min(a.end - start, end - start),
      style: a.style
    }))
});

module.exports.breakLines = (backend, textStyle, width) => {
  const { text } = textStyle;
  const breaker = new LineBreaker(text);

  const lines = [];
  let lineStart = 0;
  let lastPosition = 0;
  let lastLine = null;
  let shouldBreak = false;

  let bk = breaker.nextBreak();
  while (bk != null) {
    const { position, required } = bk;
    const testLine = textSlice(textStyle, lineStart, position);
    if (
      lastLine === null ||
      (!shouldBreak && lineWidth(backend, testLine) <= width)
    ) {
      lastLine = testLine;
    } else {
      lines.push(lastLine);
      lineStart = lastPosition;
      lastLine = textSlice(textStyle, lineStart, position);
    }
    lastPosition = position;
    shouldBreak = required;
    bk = breaker.nextBreak();
  }

  if (lastLine !== null) {
    lines.push(lastLine);
  }

  return lines;
};

module.exports.measureLines = (backend, lines) => ({
  width: max(lines.map(line => lineWidth(backend, line))),
  height: lines.reduce((a, b) => a + lineHeight(b), 0)
});
