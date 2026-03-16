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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: SPACING.xl,
        paddingBottom: 120,
    },
    section: {
        alignItems: 'center',
    },
    title: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.xxl,
        color: COLOR.gray960,
        textAlign: 'center',
        marginBottom: SPACING.xl,
    },
    buttonGroup: {
        width: '100%',
        gap: SPACING.smMd,
    },
    button: {
        height: 46,
        borderRadius: RADIUS.enormous,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: SPACING.xsSm,
        paddingRight: SPACING.xl,
    },
    buttonActive: {
        backgroundColor: COLOR.blue500,
    },
    buttonInactive: {
        backgroundColor: COLOR.grayBlue200,
    },
    badge: {
        width: 40,
        height: 40,
        borderRadius: SPACING.xl,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    label: {
        flex: 1,
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xl,
        textAlign: 'center',
        marginRight: 34,
    },
    labelActive: {
        color: COLOR.white,
    },
    labelInactive: {
        color: COLOR.grayBlue300,
    },
});
