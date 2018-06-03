import React from "react";
import { View } from "react-native";
import ScrollView from "./ScrollView";

const defaultKeyExtractor = item => item.key;

const defaultRenderScrollComponent = props => <ScrollView {...props} />;

const renderComponent = Component =>
  typeof Component === "function" ? <Component /> : Component;

export default ({
  data,
  getItemCount,
  getItem,
  renderItem,
  keyExtractor = defaultKeyExtractor,
  renderScrollComponent = defaultRenderScrollComponent,
  CellRendererComponent = View,
  ItemSeparatorComponent = null,
  ListEmptyComponent = null,
  ListHeaderComponent = null,
  ListFooterComponent = null,
  inverted,
  style,
  ...props
}) => {
  const inversionStyle = inverted
    ? { [props.horizontal ? "scaleX" : "scaleY"]: -1 }
    : null;

  const length = getItemCount(data);
  const items = Array.from({ length }, (_, i) => {
    const item = getItem(data, i);
    return (
      <CellRendererComponent key={keyExtractor(item)} style={inversionStyle}>
        {renderItem(item)}
        {i !== length - 1 ? renderComponent(ItemSeparatorComponent) : null}
      </CellRendererComponent>
    );
  });

  const children =
    items.length > 0 ? (
      <React.Fragment>
        {renderComponent(ListHeaderComponent)}
        {items}
        {renderComponent(ListFooterComponent)}
      </React.Fragment>
    ) : (
      renderComponent(ListEmptyComponent)
    );

  return renderScrollComponent({
    ...props,
    style: [inversionStyle, style],
    children
  });
};
