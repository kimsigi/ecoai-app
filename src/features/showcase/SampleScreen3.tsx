// [신규] src/features/sample/SampleScreen3.tsx

import React, { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppIcon } from "@/shared/ui/component/icon";

type UserType = "개인" | "사업자";

export default function SampleScreen3() {
  const [autoLocate, setAutoLocate] = useState(true);
  const [userType, setUserType] = useState<UserType>("사업자");

  return (
    <PageLayout
      back
      title="설정"
      right={[
                {
                    icon: <AppIcon name="close" size={24} />,
                    //onPress: 
                },
            ]}
    >
      <View style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>위치 설정</Text>

          <View style={styles.rowBetween}>
            <Text style={styles.label}>자동으로 위치 찾기</Text>
            <Switch
              value={autoLocate}
              onValueChange={setAutoLocate}
              trackColor={{ false: "#D1D5DB", true: "#4F7DF0" }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.noticeRow}>
            <Text style={styles.noticeIcon}>●</Text>
            <Text style={styles.noticeText}>
              매번 앱을 실행할 때마다 현재 위치를 찾습니다.
            </Text>
          </View>

          <View style={styles.addressWrap}>
            <Text style={styles.addressLabel}>주소</Text>
            <View>
              <Text style={styles.addressMain}>디지털로 33길 27</Text>
              <Text style={styles.addressSub}>서울 구로구 구로동 197-5</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>수정하기</Text>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배출자 유형</Text>

          <View style={styles.userTypeRow}>
            <Pressable
              style={[
                styles.userTypeButton,
                userType === "개인" && styles.userTypeButtonActive,
                userType !== "개인" && styles.userTypeButtonDisabled,
              ]}
              onPress={() => setUserType("개인")}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === "개인" && styles.userTypeTextActive,
                  userType !== "개인" && styles.userTypeTextDisabled,
                ]}
              >
                개인
              </Text>
            </Pressable>

            <Pressable
              style={[
                styles.userTypeButton,
                userType === "사업자" && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType("사업자")}
            >
              <Text
                style={[
                  styles.userTypeText,
                  userType === "사업자" && styles.userTypeTextActive,
                ]}
              >
                ✓ 사업자
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#D1D5DB",
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  contentContainer: {
    backgroundColor: "#F3F4F6",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  section: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 8,
    borderBottomColor: "#E5E7EB",
  },
  sectionTitle: {
    fontSize: 12,
    color: "#111827",
    fontWeight: "600",
    marginBottom: 10,
  },

  rowBetween: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    color: "#111827",
  },

  noticeRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  noticeIcon: {
    fontSize: 8,
    color: "#4B5563",
    marginTop: -1,
  },
  noticeText: {
    fontSize: 10,
    color: "#6B7280",
  },

  addressWrap: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  addressLabel: {
    fontSize: 11,
    color: "#4B5563",
    marginTop: 2,
  },
  addressMain: {
    fontSize: 13,
    color: "#111827",
    fontWeight: "600",
  },
  addressSub: {
    marginTop: 2,
    fontSize: 11,
    color: "#4B5563",
  },

  primaryButton: {
    marginTop: 12,
    height: 40,
    borderRadius: 4,
    backgroundColor: "#3B5BDB",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  userTypeRow: {
    marginTop: 4,
    flexDirection: "row",
    gap: 8,
  },
  userTypeButton: {
    flex: 1,
    height: 36,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#BFC7D5",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  userTypeButtonActive: {
    borderColor: "#4A6CF7",
    backgroundColor: "#F8FAFF",
  },
  userTypeButtonDisabled: {
    backgroundColor: "#E5E7EB",
    borderColor: "#D1D5DB",
  },
  userTypeText: {
    fontSize: 13,
    color: "#4B5563",
    fontWeight: "500",
  },
  userTypeTextActive: {
    color: "#2F57E5",
    fontWeight: "700",
  },
  userTypeTextDisabled: {
    color: "#9CA3AF",
  },
});
