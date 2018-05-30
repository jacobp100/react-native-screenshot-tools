import offsets from "./frames/offsets.json";

/* eslint-disable no-param-reassign */
export default Object.entries(offsets.portrait).reduce(
  (accum, [key, { offset, width }]) => {
    const [x, y] = offset.match(/[+-]\d+/g).map(Number);
    // FIXME
    accum[`Apple ${key}`] = { x, y, width };
    return accum;
  },
  {}
);
