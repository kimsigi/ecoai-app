import { Dialog, Button, Text } from "react-native-paper";
import { AlertViewProps } from "./alert.type";


export default function AlertView({
  visible = false,
  type = "alert",
  title,
  message,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
}: AlertViewProps) {
  return (
    <Dialog
      visible={visible}
      dismissable={type === "alert"}
    >
      {title && <Dialog.Title>{title}</Dialog.Title>}

      <Dialog.Content>
        <Text>{message}</Text>
      </Dialog.Content>

      <Dialog.Actions>
        {type === "confirm" && (
          <Button onPress={onCancel}>
            {cancelText}
          </Button>
        )}
        <Button onPress={onConfirm}>
          {confirmText}
        </Button>
      </Dialog.Actions>
    </Dialog>
  );
}
