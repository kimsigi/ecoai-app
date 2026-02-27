import React, { ReactNode } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export interface HeaderProps {
    showBack?: boolean;
    left?: ReactNode;
    center?: ReactNode;
    right?: ReactNode;
    backgroundColor?: string;
}

/**
 * 44 고정 커스텀 헤더
 * - 슬롯 구조 (left / center / right)
 * - showBack 옵션으로 뒤로가기 버튼 자동 생성
 * - 중앙 정렬
 */
export default function ScreenHeader({
    showBack = false,
    left,
    center,
    right,
    backgroundColor = '#FFFFFF',
}: HeaderProps) {
    const navigation = useNavigation();

    const renderLeft = () => {
        if (left) return left;

        if (showBack && navigation.canGoBack()) {
            return (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Text>{'<'}</Text>
                </TouchableOpacity>
            );
        }

        return null;
    };

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <View style={styles.side}>{renderLeft()}</View>

            <View style={styles.center}>{center}</View>

            <View style={[styles.side, styles.right]}>{right}</View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
    },
    side: {
        width: 80,
        justifyContent: 'center',
    },
    right: {
        alignItems: 'flex-end',
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backButton: {
        paddingHorizontal: 12,
    },
});
