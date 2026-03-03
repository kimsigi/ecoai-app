import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* App Store                                                          */
/* ------------------------------------------------------------------ */
interface AppStoreState {
    /* ---------------- Layout Policy ---------------- */
    /** 상태바 뒤 포함 전체 배경 */
    rootBackground: string | null;

    /** SafeArea 내부(children 영역) 배경 */
    contentBackground: string | null;

    /** 상태바 스타일 */
    statusBarStyle: 'light-content' | 'dark-content' | null;
    statusBarBackground: string | null; // Android용
    statusBarTranslucent: boolean | null;
    statusBarHidden: boolean | null;

    setRootBackground: (color: string | null) => void;
    setContentBackground: (color: string | null) => void;
    setStatusBarStyle: (style: 'light-content' | 'dark-content' | null) => void;
    setStatusBarBackground: (color: string | null) => void;
    setStatusBarTranslucent: (value: boolean | null) => void;
    setStatusBarHidden: (value: boolean | null) => void;

    resetLayout: () => void;
}

const useAppStore = create<AppStoreState>(set => ({
    /* ---------------- Layout ---------------- */
    rootBackground: null,
    contentBackground: null,

    statusBarStyle: null,
    statusBarBackground: null,
    statusBarTranslucent: null,
    statusBarHidden: null,

    setRootBackground: color => set({ rootBackground: color }),
    setContentBackground: color => set({ contentBackground: color }),
    setStatusBarStyle: style => set({ statusBarStyle: style }),
    setStatusBarBackground: color => set({ statusBarBackground: color }),
    setStatusBarTranslucent: value => set({ statusBarTranslucent: value }),
    setStatusBarHidden: value => set({ statusBarHidden: value }),

    resetLayout: () =>
        set({
            rootBackground: null,
            contentBackground: null,
            statusBarStyle: null,
            statusBarBackground: null,
            statusBarTranslucent: null,
            statusBarHidden: null,
        }),
}));

export default useAppStore;
