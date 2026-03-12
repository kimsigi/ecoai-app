import { StyleSheet } from 'react-native';
import {
    COLOR,
    FONT_FACE,
    FONT_SIZE,
    RADIUS,
    SPACING,
} from '@/shared/ui/token';

export const styles = StyleSheet.create({
    message: {
        textAlign: 'left',
    },
    decisionCard: {
        borderRadius: RADIUS.xxl,
        backgroundColor: COLOR.whiteA80,
    },
    decisionMessage: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.lg,
        color: COLOR.gray950,
        textAlign: 'center',
    },
    actions: {
        paddingTop: 6,
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
        gap: SPACING.smMd,
        justifyContent: 'space-between',
    },
    cancelButton: {
        flex: 1,
        borderRadius: RADIUS.md,
        borderColor: COLOR.gray800,
    },
    confirmButton: {
        flex: 1,
        borderRadius: RADIUS.md,
        backgroundColor: COLOR.blue500,
    },
    cancelLabel: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.sm,
        color: COLOR.gray950,
    },
    confirmLabel: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.sm,
        color: COLOR.white,
    },
});
