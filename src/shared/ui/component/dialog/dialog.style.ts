import { StyleSheet } from 'react-native';
import { DEFAULT_HEADER_HEIGHT } from '@/shared/ui/component/layout';
import { COLOR, SPACING } from '@/shared/UI/token';

export const styles = StyleSheet.create({
    modal: {
        margin: 0,
    },
    overlayRoot: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 1000,
    },
    portalRoot: {
        flex: 1,
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    contentContainer: {
        flex: 1,
    },
    headerBar: {
        height: DEFAULT_HEADER_HEIGHT,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COLOR.gray300,
        paddingHorizontal: SPACING.mdLg,
        backgroundColor: COLOR.white,
    },
    headerSide: {
        width: 28, // 좌/우 균형용
        height: 28,
    },
    headerCenter: {
        flex: 1, // 가운데 제목 영역
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 0,
    },
    headerTitle: {
        color: COLOR.gray925, // 헤더 스타일 고정
        fontSize: 16,
        fontWeight: '600',
    },
    headerCloseBtn: {
        width: 28,
        height: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
