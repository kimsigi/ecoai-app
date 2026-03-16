import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { BottomSheet } from "@/shared/ui/component/bottomsheet";

export default function SheetFixedScreen() {
  const [open, setOpen] = useState(false);

  return (
    <PageLayout
      headerState="content"
      headerCenter="Sheet Fixed"
      showBack
      protectBottomInset
      contentContainerStyle={styles.page}
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          This sheet is intentionally fixed. No drag, no swipe close, and no
          backdrop dismiss.
        </Text>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>Open Fixed Sheet</Text>
        </Pressable>
      </View>

      <BottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Fixed Height Sheet"
        showCloseButton
        showHandle={false}
        heightMode="fixed"
        fixedHeight={360}
        enableGesture={false}
        enablePanDownToClose={false}
        enableBackdropDismiss={false}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Locked interaction variant</Text>
          <Text style={styles.sheetBody}>
            This sample is useful for critical acknowledgement or a short forced
            flow where the height and interaction must stay stable.
          </Text>

          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Behavior</Text>
            <Text style={styles.noticeText}>Gesture disabled</Text>
            <Text style={styles.noticeText}>Backdrop close disabled</Text>
            <Text style={styles.noticeText}>Only explicit action closes it</Text>
          </View>

          <Pressable style={styles.ctaButton} onPress={() => setOpen(false)}>
            <Text style={styles.ctaButtonText}>Confirm</Text>
          </Pressable>
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
    backgroundColor: "#DC2626",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  sheetContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 16,
  },
  sheetTitle: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "700",
  },
  sheetBody: {
    color: "#4B5563",
    fontSize: 15,
    lineHeight: 22,
  },
  notice: {
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    padding: 16,
    gap: 6,
  },
  noticeTitle: {
    color: "#B91C1C",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 2,
  },
  noticeText: {
    color: "#7F1D1D",
    fontSize: 14,
  },
  ctaButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#111827",
    alignItems: "center",
    justifyContent: "center",
  },
  ctaButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
