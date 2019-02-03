const scale = require("polylinear-scale");

const textScale = scale(
  [6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19],
  [
    0.683,
    0.325,
    0.211,
    0.12,
    0.055,
    0.0,
    -0.046,
    -0.079,
    -0.107,
    -0.125,
    -0.141,
    -0.139,
    -0.137
  ],
  true
);

const displayScale = scale(
  [20, 21, 22, 24, 25, 27, 30, 33, 40, 44, 48, 50, 53, 56, 60, 65, 69, 70],
  [
    0.095,
    0.081,
    0.073,
    0.063,
    0.056,
    0.048,
    0.04,
    0.033,
    0.025,
    0.02,
    0.017,
    0.014,
    0.011,
    0.009,
    0.007,
    0.005,
    0.003,
    0
  ],
  true
);

const DISPLAY = "SF Pro Display";
const TEXT = "SF Pro Text";

module.exports = (backend, style) => {
  let fontFamily = style.fontSize > 20 ? DISPLAY : TEXT;
  if (!backend.hasFontForStyle({ ...style, fontFamily })) fontFamily = DISPLAY;
  const letterSpacing =
    fontFamily === DISPLAY
      ? displayScale(style.fontSize)
      : textScale(style.fontSize);
  return { fontFamily, letterSpacing };
};
