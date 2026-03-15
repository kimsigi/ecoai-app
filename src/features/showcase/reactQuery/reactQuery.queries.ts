import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  addReactQueryTodo,
  getReactQueryHealthSummary,
  getReactQueryTodoList,
  removeReactQueryTodoById,
  toggleReactQueryTodoById,
} from "./reactQuery.service";
import { ReactQueryTodo } from "./reactQuery.api";

const reactQueryShowcaseKeys = {
  health: ["showcase", "reactQuery", "health"] as const,
  todos: ["showcase", "reactQuery", "todos"] as const,
};

export function useReactQueryHealthQuery() {
  return useQuery({
    // [변경] 쿼리키는 queries 내부에서만 관리
    queryKey: reactQueryShowcaseKeys.health,
    queryFn: getReactQueryHealthSummary,
  });
}

export function useReactQueryTodoListQuery() {
  return useQuery({
    // [변경] 목록 조회 캐시
    queryKey: reactQueryShowcaseKeys.todos,
    queryFn: getReactQueryTodoList,
  });
}

export function useCreateReactQueryTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    // [변경] 생성 후 목록을 무효화해서 재조회
    mutationFn: addReactQueryTodo,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: reactQueryShowcaseKeys.todos,
      });
    },
  });
}

export function useToggleReactQueryTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: toggleReactQueryTodoById,
    // [변경] 수정은 낙관적 업데이트로 캐시를 먼저 반영
    onMutate: async (id) => {
      await queryClient.cancelQueries({
        queryKey: reactQueryShowcaseKeys.todos,
      });

      const previousTodos = queryClient.getQueryData<ReactQueryTodo[]>(
        reactQueryShowcaseKeys.todos,
      );

      queryClient.setQueryData<ReactQueryTodo[]>(
        reactQueryShowcaseKeys.todos,
        (currentTodos = []) =>
          currentTodos.map((todo) =>
            todo.id === id
              ? {
                  ...todo,
                  done: !todo.done,
                  updatedAt: new Date().toISOString(),
                }
              : todo,
          ),
      );

      return { previousTodos };
    },
    onError: (_error, _id, context) => {
      if (context?.previousTodos) {
        queryClient.setQueryData(
          reactQueryShowcaseKeys.todos,
          context.previousTodos,
        );
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({
        queryKey: reactQueryShowcaseKeys.todos,
      });
    },
  });
}

export function useDeleteReactQueryTodoMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeReactQueryTodoById,
    // [변경] 삭제는 캐시에서 바로 제거한 뒤 서버 결과와 동기화
    onSuccess: async (deletedId) => {
      queryClient.setQueryData<ReactQueryTodo[]>(
        reactQueryShowcaseKeys.todos,
        (currentTodos = []) =>
          currentTodos.filter((todo) => todo.id !== deletedId),
      );

      await queryClient.invalidateQueries({
        queryKey: reactQueryShowcaseKeys.todos,
      });
    },
  });
}

export function useReactQueryShowcaseActions() {
  const queryClient = useQueryClient();

  return {
    refetchHealth: async () => {
      await queryClient.invalidateQueries({
        queryKey: reactQueryShowcaseKeys.health,
      });
    },
    refetchTodos: async () => {
      await queryClient.invalidateQueries({
        queryKey: reactQueryShowcaseKeys.todos,
      });
    },
    refetchAll: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["showcase", "reactQuery"],
      });
    },
  };
}
