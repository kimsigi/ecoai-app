export type ChatSender = "ai" | "user";

/**
 * Store에 저장되는 최종 메시지
 */
export type ChatMessage = {
  id: string;
  sender: ChatSender;
  html: string;
};

/**
 * Service가 반환하는 메시지 초안 (id 없음)
 */
export type ChatMessageDraft = {
  sender: ChatSender;
  html: string;
};

/**
 * HTML에서 func로 넘어오는 이벤트 타입
 */
export type FuncEventType =
  | "ADDRESS"
  | "PHONE"
  | "URL"
  | "ROUTE";

/**
 * func payload (타입별 필요한 값만 들어감)
 */
export type FuncPayload = Record<string, string>;

/**
 * WebView → RN 메시지
 */
export type HtmlEventMessage = {
  type: FuncEventType;
  payload: FuncPayload;
};



export type AiChatEventType =
  | "CALL"
  | "COPY"
  | "URL"
  | "YES"
  | "NO";

export interface AiChatEvent {
  type: AiChatEventType;
  payload?: any;
}