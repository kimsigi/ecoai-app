import { Dialog, Button, Text } from "react-native-paper";
import { AlertViewProps } from "./alert.type";
import { styles } from "./alert.style";

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
    
    dismissOnBackdrop,
    dismissOnBackButton,
}: AlertViewProps) {

    const isDecision = variant === "decision" && type === "confirm";

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