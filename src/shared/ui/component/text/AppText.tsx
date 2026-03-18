import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { FONT_FACE } from '@/shared/ui/token';

/*
    Text 컴포넌트 레퍼
     - 기본 Pretendard-Regular 폰트 강제 적용
*/
export default function AppText({ style, ...props }: TextProps) {
    return <Text {...props} style={[styles.defaultText, style]} />;
}

const styles = StyleSheet.create({
    defaultText: {
        fontFamily: FONT_FACE.pretendard.regular,        
    },
});