import { StyleSheet } from 'react-native';
import { COLOR } from '../../token';

export const styles = StyleSheet.create({
    inner: {
        flex: 1,
        overflow: 'hidden',
    },
    background: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        //backgroundColor: '#FFFFFF',
        backgroundColor: COLOR.whiteA80,
    },
    handleIndicator: {
        width: 44,
        height: 4,
        borderRadius: 999,
        backgroundColor: '#C9CDD4',
    },
    container: {
        flex: 1,
        minHeight: 0,
    },
    scrollView: {
        flex: 1,
        minHeight: 0,
    },
    headerContainer: {
        minHeight: 56,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F2F5',
    },
    headerLeftSpacer: {
        width: 32,
    },
    headerTitleWrap: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: '#111827',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    headerRightWrap: {
        width: 32,
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    headerCloseButton: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F3F4F6',
    },
    headerCloseText: {
        color: '#111827',
        fontSize: 14,
        fontWeight: '700',
    },
    contentContainer: {
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 24,
    },
});
