import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import WebView from "react-native-webview";
import { PageLayout } from "@/shared/ui/component/layout";
import {
  BottomSheetHeader,
  BottomSheetScrollContent,
  BottomSheet,
} from "@/shared/ui/component/bottomsheet";

type SheetExample =
  | "fitGesture"
  | "fitLocked"
  | "fixedClose"
  | "fixedNoHandle"
  | "asyncHeader"
  | "webview";

export default function SheetPlaygroundScreen() {
  const [selected, setSelected] = useState<SheetExample | null>(null);
  const [loading] = useState(false);

  const open = (type: SheetExample) => setSelected(type);
  const close = () => setSelected(null);

  const asyncHeader = useMemo(() => {
    return (
      <BottomSheetHeader
        title="Async Header"
        showCloseButton
        onClose={close}
      />
    );
  }, []);

  return (
    <PageLayout
      headerState="content"
      headerCenter="Sheet Playground"
      showBack
      protectBottomInset
      contentContainerStyle={styles.page}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>BottomSheet Cases</Text>
        <Text style={styles.description}>
          Open each example from a single screen.
        </Text>

        <Pressable style={styles.button} onPress={() => open("fitGesture")}>
          <Text style={styles.buttonText}>Auto height + gesture</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => open("fitLocked")}>
          <Text style={styles.buttonText}>Auto height + locked</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => open("fixedClose")}>
          <Text style={styles.buttonText}>Fixed height + close button</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => open("fixedNoHandle")}>
          <Text style={styles.buttonText}>Fixed height + no handle</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => open("asyncHeader")}>
          <Text style={styles.buttonText}>Sticky header + async body</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => open("webview")}>
          <Text style={styles.buttonText}>WebView sheet</Text>
        </Pressable>
      </ScrollView>

      <BottomSheet
        open={selected === "fitGesture"}
        onClose={close}
        title="Auto height + gesture"
        showCloseButton
        heightMode="fitContent"
        enableGesture
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Fit content sheet</Text>
          <Text style={styles.sheetText}>
            The sheet opens to its content height and can still be dismissed by
            gesture.
          </Text>
        </View>
      </BottomSheet>

      <BottomSheet
        open={selected === "fitLocked"}
        onClose={close}
        title="Auto height + locked"
        showCloseButton
        showHandle={false}
        heightMode="fitContent"
        enableGesture={false}
        enablePanDownToClose={false}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Fit content only</Text>
          <Text style={styles.sheetText}>
            The height follows the content, but drag interactions are disabled.
          </Text>
        </View>
      </BottomSheet>

      <BottomSheet
        open={selected === "fixedClose"}
        onClose={close}
        title="Fixed height + close button"
        showCloseButton
        showHandle={false}
        heightMode="fixed"
        fixedHeight={380}
        enableGesture={false}
        enablePanDownToClose={false}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Fixed size sheet</Text>
          <Text style={styles.sheetText}>
            This one uses a fixed height and closes from the header button.
          </Text>
        </View>
      </BottomSheet>

      <BottomSheet
        open={selected === "fixedNoHandle"}
        onClose={close}
        title="Fixed height + no handle"
        showCloseButton
        showHandle={false}
        heightMode="fixed"
        fixedHeight={420}
        enableGesture={false}
        enablePanDownToClose={false}
        enableBackdropDismiss={false}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Locked fixed sheet</Text>
          <Text style={styles.sheetText}>
            No handle, no drag, and no backdrop dismiss.
          </Text>

          <View style={styles.noticeBox}>
            <Text style={styles.noticeText}>Gesture: off</Text>
            <Text style={styles.noticeText}>Handle: hidden</Text>
            <Text style={styles.noticeText}>Close button: on</Text>
          </View>
        </View>
      </BottomSheet>

      <BottomSheet
        open={selected === "asyncHeader"}
        onClose={close}
        header={asyncHeader}
        heightMode="expandable"
      >
        <BottomSheetScrollContent contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.sheetText}>Loading...</Text>
            </View>
          ) : (
            <>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Pickup Window</Text>
                <Text style={styles.cardText}>Tomorrow, 9:00 AM - 12:00 PM</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Estimated Cost</Text>
                <Text style={styles.cardText}>12,000 KRW</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Guide</Text>
                <Text style={styles.cardText}>
                  Leave the item near the entrance before arrival.
                </Text>
              </View>
            </>
          )}
        </BottomSheetScrollContent>
      </BottomSheet>

      <BottomSheet
        open={selected === "webview"}
        onClose={close}
        title="WebView sheet"
        showCloseButton
        heightMode="fixed"
        fixedHeight={520}
      >
        <View style={styles.webviewWrap}>
          <WebView
            source={{
              html: `
                <html>
                  <body style="font-family: sans-serif; padding: 20px;">
                    <h2>WebView Sample</h2>
                    <p>This is a simple embedded page inside the sheet.</p>
                    <p>Fixed height is usually the most stable option here.</p>
                  </body>
                </html>
              `,
            }}
            style={styles.webview}
          />
        </View>
      </BottomSheet>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#F7F8FB",
  },
  container: {
    padding: 20,
    gap: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
    marginBottom: 8,
  },
  button: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#2563EB",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 14,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  sheetText: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4B5563",
  },
  noticeBox: {
    borderRadius: 16,
    backgroundColor: "#F3F4F6",
    padding: 16,
    gap: 6,
  },
  noticeText: {
    fontSize: 14,
    color: "#374151",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    padding: 16,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#4B5563",
  },
  webviewWrap: {
    height: 440,
    overflow: "hidden",
  },
  webview: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});
