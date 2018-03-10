const Base = require("./Base");
const { breakLines, measureLines } = require("../layout/textLayout");

const defaultStyles = {
  color: "black",
  fontFamily: "Helvetica",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: "normal",
  lineHeight: 18,
  textAlign: "left"
};

const textAligns = {
  left: 0,
  center: 0.5,
  right: 1
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

module.exports = class Text extends Base {
  constructor(...args) {
    super(...args);
    this.text = null;
  }

  extractText() {
    const childElements = [
      { element: this, style: { ...defaultStyles, ...this.style } }
    ];
    let text = "";
    const attributedStyles = [];

    while (childElements.length !== 0) {
      const { element, style } = childElements.shift();

      if (element == null || element === false) {
        throw new Error(
          "I don't think this happen. If it does, log an issue (with stack trace) on GitHub."
        );
        // Do nothing
      } else if (element.constructor === Text) {
        const nextElements = element.children.map(childElement => ({
          element: childElement,
          style:
            childElement.constructor === Text
              ? { ...style, ...childElement.style }
              : { ...style }
        }));
        childElements.unshift(...nextElements);
      } else if (typeof element === "object" && element.text != null) {
        const childText = String(element.text); // child might be a number
        text += childText;
        appendStyleTo(attributedStyles, childText, style);
      }
    }

    return { text, attributedStyles };
  }

  measureFunc(width) {
    const styledText = this.extractText();
    this.text = breakLines(this.backend, styledText, width);
    return measureLines(this.backend, this.text);
  }

  draw(screenFrame) {
    const { textAlign = "left" } = this.text[0].attributedStyles[0].style;
    const x = screenFrame.x + screenFrame.width * textAligns[textAlign];
    const { y } = screenFrame;
    this.backend.fillLines(this.text, x, y);
  }
};
