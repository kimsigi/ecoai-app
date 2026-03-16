import React from "react";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { styles } from "./bottomsheet.style";
import { BottomSheetScrollContentProps } from "./bottomsheet.type";

export default function BottomSheetScrollContent({
    children,
    contentContainerStyle,
}: BottomSheetScrollContentProps) {
    return (
        <BottomSheetScrollView
            style={styles.scrollView} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
        >
            {children}
        </BottomSheetScrollView>
    );
}