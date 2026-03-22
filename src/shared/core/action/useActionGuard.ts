import { useEffect, useRef, useState } from 'react';
import { useRoute } from '@react-navigation/native';

type GuardOptions = {
    key?: string;
    item?: string | number;
    lockMs?: number;
    timeoutMs?: number;
    abortable?: boolean;
    withState?: boolean;
    onStart?: () => void;
    onEnd?: () => void;
    onTimeout?: (error: ActionGuardTimeoutError) => void;
    onError?: (error: unknown) => void;
};

type GuardState = {
    lastRun: number;
    pending: boolean;
    error: unknown;
    timer?: ReturnType<typeof setTimeout>;
    controller?: AbortController;
    timeoutHandled?: boolean;
};

type ActionGuardContext = {
    signal?: AbortSignal;
};

type GuardedFunction<TArgs extends any[] = any[], TResult = any> = (
    ...args: [...TArgs, ActionGuardContext?]
) => TResult;

type GuardedHandler<T extends GuardedFunction> = (
    ...args: Parameters<T> extends [...infer TArgs, any?] ? TArgs : Parameters<T>
) => Promise<Awaited<ReturnType<T>> | undefined>;

type GuardedActionState<T extends GuardedFunction> = {
    onPress: GuardedHandler<T>;
    disabled: boolean;
    pending: boolean;
    error: unknown;
    resetError: () => void;
};

type LatestAction<T extends GuardedFunction = GuardedFunction> = {
    fn: T;
    opt?: GuardOptions;
};

export class ActionGuardTimeoutError extends Error {
    constructor(
        message = 'Action timed out.',
        public readonly key?: string,
        public readonly timeoutMs?: number,
    ) {
        super(message);
        this.name = 'ActionGuardTimeoutError';
    }
}

export function useActionGuard(defaultLockMs = 700) {
    const route = safeUseRoute();
    const fallbackIdRef = useRef(`UNKNOWN_SCREEN_${Date.now()}`);
    const anonSeqRef = useRef(0);
    const stateMapRef = useRef<Map<string, GuardState>>(new Map());
    const handlerMapRef = useRef<Map<string, GuardedHandler<GuardedFunction>>>(
        new Map(),
    );
    const latestMapRef = useRef<Map<string, LatestAction>>(new Map());
    const anonymousKeyMapRef = useRef<WeakMap<Function, string>>(new WeakMap());
    const mountedRef = useRef(true);
    const warnedRef = useRef(false);
    const [, forceRender] = useState(0);
    const screenId = route?.name ?? fallbackIdRef.current;
    const lockTimerMapRef = useRef<
        Map<string, ReturnType<typeof setTimeout>>
    >(new Map()); // lock 해제 시점에 리렌더하기 위한 타이머 저장소 추가

    useEffect(() => {
        if (!route && !warnedRef.current) {
            warnedRef.current = true;
            console.warn(
                '[ActionGuard] screenId not found. Using fallback id. Provide navigation context or manual key.',
            );
        }
    }, [route]);

    useEffect(() => {
        return () => {
            mountedRef.current = false;
            stateMapRef.current.forEach(state => {
                if (state.timer) clearTimeout(state.timer);
                if (state.controller && !state.controller.signal.aborted) {
                    state.controller.abort();
                }
            });
            lockTimerMapRef.current.forEach(timer => clearTimeout(timer)); // lock 해제 타이머 정리
            stateMapRef.current.clear();
            handlerMapRef.current.clear();
            latestMapRef.current.clear();
            lockTimerMapRef.current.clear(); // 타이머 맵 정리
        };
    }, []);

    const buildKey = (fn: Function, opt?: GuardOptions) => {
        if (opt?.key) return opt.key;

        if (opt?.item !== undefined) {
            return `${screenId}-item-${opt.item}`;
        }

        if (fn.name) {
            return `${screenId}-${fn.name}`;
        }

        const anonymousKey = anonymousKeyMapRef.current.get(fn);
        if (anonymousKey) return anonymousKey;

        const nextKey = `${screenId}-anonymous-${++anonSeqRef.current}`;
        anonymousKeyMapRef.current.set(fn, nextKey);
        return nextKey;
    };

    const resetError = (key: string) => {
        const state = stateMapRef.current.get(key);
        if (!state) return;

        state.error = undefined;
        stateMapRef.current.set(key, state);
        forceRender(value => value + 1);
    };

    const scheduleLockReleaseRender = (key: string, lockMs: number) => {
        const prevTimer = lockTimerMapRef.current.get(key);
        if (prevTimer) {
            clearTimeout(prevTimer);
        }

        if (lockMs <= 0) return;

        const timer = setTimeout(() => {
            lockTimerMapRef.current.delete(key);

            if (!mountedRef.current) return;
            forceRender(value => value + 1);
        }, lockMs);

        lockTimerMapRef.current.set(key, timer);
    }; // lockMs 종료 시 disabled 재계산을 위한 리렌더 예약

    function action<T extends GuardedFunction>(
        fn: T,
        opt: GuardOptions & { withState: true },
    ): GuardedActionState<T>;
    function action<T extends GuardedFunction>(
        fn: T,
        opt?: GuardOptions,
    ): GuardedHandler<T>;
    function action<T extends GuardedFunction>(fn: T, opt?: GuardOptions) {
        const key = buildKey(fn, opt);
        latestMapRef.current.set(key, { fn, opt });

        if (!handlerMapRef.current.has(key)) {
            const run: GuardedHandler<T> = async (...args) => {
                const latest = latestMapRef.current.get(key) as
                    | LatestAction<T>
                    | undefined;
                const currentFn = latest?.fn ?? fn;
                const currentOpt = latest?.opt;
                const lockMs = currentOpt?.lockMs ?? defaultLockMs;
                const timeoutMs = currentOpt?.timeoutMs ?? 10000;
                const now = Date.now();

                const state = stateMapRef.current.get(key) ?? {
                    lastRun: 0,
                    pending: false,
                    error: undefined,
                };

                if (state.pending) return undefined;

                if (lockMs > 0 && now - state.lastRun < lockMs) {
                    return undefined;
                }

                if (state.timer) clearTimeout(state.timer);

                const lockTimer = lockTimerMapRef.current.get(key);
                if (lockTimer) {
                    clearTimeout(lockTimer);
                    lockTimerMapRef.current.delete(key);
                } // 새 액션 시작 시 이전 lock 해제 타이머 정리

                state.lastRun = now;
                state.pending = true;
                state.error = undefined;
                state.timeoutHandled = false;
                state.controller = currentOpt?.abortable
                    ? new AbortController()
                    : undefined;

                if (timeoutMs > 0) {
                    state.timer = setTimeout(() => {
                        const timeoutError = new ActionGuardTimeoutError(
                            `Action timed out after ${timeoutMs}ms.`,
                            key,
                            timeoutMs,
                        );

                        state.timeoutHandled = true;

                        if (
                            state.controller &&
                            !state.controller.signal.aborted
                        ) {
                            state.controller.abort();
                        }

                        if (currentOpt?.onTimeout) {
                            currentOpt.onTimeout(timeoutError);
                            return;
                        }

                        currentOpt?.onError?.(timeoutError);
                    }, timeoutMs);
                }

                stateMapRef.current.set(key, state);
                currentOpt?.onStart?.();
                forceRender(value => value + 1);

                try {
                    const result = currentFn(
                        ...args,
                        state.controller
                            ? { signal: state.controller.signal }
                            : undefined,
                    );

                    return await Promise.resolve(result);
                } catch (error) {
                    state.error = error;

                    if (!(state.timeoutHandled && isAbortError(error))) {
                        currentOpt?.onError?.(error);
                    }

                    throw error;
                } finally {
                    if (!mountedRef.current) return;

                    state.pending = false;
                    state.timeoutHandled = false;

                    if (state.timer) {
                        clearTimeout(state.timer);
                        state.timer = undefined;
                    }

                    state.controller = undefined;
                    stateMapRef.current.set(key, state);
                    currentOpt?.onEnd?.();
                    forceRender(value => value + 1);
                    scheduleLockReleaseRender(key, lockMs); // lock 종료 시 자동 리렌더
                }
            };

            handlerMapRef.current.set(
                key,
                run as GuardedHandler<GuardedFunction>,
            );
        }

        const handler = handlerMapRef.current.get(key) as GuardedHandler<T>;

        if (!opt?.withState) {
            return handler;
        }

        const state = stateMapRef.current.get(key);
        const lockMs = opt.lockMs ?? defaultLockMs;
        const disabled =
            !!state?.pending ||
            (!!state && lockMs > 0 && Date.now() - state.lastRun < lockMs);

        return {
            onPress: handler,
            disabled,
            pending: !!state?.pending,
            error: state?.error,
            resetError: () => resetError(key),
        };
    }

    return { action };
}

function isAbortError(error: unknown) {
    return (
        error instanceof Error &&
        (error.name === 'AbortError' || error.name === 'CanceledError')
    );
}

function safeUseRoute() {
    try {
        return useRoute();
    } catch {
        return undefined;
    }
}
