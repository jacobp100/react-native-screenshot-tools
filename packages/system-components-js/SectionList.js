import React, { PureComponent } from "React";
import { View } from "react-native";
import VirtualizedList from "./VirtualizedList";

function getItem(sections, index) {
  if (!sections) {
    return null;
  }
  let itemIdx = index - 1;
  for (let ii = 0; ii < sections.length; ii += 1) {
    if (itemIdx === -1 || itemIdx === sections[ii].data.length) {
      // We intend for there to be overflow by one on both ends of the list.
      // This will be for headers and footers. When returning a header or footer
      // item the section itself is the item.
      return sections[ii];
    } else if (itemIdx < sections[ii].data.length) {
      // If we are in the bounds of the list's data then return the item.
      return sections[ii].data[itemIdx];
    }
    itemIdx -= sections[ii].data.length + 2; // Add two for the header and footer
  }
  return null;
}

export default class SectionList extends PureComponent {
  getItemCount() {
    return this.props.sections.reduce(
      (v, section) => v + section.data.length + 2, // Add two for the section header and footer.
      0
    );
  }

  render() {
    const { props } = this;

    return (
      <VirtualizedList
        {...props}
        renderItem={this.renderItem}
        ItemSeparatorComponent={undefined} // Rendered with renderItem
        data={props.sections}
        getItemCount={() => this.getItemCount()}
        getItem={getItem}
        keyExtractor={this.keyExtractor}
      />
    );
  }

  keyExtractor = (item, index) => {
    const info = this.subExtractor(index);
    return (info && info.key) || String(index);
  };

  subExtractor(index) {
    /* eslint-disable prefer-template */
    let itemIndex = index;
    const defaultKeyExtractor = this.props.keyExtractor;
    for (let ii = 0; ii < this.props.sections.length; ii += 1) {
      const section = this.props.sections[ii];
      const key = section.key || String(ii);
      itemIndex -= 1; // The section adds an item for the header
      if (itemIndex >= section.data.length + 1) {
        itemIndex -= section.data.length + 1; // The section adds an item for the footer.
      } else if (itemIndex === -1) {
        return {
          section,
          key: key + ":header",
          index: null,
          header: true,
          trailingSection: this.props.sections[ii + 1]
        };
      } else if (itemIndex === section.data.length) {
        return {
          section,
          key: key + ":footer",
          index: null,
          header: false,
          trailingSection: this.props.sections[ii + 1]
        };
      } else {
        const keyExtractor = section.keyExtractor || defaultKeyExtractor;
        return {
          section,
          key: key + ":" + keyExtractor(section.data[itemIndex], itemIndex),
          index: itemIndex,
          leadingItem: section.data[itemIndex - 1],
          leadingSection: this.props.sections[ii - 1],
          trailingItem: section.data[itemIndex + 1],
          trailingSection: this.props.sections[ii + 1]
        };
      }
    }
    return null;
  }

  renderItem = ({ item, index }) => {
    const info = this.subExtractor(index);
    if (!info) {
      return null;
    }
    const infoIndex = info.index;
    if (infoIndex == null) {
      const { section } = info;
      const { renderSectionHeader, renderSectionFooter } = this.props;
      if (info.header === true) {
        return renderSectionHeader ? renderSectionHeader({ section }) : null;
      }
      return renderSectionFooter ? renderSectionFooter({ section }) : null;
    }
    const renderItem = info.section.renderItem || this.props.renderItem;
    const SeparatorComponent = this.getSeparatorComponent(index, info);

    return (
      <ItemWithSeparator
        SeparatorComponent={SeparatorComponent}
        LeadingSeparatorComponent={
          infoIndex === 0 ? this.props.SectionSeparatorComponent : undefined
        }
        cellKey={info.key}
        index={infoIndex}
        item={item}
        leadingItem={info.leadingItem}
        leadingSection={info.leadingSection}
        prevCellKey={(this.subExtractor(index - 1) || {}).key}
        renderItem={renderItem}
        section={info.section}
        trailingItem={info.trailingItem}
        trailingSection={info.trailingSection}
      />
    );
  };

  getSeparatorComponent(index, info = this.subExtractor(index)) {
    if (!info) {
      return null;
    }
    const ItemSeparatorComponent =
      info.section.ItemSeparatorComponent || this.props.ItemSeparatorComponent;
    const { SectionSeparatorComponent } = this.props;
    const isLastItemInList = index === this.getItemCount() - 1;
    const isLastItemInSection = info.index === info.section.data.length - 1;
    if (SectionSeparatorComponent && isLastItemInSection) {
      return SectionSeparatorComponent;
    }
    if (ItemSeparatorComponent && !isLastItemInSection && !isLastItemInList) {
      return ItemSeparatorComponent;
    }
    return null;
  }
}

const ItemWithSeparator = () => {
  const separatorProps = {
    highlighted: false,
    leadingItem: this.props.item,
    leadingSection: this.props.leadingSection,
    section: this.props.section,
    trailingItem: this.props.trailingItem,
    trailingSection: this.props.trailingSection
  };
  const leadingSeparatorProps = {
    highlighted: false,
    leadingItem: this.props.leadingItem,
    leadingSection: this.props.leadingSection,
    section: this.props.section,
    trailingItem: this.props.item,
    trailingSection: this.props.trailingSection
  };

  const {
    LeadingSeparatorComponent,
    SeparatorComponent,
    item,
    index,
    section
  } = this.props;
  const element = this.props.renderItem({
    item,
    index,
    section,
    separators: null
  });
  const leadingSeparator = LeadingSeparatorComponent && (
    <LeadingSeparatorComponent {...leadingSeparatorProps} />
  );
  const separator = SeparatorComponent && (
    <SeparatorComponent {...separatorProps} />
  );
  return leadingSeparator || separator ? (
    <View>
      {leadingSeparator}
      {element}
      {separator}
    </View>
  ) : (
    element
  );
};
