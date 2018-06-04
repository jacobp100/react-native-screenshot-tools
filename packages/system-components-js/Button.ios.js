import React from "react";
import { View, Text, StyleSheet } from "react-native";

const styles = {
  button: {},
  text: {
    // iOS blue from https://developer.apple.com/ios/human-interface-guidelines/visual-design/color/
    color: "#007AFF",
    textAlign: "center",
    padding: 8,
    fontSize: 18
  },
  buttonDisabled: {},
  textDisabled: {
    color: "#cdcdcd"
  }
};

export default ({ color, title, disabled }) => {
  const buttonStyles = [styles.button];
  const textStyles = [styles.text];
  if (color) textStyles.push({ color });
  if (disabled) {
    buttonStyles.push(styles.buttonDisabled);
    textStyles.push(styles.textDisabled);
  }
  const formattedTitle = title;
  return (
    <View style={buttonStyles}>
      <Text style={textStyles} disabled={disabled}>
        {formattedTitle}
      </Text>
    </View>
  );
};
