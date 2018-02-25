import React from "react";
import { View, Text } from "react-native";
import { renderToSvg, renderToCanvas } from "..";

test("Render test 1", async () => {
  const jsx = (
    <View
      style={{
        flexDirection: "row",
        flexWrap: "wrap",
        width: 500,
        height: 500
      }}
    >
      {Array.from({ length: 16 }, (_, i) => (
        <View
          key={i}
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 100,
            height: 100,
            margin: 10,
            backgroundColor: "red",
            borderTopWidth: 5,
            borderRightWidth: 10,
            borderBottomWidth: 15,
            borderLeftWidth: 20,
            borderTopColor: "yellow",
            borderRightColor: "green",
            borderBottomColor: "blue",
            borderLeftColor: "magenta",
            borderRadius: 33,
            transform: [{ rotate: `${Math.floor(360 * i / 16)}deg` }]
          }}
        >
          <Text style={{ textAlign: "center" }}>Hello World</Text>
        </View>
      ))}
    </View>
  );

  expect(await renderToSvg(jsx)).toMatchSnapshot();
  // await renderToCanvas(jsx);
});
