const AiChatViewHtml = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta
    name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0"
  />
  <style>
    * {
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    body {
      margin: 0;
      padding: 12px;
      font-family: -apple-system, BlinkMacSystemFont,
        "Apple SD Gothic Neo", Roboto, Helvetica, Arial, sans-serif;
      background-color: #eef4fb;
    }

    .chat {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .bubble {
      max-width: calc(100% - 16px);
      padding: 12px 14px;
      border-radius: 16px;
      font-size: 14px;
      line-height: 1.5;
      word-break: break-word;
    }

    .bubble.ai {
      align-self: flex-start;
      background-color: #ffffff;
      border-top-left-radius: 4px;
    }

    .bubble.user {
      align-self: flex-end;
      background-color: #2563eb;
      color: #ffffff;
      border-top-right-radius: 4px;
    }
  </style>
</head>

<body>
  <div id="chat" class="chat"></div>

  <script>
    const chatEl = document.getElementById("chat");
    let lastInnerHeight = window.innerHeight;

    let isKeyboardOpen = false;
    const EXTRA_KEYBOARD_GAP = 12;

    function func(type, payload) {
      window.ReactNativeWebView.postMessage(
        JSON.stringify({
          type,
          payload,
        })
      );
    }

    function appendMessage({ sender, html }) {
      const bubble = document.createElement("div");
      bubble.className = "bubble " + sender;
      bubble.innerHTML = html;
      chatEl.appendChild(bubble);
    }

    function scrollToBottom() {
      const el =
        document.scrollingElement || document.documentElement;
      if (!el) return;
      el.scrollTop = el.scrollHeight;
    }

    // 🔥 핵심: 키보드로 인한 viewport resize 감지
    window.addEventListener("resize", () => {
      const current = window.innerHeight;

      // 키보드 올라온 경우
      if (current < lastInnerHeight) {
        setTimeout(scrollToBottom, 50);
      }

      lastInnerHeight = current;
    });

    // RN → WebView 메시지
    document.addEventListener("message", (e) => {
      let data;
      try {
        data = JSON.parse(e.data);
      } catch {
        return;
      }

      if (data.type === "HYDRATE") {
        chatEl.innerHTML = "";
        data.messages.forEach(appendMessage);
        scrollToBottom();
      }

      if (data.type === "APPEND") {
        appendMessage(data);
        scrollToBottom();
      }

      if (data.type === "PADDING_UPDATE") {
        const EXTRA_KEYBOARD_GAP = 12; // 👈 여기서 UX 조절
        const base = data.paddingBottom || 0;
        
        document.body.style.paddingBottom = 
        isKeyboardOpen
        ? base + EXTRA_KEYBOARD_GAP + "px"
        : base + "px";
      }

      if (data.type === "KEYBOARD_SHOWN") {
        isKeyboardOpen = true;

        // resize 타이밍 보정
        setTimeout(scrollToBottom, 80);
      }

      if (data.type === "KEYBOARD_HIDDEN") {
        isKeyboardOpen = false;
      }
    });
  </script>
</body>
</html>
`;

export default AiChatViewHtml;
