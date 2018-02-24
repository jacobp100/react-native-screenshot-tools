const { flattenStyle } = require("../stylesheet");

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

module.exports = element => {
  let text = "";
  const attributedStyles = [];

  const iterate = (c, style = { ...defaultStyles, ...flattenStyle(c) }) => {
    (c.children || []).forEach(child => {
      if (child == null) {
        /* Do nothing */
      } else if (typeof child !== "object") {
        const childText = String(child); // child might be a number
        text += childText;
        appendStyleTo(attributedStyles, childText, style);
      } else {
        iterate(child, { ...style, ...flattenStyle(child) });
      }
    });
  };

  iterate(element);

  return { text, attributedStyles };
};
