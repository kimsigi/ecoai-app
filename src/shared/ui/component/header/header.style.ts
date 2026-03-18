import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    wrap: {
        height: 48,
        marginHorizontal: 12,
        borderRadius: 20,
        backgroundColor: '#FFFFFF99',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 6,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderStyle: 'solid',
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    backSpacer: {
        width: 36,
        height: 36,
    },
    inputWrap: {
        flex: 1,
        minHeight: 36,
        borderRadius: 18,
        paddingLeft: 8,
        paddingRight: 32,
        paddingVertical: 4,
        justifyContent: 'center',
    },
    input: {
        fontSize: 16,
        color: '#1F2937',
        paddingVertical: 0,
        paddingHorizontal: 0,
    },
    triggerText: {
        fontSize: 16,
        color: '#1F2937',
    },
    placeholder: {
        color: '#9CA3AF',
    },
    clearBtn: {
        position: 'absolute',
        right: 20,
    },
    clearText: {
        fontSize: 16,
        lineHeight: 18,
        color: '#374151',
    },
});
