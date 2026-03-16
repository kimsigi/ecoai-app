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
        backgroundColor: COLOR.gray100,
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


    positionOverlay: {
        ...StyleSheet.absoluteFillObject,
        paddingHorizontal: SPACING.lg, // [변경] top/bottom 카드 좌우 여백
    },
    positionTop: {
        justifyContent: 'flex-start', // [변경] top 위치
        paddingTop: SPACING.xl,
    },
    positionBottom: {
        justifyContent: 'flex-end', // [변경] bottom 위치
        paddingBottom: SPACING.xl,
        marginBottom: 50,
    },
    positionBackdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: COLOR.blackA20, // [변경] top/bottom 공통 백드롭
    },
    positionCard: {
        borderRadius: RADIUS.xxl, // [변경] top/bottom 공통 카드 스타일
        backgroundColor: COLOR.white,
        paddingTop: SPACING.lg,
        paddingHorizontal: SPACING.lg,
        paddingBottom: SPACING.lg,
        gap: SPACING.md,
    },
    positionTitle: {
        fontFamily: FONT_FACE.pretendard.bold, // [변경] top/bottom 공통 타이틀
        fontSize: FONT_SIZE.lg,
        color: COLOR.gray950,
        textAlign: 'center',
    },
    positionActions: {
        flexDirection: 'row', // [변경] top/bottom 공통 액션 레이아웃
        gap: SPACING.smMd,
    },
});
