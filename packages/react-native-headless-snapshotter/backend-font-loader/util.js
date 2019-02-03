const weights = {
  normal: "400",
  bold: "700"
};

const numberWeight = weight => weights[weight] || weight;

const keyForStyle = ({ fontFamily, fontWeight, fontStyle }) =>
  `${fontFamily} (weight: ${numberWeight(fontWeight)} style: ${fontStyle})`;
module.exports.keyForStyle = keyForStyle;

const weightNames = [
  { match: "ultralight", value: "200" },
  { match: "ultra light", value: "200" },
  { match: "thin", value: "100" },
  { match: "light", value: "300" },
  { match: "normal", value: "400" },
  { match: "medium", value: "500" },
  { match: "semibold", value: "600" },
  { match: "semi bold", value: "600" },
  { match: "bold", value: "700" },
  { match: "black", value: "800" },
  { match: "ultrabold", value: "800" },
  { match: "ultra bold", value: "800" },
  { match: "heavy", value: "900" },
  { match: "100", value: "100" },
  { match: "200", value: "200" },
  { match: "300", value: "300" },
  { match: "400", value: "400" },
  { match: "500", value: "500" },
  { match: "600", value: "600" },
  { match: "700", value: "700" },
  { match: "800", value: "800" },
  { match: "900", value: "900" }
].sort((a, b) => b.match.length - a.match.length);

const italicNames = [
  { match: "italic", value: "italic" },
  { match: "oblique", value: "italic" }
];

const matchNames = (target, names, defaultValue) => {
  const match = names.find(name => target.toLowerCase().includes(name.match));
  return match ? match.value : defaultValue;
};

const normalizeStyles = subfamilyName => {
  const fontWeight = matchNames(subfamilyName, weightNames, "400");
  const fontStyle = matchNames(subfamilyName, italicNames, "normal");
  return { fontWeight, fontStyle };
};

module.exports.keyForFont = font => {
  const fontFamily = font.familyName;
  const { fontWeight, fontStyle } = normalizeStyles(font.subfamilyName);

  const key = keyForStyle({ fontFamily, fontWeight, fontStyle });

  if (!fontFamily || !fontWeight || !fontStyle) {
    throw new Error(`Could not find styles for font: ${key}`);
  }

  return key;
};
