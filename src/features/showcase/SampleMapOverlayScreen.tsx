import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";

export default function SampleMapOverlayScreen() {
  return (
    <PageLayout
      headerState="hidden"
      statusBarStyle="dark-content"
      statusBarTranslucent
      statusBarBackgroundColor="transparent"
      statusBarAreaStyle={{ backgroundColor: "rgba(255,255,255,0.88)" }}
      contentContainerStyle={styles.container}
      protectBottomInset={false}
    >
      <View style={styles.container}>
        {/* 지도 배경(샘플) */}
        <View style={styles.mapLayer}>
          <View style={[styles.road, styles.roadA]} />
          <View style={[styles.road, styles.roadB]} />
          <View style={[styles.block, { top: 80, left: 20, width: 120, height: 90 }]} />
          <View style={[styles.block, { top: 140, right: 26, width: 130, height: 98 }]} />
          <View style={[styles.block, { bottom: 200, left: 42, width: 170, height: 120 }]} />
          <View style={[styles.block, { bottom: 120, right: 22, width: 130, height: 88 }]} />
        </View>

        {/* 상단 오버레이 */}
        <View style={styles.topOverlay}>
          {/* 검색 헤더 */}
          <View style={styles.searchHeader}>
            <Pressable style={styles.backBtn}>
                <AppIcon name="chevronLeft" size={24} />
            </Pressable>
            <Text style={styles.searchText} numberOfLines={1}>
              디지털로 33길 27
            </Text>
          </View>

          {/* 시도 / 시군구 */}
          <View style={styles.regionRow}>
            <Pressable style={styles.regionBtn}>
              <Text style={styles.regionText}>서울특별시</Text>
              <Text style={styles.regionArrow}>⌄</Text>
            </Pressable>
            <Pressable style={styles.regionBtn}>
              <Text style={styles.regionText}>관악구</Text>
              <Text style={styles.regionArrow}>⌄</Text>
            </Pressable>
          </View>

          {/* 버튼 영역 */}
          <View style={styles.filterRow}>
            <Pressable style={[styles.filterChip, styles.filterChipMuted]}>
              <Text style={styles.filterTextMuted}>ALL</Text>
            </Pressable>

            <Pressable style={[styles.filterChip, styles.filterChipMuted]}>
              <Text style={styles.filterTextMuted}>전체보기</Text>
            </Pressable>

            <Pressable style={[styles.filterChip, styles.filterChipActive]}>
              <View style={styles.chipIconDot} />
              <Text style={styles.filterTextActive}>분리배출장소</Text>
            </Pressable>

            <Pressable style={[styles.filterChip, styles.filterChipActive]}>
              <View style={styles.chipIconDot} />
              <Text style={styles.filterTextActive}>무인회수기</Text>
            </Pressable>
          </View>
        </View>

        {/* 지도 마커 샘플 */}
        <View style={[styles.marker, { top: "43%", left: "22%", backgroundColor: "#17A16F" }]} />
        <View style={[styles.marker, { top: "58%", left: "28%", backgroundColor: "#7347D8" }]} />
        <View style={[styles.marker, { top: "53%", right: "18%", backgroundColor: "#2E7D32" }]} />
        <View style={[styles.marker, { top: "66%", right: "14%", backgroundColor: "#2F57E5" }]} />

        {/* 좌하단 위치 버튼 */}
        <Pressable style={styles.gpsBtn}>
          <Text style={styles.gpsText}>◎</Text>
        </Pressable>

        {/* 하단 주소 정보 */}
        <View style={styles.bottomCard}>
          <View style={styles.bottomHead}>
            <Text style={styles.placeTitle}>신림동주민센터</Text>
            <Text style={styles.placeSub}>동행정복지센터</Text>
            <View style={styles.rightIcons}>
              <Pressable style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>⌂</Text>
              </Pressable>
              <Pressable style={styles.iconBtn}>
                <Text style={styles.iconBtnText}>◎</Text>
              </Pressable>
            </View>
          </View>

          <Text style={styles.addrText}>서울 관악구 봉천로 224 2층</Text>
          <Text style={styles.addrText}>(지번) 신림동 1443-13</Text>
          <Text style={styles.addrText}>운영  월~금 09:00 ~ 18:00</Text>

          <View style={styles.contactRow}>
            <Text style={styles.phone}>02-879-4501</Text>
            <Text style={styles.link}>상세보기</Text>
            <Text style={styles.link}>홈페이지</Text>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8ECF3",
  },

  mapLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#E6E8ED",
  },
  road: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
    opacity: 0.75,
  },
  roadA: {
    top: "38%",
    left: -20,
    right: -20,
    height: 18,
    transform: [{ rotate: "-14deg" }],
  },
  roadB: {
    top: -20,
    bottom: -20,
    left: "56%",
    width: 16,
    transform: [{ rotate: "10deg" }],
  },
  block: {
    position: "absolute",
    borderRadius: 8,
    backgroundColor: "#D7DBE2",
  },

  topOverlay: {
    paddingTop: 10,
    paddingHorizontal: 12,
    gap: 10,
  },

  searchHeader: {
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#D7DAE0",
    backgroundColor: "rgba(255,255,255,0.92)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  searchText: {
    flex: 1,
    marginLeft: 4,
    color: "#1F2937",
    fontSize: 20,
    fontWeight: "600",
  },

  regionRow: {
    flexDirection: "row",
    gap: 8,
  },
  regionBtn: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DFE3EA",
    backgroundColor: "rgba(255,255,255,0.94)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
  },
  regionText: {
    fontSize: 20,
    color: "#242B38",
    fontWeight: "500",
  },
  regionArrow: {
    fontSize: 15,
    color: "#4B5563",
  },

  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterChip: {
    height: 34,
    borderRadius: 17,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  filterChipMuted: {
    borderWidth: 1,
    borderColor: "#C8CDD6",
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  filterChipActive: {
    borderWidth: 1,
    borderColor: "#9DD7B9",
    backgroundColor: "#F1FFF7",
  },
  chipIconDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#22A06B",
  },
  filterTextMuted: {
    color: "#3D4451",
    fontSize: 12,
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#2B7D5A",
    fontSize: 12,
    fontWeight: "600",
  },

  marker: {
    position: "absolute",
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  gpsBtn: {
    position: "absolute",
    left: 12,
    bottom: 136,
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#D5D8DD",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  gpsText: {
    color: "#2F57E5",
    fontSize: 14,
    fontWeight: "700",
  },

  bottomCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    minHeight: 122,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderWidth: 1,
    borderColor: "#E3E6EC",
    backgroundColor: "rgba(255,255,255,0.98)",
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 14,
  },
  bottomHead: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeTitle: {
    color: "#1F2937",
    fontSize: 18,
    fontWeight: "700",
  },
  placeSub: {
    marginLeft: 6,
    color: "#9CA3AF",
    fontSize: 10,
  },
  rightIcons: {
    marginLeft: "auto",
    flexDirection: "row",
    gap: 6,
  },
  iconBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D5D8DD",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  iconBtnText: {
    color: "#667085",
    fontSize: 12,
  },

  addrText: {
    marginTop: 4,
    color: "#4B5563",
    fontSize: 11,
  },
  contactRow: {
    marginTop: 7,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  phone: {
    color: "#1DAA6A",
    fontSize: 13,
    fontWeight: "700",
  },
  link: {
    color: "#4F6EDB",
    fontSize: 11,
    textDecorationLine: "underline",
  },
});
