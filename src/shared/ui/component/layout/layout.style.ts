import { StyleSheet } from 'react-native';
import { COLOR, FONT_FACE, FONT_SIZE, SPACING } from '@/shared/ui/token';

export const styles = StyleSheet.create({
    statusBarBackgroundPosition: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
    },
    headerOverlayPosition: {
        position: 'absolute',
        left: 0,
        right: 0,
    },
    pageHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLOR.white,
    },
    pageHeaderBottomLine: {
        borderBottomWidth: 1,
        borderBottomColor: COLOR.gray300,
    },
    pageHeaderLeft: {
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingLeft: SPACING.xl,
    },
    pageHeaderCenter: {
        flex: 1,
        minWidth: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pageHeaderTitle: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.xxl,
    },
    pageHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingRight: SPACING.xl,
    },
});
