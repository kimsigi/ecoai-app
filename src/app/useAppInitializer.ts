import { useCallback, useEffect, useRef, useState } from 'react';
import BootSplash from 'react-native-bootsplash';
import { InitState } from './app.type';
import { INIT_STATE } from './app.constant';
import { initApp } from './app.service';

export function useAppInitializer() {
    const [state, setState] = useState<InitState>(INIT_STATE.CHECKING);
    const nativeSplashHidden = useRef(false);

    /** -------------------------------
     * 초기화 엔트리 포인트
     * ------------------------------- */
    const entryPoint = useCallback(async () => {
        setState(INIT_STATE.CHECKING);
        const result = await initApp();
        setState(result);
    }, []);

    /* -------------------------------
     * 초기화 시작
     * ------------------------------- */
    useEffect(() => {
        entryPoint();
    }, [entryPoint]);

    /* -------------------------------
     * BootSplash 제어
     * ------------------------------- */
    useEffect(() => {
        if (!nativeSplashHidden.current) {
            if (state !== INIT_STATE.CHECKING) {
                BootSplash.hide({ fade: true });
                nativeSplashHidden.current = true;
            }
        }
    }, [state]);

    return {
        state,
        entryPoint,
    };
}
