import React, { useMemo, useState } from "react";
import { Pressable, Text, TextInput, TextInputContentSizeChangeEvent, View } from "react-native";
import { AppIcon } from "@/shared/ui/component/icon";
import { HeaderInputDefaultProps } from "./header.type";
import { styles } from "./header.style";
import { INPUT_LINE_HEIGHT, INPUT_MAX_HEIGHT, INPUT_MIN_HEIGHT } from "./header.constant";
import { useNavigation } from "@react-navigation/native";

export default function HeaderInputDefault({
    mode = "input",
    value,
    placeholder,
    back = false,
    onBackPress,
    onPressField,
    onChangeText,
    onSubmit,
    onClear,
    autoFocus = false,
    multiline = false,
}: HeaderInputDefaultProps) {

    const navigation = useNavigation();

    const isInput = mode === "input";
    const canShowBack = back;// && !!onBackPress; 
    const [inputHeight, setInputHeight] = useState(INPUT_MIN_HEIGHT);
    
    const resolvedInputHeight = useMemo(() => {
        return multiline ? inputHeight : INPUT_MIN_HEIGHT;
    }, [inputHeight, multiline]);

    const handleContentSizeChange = (e: TextInputContentSizeChangeEvent) => {
        if (!multiline) return;

        const nextHeight = Math.max(
            INPUT_MIN_HEIGHT,
            Math.min(INPUT_MAX_HEIGHT, Math.ceil(e.nativeEvent.contentSize.height)),
        );

        setInputHeight(nextHeight);
    };

    const handleBackPress = () => {
        if (onBackPress) {
            onBackPress();
            return;
        }

        navigation.goBack();
    };

    return (
        <View
            style={[
                styles.wrap,
                isInput &&
                    (multiline
                        ? { minHeight: resolvedInputHeight }
                        : { height: INPUT_MIN_HEIGHT }),
            ]}
        >
            {
                canShowBack 
                ? 
                (
                    <Pressable onPress={handleBackPress} style={styles.backBtn} hitSlop={8}>
                        <AppIcon name="chevronLeft" size={24} />
                    </Pressable>
                ) 
                : 
                (
                    <View style={styles.backSpacer} /> // 버튼 없을 때 공간만 유지
                )
            }

            {
                isInput 
                ?
                (
                    <View
                        style={[
                            styles.inputWrap,
                            // 수정: 한 줄 모드에서는 inputWrap도 고정 높이 사용
                            multiline
                                ? { minHeight: resolvedInputHeight + 8 }
                                : { height: INPUT_MIN_HEIGHT - 8}
                        ]}
                    >
                        <TextInput
                            value={value}
                            onChangeText={onChangeText}
                            placeholder={placeholder}
                            style={[
                                styles.input,
                                multiline
                                    ? {
                                        height: resolvedInputHeight,
                                        lineHeight: INPUT_LINE_HEIGHT,
                                    }
                                    : {height: 24},
                            ]}
                            autoFocus={autoFocus}
                            multiline={multiline}
                            scrollEnabled={multiline}
                            textAlignVertical={"center"}
                            onContentSizeChange={handleContentSizeChange}
                            returnKeyType="search"
                            onSubmitEditing={onSubmit}
                        />
                        {
                            !!value 
                            && 
                            (
                                <Pressable onPress={onClear} style={styles.clearBtn} hitSlop={6}>
                                    <AppIcon name="clear" size={24} />
                                </Pressable>
                            )
                        }
                    </View>
                ) 
                : 
                (
                    <Pressable onPress={onPressField} style={styles.inputWrap}>
                        <Text style={[
                                styles.triggerText, 
                                !value && styles.placeholder, 
                                { lineHeight: INPUT_LINE_HEIGHT }
                                ]}>
                            {value || placeholder}
                        </Text>
                    </Pressable>
                )
            }
        </View>
    );
}