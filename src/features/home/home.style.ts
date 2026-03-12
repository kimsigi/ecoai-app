import {
    COLOR,
    FONT_FACE,
    FONT_SIZE,
    RADIUS,
    SPACING,
} from '@/shared/ui/token';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    statusBar: {
        backgroundColor: COLOR.blue500,
    },
    header: {
        backgroundColor: COLOR.blue500,
    },
    content: {
        backgroundColor: COLOR.blue500,
    },
    searchArea: {
        marginTop: SPACING.xl,
        flexDirection: 'row',
        marginHorizontal: SPACING.xl,
        height: 48,
        backgroundColor: COLOR.whiteA80,
        borderRadius: RADIUS.xxxl,
        borderWidth: 1,
        borderColor: COLOR.gray300,
        alignItems: 'center',
        paddingHorizontal: SPACING.xl,
        gap: SPACING.sm,
    },
    searchAreaPlaceholder: {
        flex: 1,
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.md,
        color: COLOR.gray950,
    },
    heroArea: {
        flex: 1,
        minHeight: 180,
        alignItems: 'center',
    },
    heroTextArea: {
        alignItems: 'center',
        marginTop: 47,
    },
    heroTitle: {
        textAlign: 'center',
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.display2xl,
        lineHeight: Math.round(FONT_SIZE.display2xl * 1.2),
        color: COLOR.white,
    },
    heroSubtitle: {
        textAlign: 'center',
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.displayXl,
        lineHeight: Math.round(FONT_SIZE.displayXl * 1.2),
        color: COLOR.white,
    },
    lottieArea: {
        flex: 1,
        width: '100%',
        marginTop: SPACING.xl,
        justifyContent: 'flex-end',
    },
    lottie: {
        width: '100%',
        aspectRatio: 361 / 203,
    },
    infoCard: {
        width: '100%',
        backgroundColor: COLOR.white,
        borderTopLeftRadius: RADIUS.xxxl,
        borderTopRightRadius: RADIUS.xxxl,
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
        paddingBottom: SPACING.xl,
    },
    infoTextArea: {
        alignItems: 'center',
    },
    infoText: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.lg,
        lineHeight: Math.round(FONT_SIZE.lg * 1.4),
        color: COLOR.gray925,
        textAlign: 'center',
    },
    ctaArea: {
        alignItems: 'center',
        marginTop: SPACING.xl,
    },
    ctaCard: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaCircle: {
        width: 80,
        height: 80,
        borderRadius: RADIUS.pill,
        backgroundColor: COLOR.blue500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaLabel: {
        marginTop: SPACING.xl,
    },
    ctaLabel1: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.displaySm,
        color: COLOR.gray950,
        textAlign: 'center',
    },
    ctaLabel2: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.lg,
        color: COLOR.gray950,
        textAlign: 'center',
    },
    symbolArea: {
        marginTop: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: SPACING.xl,
    },

    //////////////////////////////////////
    ////////// 사이드메뉴 스타일 //////////
    //////////////////////////////////////

    menuPanel: {
        width: '100%',
        backgroundColor: COLOR.white,
        borderRightWidth: 1,
        borderColor: COLOR.gray300,
    },
    menuItem: {
        height: 72,
        paddingHorizontal: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.smMd,
        borderBottomWidth: 1,
        borderBottomColor: COLOR.gray300,
        backgroundColor: COLOR.white,
    },
    menuItemText: {
        flex: 1,
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.lg,
        lineHeight: Math.round(FONT_SIZE.lg * 1.4),
        color: COLOR.gray950,
    },
    subitemContainer: {
        backgroundColor: COLOR.gray300,
        paddingVertical: SPACING.xsSm,
    },
    subitem: {
        height: 48,
        paddingHorizontal: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subitemText: {
        flex: 1,
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.lg,
        lineHeight: Math.round(FONT_SIZE.lg * 1.4),
        color: COLOR.gray900,
    },
    subitemActive: {
        backgroundColor: COLOR.blue50,
        borderLeftWidth: 3,
        borderLeftColor: COLOR.blue500,
    },
    subitemTextActive: {
        color: COLOR.blue700,
    },
});
