export type ReactQueryTodo = {
  id: number;
  title: string;
  done: boolean;
  updatedAt: string;
};

let todoSequence = 4;

let mockTodos: ReactQueryTodo[] = [
  {
    id: 1,
    title: "Check backend health",
    done: true,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Create mutation sample",
    done: false,
    updatedAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Invalidate query after change",
    done: false,
    updatedAt: new Date().toISOString(),
  },
];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchReactQueryTodos(): Promise<ReactQueryTodo[]> {
  // [변경] 실제 CRUD 데모를 위한 mock API
  await wait(500);
  return [...mockTodos];
}

export async function createReactQueryTodo(
  title: string,
): Promise<ReactQueryTodo> {
  // [변경] 생성 mutation 데모
  await wait(400);

  const nextTodo: ReactQueryTodo = {
    id: todoSequence++,
    title,
    done: false,
    updatedAt: new Date().toISOString(),
  };

  mockTodos = [nextTodo, ...mockTodos];

  return nextTodo;
}

export async function toggleReactQueryTodo(id: number): Promise<ReactQueryTodo> {
  // [변경] 수정 mutation 데모
  await wait(350);

  const current = mockTodos.find((todo) => todo.id === id);

  if (!current) {
    throw new Error("Todo item not found.");
  }

  const nextTodo: ReactQueryTodo = {
    ...current,
    done: !current.done,
    updatedAt: new Date().toISOString(),
  };

  mockTodos = mockTodos.map((todo) => (todo.id === id ? nextTodo : todo));

  return nextTodo;
}

export async function deleteReactQueryTodo(id: number): Promise<number> {
  // [변경] 삭제 mutation 데모
  await wait(300);

  mockTodos = mockTodos.filter((todo) => todo.id !== id);

  return id;
}
