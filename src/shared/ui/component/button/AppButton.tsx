import { Text, TouchableOpacity } from "react-native";
import { AppButtonProps } from "./button.type";
import { styles } from "./button.style";

export default function AppButton({
    type = "default", 
    disabled = false, 
    buttonStyle, 
    textStyle, 
    onPress, 
    children}: AppButtonProps) {
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
