import { set, update, concat } from "lodash/fp";
import devices from "react-native-device-frames/devices.json";

const ADD_IMAGE = Symbol("ADD_IMAGE");
const SET_CONFIG = Symbol("SET_CONFIG");
const SET_IMAGE_CONFIG = Symbol("SET_IMAGE_CONFIG");
const SET_EXPORTS = Symbol("SET_EXPORTS");
const ADD_ERROR = Symbol("ADD_ERROR");
const CLEAR_MESSAGES = Symbol("CLEAR_MESSAGES");

export const deviceNames = Object.keys(devices);

const deviceKeyedObject = fn =>
  deviceNames.reduce((accum, key) => {
    accum[key] = fn(devices[key], key);
    return accum;
  }, {});

const deviceSizes = deviceNames.reduce((accum, key) => {
  const { width, height } = devices[key].deviceContext;
  accum[`${width}x${height}`] = key;
  return accum;
}, {});

const deviceNameForSize = (width, height) => deviceSizes[`${width}x${height}`];

export const messageLevels = {
  WARNING: 1,
  ERROR: 2
};

const defaultImageConfig = {
  title: "Hello World",
  colors: ["Silver"],
  backgroundColor: "white",
  textColor: "black",
  fontSize: 32,
  textAlign: "center",
  textBelowDevice: false,
  scaleDevice: true,
  padding: 32,
  spacing: 16
};

export const exportTypes = {
  DISABLED: 0,
  ENABLED: 1,
  IF_AVAILABLE: 2
};

export const initialState = {
  exports: deviceKeyedObject(() => exportTypes.IF_AVAILABLE),
  files: deviceKeyedObject(() => []),
  imageConfigs: {},
  messages: []
};

const addMessage = (body, level = messageLevels.WARNING) =>
  update("messages", concat({ body, level }));

export const reducer = (state, action) => {
  switch (action.type) {
    case ADD_IMAGE: {
      const { uri, name, width, height } = action;
      const key = deviceNameForSize(width, height);
      if (key == null) {
        return addMessage(
          `The image ${name} with size ${width}x${height} did not correspond to any known devices`
        )(state);
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
    case SET_CONFIG: {
      const { config } = action;
      if (config.appStoreDesignerVersion !== 1) return state;
      const imageConfigs = config.imageConfigs.map(c => c.config);
      return { ...state, imageConfigs };
    }
    case SET_IMAGE_CONFIG:
      return update(
        ["imageConfigs", action.index],
        (config = defaultImageConfig) => set(action.key, action.value, config),
        state
      );
    case SET_EXPORTS: {
      const { exports } = action;
      return {
        ...state,
        exports: deviceKeyedObject((device, key) =>
          exports.includes(key) ? exportTypes.ENABLED : exportTypes.DISABLED
        )
      };
    }
    case ADD_ERROR:
      return addMessage(action.body, messageLevels.ERROR)(state);
    case CLEAR_MESSAGES:
      return { ...state, messages: [] };
    default:
      return state;
  }
};

export const getIndices = ({ files }) => {
  const numScreenshots = deviceNames
    .map(key => files[key].length)
    .reduce((a, b) => Math.max(a, b), 0);
  return Array.from({ length: numScreenshots }, (_, i) => i);
};

export const getAvailableDevices = state =>
  deviceNames.filter(device => state.files[device].length > 0);

export const getExportedDevices = state =>
  deviceNames.filter(device => {
    switch (state.exports[device]) {
      case exportTypes.DISABLED:
        return false;
      case exportTypes.ENABLED:
        return true;
      case exportTypes.IF_AVAILABLE:
        return state.files[device].length > 0;
      default:
        return false;
    }
  });

export const getImageConfig = (index, state) => {
  const sources = deviceNames
    .map(device => state.files[device][index])
    .filter(x => x != null);
  const { [index]: config = defaultImageConfig } = state.imageConfigs;
  return { ...config, sources };
};

export const getFilesTable = state => {
  const columns = getAvailableDevices(state);
  const rows = getIndices(state).map(i =>
    deviceNames.reduce((accum, column) => {
      accum[column] = state.files[column][i];
      return accum;
    }, {})
  );
  return { columns, rows };
};

export const getJson = state => {
  const imageConfigs = getIndices(state).map(index => {
    const { [index]: config = defaultImageConfig } = state.imageConfigs;
    // encode layout incase we introduce more layouts
    return { layout: "default", config };
  });
  return { appStoreDesignerVersion: 1, imageConfigs };
};

export const addImage = ({ uri, name, width, height }) => ({
  type: ADD_IMAGE,
  uri,
  name,
  width,
  height
});
export const setConfig = config => ({ type: SET_CONFIG, config });
export const setImageConfig = (index, key, value) => ({
  type: SET_IMAGE_CONFIG,
  index,
  key,
  value
});
export const setExports = exports => ({ type: SET_EXPORTS, exports });
export const addError = () => ({ type: ADD_ERROR });
export const clearMessages = () => ({ type: CLEAR_MESSAGES });
