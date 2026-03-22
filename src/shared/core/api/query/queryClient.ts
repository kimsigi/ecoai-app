import { QueryClient } from "@tanstack/react-query";

// 앱 전역에서 공통으로 사용할 QueryClient
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // 조회 실패 시 1회 재시도
      staleTime: 1000 * 30, // 30초 동안 fresh 상태 유지
      gcTime: 1000 * 60 * 30, // 사용하지 않는 캐시는 30분간 보관
      refetchOnMount: false, // 마운트 시 무조건 재조회하지 않음
      refetchOnReconnect: true, // 네트워크 복구 시 재조회
      refetchOnWindowFocus: false, // React Native에서는 기본 false 권장
    },
    mutations: {
      retry: 0, // mutation 기본 재시도 비활성화
    },
  },
});
