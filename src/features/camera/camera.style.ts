import { StyleSheet } from 'react-native';
import {
    COLOR,
    FONT_FACE,
    FONT_SIZE,
    RADIUS,
    SPACING,
} from '@/shared/ui/token';

export const styles = StyleSheet.create({
    header: {
        backgroundColor: COLOR.transparent,
    },
    container: {
        flex: 1,
        backgroundColor: COLOR.black,
        overflow: 'hidden',
    },
    cameraContainer: {
        ...StyleSheet.absoluteFill,
    },
    capturedPhoto: {
        ...StyleSheet.absoluteFillObject,
    },
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        paddingTop: 56,
        paddingBottom: 7,
        paddingHorizontal: 20,
        justifyContent: 'space-between',
        zIndex: 10,
    },
    guideFrameArea: {
        flex: 1,
        position: 'relative',
        marginTop: 43,
        marginBottom: 20,
    },
    guideCorner: {
        position: 'absolute',
        width: 100,
        height: 100,
        borderColor: COLOR.white,
        borderWidth: 4,
    },
    guideCornerTopLeft: {
        top: 0,
        left: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopLeftRadius: RADIUS.xl,
    },
    guideCornerTopRight: {
        top: 0,
        right: 0,
        borderLeftWidth: 0,
        borderBottomWidth: 0,
        borderTopRightRadius: RADIUS.xl,
    },
    guideCornerBottomLeft: {
        bottom: 0,
        left: 0,
        borderRightWidth: 0,
        borderTopWidth: 0,
        borderBottomLeftRadius: RADIUS.xl,
    },
    guideCornerBottomRight: {
        bottom: 0,
        right: 0,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderBottomRightRadius: RADIUS.xl,
    },
    bottomContainer: {
        /* 추후 쓰임이 있을 때 선언 */
    },
    guideMessageContainer: {
        height: 40,
        marginBottom: 20,
        alignItems: 'center',
    },
    guideMessageText: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xl,
        color: COLOR.white,
        textAlign: 'center',
    },
    bottomGroup: {
        width: '100%',
        height: 92,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',

        borderWidth: 1,
        borderRadius: RADIUS.xxxl,
        borderColor: COLOR.whiteA10,
        backgroundColor: COLOR.whiteA20,
    },
    shutterOuter: {
        width: 72,
        height: 72,
        borderRadius: RADIUS.pill,
        borderWidth: 3,
        borderColor: COLOR.white,
        backgroundColor: COLOR.gray950,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shutterInner: {
        width: 56,
        height: 56,
        borderRadius: RADIUS.pill,
        backgroundColor: COLOR.gray950,
    },
    shutterOuterDisabled: {
        opacity: 0.6,
    },
    aiAssistantButton: {
        position: 'absolute',
        right: 20,
        width: 66,
        height: 70,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiCircle: {
        width: 50,
        height: 50,
        borderRadius: RADIUS.pill,
        paddingHorizontal: SPACING.smMd,
        paddingVertical: SPACING.lg,
        backgroundColor: COLOR.blue500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiBadge: {
        width: 66,
        height: 25,
        borderRadius: RADIUS.xxxl,
        paddingHorizontal: SPACING.xsSm,
        paddingVertical: SPACING.xs,
        marginTop: -SPACING.xs,
        backgroundColor: COLOR.blue500,
        alignItems: 'center',
        justifyContent: 'center',
    },
    aiBadgeText: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.xxs,
        color: COLOR.white,
    },

    // [추가] detection overlay
    detectionOverlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 2,
    },
    detectionBox: {
        position: 'absolute',
        borderWidth: 2,
        borderColor: '#FF3B30',
        backgroundColor: 'transparent',
    },
    detectionBadge: {
        alignSelf: 'flex-start',
        maxWidth: '100%',
        backgroundColor: '#FF3B30',
        paddingHorizontal: SPACING.xsSm,
        paddingVertical: SPACING.xs,
        borderBottomRightRadius: RADIUS.md,
    },
    detectionBadgeText: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xxs,
        color: COLOR.white,
    },
    // [추가] detection touch debug panel
    detectionDebugPanel: {
        position: 'absolute',
        left: 12,
        right: 12,
        top: 72,
        maxHeight: 220,
        backgroundColor: '#000000AA',
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING.smMd,
        paddingVertical: SPACING.smMd,
        zIndex: 3,
    },
    detectionDebugTitle: {
        fontFamily: FONT_FACE.pretendard.bold,
        fontSize: FONT_SIZE.xs,
        color: COLOR.white,
        marginBottom: SPACING.xs,
    },
    detectionDebugText: {
        fontFamily: FONT_FACE.pretendard.semibold,
        fontSize: FONT_SIZE.xxs,
        color: COLOR.white,
    },
});
