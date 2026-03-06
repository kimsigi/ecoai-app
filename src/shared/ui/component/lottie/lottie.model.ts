export const LOTTIE_MAP = {
    ax: require('@/shared/ui/assets/lottie/ax.json'),
    notificationActive: require('@/shared/ui/assets/lottie/notificationActive.json'),
    splash: require('@/shared/ui/assets/lottie/splash.json'),
    winkingFace: require('@/shared/ui/assets/lottie/winkingFace.json'),
    quitFullScreenCircle: require('@/shared/ui/assets/lottie/quitFullScreenCircle.json'),
} as const;

export type LottieName = keyof typeof LOTTIE_MAP;
