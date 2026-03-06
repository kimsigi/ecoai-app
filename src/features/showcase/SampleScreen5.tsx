// [신규] src/features/sample/SampleScreen5.tsx

import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";

export default function SampleScreen5() {
  const navigation = useNavigation();

  return (
    <PageLayout
      headerState="hidden"
      //topInsetMode="none" // [핵심] 지도 배경이 상태바까지 침범
      protectBottomInset
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.container}>
        {/* [대체] 지도 대신 배경 블록(실제 프로젝트에서는 MapView로 교체) */}
        <View style={styles.mapLayer}>
          <View style={styles.mockRoadHorizontal} />
          <View style={styles.mockRoadVertical} />
          <View style={[styles.mockBlock, { top: 100, left: 34, width: 130, height: 90 }]} />
          <View style={[styles.mockBlock, { top: 210, right: 28, width: 150, height: 110 }]} />
          <View style={[styles.mockBlock, { bottom: 170, left: 24, width: 170, height: 120 }]} />
        </View>

        {/* [핵심] 상태바 아래 커스텀 헤더가 지도 위에 오버레이 */}
        <View style={styles.topOverlay}>
          <View style={styles.searchHeader}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
              hitSlop={8}
            >
              <AppIcon name="chevronLeft" size={24} />
            </Pressable>
            <Text style={styles.headerText} numberOfLines={1}>
              디지털로 33길 27
            </Text>
          </View>
        </View>

        {/* 중앙 핀 가이드 */}
        <View pointerEvents="none" style={styles.centerPinWrap}>
          <View style={styles.pinBubble}>
            <Text style={styles.pinTitle}>현위치</Text>
            <Text style={styles.pinDesc}>지도를 움직여</Text>
            <Text style={styles.pinDesc}>위치를 설정해주세요.</Text>
          </View>
          <View style={styles.pinTail} />
          <View style={styles.pinDot} />
        </View>

        {/* 좌하단 타겟 버튼 */}
        <Pressable style={styles.gpsButton}>
          <Text style={styles.gpsIcon}>◎</Text>
        </Pressable>

        {/* 하단 확인 버튼 */}
        <View style={styles.bottomArea}>
          <Pressable style={styles.confirmButton}>
            <Text style={styles.confirmText}>이 위치로 설정</Text>
          </Pressable>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#ECEDEF",
  },
  container: {
    flex: 1,
    backgroundColor: "#ECEDEF",
  },

  mapLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ECEDEF",
  },
  mockRoadHorizontal: {
    position: "absolute",
    top: "48%",
    left: -40,
    right: -40,
    height: 22,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "-12deg" }],
    opacity: 0.7,
  },
  mockRoadVertical: {
    position: "absolute",
    top: -40,
    bottom: -40,
    left: "54%",
    width: 18,
    backgroundColor: "#FFFFFF",
    transform: [{ rotate: "8deg" }],
    opacity: 0.7,
  },
  mockBlock: {
    position: "absolute",
    borderRadius: 8,
    backgroundColor: "#DADDE2",
  },

  topOverlay: {
    paddingTop: 44, // [핵심] 상태바 바로 아래 헤더 배치
    paddingHorizontal: 12,
  },
  searchHeader: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#D5D8DD",
    backgroundColor: "rgba(255,255,255,0.92)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    gap: 6,
  },
  backButton: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
    fontSize: 30,
    lineHeight: 34,
    color: "#111827",
    fontWeight: "700",
  },

  centerPinWrap: {
    position: "absolute",
    top: "48%",
    left: 0,
    right: 0,
    alignItems: "center",
    transform: [{ translateY: -52 }],
  },
  pinBubble: {
    minWidth: 132,
    borderRadius: 12,
    backgroundColor: "#1E3A8A",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  pinTitle: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 16,
    marginBottom: 2,
  },
  pinDesc: {
    color: "#FFFFFF",
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "600",
  },
  pinTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#1E3A8A",
    marginTop: -1,
  },
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1E3A8A",
    marginTop: 5,
  },

  gpsButton: {
    position: "absolute",
    left: 12,
    bottom: 116,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D5D8DD",
    alignItems: "center",
    justifyContent: "center",
  },
  gpsIcon: {
    fontSize: 14,
    color: "#3157E5",
    fontWeight: "700",
  },

  bottomArea: {
    position: "absolute",
    left: 12,
    right: 12,
    bottom: 14,
  },
  confirmButton: {
    height: 48,
    borderRadius: 6,
    backgroundColor: "#345AE4",
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});
