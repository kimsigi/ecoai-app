import React, { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";
import { AppLottie } from "@/shared/ui/component/lottie";
import { COLOR } from "@/shared/ui/token";

const CATEGORIES = [
  "일반쓰레기",
  "음식물쓰레기",
  "재활용품",
  "지정폐기물",
  "분리수거",
  "기타항목1",
  "기타항목2",
  "기타항목3",
  "기타항목4",
  "기타항목5",
  "기타항목6",
  "기타항목7",
];

const ITEMS = [
  { id: "1", name: "게껍데기", icon: "🦀" },
  { id: "2", name: "가지", icon: "🍆" },
  { id: "3", name: "계란껍질", icon: "🥚" },
  { id: "4", name: "감자껍질", icon: "🥔" },
];

export default function CategoryScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [keyword, setKeyword] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("1");

  const [notification] = useState(true);

  const filteredItems = useMemo(() => {
    const q = keyword.trim();
    if (!q) return ITEMS;
    return ITEMS.filter((v) => v.name.includes(q));
  }, [keyword]);

  return (
    <PageLayout
        back      
        title="생활폐기물"
        right={[
                {
                    icon: notification ? (
                        <AppLottie name="notificationActive" size={24} scale={1.2} />
                    ) : (
                        <AppIcon name="notificationInactive" size={24} />
                    ),
                    //onPress: onNotificationPress,
                },
                {
                    icon: <AppIcon name="menu" size={24} />,
                    //onPress: onMenuPress,
                },
            ]}
        statusBarStyle={{backgroundColor: COLOR.blue500}}
        headerStyle={{backgroundColor: COLOR.blue500}}
    >
      <View style={styles.screen}>
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: 110 + insets.bottom }, // [추가] 하단 고정 패널 높이만큼 여백
          ]}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryRow}
          >
            {CATEGORIES.map((category) => {
              const active = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[styles.categoryCard, active && styles.categoryCardActive]}
                >
                  <Text style={styles.categoryIcon}>🗑️</Text>
                  <Text style={[styles.categoryLabel, active && styles.categoryLabelActive]}>
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text style={styles.helperText}>
            “봉지, 나무젓품, 플라스틱 조각, 고무제품 등{"\n"}
            혼합용이 어려운 쓰레기는”
          </Text>

          <View style={styles.listCard}>
            <Text style={styles.cardTitle}>“세부 품목을 선택하여 배출 방법을 확인하세요”</Text>

            <View style={styles.searchBox}>
                <AppIcon name="search" size={16} />
              <TextInput
                value={keyword}
                onChangeText={setKeyword}
                placeholder="세부 품목명으로 검색"
                style={styles.searchInput}
              />
            </View>

            <View style={styles.itemList}>
              {filteredItems.map((item) => {
                const active = item.id === selectedItemId;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setSelectedItemId(item.id)}
                    style={[styles.itemRow, active && styles.itemRowActive]}
                  >
                    <Text style={styles.itemIcon}>{item.icon}</Text>
                    <Text style={styles.itemText}>{item.name}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </ScrollView>

        {/* [추가] 하단 고정 확인 패널 */}
        <View style={[styles.bottomPrompt, { paddingBottom: 10 + insets.bottom }]}>
          <Text style={styles.bottomPromptText}>개별 대기의 배출 방법을 확인할까요?</Text>

          <View style={styles.bottomActionRow}>
            <Pressable style={styles.noButton}>
              <Text style={styles.noButtonText}>아니요</Text>
            </Pressable>

            <Pressable style={styles.fingerBtn}>
              <Text style={styles.fingerEmoji}>👆</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  statusBarArea: {
    backgroundColor: COLOR.blue500,
  },
  headerContainer: {
    backgroundColor: COLOR.blue500,
  },
  contentContainer: {
    backgroundColor: COLOR.blue500,
  },

  screen: {
    flex: 1,
    backgroundColor: COLOR.blue500,
  },
  scrollContent: {
    paddingTop: 8,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  headerRightRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingRight: 10,
  },
  headerIconBtn: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  categoryRow: {
    paddingHorizontal: 10,
    gap: 8,
  },
  categoryCard: {
    width: 68,
    height: 68,
    borderRadius: 10,
    backgroundColor: "#EEF3FF",
    borderWidth: 1,
    borderColor: "#D8E2FF",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 2,
  },
  categoryCardActive: {
    borderColor: "#7FA2FF",
    backgroundColor: "#FFFFFF",
  },
  categoryIcon: {
    fontSize: 24,
  },
  categoryLabel: {
    marginTop: 4,
    fontSize: 10,
    color: "#1F3C8F",
    fontWeight: "600",
  },
  categoryLabelActive: {
    color: "#2F57E5",
  },

  helperText: {
    marginTop: 10,
    marginHorizontal: 16,
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 11,
    lineHeight: 15,
  },

  listCard: {
    marginTop: 12,
    marginHorizontal: 10,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D7E2FF",
    backgroundColor: "#F8FBFF",
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 14,
  },
  cardTitle: {
    textAlign: "center",
    color: "#2C2C2C",
    fontSize: 12,
    fontWeight: "700",
    marginBottom: 10,
  },

  searchBox: {
    height: 38,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#D7DDE8",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: "#374151",
    paddingVertical: 0,
  },

  itemList: {
    marginTop: 8,
    gap: 8,
  },
  itemRow: {
    minHeight: 54,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CDD5E1",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 10,
  },
  itemRowActive: {
    borderColor: "#4D7CFE",
    backgroundColor: "#EEF4FF",
  },
  itemIcon: {
    fontSize: 24,
  },
  itemText: {
    fontSize: 14,
    color: "#1F2937",
    fontWeight: "600",
  },

  bottomPrompt: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    borderColor: "#D9E1F5",
    backgroundColor: "#FFFFFFF2",
    paddingTop: 10,
    paddingHorizontal: 14,
  },
  bottomPromptText: {
    textAlign: "center",
    color: "#2F57E5",
    fontSize: 13,
    fontWeight: "600",
  },
  bottomActionRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  noButton: {
    width: 84,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#2F57E5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  noButtonText: {
    color: "#2F57E5",
    fontSize: 13,
    fontWeight: "700",
  },
  fingerBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2F57E5",
  },
  fingerEmoji: {
    fontSize: 18,
  },
});
