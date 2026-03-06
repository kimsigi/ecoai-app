// src/features/showcase/MenuLayerOverlay.tsx
// [완성본] PageLayout 포함 화면 + 헤더 햄버거 클릭 시 오버레이 + 서브메뉴 active 표시

import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ROUTES, StackParamList } from "@/app/app.route";
import { AppIcon } from "@/shared/ui/component/icon";

const TOP_MENUS = [
  { key: "setting", label: "설정", icon: "setting" },
  { key: "faq", label: "FAQ", icon: "faq"},
  { key: "notice", label: "알림", icon: "notice"},
  { key: "appinfo", label: "앱정보", icon: "appinfo"},
] as const;

const SUB_MENUS = ["재활용폐기물", "음식물류폐기물", "일반공정폐기물"];

export function MenuLayerOverlay() {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // [추가]
  const [isCategoryOpen, setIsCategoryOpen] = useState(true); // [추가]
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null); // [추가]

  const chevron = useMemo(() => (isCategoryOpen ? "⌃" : "⌄"), [isCategoryOpen]);
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  const onPressSubMenu = (item: string) => {
    setActiveSubMenu(item); // [추가] 선택한 서브메뉴 active
    // 필요하면 여기서 페이지 이동 추가
    navigation.push(ROUTES.SUBITEM);
  };

  return (
    <PageLayout
      headerState="content"
      showBack
      headerCenter={<Text style={styles.headerTitle}>메뉴 오버레이 샘플</Text>}
      headerRight={
        <Pressable style={styles.headerIconBtn} onPress={() => setIsMenuOpen(true)}>
            <AppIcon name="menu" size={24} />
        </Pressable>
      }
      statusBarStyle="dark-content"
      contentContainerStyle={styles.screen}
    >
      <View style={styles.screen}>
        <Text style={styles.bodyText}>헤더 햄버거를 누르면 메뉴가 뜹니다.</Text>
      </View>

      {isMenuOpen && (
        <View style={styles.overlayRoot}>
          <Pressable style={styles.backdrop} onPress={() => setIsMenuOpen(false)} />

          <View style={styles.menuPanel}>
            <View style={styles.menuTopBar}>
              <Pressable style={styles.closeBtn} onPress={() => setIsMenuOpen(false)}>
                <Text style={styles.closeTxt}>×</Text>
              </Pressable>
            </View>

            {TOP_MENUS.map((menu) => (
              <Pressable key={menu.key} style={styles.topRow}>
                <AppIcon name={menu.icon} style={styles.dot} />
                <Text style={styles.topRowTxt}>{menu.label}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.categoryRow} onPress={() => setIsCategoryOpen((p) => !p)}>
              <View style={styles.categoryLeft}>
                <View style={[styles.dot, { backgroundColor: "#8AD39C" }]} />
                <Text style={styles.categoryTxt}>배출 품목 분류</Text>
              </View>
              <Text style={styles.chevron}>{chevron}</Text>
            </Pressable>

            {isCategoryOpen && (
              <View style={styles.subWrap}>
                {SUB_MENUS.map((item) => {
                  const active = activeSubMenu === item;
                  return (
                    <Pressable
                      key={item}
                      style={[styles.subRow, active && styles.subRowActive]}
                      onPress={() => onPressSubMenu(item)}
                    >
                      <Text style={[styles.subTxt, active && styles.subTxtActive]}>{item}</Text>
                      <Text style={[styles.subArrow, active && styles.subArrowActive]}>
                        {active ? "✓" : "→"}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      )}
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },
  bodyText: {
    color: "#4B5563",
    fontSize: 14,
  },

  headerTitle: {
    color: "#111827",
    fontSize: 16,
    fontWeight: "700",
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  overlayRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.08)",
  },

  menuPanel: {
    width: "100%",
    backgroundColor: "#F4F4F4",
    borderRightWidth: 1,
    borderColor: "#E5E7EB",
  },
  menuTopBar: {
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
    paddingHorizontal: 14,
  },
  closeBtn: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  closeTxt: {
    fontSize: 24,
    color: "#4B5563",
    lineHeight: 24,
  },

  topRow: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
    backgroundColor: "#F4F4F4",
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  topRowTxt: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "500",
  },

  categoryRow: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#DEDEDE",
    backgroundColor: "#F4F4F4",
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryTxt: {
    color: "#111827",
    fontSize: 14,
    fontWeight: "600",
  },
  chevron: {
    color: "#4B5563",
    fontSize: 16,
  },

  subWrap: {
    backgroundColor: "#E5E7EB",
    paddingVertical: 6,
  },
  subRow: {
    minHeight: 44,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  subRowActive: {
    backgroundColor: "#D9E3FF",
  },
  subTxt: {
    color: "#374151",
    fontSize: 14,
  },
  subTxtActive: {
    color: "#1F3C8F",
    fontWeight: "700",
  },
  subArrow: {
    color: "#374151",
    fontSize: 16,
  },
  subArrowActive: {
    color: "#2F57E5",
    fontWeight: "700",
  },
});
