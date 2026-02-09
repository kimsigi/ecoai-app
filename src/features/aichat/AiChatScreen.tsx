import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
} from "react-native";
import { WebView } from "react-native-webview";

import { useAiChat } from "./useAiChat";
import AiChatViewHtml from "./AiChatView";
import { styles } from "./aiChat.style";

export default function AiChatScreen() {
  const { webViewRef, hydrate, handleWebMessage, sendUserMessage, bottomOffset} = useAiChat();
  const [input, setInput] = useState("");
  
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const onSend = () => {
    const value = input.trim();
    if (!value) return;

    sendUserMessage(value);
    setInput("");
  };

  return (
    <View style={styles.container}>
      {/* 채팅 영역 */}
      <WebView
        ref={webViewRef}
        source={{ html: AiChatViewHtml }}
        onMessage={(e) => handleWebMessage(e.nativeEvent.data)}
        originWhitelist={["*"]}
        showsVerticalScrollIndicator={false}
        style={styles.webView}
      />

      {/* 입력 바 (키보드 위로 이동) */}
      <View
        style={[
          styles.inputBar,
          { bottom: bottomOffset},
        ]}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력하세요"
          placeholderTextColor="#9ca3af"
          style={styles.input}
          multiline
        />

        <Pressable
          disabled={!input.trim()}
          style={[
            styles.sendButton,
            !input.trim() && styles.sendButtonDisabled,
          ]}
          onPress={onSend}
        >
          <Text style={styles.sendText}>전송</Text>
        </Pressable>
      </View>
    </View>
  );
}
