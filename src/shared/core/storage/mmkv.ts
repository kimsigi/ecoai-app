import { createMMKV } from 'react-native-mmkv';

/**
 * MMKV 스토리지 인스턴스 (인프라 계층)
 * - 어떤 데이터를 저장할지는 각 feature/service에서 정의한다.
 * - 이 파일은 "저장 엔진" 역할만 수행한다.
 */
export const mmkv = createMMKV();
