// [신규] src/features/sample/SampleScreen1.tsx

import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ArrowLeft from "@/shared/ui/assets/icon/arrow-left.svg";
import { PageLayout } from "@/shared/ui/component/layout";

const CHIPS = [
  "공기청정기",
  "멀티탭",
  "건전배터리",
  "폐기물 처리 업체",
  "다회용기 컵",
  "형광등",
  "종량제 봉투 직접 수",
  "건전지",
  "형광등",
  "부탄 배출 신고",
];

const LIST_ITEMS = [
  "에어컨",
  "에어컨 실외기",
  "인버터 에어컨",
  "에어컨 가이드",
  "에어컨 배출 방법",
];

export default function SampleScreen1() {
  const navigation = useNavigation();
  const [keyword, setKeyword] = useState("입력중");

  const filtered = useMemo(() => {
    const q = keyword.trim();
    if (!q) return LIST_ITEMS;
    return LIST_ITEMS.filter((v) => v.includes(q));
  }, [keyword]);

  return (
    <PageLayout
      headerState="content"
      topInsetMode="header"
      showBack={false}
      protectBottomInset
      headerHeight={52}
      headerContainerStyle={styles.headerArea}
      customHeader={
        <View style={styles.customHeaderWrap}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            hitSlop={8}
          >
            <ArrowLeft width={24} height={24} />
          </Pressable>

          <View style={styles.searchBox}>
            <TextInput
              value={keyword}
              onChangeText={setKeyword}
              style={styles.searchInput}
              placeholder="검색어를 입력하세요"
              returnKeyType="search"
            />
            {!!keyword && (
              <Pressable onPress={() => setKeyword("")} style={styles.clearButton}>
                <Text style={styles.clearText}>×</Text>
              </Pressable>
            )}
          </View>
        </View>
      }
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.chipWrap}>
          {CHIPS.map((chip, idx) => (
            <Pressable key={`${chip}-${idx}`} style={styles.chip}>
              <Text style={styles.chipText}>{chip}</Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.divider} />

        {filtered.map((item, idx) => (
          <View key={`${item}-${idx}`} style={styles.row}>
            <Text style={styles.rowText}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  headerArea: {
    backgroundColor: "#F6F6F6",
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D9D9D9",
  },
  customHeaderWrap: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  searchBox: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 18,
    backgroundColor: "#F8F8F8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1F2937",
    paddingVertical: 0,
  },
  clearButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#BDBDBD",
    alignItems: "center",
    justifyContent: "center",
  },
  clearText: {
    color: "#FFFFFF",
    fontSize: 14,
    lineHeight: 16,
    fontWeight: "700",
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  content: {
    paddingTop: 8,
    paddingBottom: 12,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: "#BFBFBF",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#FFFFFF",
  },
  chipText: {
    fontSize: 11,
    color: "#3A3A3A",
  },
  divider: {
    height: 8,
  },
  row: {
    minHeight: 48,
    justifyContent: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#D9D9D9",
    paddingHorizontal: 12,
  },
  rowText: {
    fontSize: 14,
    color: "#222222",
    fontWeight: "500",
  },
});
