import React, { Component } from "react";
import { View } from "react-native";

const styles = {
  baseVertical: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "column",
    overflow: "scroll"
  },
  baseHorizontal: {
    flexGrow: 1,
    flexShrink: 1,
    flexDirection: "row",
    overflow: "scroll"
  },
  contentContainerHorizontal: {
    flexDirection: "row"
  }
};

export default class ScrollView extends Component {
  handleContentOnLayout = ({ nativeEvent: { layout } }) => {
    const { width, height } = layout;
    if (this.props.onContentSizeChange) {
      this.props.onContentSizeChange(width, height);
    }
  };

  render() {
    const {
      horizontal,
      style,
      contentContainerStyle,
      children,
      // centerContent, FIXME
      endFillColor,
      ...props
    } = this.props;

    return (
      <View
        style={[
          horizontal ? styles.baseHorizontal : styles.baseVertical,
          style
        ]}
        {...props}
      >
        <View
          style={[
            horizontal && styles.contentContainerHorizontal,
            contentContainerStyle
          ]}
          onLayout={this.handleContentOnLayout}
        >
          {children}
        </View>
        <View style={{ flex: 1, backgroundColor: endFillColor }} />
      </View>
    );
  }
}
