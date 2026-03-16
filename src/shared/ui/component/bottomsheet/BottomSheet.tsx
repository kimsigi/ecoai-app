import React from "react";
import {
    View,
} from "react-native";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import BottomSheetHeader from "./BottomSheetHeader";
import { BottomSheetProps } from "./bottomsheet.type";
import { useBottomSheet } from "./useBottomSheet";
import { styles } from "./bottomsheet.style";

export default function BottomSheet(props: BottomSheetProps) {
    
    const {
        header,
        title,
        onClose,
        footer,
        contentContainerStyle,
        enableGesture = true,
        enablePanDownToClose = true,
        detached = false,
        enableBackdropDismiss = true,
        showHandle = true,      
        showCloseButton = false,      
        children,
    } = props;

    const {
        bottomSheetRef,
        snapPoints,
        enableDynamicSizing,
        maxDynamicContentSize,
        insetTop,
        insetBottom,
    } = useBottomSheet(props);

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
            topInset={insetTop}
            detached={detached}
            bottomInset={insetBottom}
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

                  <View
                      style={[
                        styles.container,
                        { paddingBottom: Math.max(insetBottom, 16) },
                        contentContainerStyle,
                      ]}
                  >
                      {children}
                  </View>
                  
                  {footer}
              </BottomSheetView>
        </BottomSheetModal>
    );
}
