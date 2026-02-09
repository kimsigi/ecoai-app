import { create } from "zustand";
import { ChatMessage } from "./aiChat.type";
import { initialChatMessages } from "./aiChat.model";

type AiChatState = {
  messages: ChatMessage[];
  append: (msg: ChatMessage) => void;
  reset: () => void;
};

export const useAiChatStore = create<AiChatState>((set) => ({
  messages: initialChatMessages,
  append: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
  reset: () => set({ messages: [] }),
}));
