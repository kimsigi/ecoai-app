import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type BottomSheetHeaderProps = {
  title?: string;
  showCloseButton?: boolean;
  onClose?: () => void;
  rightSlot?: React.ReactNode;
};

export default function BottomSheetHeader({
  title,
  showCloseButton = false,
  onClose,
  rightSlot,
}: BottomSheetHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.leftSpacer} />

      <View style={styles.titleWrap}>
        {!!title && <Text style={styles.title}>{title}</Text>}
      </View>

      <View style={styles.rightWrap}>
        {rightSlot}
        {showCloseButton && (
          <Pressable onPress={onClose} hitSlop={8} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F2F5",
  },
  leftSpacer: {
    width: 32,
  },
  titleWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  rightWrap: {
    width: 32,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F4F6",
  },
  closeText: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "700",
  },
});
