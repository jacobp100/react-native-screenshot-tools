import React from "react";
import { View, Text } from "react-native";
import Frame from "react-native-device-frames";

snapshot("device frame", () => (
  <View
    style={{
      flex: 1,
      backgroundColor: "#C4E538",
      justifyContent: "space-around",
      alignItems: "center"
    }}
  >
    <Text
      style={{
        marginVertical: 16,
        textAlign: "center",
        fontSize: 36,
        color: "white"
      }}
    >
      Something about the app
    </Text>
    <Frame device="Apple iPhone 7 Gold" width="200">
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFC312",
          justifyContent: "center"
        }}
      >
        <Text
          style={{
            color: "#F79F1F",
            textAlign: "center",
            marginHorizontal: 24,
            fontSize: 48
          }}
        >
          This is actually your app
        </Text>
      </View>
    </Frame>
  </View>
));
