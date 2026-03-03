// [신규] src/features/sample/SampleScreen2.tsx

import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PageLayout } from "@/shared/ui/component/layout";

type TopItem = {
  label: string;
  icon: string;
};

type CategoryItem = {
  label: string;
};

const TOP_ITEMS: TopItem[] = [
  { label: "설정", icon: "🫧" },
  { label: "FAQ", icon: "🟢" },
  { label: "알림", icon: "🟣" },
  { label: "앱정보", icon: "🩷" },
];

const CATEGORY_ITEMS: CategoryItem[] = [
  { label: "재활용폐기물" },
  { label: "음식물류폐기물" },
  { label: "일반공정폐기물" },
];

export default function SampleScreen2() {
  const navigation = useNavigation();

  return (
    <PageLayout
      headerState="content"
      topInsetMode="header"
      showBack={false}
      protectBottomInset
      headerHeight={44}
      headerContainerStyle={styles.headerContainer}
      headerRight={
        <Pressable onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>×</Text>
        </Pressable>
      }
      contentContainerStyle={styles.contentContainer}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topMenuWrap}>
          {TOP_ITEMS.map((item, idx) => (
            <Pressable key={`${item.label}-${idx}`} style={styles.topMenuRow}>
              <View style={styles.leftRow}>
                <Text style={styles.menuIcon}>{item.icon}</Text>
                <Text style={styles.menuText}>{item.label}</Text>
              </View>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.categoryHeader}>
          <View style={styles.leftRow}>
            <Text style={styles.menuIcon}>✅</Text>
            <Text style={styles.menuText}>배출 품목 분류</Text>
          </View>
          <Text style={styles.chevronUp}>⌃</Text>
        </Pressable>

        <View style={styles.categoryList}>
          {CATEGORY_ITEMS.map((item, idx) => (
            <Pressable key={`${item.label}-${idx}`} style={styles.categoryRow}>
              <Text style={styles.categoryText}>{item.label}</Text>
              <Text style={styles.arrow}>→</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9D9D9",
    paddingHorizontal: 8,
  },
  closeButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 4,
  },
  closeText: {
    fontSize: 20,
    color: "#4B5563",
    lineHeight: 22,
  },

  contentContainer: {
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  content: {
    paddingBottom: 20,
  },

  topMenuWrap: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D9D9D9",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9D9D9",
  },
  topMenuRow: {
    minHeight: 56,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    justifyContent: "center",
    paddingHorizontal: 14,
  },

  categoryHeader: {
    minHeight: 56,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E7EB",
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  categoryList: {
    backgroundColor: "#E5E7EB",
    paddingTop: 6,
    paddingBottom: 6,
  },
  categoryRow: {
    minHeight: 44,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  leftRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  menuIcon: {
    fontSize: 14,
    width: 16,
    textAlign: "center",
  },
  menuText: {
    fontSize: 13,
    color: "#111827",
  },

  categoryText: {
    fontSize: 13,
    color: "#374151",
  },
  arrow: {
    fontSize: 14,
    color: "#374151",
  },
  chevronUp: {
    fontSize: 13,
    color: "#6B7280",
  },
});
