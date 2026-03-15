import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";

type BottomSheetScrollContentProps = {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
};

export default function BottomSheetScrollContent({
  children,
  contentContainerStyle,
}: BottomSheetScrollContentProps) {
  return (
    <BottomSheetScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
    >
      {children}
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
});
