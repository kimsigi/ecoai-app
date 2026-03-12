import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Modal, Portal } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { styles } from "./dialog.style";
import { COLOR } from "@/shared/ui/token";
import { DialogProps } from "./dialog.type";
import { AppIcon } from "@/shared/ui/component/icon";

export default function Dialog({
    visible,
    onDismiss,
    children,
    containerStyle,
    dimColor = COLOR.blackA18,
    dismissable = true,
    dismissableBackButton = true,
    presentation = "screen",
    showCloseHeader = true,
    headerTitle,
    fillContent = true,
}: DialogProps) {

    const insets = useSafeAreaInsets();

    const content = (
        <>
            <Pressable
                style={[styles.backdrop, { backgroundColor: dimColor }]}
                onPress={dismissable ? onDismiss : undefined}
            />
            <View style={[fillContent && styles.contentContainer, containerStyle]}>
                {showCloseHeader ? (
                <View style={styles.headerBar}>
                    <View style={styles.headerSide} />
                    <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                        {headerTitle ?? ""}
                    </Text>
                    </View>
                    <Pressable style={styles.headerCloseBtn} onPress={onDismiss}>
                    <AppIcon name="close" size={24} />
                    </Pressable>
                </View>
                ) : null}
                {children}
            </View>
        </>
    );

    if ( presentation === "screen" ) {
        if (!visible) return null;

        return (
            <View style={styles.overlayRoot} pointerEvents="box-none">
                <View
                style={[
                    styles.overlayRoot,
                    {
                    marginTop: insets.top,
                    marginBottom: insets.bottom,
                    },
                ]}
                >
                    {content}
                </View>
            </View>
        );
    }

    return (
        <Portal>
            <Modal
                visible={visible}
                onDismiss={onDismiss}
                dismissable={dismissable}
                dismissableBackButton={dismissableBackButton}
                style={styles.modal}
                contentContainerStyle={StyleSheet.absoluteFill}
            >
                <View
                    style={[
                        styles.portalRoot,
                        {
                            marginTop: insets.top, // 상태바 아래부터
                            marginBottom: insets.bottom, // 바텀 safe 전까지
                        },
                    ]}
                >
                    {content}
                </View>
            </Modal>
        </Portal>
    );
}