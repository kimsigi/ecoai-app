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
        paddingTop: 30,
        borderRadius: 20,
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
        bottom: 20,
        left: 20,
        right: 20,
    },
    confirmButton: {
        backgroundColor: '#345AE4',
        borderRadius: 30,
        paddingVertical: 16,
        alignItems: 'center',
    },
    confirmText: {
        fontFamily: 'Pretendard-SemiBold', // font-style이 SemiBold이므로 폰트 파일명에 맞춰 지정
        fontSize: 17,
        fontWeight: '600', // RN에서는 폰트 파일에 따라 생략 가능하지만 명시

        // line-height: 150% -> 17 * 1.5 = 25.5
        lineHeight: 25.5,

        // letter-spacing: 수치가 없어서 일반적인 label/small 기준(-2% 내외)으로 설정
        // 구체적인 수치가 있다면 그 값을 넣으세요. (예: -0.34)
        letterSpacing: -0.34,

        textAlign: 'center',

        // RN에는 verticalAlign이 없으므로 부모 View에서 제어하거나
        // textAlignVertical(Android 전용)을 사용합니다.
        textAlignVertical: 'center',

        color: '#FFFFFF',
    },
});
/*
width: 320;
height: 48;
min-width: 60px;
top: 762px;
left: 20px;
gap: 2;
angle: 0 deg;
opacity: 1;
padding-right: padding/4;
padding-left: padding/4;
border-radius: radius/small3;


font-family: Pretendard;
font-weight: 600;
font-style: SemiBold;
font-size: 17px;
leading-trim: NONE;
line-height: 150%;
letter-spacing: typo/label/small/letter-spacing;
text-align: center;
vertical-align: middle;
*/

export const addressSearchStyles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    headerWrap: { paddingBottom: 8 },
    loadingWrap: { paddingVertical: 8 },

    item: {
        minHeight: 56,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#E5E7EB',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    iconWrap: {
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    textWrap: { flex: 1 },

    titleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    titleText: {
        fontSize: 14,
        color: '#111827',
        fontWeight: '500',
        flexShrink: 1,
    },
    smallLabel: {
        fontSize: 11,
        color: '#9CA3AF',
        flexShrink: 0,
    },

    subText: {
        marginTop: 2,
        fontSize: 12,
        color: '#6B7280',
    },

    sectionDivider: {
        height: 10,
        backgroundColor: '#F3F4F6',
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: '#E5E7EB',
    },

    emptyText: {
        paddingTop: 24,
        textAlign: 'center',
        color: '#9CA3AF',
        fontSize: 14,
    },
});
