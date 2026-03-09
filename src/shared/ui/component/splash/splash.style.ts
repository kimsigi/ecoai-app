import { StyleSheet } from 'react-native';
import { COLOR, FONT_FACE, FONT_SIZE } from '../../token';

export const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#345AE4',
    },
    top: {
        flex: 0.6,
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottom: {
        flex: 0.4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleSmall: {
        fontFamily: FONT_FACE.pretendard.regular,
        fontSize: FONT_SIZE.display2xl,
        color: COLOR.white,
    },
    titleLarge: {
        fontFamily: FONT_FACE.pretendard.extraBold,
        fontSize: FONT_SIZE.display3xl,
        color: COLOR.white,
    },
});
