import React, { PureComponent } from "React";
import { View } from "react-native";
import VirtualizedList from "./VirtualizedList";

const styles = {
  row: { flexDirection: "row" }
};

export default class FlatList extends PureComponent {
  static defaultProps = { ...VirtualizedList.defaultProps, numColumns: 1 };

  getItem = (data, index) => {
    const { numColumns } = this.props;
    if (numColumns === 1) return data[index];

    const ret = [];
    for (let kk = 0; kk < numColumns; kk += 1) {
      const item = data[index * numColumns + kk];
      if (item != null) {
        ret.push(item);
      }
    }
    return ret;
  };

  getItemCount = data =>
    data ? Math.ceil(data.length / this.props.numColumns) : 0;

  keyExtractor = (items, index) => {
    const { keyExtractor, numColumns } = this.props;
    return numColumns > 1
      ? items
          .map((it, kk) => keyExtractor(it, index * numColumns + kk))
          .join(":")
      : keyExtractor(items, index);
  };

  pushMultiColumnViewable(arr, v) {
    const { numColumns, keyExtractor } = this.props;
    v.item.forEach((item, ii) => {
      const index = v.index * numColumns + ii;
      arr.push({ ...v, item, key: keyExtractor(item, index), index });
    });
  }

  renderItem = info => {
    const { renderItem, numColumns, columnWrapperStyle } = this.props;
    if (numColumns === 1) return renderItem(info);

    const { item, index } = info;
    return (
      <View style={[styles.row, columnWrapperStyle]}>
        {item.map((it, kk) => {
          const element = renderItem({
            item: it,
            index: index * numColumns + kk,
            separators: info.separators
          });
          return element && React.cloneElement(element, { key: kk });
        })}
      </View>
    );
  };

  render() {
    return (
      <VirtualizedList
        {...this.props}
        renderItem={this.renderItem}
        getItem={this.getItem}
        getItemCount={this.getItemCount}
        keyExtractor={this.keyExtractor}
      />
    );
  }
}
