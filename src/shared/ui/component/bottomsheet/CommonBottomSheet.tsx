import React, { useEffect, useMemo, useRef } from "react";
import { Dimensions, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheetHeader from "./BottomSheetHeader";

type HeightMode = "fitContent" | "fixed" | "expandable";

type CommonBottomSheetProps = {
  open: boolean;
  onClose: () => void;

  title?: string;
  showCloseButton?: boolean;
  showHandle?: boolean;

  heightMode?: HeightMode;
  fixedHeight?: number;
  maxHeightRatio?: number;

  enableGesture?: boolean;
  enablePanDownToClose?: boolean;
  enableBackdropDismiss?: boolean;

  detached?: boolean;
  topInset?: number;

  header?: React.ReactNode;
  footer?: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  children: React.ReactNode;
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function CommonBottomSheet({
  open,
  onClose,
  title,
  showCloseButton = false,
  showHandle = true,
  heightMode = "expandable",
  fixedHeight,
  maxHeightRatio = 0.8,
  enableGesture = true,
  enablePanDownToClose = true,
  enableBackdropDismiss = true,
  detached = false,
  topInset = 0,
  header,
  footer,
  contentContainerStyle,
  children,
}: CommonBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const insets = useSafeAreaInsets();

  const maxDynamicContentSize = useMemo(() => {
    return SCREEN_HEIGHT * maxHeightRatio;
  }, [maxHeightRatio]);

  const { snapPoints, enableDynamicSizing } = useMemo(() => {
    if (heightMode === "fixed") {
      return {
        snapPoints: [fixedHeight ?? SCREEN_HEIGHT * 0.5],
        enableDynamicSizing: false,
      };
    }

    if (heightMode === "fitContent") {
      return {
        snapPoints: undefined,
        enableDynamicSizing: true,
      };
    }

    return {
      snapPoints: ["80%"],
      enableDynamicSizing: true,
    };
  }, [fixedHeight, heightMode]);

  useEffect(() => {
    if (open) {
      bottomSheetRef.current?.present();
      return;
    }

    bottomSheetRef.current?.dismiss();
  }, [open]);

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      enableDynamicSizing={enableDynamicSizing}
      maxDynamicContentSize={maxDynamicContentSize}
      enablePanDownToClose={enableGesture && enablePanDownToClose}
      enableHandlePanningGesture={enableGesture}
      enableContentPanningGesture={enableGesture}
      topInset={topInset}
      detached={detached}
      bottomInset={insets.bottom}
      onDismiss={onClose}
      backdropComponent={(backdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
          pressBehavior={enableBackdropDismiss ? "close" : "none"}
        />
      )}
      handleComponent={showHandle ? undefined : () => null}
      handleIndicatorStyle={styles.handleIndicator}
      backgroundStyle={styles.background}
    >
      <BottomSheetView style={styles.inner}>
        {header ?? (
          <BottomSheetHeader
            title={title}
            showCloseButton={showCloseButton}
            onClose={() => bottomSheetRef.current?.dismiss()}
          />
        )}

        <View style={[styles.contentContainer, contentContainerStyle]}>
          {children}
        </View>

        {footer}
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  inner: {
    overflow: "hidden",
  },
  background: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "#FFFFFF",
  },
  handleIndicator: {
    width: 44,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#C9CDD4",
  },
  contentContainer: {
    minHeight: 1,
  },
});
