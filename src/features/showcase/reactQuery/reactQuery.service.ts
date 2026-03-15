import { checkNetwork } from "@/app/app.service";
import {
  createReactQueryTodo,
  deleteReactQueryTodo,
  fetchReactQueryTodos,
  ReactQueryTodo,
  toggleReactQueryTodo,
} from "./reactQuery.api";

export type ReactQueryHealthSummary = {
  isOnline: boolean;
  checkedAt: string;
  label: string;
};

export async function getReactQueryHealthSummary(): Promise<ReactQueryHealthSummary> {
  // [변경] app.service.ts를 통해 실제 네트워크 체크 예시 제공
  const isOnline = await checkNetwork();

  return {
    isOnline,
    checkedAt: new Date().toISOString(),
    label: isOnline ? "Server is reachable" : "Server is unavailable",
  };
}

export async function getReactQueryTodoList(): Promise<ReactQueryTodo[]> {
  // [변경] service에서 조회 결과를 화면 표시용으로 정렬
  const todos = await fetchReactQueryTodos();

  return [...todos].sort((left, right) => right.id - left.id);
}

export async function addReactQueryTodo(params: {
  index: number;
  title?: string;
}): Promise<ReactQueryTodo> {
  // [변경] 입력 제목이 있으면 사용하고 없으면 샘플 제목을 생성
  const nextTitle = params.title?.trim() || `Query demo item ${params.index}`;

  return createReactQueryTodo(nextTitle);
}

export async function toggleReactQueryTodoById(
  id: number,
): Promise<ReactQueryTodo> {
  return toggleReactQueryTodo(id);
}

export async function removeReactQueryTodoById(id: number): Promise<number> {
  return deleteReactQueryTodo(id);
}
