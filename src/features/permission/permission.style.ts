import {
    COLOR,
    FONT_FACE,
    FONT_SIZE,
    RADIUS,
    SPACING,
} from '@/shared/ui/token';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: SPACING.xxl,
        paddingTop: SPACING.layout,
        paddingBottom: SPACING.huge,
    },
    title: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.displayXl,
        marginBottom: SPACING.md,
    },
    subtitle: {
        fontSize: FONT_SIZE.lg,
        color: COLOR.gray600,
    },
    permissionList: {
        flex: 1,
        paddingHorizontal: SPACING.xxl,
    },
    permissionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.gray25,
        borderRadius: SPACING.md,
        padding: SPACING.lg,
        marginBottom: SPACING.md,
    },
    permissionIcon: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.pill,
        backgroundColor: COLOR.white,
        marginRight: SPACING.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: {
        fontSize: FONT_SIZE.displayLg,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionTitle: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.lg,
        marginBottom: SPACING.xs,
    },
    permissionDescription: {
        fontSize: FONT_SIZE.xs,
        color: COLOR.gray600,
        lineHeight: Math.round(FONT_SIZE.xs * 1.8),
    },
    statusBadge: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xsSm,
        borderRadius: RADIUS.xxl,
    },
    statusText: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xxs,
        color: COLOR.white,
    },
    footer: {
        paddingHorizontal: SPACING.xxl,
        paddingBottom: SPACING.giant,
        paddingTop: SPACING.lg,
    },
    loadingText: {
        marginTop: 100,
        fontSize: FONT_SIZE.lg,
        color: COLOR.gray600,
        textAlign: 'center',
    },
});
