import { StyleSheet } from 'react-native';
import { SPACING } from '@/shared/ui/token';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerBody: {
        width: '100%',
    },
    defaultHeaderRow: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    side: {
        width: 56,
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
    },
    rightIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        paddingRight: SPACING.xl,
    },
    rightIconButton: {
        width: 24,
        height: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    content: {
        flex: 1,
        //paddingHorizontal: spacingRaw.sp1 - 1, // 0 유지 의도 (토큰 참조 형태 유지용, 싫으면 0으로 바꿔도 됨)
    },
});
