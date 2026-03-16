import React from "react";
import { Pressable, Text, View } from "react-native";
import { BottomSheetHeaderProps } from "./bottomsheet.type";
import { styles } from "./bottomsheet.style";

export default function BottomSheetHeader({
    title,
    onClose,
    rightSlot,
    showCloseButton = false,
}: BottomSheetHeaderProps) {
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerLeftSpacer} />

            <View style={styles.headerTitleWrap}>
                {!!title && <Text style={styles.headerTitle}>{title}</Text>}
            </View>

            <View style={styles.headerRightWrap}>
                {rightSlot}
                {showCloseButton && (
                    <Pressable onPress={onClose} hitSlop={8} style={styles.headerCloseButton}>
                        <Text style={styles.headerCloseText}>X</Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}