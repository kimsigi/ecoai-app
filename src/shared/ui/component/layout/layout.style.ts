import { StyleSheet } from 'react-native';

export const pageLayoutStyles = StyleSheet.create({
    container: { flex: 1 },

    headerArea: {
        //justifyContent: 'center',
        width: '100%', // [수정] 헤더 전체 폭 고정
        //backgroundColor: '#FFFFFF',
    },

    defaultHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%', // [수정] 행 전체 폭 고정
    },

    customHeaderWrap: {
        justifyContent: 'center',
    },

    side: {
        width: 72,
        justifyContent: 'center',
    },

    sideSpacer: {
        width: 36,
        height: 36,
    },

    right: {
        alignItems: 'flex-end',
    },

    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    backButton: {
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 8,
    },

    backText: {
        fontSize: 20,
        color: '#111827',
        fontWeight: '600',
        lineHeight: 22,
    },

    contentArea: {
        flex: 1,
    },
});
