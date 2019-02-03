const { enumerateLines, textAligns } = require("../backend-render/util");

module.exports = class FontKitBackend {
  measureText(text, style) {
    const font = this.getLoadedFont(style);
    const scale = style.fontSize / font.unitsPerEm;
    return {
      width:
        font.layout(text).advanceWidth * scale +
        style.letterSpacing * text.length,
      emHeightAscent: Math.abs(font.ascent * scale),
      emHeightDescent: Math.abs(font.descent * scale)
    };
  }

  fillLinesIntoBackend(renderBackend, lines, screenFrame) {
    const { textAlign = "left" } = lines[0].attributedStyles[0].style;

    const renderRun = ({ x, y, body, style }) => {
      const font = this.getLoadedFont(style);
      const run = font.layout(body);
      const scale = style.fontSize / font.unitsPerEm;
      const { letterSpacing } = style;
      const xPositions = run.positions.reduce(
        (acc, position) => {
          const previousPosition = acc[acc.length - 1];
          return [
            ...acc,
            previousPosition + position.xAdvance * scale + letterSpacing
          ];
        },
        [0]
      );
      run.glyphs.forEach((glyph, i) => {
        const path = glyph.path
          .scale(scale, -scale)
          .translate(x + xPositions[i], y);

        renderBackend.beginShape();
        path.toFunction()(renderBackend.ctx);

        renderBackend.commitShape({ fill: style.color });
      });
      return x + xPositions[xPositions.length - 1];
    };

    const getStartX = runs => {
      const totalWidth = runs.reduce(
        (x, { body, style }) => x + this.measureText(body, style).width,
        0
      );

      const startX =
        screenFrame.x +
        (screenFrame.width - totalWidth) * textAligns[textAlign];
      return startX;
    };

    enumerateLines(this, lines, renderRun, screenFrame.y, getStartX);
  }
};
