import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  /* 전체 화면 */
  container: {
    flex: 1,
    backgroundColor: "#eef4fb",
  },

  /* WebView는 절대 움직이지 않음 */
  webView: {
    flex: 1,
    backgroundColor: "transparent",
  },

  /* 입력 바 (absolute 고정) */
  inputBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 12,
    paddingVertical: 8,

    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },

  /* 입력창 */
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 96,

    paddingHorizontal: 14,
    paddingVertical: 8,

    backgroundColor: "#f3f4f6",
    borderRadius: 20,

    fontSize: 14,
    color: "#111827",
  },

  /* 전송 버튼 */
  sendButton: {
    marginLeft: 8,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 20,

    backgroundColor: "#2563eb",
    justifyContent: "center",
    alignItems: "center",
  },

  sendButtonDisabled: {
    backgroundColor: "#9ca3af",
  },

  sendText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
  },
});
