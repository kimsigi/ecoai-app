import { PageLayout } from "@/shared/ui/component/layout";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import AppButton from "@/shared/ui/component/button/AppButton";
import {
  useCreateReactQueryTodoMutation,
  useDeleteReactQueryTodoMutation,
  useReactQueryHealthQuery,
  useReactQueryShowcaseActions,
  useReactQueryTodoListQuery,
  useToggleReactQueryTodoMutation,
} from "./reactQuery.queries";

function formatDateLabel(value?: string) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function ReactQueryShowcaseScreen() {
  const [draft, setDraft] = useState("");
  const [createIndex, setCreateIndex] = useState(4);

  const healthQuery = useReactQueryHealthQuery();
  const todoListQuery = useReactQueryTodoListQuery();
  const createTodoMutation = useCreateReactQueryTodoMutation();
  const toggleTodoMutation = useToggleReactQueryTodoMutation();
  const deleteTodoMutation = useDeleteReactQueryTodoMutation();
  const showcaseActions = useReactQueryShowcaseActions();

  const todos = todoListQuery.data ?? [];

  const summary = useMemo(() => {
    const doneCount = todos.filter((todo) => todo.done).length;

    return {
      totalCount: todos.length,
      doneCount,
      pendingCount: todos.length - doneCount,
    };
  }, [todos]);

  const handleCreatePreset = async () => {
    await createTodoMutation.mutateAsync({ index: createIndex });
    setCreateIndex((previousIndex) => previousIndex + 1);
  };

  const handleCreateDraft = async () => {
    const nextTitle = draft.trim();

    if (!nextTitle) {
      return;
    }

    await createTodoMutation.mutateAsync({
      index: createIndex,
      title: nextTitle,
    });
    setCreateIndex((previousIndex) => previousIndex + 1);
    setDraft("");
  };

  return (
    <PageLayout
      headerState="content"
      headerCenter="React Query"
      showBack
      protectBottomInset
      contentContainerStyle={styles.page}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>React Query Showcase</Text>
          <Text style={styles.heroBody}>
            조회, 수동 재조회, invalidate, optimistic update, CRUD 흐름을 한
            화면에서 확인하는 샘플입니다.
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>1. Health Query</Text>
          <Text style={styles.sectionBody}>
            `app.service.ts`의 네트워크 체크를 query로 감싼 예시입니다.
          </Text>

          <View style={styles.statusBox}>
            {healthQuery.isLoading ? (
              <ActivityIndicator color="#2563EB" />
            ) : (
              <>
                <Text style={styles.statusLabel}>
                  Status: {healthQuery.data?.isOnline ? "ONLINE" : "OFFLINE"}
                </Text>
                <Text style={styles.statusSubText}>
                  {healthQuery.data?.label ?? "No data"}
                </Text>
                <Text style={styles.statusSubText}>
                  Last checked: {formatDateLabel(healthQuery.data?.checkedAt)}
                </Text>
              </>
            )}
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.buttonCell}>
              <AppButton
                onPress={() => {
                  void healthQuery.refetch();
                }}
              >
                Refetch
              </AppButton>
            </View>
            <View style={styles.buttonCell}>
              <AppButton
                onPress={() => {
                  void showcaseActions.refetchHealth();
                }}
              >
                Invalidate
              </AppButton>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>2. Todo CRUD Query</Text>
          <Text style={styles.sectionBody}>
            mock API로 create, toggle, delete를 수행하고 목록 캐시를 갱신합니다.
          </Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Total {summary.totalCount}</Text>
            <Text style={styles.summaryText}>Done {summary.doneCount}</Text>
            <Text style={styles.summaryText}>Pending {summary.pendingCount}</Text>
          </View>

          <View style={styles.inputCard}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="직접 입력은 UI 예시용입니다"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
            <Text style={styles.inputHint}>
              직접 입력 UI는 열어두되, 생성은 preset sample 제목으로 통일했습니다.
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.buttonCell}>
              <AppButton
                onPress={() => {
                  void handleCreatePreset();
                }}
              >
                Create Sample
              </AppButton>
            </View>
            <View style={styles.buttonCell}>
              <AppButton
                onPress={() => {
                  void handleCreateDraft();
                }}
                disabled={!draft.trim()}
              >
                Create via UI
              </AppButton>
            </View>
          </View>

          <View style={styles.buttonRow}>
            <View style={styles.buttonCell}>
              <AppButton
                onPress={() => {
                  void todoListQuery.refetch();
                }}
              >
                Refetch List
              </AppButton>
            </View>
            <View style={styles.buttonCell}>
              <AppButton
                onPress={() => {
                  void showcaseActions.refetchTodos();
                }}
              >
                Invalidate List
              </AppButton>
            </View>
          </View>

          {todoListQuery.isLoading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color="#7C3AED" />
              <Text style={styles.loadingText}>Loading list...</Text>
            </View>
          ) : (
            todos.map((todo) => (
              <View key={todo.id} style={styles.todoCard}>
                <View style={styles.todoTextArea}>
                  <Text style={styles.todoTitle}>
                    {todo.done ? "Done" : "Pending"} · {todo.title}
                  </Text>
                  <Text style={styles.todoMeta}>
                    Updated: {formatDateLabel(todo.updatedAt)}
                  </Text>
                </View>

                <View style={styles.todoActions}>
                  <View style={styles.todoActionButton}>
                    <AppButton
                      onPress={() => {
                        void toggleTodoMutation.mutateAsync(todo.id);
                      }}
                    >
                      Toggle
                    </AppButton>
                  </View>
                  <View style={styles.todoActionButton}>
                    <AppButton
                      onPress={() => {
                        void deleteTodoMutation.mutateAsync(todo.id);
                      }}
                    >
                      Delete
                    </AppButton>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>3. Global Refresh Actions</Text>
          <Text style={styles.sectionBody}>
            화면은 쿼리키를 모르고, queries에서 감싼 액션만 사용합니다.
          </Text>

          <AppButton
            onPress={() => {
              void showcaseActions.refetchAll();
            }}
          >
            Invalidate All Showcase Queries
          </AppButton>
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#EEF2FF",
  },
  container: {
    padding: 20,
    gap: 16,
  },
  heroCard: {
    borderRadius: 24,
    backgroundColor: "#111827",
    padding: 20,
    gap: 8,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "800",
  },
  heroBody: {
    color: "#D1D5DB",
    fontSize: 14,
    lineHeight: 20,
  },
  card: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 18,
    gap: 14,
  },
  sectionTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "800",
  },
  sectionBody: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
  },
  statusBox: {
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    padding: 16,
    gap: 6,
  },
  statusLabel: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  statusSubText: {
    color: "#475569",
    fontSize: 14,
  },
  summaryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  summaryText: {
    borderRadius: 999,
    backgroundColor: "#EDE9FE",
    color: "#5B21B6",
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: "700",
  },
  inputCard: {
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    padding: 14,
    gap: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#0F172A",
    fontSize: 14,
    backgroundColor: "#FFFFFF",
  },
  inputHint: {
    color: "#64748B",
    fontSize: 12,
    lineHeight: 18,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  buttonCell: {
    flex: 1,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    gap: 10,
  },
  loadingText: {
    color: "#4B5563",
    fontSize: 14,
  },
  todoCard: {
    borderRadius: 18,
    backgroundColor: "#F8FAFC",
    padding: 14,
    gap: 12,
  },
  todoTextArea: {
    gap: 4,
  },
  todoTitle: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  todoMeta: {
    color: "#64748B",
    fontSize: 12,
  },
  todoActions: {
    flexDirection: "row",
    gap: 10,
  },
  todoActionButton: {
    flex: 1,
  },
});
