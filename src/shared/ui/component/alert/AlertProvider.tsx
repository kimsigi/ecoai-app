import { createContext, useContext, useState } from "react";
import { Portal } from "react-native-paper";
import AlertView from "./AlertView";
import { AlertState, AlertOptions, ConfirmOptions, AlertContextValue } from "./alert.type";

const AlertContext = createContext<AlertContextValue | null>(null);

function AlertProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AlertState>(null);

  function alert(messageOrOptions: string | AlertOptions, onConfirm?: () => void) {
    setState({
      type: "alert",
      options:
        typeof messageOrOptions === "string"
          ? { message: messageOrOptions, onConfirm }
          : messageOrOptions,
    });
  }

  function confirm(options: ConfirmOptions) {
    setState({
      type: "confirm",
      options,
    });
  }

  function close() {
    setState(null);
  }

  return (
    <AlertContext.Provider value={{ alert, confirm }}>
      {children}
      <Portal>
        {state && (
          <AlertView
            visible
            type={state.type}
            {...state.options}
            onConfirm={() => {
              state.options.onConfirm?.();
              close();
            }}
            onCancel={() => {
              (state.options as ConfirmOptions).onCancel?.();
              close();
            }}
          />
        )}
      </Portal>
    </AlertContext.Provider>
  );
}

function useAlert() {
  const ctx = useContext(AlertContext);
  if (!ctx) {
    throw new Error("AlertProvider is not mounted");
  }
  return ctx;
}

export {
  AlertProvider,
  useAlert,
}