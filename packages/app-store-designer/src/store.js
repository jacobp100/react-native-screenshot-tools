import { set, update, concat } from "lodash/fp";
import devices from "react-native-device-frames/devices.json";

const ADD_FILE = Symbol("ADD_FILE");
const SET_IMAGE_CONFIG = Symbol("SET_IMAGE_CONFIG");
const CLEAR_MESSAGES = Symbol("CLEAR_MESSAGES");

const deviceKeys = Object.keys(devices).reduce((accum, key) => {
  const { width, height } = devices[key].deviceContext;
  accum[`${width}x${height}`] = key;
  return accum;
}, {});

const keyForSize = (width, height) => deviceKeys[`${width}x${height}`];

export const MESSAGE_LEVELS = {
  WARNING: 1,
  ERROR: 2
};

const message = (detail, level = MESSAGE_LEVELS.WARNING) => ({ detail, level });

const defaultImageConfig = {
  title: "Hello World",
  backgroundColor: "white",
  fontSize: 64,
  textAlign: "center",
  textBelowDevice: false,
  scaleDevice: true,
  padding: 32,
  spacing: 16
};

export const initialState = {
  files: {},
  imageConfigs: {},
  messages: []
};

export const reducer = (state, action) => {
  switch (action.type) {
    case ADD_FILE: {
      const { uri, name, width, height } = action;
      const key = keyForSize(width, height);
      if (key == null) {
        return update(
          "messages",
          concat(
            message(
              `The image ${name} size ${width}x${height} did not correspond to any known devices`
            )
          ),
          state
        );
      }
      const file = { uri, name, width, height };
      return update(
        ["files", key],
        (existing = []) => {
          let index = existing.findIndex((f, i) => {
            const gtPrev = i > 0 ? name > existing[i - 1].name : true;
            const ltCurr = name < f.name;
            return gtPrev && ltCurr;
          });
          if (index === -1) index = existing.length;
          return [...existing.slice(0, index), file, ...existing.slice(index)];
        },
        state
      );
    }
    case SET_IMAGE_CONFIG:
      return update(
        ["imageConfigs", action.index],
        (config = defaultImageConfig) => set(action.key, action.value, config),
        state
      );
    case CLEAR_MESSAGES:
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export const getImageConfig = (index, state) => {
  const sources = Object.values(state.files)
    .map(fileSet => fileSet[index])
    .filter(x => x != null);
  const { [index]: config = defaultImageConfig } = state.imageConfigs;
  return { ...config, sources };
};

export const getFilesTable = ({ files }) => {
  const columns = Object.keys(files);
  const numScreenshots = columns
    .map(key => files[key].length)
    .reduce((a, b) => Math.max(a, b), 0);

  const rows = Array.from({ length: numScreenshots }, (_, i) =>
    columns.reduce((accum, column) => {
      accum[column] = files[column][i];
      return accum;
    }, {})
  );

  return { columns, rows };
};

export const addFile = ({ uri, name, width, height }) => ({
  type: ADD_FILE,
  uri,
  name,
  width,
  height
});
export const setImageConfig = (index, key, value) => ({
  type: SET_IMAGE_CONFIG,
  index,
  key,
  value
});
export const clearMessages = () => ({ type: CLEAR_MESSAGES });
