export interface ErrorPageProps {
  /** 에러 제목 */
  title: string;

  /** 에러 설명 */
  description?: string;

  /** 다시 시도 버튼 클릭 시 실행할 콜백 */
  onRetry?: () => void;
}
