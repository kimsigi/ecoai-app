import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { CommonBottomSheet } from "@/shared/ui/component/bottomsheet";

export default function SheetBasicScreen() {
  const [open, setOpen] = useState(false);

  return (
    <PageLayout
      headerState="content"
      headerCenter="Sheet Basic"
      showBack
      protectBottomInset
      contentContainerStyle={styles.page}
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          Content height starts naturally and can expand up to 80 percent.
        </Text>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>Open Basic Sheet</Text>
        </Pressable>
      </View>

      <CommonBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        title="Basic Bottom Sheet"
        showCloseButton
        heightMode="expandable"
      >
        <View style={styles.sheetContent}>
          <Text style={styles.sheetTitle}>Reusable default sheet</Text>
          <Text style={styles.sheetBody}>
            This sample opens at content height and still supports gesture
            expansion.
          </Text>

          <View style={styles.card}>
            <Text style={styles.cardLabel}>Use case</Text>
            <Text style={styles.cardText}>
              Quick summary, action menu, confirmation, or short form input.
            </Text>
          </View>

          <Pressable style={styles.ctaButton} onPress={() => setOpen(false)}>
            <Text style={styles.ctaButtonText}>Close</Text>
          </Pressable>
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
    backgroundColor: "#2563EB",
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
  card: {
    borderRadius: 16,
    backgroundColor: "#F3F6FB",
    padding: 16,
    gap: 8,
  },
  cardLabel: {
    color: "#1D4ED8",
    fontSize: 13,
    fontWeight: "700",
  },
  cardText: {
    color: "#374151",
    fontSize: 14,
    lineHeight: 20,
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
