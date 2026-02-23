import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 60,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 80,
        color: '#000',
    },
    description: {
        fontSize: 16,
        marginBottom: 24,
        color: '#000',
    },
    buttonWrapper: {
        gap: 16,
    },
    button: {
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
    },
    buttonActive: {
        backgroundColor: '#1E6DEB',
        borderColor: '#1E6DEB',
    },
    buttonInactive: {
        backgroundColor: '#FFFFFF',
        borderColor: '#1E6DEB',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    },
    buttonTextActive: {
        color: '#FFFFFF',
    },
    buttonTextInactive: {
        color: '#1E6DEB',
    },
    nextButton: {
        marginTop: 40,
        paddingHorizontal: 40,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#1E6DEB',
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: '600',
    },
});
