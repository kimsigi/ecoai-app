import React from 'react';
import { TextInput, TextInputProps, StyleSheet } from 'react-native';
import { FONT_FACE } from '@/shared/ui/token';

/*
    TextInput 컴포넌트 레퍼
     - 기본 Pretendard-Regular 폰트 강제 적용
*/
export default function AppTextInput({ style, ...props }: TextInputProps) {
    return <TextInput {...props} style={[styles.defaultInput, style]} />;
}

const styles = StyleSheet.create({
    defaultInput: {
        fontFamily: FONT_FACE.pretendard.regular,        
    },
});
