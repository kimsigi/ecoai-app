export interface AlertOptions {
  title?: string;
  message: string;
  confirmText?: string;
  onConfirm?: () => void;
}

export interface ConfirmOptions extends AlertOptions {
  cancelText?: string;
  onCancel?: () => void;
  onConfirm: () => void;
}

// View Props
export interface AlertViewProps extends ConfirmOptions {
  visible: boolean;
  type: "alert" | "confirm";
}

// 상태 관리용
export type AlertState =
  | { type: "alert"; options: AlertOptions }
  | { type: "confirm"; options: ConfirmOptions }
  | null;

export type AlertContextValue = {
  alert: (message: string | AlertOptions, onConfirm?: () => void) => void;
  confirm: (options: ConfirmOptions) => void;
};