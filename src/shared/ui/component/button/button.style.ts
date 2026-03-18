import { StyleSheet } from 'react-native';
import {
    COLOR,
    FONT_FACE,
    FONT_SIZE,
    RADIUS,
    SPACING,
} from '@/shared/ui/token';

export const styles = StyleSheet.create({
    button: {
        backgroundColor: COLOR.blue500,
        paddingVertical: SPACING.lg,
        paddingHorizontal: SPACING.xl,
        borderRadius: RADIUS.xxl,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        elevation: 3,
        shadowColor: COLOR.black,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: RADIUS.md,
    },
    buttonText: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.lg,
        color: COLOR.white,
    },
});
