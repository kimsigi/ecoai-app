import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    /* 🔝 상단 */
    topContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16,
    },
    searchBar: {
        marginTop: 12,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    searchText: {
        color: '#777',
        fontSize: 15,
    },

    /* 🔻 하단 */
    bottomContainer: {
        position: 'absolute',
        bottom: 30,
        left: 20,
        right: 20,
    },
    confirmButton: {
        backgroundColor: '#1976D2',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },
    confirmText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
