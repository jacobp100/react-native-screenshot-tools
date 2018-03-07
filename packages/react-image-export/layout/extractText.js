const { flattenStyle } = require("../stylesheet");
const { depthFirst } = require("./util");

/*
type AttributedStyle = { start: number, end: number, style: any }

type TextWithAttributedStyle = {
  text: string,
  attributedStyles: AttributedStyle[],
}
*/

const defaultStyles = {
  color: "black",
  fontFamily: "Helvetica",
  fontSize: 14,
  fontStyle: "normal",
  fontWeight: "normal",
  lineHeight: 18,
  textAlign: "left"
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

module.exports = rootTextElement => {
  let text = "";
  const attributedStyles = [];

  depthFirst((element, style) => {
    if (element == null || element === false) {
      console.log("Should this happen?");
      // Do nothing
    } else if (typeof element !== "object") {
      const childText = String(element); // child might be a number
      text += childText;
      appendStyleTo(attributedStyles, childText, style);
    } else if (element.nodeType === "host" && element.type === "Text") {
      const nextStyle = {
        ...defaultStyles,
        ...flattenStyle(element.props.style)
      };
      return nextStyle;
    }
    return style;
  }, rootTextElement);

  return { text, attributedStyles };
};
