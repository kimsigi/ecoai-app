import React from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { AppIcon } from "../icon";
type Mode = "trigger" | "input";

interface Props {
  mode: Mode;
  value: string;
  placeholder?: string;
  showBack?: boolean; // 백버튼 표시 여부
  onBackPress?: () => void;

  // trigger 모드: 필드 탭 시 검색 화면 이동
  onPressField?: () => void;

  // input 모드: 실제 입력/검색
  onChangeText?: (v: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  autoFocus?: boolean;
}

export default function SearchNavHeader({
  mode,
  value,
  placeholder,// = "주소를 검색하세요",
  showBack = true, // 기본값 추가
  onBackPress,
  onPressField,
  onChangeText,
  onSubmit,
  onClear,
  autoFocus = false,
}: Props) {
  const isInput = mode === "input";
  const canShowBack = showBack && !!onBackPress; 

  return (
    <View style={styles.wrap}>
      {canShowBack ? (
        <Pressable onPress={onBackPress} style={styles.backBtn}>
            <AppIcon name="chevronLeft" size={24} />
        </Pressable>
      ) : (
        <View style={styles.backSpacer} /> // 버튼 없을 때 공간만 유지
      )}

      {isInput ? (
        <View style={styles.inputWrap}>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            style={styles.input}
            autoFocus={autoFocus}
            returnKeyType="search"
            onSubmitEditing={onSubmit}
          />
          {!!value && (
            <Pressable onPress={onClear} style={styles.clearBtn}>
              <Text style={styles.clearText}>×</Text>
            </Pressable>
          )}
        </View>
      ) : (
        <Pressable onPress={onPressField} style={styles.inputWrap}>
          <Text style={[styles.triggerText, !value && styles.placeholder]}>
            {value || placeholder}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    height: 44,
    marginHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#FFFFFF99",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderStyle: 'solid',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  backSpacer: {
    width: 36,
    height: 36,
  },
  backText: { fontSize: 18, color: "#262626" },
  inputWrap: {
    flex: 1,
    height: 36,
    borderRadius: 18,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
  },
  input: { flex: 1, fontSize: 16, color: "#1F2937", paddingVertical: 0 },
  triggerText: { fontSize: 16, color: "#1F2937" },
  placeholder: { color: "#9CA3AF" },
  clearBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D1D5DB",
  },
  clearText: { fontSize: 16, lineHeight: 18, color: "#374151" },
});
