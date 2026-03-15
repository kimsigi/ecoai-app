import { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./queryClient";

export default function QueryProvider({ children }: PropsWithChildren) {
  return (
    // react-query 전역 Provider
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
