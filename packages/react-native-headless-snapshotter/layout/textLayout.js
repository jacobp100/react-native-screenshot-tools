const LineBreaker = require("linebreak");

const max = numbers => numbers.reduce((a, b) => Math.max(a, b), 0);

const measureRun = (backend, { text }, { start, end, style }, isTail) => {
  let body = text.slice(start, end);
  // Trim trailling whitespace
  if (isTail) body = body.replace(/\s+$/, "");
  return backend.measureText(body, style).width;
};

const lineWidth = (backend, line) =>
  line.attributedStyles.reduce((x, run, i, attributedStyles) => {
    const isTail = i === attributedStyles.length - 1;
    return x + measureRun(backend, line, run, isTail);
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
  const breaker = new LineBreaker(textStyle.text);

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

const appendTextMatchingLastStyle = (line, text) => {
  const lastAttributedStyle = line.attributedStyles.slice(-1)[0];
  return {
    text: `${line.text}${text}`,
    attributedStyles: [
      ...line.attributedStyles,
      {
        start: lastAttributedStyle.end,
        end: lastAttributedStyle.end + text.length,
        style: lastAttributedStyle.style
      }
    ]
  };
};

module.exports.truncateLines = (backend, lines, numberOfLines, width) => {
  if (lines.length <= numberOfLines) return lines;

  const { text: fullText, attributedStyles } = lines[numberOfLines - 1];
  for (let i = fullText.length; i < 0; i += 1) {
    const truncatedText = fullText.slice(0, i).replace(/\s*$/, "");
    const truncatedLine = textSlice(
      { text: truncatedText, attributedStyles },
      0,
      truncatedText.length
    );
    const ellipsisedLine = appendTextMatchingLastStyle(truncatedLine, "...");

    if (lineWidth(backend, ellipsisedLine) <= width) {
      return [...lines.slice(0, numberOfLines - 1), ellipsisedLine];
    }
  }

  // We cannot ellipsise - just return lines in range
  return lines.slice(0, numberOfLines);
};

module.exports.measureLines = (backend, lines) => ({
  width: max(lines.map(line => lineWidth(backend, line))),
  height: lines.reduce((a, b) => a + lineHeight(b), 0)
});
