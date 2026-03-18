import {
    COLOR,
    FONT_FACE,
    FONT_SIZE,
    RADIUS,
    SPACING,
} from '@/shared/ui/token';
import { StyleSheet } from 'react-native';

export const locationPickerStyles = StyleSheet.create({
    customHeader: {
        paddingTop: SPACING.xl,
        backgroundColor: COLOR.transparent,
    },
    contentContainer: {
        flex: 1,
    },
    bottomContainer: {
        position: 'absolute',
        bottom: SPACING.xl,
        left: SPACING.xl,
        right: SPACING.xl,
    },
    bottomConfirmButton: {
        backgroundColor: COLOR.blue500,
        borderRadius: RADIUS.lg,
        paddingVertical: SPACING.smMd,
        height: 48,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomConfirmText: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xl,
        color: COLOR.white,
        lineHeight: Math.round(FONT_SIZE.xl * 1.5),
    },
});

export const locationAddressSearchStyles = StyleSheet.create({
    customHeader: {
        paddingTop: SPACING.xl,
    },
    activityIndicator: {
        paddingVertical: SPACING.sm,
    },
    sectionDivider: {
        height: 10,
        backgroundColor: COLOR.white,
        borderColor: COLOR.gray300,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    item: {
        height: 59,
        paddingHorizontal: SPACING.giant,
        paddingVertical: SPACING.xl,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.gray100,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.smMd,
    },
    itemIconWrap: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemTextWrap: {
        flex: 1,
    },
    itemText: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.xsSm,
    },
    itemMainTitle: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.md,
        color: COLOR.gray950,
        flexShrink: 1,
    },
    itemSmallLabelWrap: {
        height: FONT_SIZE.md + 8,
        justifyContent: 'center',
    },
    itemSmallLabel: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.xxs,
        color: COLOR.gray500,
    },
    itemSubText: {
        marginTop: SPACING.xs,
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xxs,
        color: COLOR.gray700,
    },
    emptyText: {
        paddingTop: SPACING.xxl,
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.sm,
        color: COLOR.gray950,
        textAlign: 'center',
    },
});
