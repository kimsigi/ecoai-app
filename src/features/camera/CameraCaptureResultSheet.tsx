// [추가] c:\software\project\ecoai-app\src\features\camera\CameraCaptureResultSheet.tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Modal, Portal } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLOR, FONT_FACE, FONT_SIZE, RADIUS, SPACING } from '@/shared/ui/token';

type CameraCaptureResultSheetProps = {
  visible: boolean;
  onRetakePress: () => void;
  onConfirmPress: () => void;
};

export default function CameraCaptureResultSheet({
  visible,
  onRetakePress,
  onConfirmPress,
}: CameraCaptureResultSheetProps) {
  const insets = useSafeAreaInsets();

  return (
    <Portal>
      <Modal
        visible={visible}
        dismissable={false}
        // [수정] 모달 루트 자체를 하단 정렬
        style={styles.modalRoot}
        // [수정] 여기엔 카드 컨테이너만
        contentContainerStyle={[
          styles.sheet,
          { marginBottom: Math.max(insets.bottom, 12) },
        ]}
      >
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>냉장고를 인식하였습니다.</Text>
          <Text style={styles.description}>
            화면은 전문적인 스테인리스 조리대, 환기 후드, 가스레인지, 오븐 그리고
            냉장고로 구성되어 있습니다.
          </Text>

          <View style={styles.questionBox}>
            <Text style={styles.question}>이대로 배출 방법을 확인할까요?</Text>

            <View style={styles.actionRow}>
              <Pressable style={styles.secondaryButton} onPress={onRetakePress}>
                <Text style={styles.secondaryText}>재촬영</Text>
              </Pressable>
              <Pressable style={styles.primaryButton} onPress={onConfirmPress}>
                <Text style={styles.primaryText}>예</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
    // [추가] 하단 정렬 루트
  modalRoot: {
    justifyContent: 'flex-end',
    margin: 0,
    paddingHorizontal: SPACING.xl,
  },
  modalContainer: {
    justifyContent: 'flex-end',
    paddingHorizontal: SPACING.xl,
  },
  sheet: {
    borderRadius: RADIUS.xxxl,
    backgroundColor: COLOR.whiteA80,
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
  },
  handle: {
    width: 52,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLOR.black,
    alignSelf: 'center',
    marginBottom: SPACING.md,
  },
  title: {
    textAlign: 'center',
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    marginBottom: SPACING.sm,
  },
  description: {
    color: COLOR.gray900,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: 20,
    marginBottom: SPACING.md,
  },
  questionBox: {
    borderRadius: RADIUS.xl,
    backgroundColor: COLOR.whiteA80,
    padding: SPACING.md,
  },
  question: {
    textAlign: 'center',
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    marginBottom: SPACING.smMd,
  },
  actionRow: {
    flexDirection: 'row',
    gap: SPACING.smMd,
  },
  secondaryButton: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLOR.gray700,
    backgroundColor: COLOR.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
  },
  primaryButton: {
    flex: 1,
    height: 38,
    borderRadius: RADIUS.md,
    backgroundColor: COLOR.blue500,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.sm,
  },
});
