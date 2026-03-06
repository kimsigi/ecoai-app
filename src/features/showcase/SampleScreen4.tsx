// [신규] src/features/sample/SampleScreen4.tsx

import React from "react";
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";

export default function SampleScreen4() {
  const navigation = useNavigation();

  return (
    <PageLayout
      headerState="hidden"
      //topInsetMode="content" // [핵심] 상태바는 보호, 헤더는 콘텐츠 위 오버레이로 직접 구현
      protectBottomInset
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.container}>
        <ImageBackground
          source={require("@/shared/ui/assets/image/backgoundMap.png")}
          style={styles.preview}
          resizeMode="cover"
        >
          {/* [핵심] 헤더는 존재하지만 카메라 프리뷰 위에 오버레이 */}
          <View style={styles.headerOverlay}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
              <AppIcon name="arrowLeft" size={24} />
            </Pressable>
          </View>

          <View style={styles.guideFrame}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />
          </View>

          <View style={styles.bottomOverlay}>
            <Text style={styles.guideText}>
              배출 물품을 가능한 화면 중심에 위치시키면{"\n"}
              더 정확한 이미지 인식이 가능합니다.
            </Text>

            <View style={styles.controlRow}>
              <View style={styles.shutterOuter}>
                <View style={styles.shutterInner} />
              </View>

              <Pressable style={styles.aiButton}>
                <View style={styles.aiDot} />
                <Text style={styles.aiText}>AI 도우미</Text>
              </Pressable>
            </View>
          </View>
        </ImageBackground>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: "#000000",
  },
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  preview: {
    flex: 1,
    justifyContent: "space-between",
  },

  headerOverlay: {
    height: 44,
    backgroundColor: "rgba(120,120,120,0.45)",
    justifyContent: "center",
    paddingHorizontal: 8,
  },
  backButton: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
  },

  guideFrame: {
    ...StyleSheet.absoluteFillObject,
    marginHorizontal: 18,
    marginTop: 76,
    marginBottom: 176,
  },
  corner: {
    position: "absolute",
    width: 50,
    height: 50,
    borderColor: "#FFFFFF",
  },
  tl: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  tr: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bl: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  br: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },

  bottomOverlay: {
    backgroundColor: "rgba(0,0,0,0.35)",
    paddingTop: 12,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  guideText: {
    color: "#FFFFFF",
    textAlign: "center",
    fontSize: 22,
    lineHeight: 30,
    fontWeight: "700",
    marginBottom: 16,
  },

  controlRow: {
    minHeight: 68,
    justifyContent: "center",
    alignItems: "center",
  },
  shutterOuter: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  shutterInner: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#2B2E34",
  },

  aiButton: {
    position: "absolute",
    right: 2,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  aiDot: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#2F57E5",
    borderWidth: 3,
    borderColor: "#88A3FF",
  },
  aiText: {
    marginTop: -2,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    backgroundColor: "#2F57E5",
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});
