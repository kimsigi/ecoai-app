import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

/* ---------- Type  ---------- */
type AppButtonType = 
| "default"
| "primary"
| "selected";

type AppButtonProps = {
    type?: AppButtonType;
    disabled?: boolean;
    buttonStyle?: ViewStyle;
    textStyle?: ViewStyle;
    onPress?: () => void;
    children: React.ReactNode;
}

export default function AppButton({type = "default", disabled = false, buttonStyle, textStyle, onPress, children}: AppButtonProps) {
    return (
        <TouchableOpacity 
            onPress={onPress} 
            disabled={disabled}
            style={[styles.button, buttonStyle]}
        >
            <Text style={[styles.buttonText, textStyle]}>
                {children}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#4A90E2',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%', // wrapper에서 너비를 조절하므로 100%로 설정
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
});
