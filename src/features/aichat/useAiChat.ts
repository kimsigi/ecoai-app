import { useCallback, useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardEvent,
  Platform,
  Dimensions,
} from "react-native";
import { WebView } from "react-native-webview";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAiChatStore } from "./aiChat.store";
import {
  ChatMessage,
  ChatMessageDraft,
  HtmlEventMessage,
} from "./aiChat.type";
import { handleAiChatAction } from "./aiChat.service";

/* ------------------------------------------------------------------ */
/* message helpers                                                    */
/* ------------------------------------------------------------------ */

function createMessage(draft: ChatMessageDraft): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random()}`,
    sender: draft.sender,
    html: draft.html,
  };
}

function createUserMessage(text: string): ChatMessage {
  return {
    id: `${Date.now()}-${Math.random()}`,
    sender: "user",
    html: `<div>${text}</div>`,
  };
}

/* ------------------------------------------------------------------ */
/* hook                                                               */
/* ------------------------------------------------------------------ */

export function useAiChat() {
  const webViewRef = useRef<WebView>(null);
  const { messages, append } = useAiChatStore();
  const insets = useSafeAreaInsets();

  /* ---------------- 키보드 높이 ---------------- */
  const INPUT_BAR_HEIGHT = 64;
  const EXTRA_SPACE = 12;

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {

    const onShow = (e: KeyboardEvent) => {
      if (Platform.OS !== "android") return;

      const screenHeight = Dimensions.get("window").height;
      const realHeight = screenHeight - e.endCoordinates.screenY;
      setKeyboardHeight(realHeight);

      webViewRef.current?.postMessage(
        JSON.stringify({ type: "KEYBOARD_SHOWN" })
      );
    };

    const onHide = () => {
      setKeyboardHeight(0);

      webViewRef.current?.postMessage(
        JSON.stringify({ type: "KEYBOARD_HIDDEN" })
      );
    };

    const showSub = Keyboard.addListener(
      Platform.OS === "android"
        ? "keyboardDidShow"
        : "keyboardWillShow",
      onShow
    );

    const hideSub = Keyboard.addListener(
      Platform.OS === "android"
        ? "keyboardDidHide"
        : "keyboardWillHide",
      onHide
    );

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  /**
   * AppLayout에서 이미 bottom inset을 먹였으므로 상쇄
   */
  const bottomOffset =
    keyboardHeight > 0
      ? Math.max(0, keyboardHeight - insets.bottom)
      : 0;

  /** WebView 스크롤 영역 보호용 padding */
  const webViewPaddingBottom =
    keyboardHeight > 0
      ? INPUT_BAR_HEIGHT + bottomOffset - EXTRA_SPACE
      : INPUT_BAR_HEIGHT;

  /** WebView에 padding 값 전달 */
  useEffect(() => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: "PADDING_UPDATE",
        paddingBottom: webViewPaddingBottom,
      })
    );
  }, [webViewPaddingBottom]);

  /**
   * Screen mount 시 전체 메시지 주입
   */
  const hydrate = useCallback(() => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: "HYDRATE",
        messages,
      })
    );
  }, [messages]);

  /**
   * WebView에 단건 메시지 추가
   */
  const appendToWebView = (msg: ChatMessage) => {
    webViewRef.current?.postMessage(
      JSON.stringify({
        type: "APPEND",
        html: msg.html,
        sender: msg.sender,
      })
    );
  };

  /**
   * WebView → RN 이벤트 처리
   */
  const handleWebMessage = (raw: string) => {
    const event: HtmlEventMessage = JSON.parse(raw);

    const drafts = handleAiChatAction(event.type, event.payload);

    drafts.forEach((draft) => {
      const msg = createMessage(draft);
      append(msg);
      appendToWebView(msg);
    });
  };

  /**
   * 사용자 입력 처리
   */
  const sendUserMessage = (text: string) => {
    const msg = createUserMessage(text);
    append(msg);
    appendToWebView(msg);
  };

  return {
    /* refs */
    webViewRef,

    /* actions */
    hydrate,
    handleWebMessage,
    sendUserMessage,

    /* ui state (Screen에서 사용) */
    keyboardHeight,
    bottomOffset,
    webViewPaddingBottom,
  };
}
