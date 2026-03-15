import { useMemo, useState } from "react";
import { Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import WebView from "react-native-webview";
import { PageLayout } from "@/shared/ui/component/layout";
import { CommonBottomSheet } from "@/shared/ui/component/bottomsheet";

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function SheetWebViewScreen() {
  const [open, setOpen] = useState(false);

  const html = useMemo(
    () => `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, sans-serif;
              margin: 0;
              padding: 24px 20px 40px;
              color: #1f2937;
              background: #ffffff;
            }
            h1 { margin: 0 0 12px; font-size: 24px; }
            p { margin: 0 0 16px; line-height: 1.6; }
            .card {
              margin-bottom: 16px;
              border-radius: 16px;
              padding: 16px;
              background: #f3f6fb;
            }
          </style>
        </head>
        <body>
          <h1>WebView Sheet</h1>
          <p>This sample keeps the sheet at a stable height while the web content scrolls inside.</p>
          <div class="card">Useful for terms, notices, guide pages, and embedded documents.</div>
          <div class="card">WebView works more predictably when the sheet height stays fixed.</div>
          <div class="card">You can still keep gesture close enabled while maintaining a stable layout.</div>
        </body>
      </html>
    `,
    [],
  );

  return (
    <PageLayout
      headerState="content"
      headerCenter="Sheet WebView"
      showBack
      protectBottomInset
      contentContainerStyle={styles.page}
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          WebView content is easier to control with a stable fixed-height sheet.
        </Text>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>Open WebView Sheet</Text>
        </Pressable>
      </View>

      <CommonBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Terms Preview"
        showCloseButton
        heightMode="fixed"
        fixedHeight={SCREEN_HEIGHT * 0.72}
      >
        <View style={styles.webviewWrap}>
          <WebView source={{ html }} style={styles.webview} />
        </View>
      </CommonBottomSheet>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F7F8FB",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  description: {
    color: "#4B5563",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  button: {
    height: 52,
    borderRadius: 16,
    backgroundColor: "#0F766E",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  webviewWrap: {
    height: SCREEN_HEIGHT * 0.62,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
