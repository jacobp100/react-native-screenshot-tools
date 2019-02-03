import { set, update } from "lodash/fp";

const ADD_FILE = Symbol("ADD_FILE");

export default (
  action,
  state = {
    files: {}
  }
) => {
  switch (action.type) {
    case ADD_FILE: {
      const { uri, name, width, height } = action;
      const key = `${width}x${height}`;
      const file = { uri, name };
      return update(
        ["files", key],
        (existing = []) => {
          const index = Math.max(existing.findIndex(f => f.name < name), 0);
          return [...existing.slice(0, index), file, ...existing.slice(index)];
        },
        state
      );
    }
    default:
      return state;
  }
};
