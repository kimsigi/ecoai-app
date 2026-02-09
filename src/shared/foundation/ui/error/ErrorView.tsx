import { View, Text, Pressable } from "react-native";
import { ErrorPageProps } from "./error.type";
import { styles } from "./error.style";

/**
 * [ErrorView]
 *
 * - 앱 전역에서 사용되는 에러 페이지
 * - navigation에 의존하지 않음
 * - 레이아웃은 상위(App.tsx)에서 결정
 * - UX 관점에서 화면 전체를 차지하는 Page
 */
export default function ErrorView({
  title,
  description,
  onRetry,
}: ErrorPageProps) {
  return (
    <View style={styles.container}>
      {/* 제목 */}
      <Text style={styles.title}>{title}</Text>

      {/* 설명 */}
      {description && (
        <Text style={styles.description}>{description}</Text>
      )}

      {/* 다시 시도 버튼 */}
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>다시 시도</Text>
        </Pressable>
      )}
    </View>
  );
}