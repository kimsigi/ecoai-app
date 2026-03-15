import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import {
  BottomSheetHeader,
  BottomSheetScrollContent,
  CommonBottomSheet,
} from "@/shared/ui/component/bottomsheet";

type Item = {
  id: number;
  title: string;
  description: string;
};

export default function SheetAsyncScreen() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    if (!open) {
      setLoading(false);
      setItems([]);
      return;
    }

    setLoading(true);

    const timer = setTimeout(() => {
      setItems([
        {
          id: 1,
          title: "Collection schedule",
          description: "Pickup available tomorrow between 9:00 and 12:00.",
        },
        {
          id: 2,
          title: "Expected fee",
          description: "Estimated cost is 12,000 KRW based on current size.",
        },
        {
          id: 3,
          title: "Guide",
          description: "Place the item near the entrance before the driver arrives.",
        },
      ]);
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, [open]);

  const header = useMemo(
    () => (
      <BottomSheetHeader
        title="Async Detail Sheet"
        showCloseButton
        onClose={() => setOpen(false)}
      />
    ),
    [],
  );

  return (
    <PageLayout
      headerState="content"
      headerCenter="Sheet Async"
      showBack
      protectBottomInset
      contentContainerStyle={styles.page}
    >
      <View style={styles.container}>
        <Text style={styles.description}>
          Header stays fixed while only the lower content changes after a fake
          API load.
        </Text>

        <Pressable style={styles.button} onPress={() => setOpen(true)}>
          <Text style={styles.buttonText}>Open Async Sheet</Text>
        </Pressable>
      </View>

      <CommonBottomSheet
        open={open}
        onClose={() => setOpen(false)}
        header={header}
        heightMode="expandable"
      >
        <BottomSheetScrollContent contentContainerStyle={styles.scrollContent}>
          {loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color="#2563EB" />
              <Text style={styles.loadingText}>Loading sheet data...</Text>
            </View>
          ) : (
            items.map((item) => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.description}</Text>
              </View>
            ))
          )}
        </BottomSheetScrollContent>
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
    backgroundColor: "#7C3AED",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  scrollContent: {
    paddingTop: 16,
    paddingBottom: 28,
  },
  loadingWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    color: "#4B5563",
    fontSize: 14,
  },
  card: {
    borderRadius: 16,
    backgroundColor: "#F9FAFB",
    padding: 16,
    marginBottom: 12,
    gap: 8,
  },
  cardTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  cardBody: {
    color: "#4B5563",
    fontSize: 14,
    lineHeight: 20,
  },
});
