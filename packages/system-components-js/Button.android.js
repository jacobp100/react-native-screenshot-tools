import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = {
  button: {
    elevation: 4,
    // Material design blue from https://material.google.com/style/color.html#color-color-palette
    backgroundColor: "#2196F3",
    borderRadius: 2
  },
  text: {
    color: "white",
    textAlign: "center",
    padding: 8
    // fontWeight: "500" FIXME
  },
  buttonDisabled: {
    elevation: 0,
    backgroundColor: "#dfdfdf"
  },
  textDisabled: {
    color: "#a1a1a1"
  }
};

export default ({ color, title, disabled }) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];
  if (color) buttonStyles.push({ backgroundColor: color });
  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
    textStyles.push(styles.textDisabled);
  }
  const formattedTitle = title.toUpperCase();
  return (
    <View style={buttonStyles}>
      <Text style={textStyles} disabled={disabled}>
        {formattedTitle}
      </Text>
    </View>
  );
};
