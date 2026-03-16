import { Dialog, Button, Text, Portal } from "react-native-paper";
import { AlertViewProps } from "./alert.type";
import { styles } from "./alert.style";
import { Pressable, View } from "react-native";

export default function AlertView({
    visible = false,
    type = "alert",
    title,
    message,
    confirmText = "확인",
    cancelText = "취소",
    onConfirm,
    onCancel,
    onDismiss,
    variant = "default",
    position = "center", // 기본은 중앙
    
    dismissOnBackdrop,
    dismissOnBackButton,
}: AlertViewProps) {

    const isDecision = variant === "decision" && type === "confirm";
    const isOverlayPosition = position === "top" || position === "bottom"; 
    
    // top/bottom 위치 옵션일 때만 커스텀 오버레이 카드 사용
    if (isOverlayPosition) {
        if (!visible) return null;

        return (
            <Portal>
                <View
                    style={[
                        styles.positionOverlay,
                        position === "top" ? styles.positionTop : styles.positionBottom,
                    ]}
                    pointerEvents="box-none"
                >
                    <Pressable
                        style={styles.positionBackdrop}
                        onPress={dismissOnBackdrop ? onDismiss : undefined}
                    />

                    <View style={[styles.positionCard, isDecision && styles.decisionCard]}>
                        {title ? (
                            <Text style={styles.positionTitle}>{title}</Text>
                        ) : null}

                        <Text style={[styles.message, isDecision && styles.decisionMessage]}>
                            {message}
                        </Text>

                        <View style={[styles.positionActions, isDecision && styles.actions]}>
                            {
                                type === "confirm" && (
                                    <Button
                                        mode={isDecision ? "outlined" : "text"}
                                        onPress={onCancel}
                                        style={isDecision ? styles.cancelButton : undefined}
                                        labelStyle={isDecision ? styles.cancelLabel : undefined}
                                    >
                                        {cancelText}
                                    </Button>
                                )
                            }
                            <Button
                                mode={isDecision ? "contained" : "text"}
                                onPress={onConfirm}
                                style={isDecision ? styles.confirmButton : undefined}
                                labelStyle={isDecision ? styles.confirmLabel : undefined}
                            >
                                {confirmText}
                            </Button>
                        </View>
                    </View>
                </View>
            </Portal>
        );
    }
    return (
        <Dialog
            visible={visible}
            onDismiss={onDismiss}
            dismissable={dismissOnBackdrop ?? type === "alert"}
            dismissableBackButton={dismissOnBackButton ?? type === "alert"}
            style={isDecision ? styles.decisionCard : undefined}
        >
            {title && <Dialog.Title>{title}</Dialog.Title>}

            <Dialog.Content>
                <Text style={[styles.message, isDecision && styles.decisionMessage]}>
                    {message}
                </Text>
            </Dialog.Content>

            <Dialog.Actions style={isDecision ? styles.actions : undefined}>
                {
                    type === "confirm" && (
                    <Button
                        mode={isDecision ? "outlined" : "text"}
                        onPress={onCancel}
                        style={isDecision ? styles.cancelButton : undefined}
                        labelStyle={isDecision ? styles.cancelLabel : undefined}
                    >
                        {cancelText}
                    </Button>
                )}
                <Button
                    mode={isDecision ? "contained" : "text"}
                    onPress={onConfirm}
                    style={isDecision ? styles.confirmButton : undefined}
                    labelStyle={isDecision ? styles.confirmLabel : undefined}
                >
                    {confirmText}
                </Button>
            </Dialog.Actions>
        </Dialog>
    );
}