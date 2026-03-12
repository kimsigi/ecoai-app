import React, { useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";
import { AppLottie } from "@/shared/ui/component/lottie";

type SheetMode = "single" | "multi" | "fail";

const MULTI_TAGS = ["냉장고", "에어컨", "식기세척기", "캐비닛", "세탁기", "건조기", "전기히터"];

export default function BottomSheet() {
  const insets = useSafeAreaInsets();

  const [mode, setMode] = useState<SheetMode>("single"); // [추가]
  const [open, setOpen] = useState(false); // [추가]

  const progress = useRef(new Animated.Value(0)).current; // [추가]

  const openSheet = () => {
    setOpen(true);
    Animated.timing(progress, {
      toValue: 1,
      duration: 220,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const closeSheet = () => {
    Animated.timing(progress, {
      toValue: 0,
      duration: 180,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) setOpen(false);
    });
  };

  const sheetTranslateY = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [380, 0],
  });

  const sheetOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const title = useMemo(() => {
    if (mode === "single") return "냉장고를 인식하였습니다.";
    if (mode === "multi") return "냉장고를 인식하였습니다.";
    return "인식할 수 없습니다.";
  }, [mode]);

  return (
    <PageLayout
        back
        title="바텀시트"
    >
      <View style={styles.root}>
        {/* 카메라 프리뷰 목업 */}
        <View style={styles.preview}>
          <View style={styles.topOverlay}>
            <Pressable style={styles.backBtn}>
                <AppIcon name="chevronLeft" size={22} />
            </Pressable>
          </View>

          <View style={styles.frameBox}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>

          <View style={styles.bottomBar}>
            <Pressable style={styles.searchBarMock}>
                <AppIcon name="search" size={16} />
              <Text style={styles.searchBarText}>어떻게 배출해야 할까?</Text>
            </Pressable>
            <Pressable style={styles.aiChip}>
                <AppLottie name="winkingFace" size={14} />
              <Text style={styles.aiChipText}>AI인식</Text>
            </Pressable>
          </View>
        </View>

        {/* 샘플 버튼: 촬영 -> 바텀시트 오픈 */}
        <View style={styles.sampleControls}>
          <Pressable style={styles.modeBtn} onPress={() => setMode("single")}>
            <Text style={styles.modeBtnText}>단건</Text>
          </Pressable>
          <Pressable style={styles.modeBtn} onPress={() => setMode("multi")}>
            <Text style={styles.modeBtnText}>다건</Text>
          </Pressable>
          <Pressable style={styles.modeBtn} onPress={() => setMode("fail")}>
            <Text style={styles.modeBtnText}>실패</Text>
          </Pressable>
          <Pressable style={styles.captureBtn} onPress={openSheet}>
            <AppIcon name="cameraEntry" size={26} />
            <Text style={styles.captureText}>촬영(시트 열기)</Text>
          </Pressable>
        </View>

        {/* 바텀시트 */}
        {open && (
          <>
            <Pressable style={styles.backdrop} onPress={closeSheet} />
            <Animated.View
              style={[
                styles.sheet,
                {
                  paddingBottom: Math.max(insets.bottom, 12),
                  opacity: sheetOpacity,
                  transform: [{ translateY: sheetTranslateY }],
                },
              ]}
            >
              <View style={styles.handle} />

              <Text style={styles.sheetTitle}>{title}</Text>

              <Text style={styles.desc}>
                화면은 전문적인 스테인리스 조리대, 환기 후드, 가스레인지 등으로 구성되어 있습니다.
              </Text>

              {mode === "multi" && (
                <View style={styles.tagWrap}>
                  {MULTI_TAGS.map((t) => (
                    <View key={t} style={styles.tag}>
                      <Text style={styles.tagText}>{t}</Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.questionBox}>
                <Text style={styles.question}>이대로 배출 방법을 확인할까요?</Text>
                <View style={styles.actionRow}>
                  <Pressable style={styles.grayBtn} onPress={closeSheet}>
                    <Text style={styles.grayBtnText}>{mode === "fail" ? "다른 방법으로 찾기" : "재촬영"}</Text>
                  </Pressable>
                  <Pressable style={styles.blueBtn} onPress={closeSheet}>
                    <Text style={styles.blueBtnText}>예</Text>
                  </Pressable>
                </View>
              </View>
            </Animated.View>
          </>
        )}
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#E9EDF5" },

  preview: { flex: 1, backgroundColor: "#D9DDE5" },

  topOverlay: {
    height: 44,
    justifyContent: "center",
    paddingHorizontal: 8,
    backgroundColor: "rgba(120,120,120,0.35)",
  },
  backBtn: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  frameBox: {
    ...StyleSheet.absoluteFillObject,
    top: 56,
    bottom: 112,
    left: 14,
    right: 14,
  },
  corner: {
    position: "absolute",
    width: 60,
    height: 60,
    borderColor: "#FFFFFF",
  },
  tl: { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  tr: { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  bl: { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  br: { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },

  bottomBar: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  searchBarMock: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderWidth: 1,
    borderColor: "#D8D8D8",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    gap: 6,
  },
  searchBarText: { color: "#6B7280", fontSize: 13 },
  aiChip: {
    height: 34,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#95A6F6",
    backgroundColor: "#EAF0FF",
    paddingHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  aiChipText: { color: "#345AE4", fontSize: 12, fontWeight: "600" },

  sampleControls: {
    position: "absolute",
    top: 76,
    right: 10,
    gap: 6,
  },
  modeBtn: {
    height: 28,
    borderRadius: 6,
    backgroundColor: "#FFFFFFDD",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  modeBtnText: { fontSize: 12, color: "#374151" },
  captureBtn: {
    marginTop: 4,
    height: 34,
    borderRadius: 8,
    backgroundColor: "#345AE4",
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  captureText: { color: "#FFFFFF", fontSize: 12, fontWeight: "600" },

  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  sheet: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: 10,
    borderRadius: 16,
    backgroundColor: "rgba(245,245,245,0.96)",
    borderWidth: 1,
    borderColor: "#E4E4E4",
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  handle: {
    width: 46,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#2E2E2E",
    alignSelf: "center",
    marginBottom: 12,
  },
  sheetTitle: {
    textAlign: "center",
    color: "#2C2C2C",
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 10,
  },
  desc: {
    color: "#4B5563",
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  tagWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#BCD0FF",
    borderRadius: 10,
    backgroundColor: "#ECF3FF",
  },
  tag: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#9CA3AF",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
  },
  tagText: { fontSize: 12, color: "#374151" },

  questionBox: {
    marginTop: 2,
    borderRadius: 12,
    backgroundColor: "#FFFFFFCC",
    padding: 12,
  },
  question: {
    textAlign: "center",
    fontSize: 15,
    color: "#2C2C2C",
    marginBottom: 10,
    fontWeight: "600",
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
  },
  grayBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#AFAFAF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5",
  },
  grayBtnText: { color: "#4B5563", fontSize: 14 },
  blueBtn: {
    flex: 1,
    height: 38,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#345AE4",
  },
  blueBtnText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
});
