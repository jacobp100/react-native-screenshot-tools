const { max } = require("lodash/fp");
const Base = require("./Base");
const {
  breakLines,
  measureLines,
  truncateLines
} = require("../layout/textLayout");
const { getInnerFrame } = require("../layout/util");
const getIOSFont = require("./iosFonts");

const getFilteredStyles = (styleKey, attributedStyles) =>
  attributedStyles
    .map(attributedStyle => attributedStyle.style[styleKey])
    .filter(style => style != null);

const getLineHeight = attributedStyles => {
  const lineHeights = getFilteredStyles("lineHeight", attributedStyles);
  if (lineHeights.length !== 0) return max(lineHeights);

  const fontSizes = getFilteredStyles("fontSize", attributedStyles);
  if (fontSizes.length !== 0) return Math.floor(1.25 * max(fontSizes));

  return 18; // for fontSize of 14
};

const defaultStyles = attributedStyles => ({
  color: "black",
  fontFamily: "System",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: "normal",
  textAlign: "left",
  lineHeight: getLineHeight(attributedStyles),
  fontVariant: [],
  letterSpacing: 0,
  textDecoration: "none",
  textDecorationColor: "currentColor", // Internal value
  textDecorationStyle: "solid"
});

const applyInternalValues = (inputStyle, settings) => {
  const style = { ...inputStyle };

  if (style.fontFamily !== "System") {
    // pass
  } else if (settings.platform === "ios") {
    const { fontFamily, letterSpacing } = getIOSFont(style);
    style.fontFamily = fontFamily;
    if (style.letterSpacing === 0) style.letterSpacing = letterSpacing;
  } else if (settings.platform === "android") {
    style.fontFamily = "Roboto";
  } else {
    style.fontFamily = settings.fontFamily;
  }

  if (style.textDecorationColor === "currentColor") {
    style.textDecorationColor = style.color;
  }

  return style;
};

const appendStyleTo = (attributedStyles, text, style) => {
  const lastAttributedStyle =
    attributedStyles.length > 0
      ? attributedStyles[attributedStyles.length - 1]
      : null;

  if (lastAttributedStyle !== null && style === lastAttributedStyle) {
    lastAttributedStyle.end += text.length;
  } else {
    const start = lastAttributedStyle ? lastAttributedStyle.end : 0;
    const end = start + text.length;
    attributedStyles.push({ start, end, style });
  }
};

class Text extends Base {
  constructor(...args) {
    super(...args);
    this.body = null;
  }

  normalizeStyle(style) {
    if (this.settings.platform === "android") {
      return {
        ...style,
        fontVariant: [],
        letterSpacing: 0,
        textDecorationColor: "currentColor",
        textDecorationStyle: "solid",
        writingDirection: "ltr"
      };
    }
    return style;
  }

  extractText() {
    const childElements = [{ element: this, style: this.style }];
    let text = "";
    let attributedStyles = [];

    while (childElements.length !== 0) {
      const { element, style } = childElements.shift();

      if (element instanceof Text) {
        const nextElements = element.children.map(childElement => ({
          element: childElement,
          style:
            childElement.constructor === Text
              ? { ...style, ...childElement.style }
              : { ...style }
        }));
        childElements.unshift(...nextElements);
      } else if (element instanceof Text.Container) {
        const childText = String(element.text); // child might be a number
        text += childText;
        appendStyleTo(attributedStyles, childText, style);
      } else {
        throw new Error(
          "I don't think this happen. If it does, log an issue (with stack trace) on GitHub."
        );
      }
    }

    const defaultStyle = defaultStyles(attributedStyles);
    attributedStyles = attributedStyles.map(({ start, end, style }) => ({
      start,
      end,
      style: applyInternalValues({ ...defaultStyle, ...style }, this.settings)
    }));

    return { text, attributedStyles };
  }

  measureFunc(outerWidth) {
    const { width } = getInnerFrame(
      { x: 0, y: 0, width: outerWidth, height: 0 },
      this.style
    );

    const styledText = this.extractText();
    let body = breakLines(this.backend, styledText, width);
    if (Number.isFinite(this.props.numberOfLines)) {
      body = truncateLines(this.backend, body, this.props.numberOfLines, width);
    }
    this.body = body;
    return measureLines(this.backend, this.body);
  }

  draw(screenFrame) {
    this.backend.fillLines(this.body, getInnerFrame(screenFrame, this.style));
  }
}

Text.Container = class TextContainer {
  constructor(text) {
    this.text = text;
  }

  updateText(text) {
    this.text = text;
  }
};

module.exports = Text;
