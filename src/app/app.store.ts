import { create } from 'zustand';

/* ------------------------------------------------------------------ */
/* App Store                                                          */
/* ------------------------------------------------------------------ */

interface AppState {

  /** 앱이 MainFlow로 진입 가능한 상태인지 */
  isAppReady: boolean;

  /** Init 완료 → Main 진입 */
  setAppReady: (ready: boolean) => void;

  /** 앱 완전 초기화 (권한 철회, 로그아웃 등) */
  resetApp: () => void;
}

const useAppStore = create<AppState>(set => ({
    isAppReady: false,

    setAppReady: ready => set({isAppReady: ready}),
    
    resetApp: () => set({isAppReady: false,}),
}));