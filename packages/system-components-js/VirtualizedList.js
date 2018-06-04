import React from "react";
import { View } from "react-native";
import ScrollView from "./ScrollView";

const renderComponent = Component =>
  typeof Component === "function" ? <Component /> : Component;

const VirtualizedList = ({
  data,
  getItemCount,
  getItem,
  renderItem,
  keyExtractor,
  renderScrollComponent,
  CellRendererComponent,
  ItemSeparatorComponent,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  inverted,
  style,
  ...props
}) => {
  const inversionStyle = inverted
    ? { transform: [{ [props.horizontal ? "scaleX" : "scaleY"]: -1 }] }
    : null;

  const length = getItemCount(data);
  const items = Array.from({ length }, (_, index) => {
    const item = getItem(data, index);
    return (
      <CellRendererComponent
        key={keyExtractor(item, index)}
        style={inversionStyle}
      >
        {renderItem({ item, index })}
        {index !== length - 1 ? renderComponent(ItemSeparatorComponent) : null}
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

VirtualizedList.defaultProps = {
  keyExtractor: item => item.key,
  renderScrollComponent: props => <ScrollView {...props} />,
  CellRendererComponent: View,
  ItemSeparatorComponent: null,
  ListEmptyComponent: null,
  ListHeaderComponent: null,
  ListFooterComponent: null
};

export default VirtualizedList;
