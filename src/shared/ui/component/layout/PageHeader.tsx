import React from "react";
import { Pressable, View } from "react-native";
import { PageHeaderProps } from "./layout.type";
import { styles } from "./layout.style";
import { AppIcon } from "@/shared/ui/component/icon";


export default function PageHeader({ config, layout }: PageHeaderProps) {
  if (config.state === "hidden") return null;

  function HeaderLeft() {
    if (layout.headerLeft) return <>{layout.headerLeft}</>;
    if (!layout.showBack) return <View style={styles.sideSpacer} />;

    return (
      <Pressable onPress={layout.onBackPress} style={styles.backButton} hitSlop={8}>
        <AppIcon name="chevronLeft" size={24} />
      </Pressable>
    );
  }

  function HeaderRight() {
    if (layout.headerRight) return <>{layout.headerRight}</>;
    if (layout.rightItems.length === 0) return <View style={styles.sideSpacer} />;

    return (
      <View style={styles.rightIconRow}>
        {layout.rightItems.map((item, index) => (
          <Pressable
            key={item.key ?? index}
            style={styles.rightIconButton}
            onPress={item.onPress}
            hitSlop={8}
          >
            {layout.getRightIcon(item)}
          </Pressable>
        ))}
      </View>
    );
  }

  if (config.state === "empty") {
    return <View style={[styles.headerBody, { height: config.height }, config.containerStyle]} />;
  }

  if (config.custom) {
    return (
      <View style={[styles.headerBody, { height: config.height }, config.containerStyle]}>
        {config.custom}
      </View>
    );
  }

  return (
    <View style={[styles.defaultHeaderRow, { height: config.height }, config.containerStyle]}>
      <View style={styles.side}>
        <HeaderLeft />
      </View>
      <View style={styles.center}>{config.center ?? null}</View>
      <View style={[styles.side, styles.right]}>
        <HeaderRight />
      </View>
    </View>
  );
}
