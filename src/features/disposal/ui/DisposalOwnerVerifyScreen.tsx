import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { PageLayout } from '@/shared/ui/component/layout';
import { AppIcon } from '@/shared/ui/component/icon';
import {
  COLOR,
  FONT_FACE,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
} from '@/shared/ui/token';

type Step = 1 | 2 | 3;

const PHONE_REGEX = /^01[0-9]-\d{3,4}-\d{4}$/;

function formatPhone(value: string) {
  const n = value.replace(/\D/g, '').slice(0, 11);
  if (n.length < 4) return n;
  if (n.length < 8) return `${n.slice(0, 3)}-${n.slice(3)}`;
  return `${n.slice(0, 3)}-${n.slice(3, n.length === 10 ? 6 : 7)}-${n.slice(n.length === 10 ? 6 : 7)}`;
}

export default function DisposalOwnerVerifyScreen() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  // [ADD] 단계 판별 (요청하신 3단계를 한 화면에서 표현)
  const step: Step = useMemo(() => {
    if (!name.trim() || !PHONE_REGEX.test(phone)) return 1;
    if (!isCodeSent) return 2;
    return 3;
  }, [isCodeSent, name, phone]);

  const canSendCode = step >= 2;
  const canVerify = step === 3 && code.trim().length >= 4;

  const onPressSendCode = () => {
    if (!canSendCode) return;
    setIsCodeSent(true);
  };

  return (
    <PageLayout
      headerState="content"
      headerHeight={56}
      headerContainerStyle={styles.headerContainer}
      headerCenter={<Text style={styles.headerTitle}>배출자 정보 확인</Text>}
      headerRight={
        <Pressable hitSlop={8} style={styles.headerClose}>
          <AppIcon name="close" size={20} />
        </Pressable>
      }
      contentContainerStyle={styles.contentContainer}
      protectBottomInset
    >
      <View style={styles.container}>
        <Text style={styles.sectionTitle}>배출자 정보</Text>

        <Text style={styles.label}>이름</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="실명을 입력해 주세요"
          placeholderTextColor={COLOR.gray500}
        />

        <Text style={[styles.label, styles.labelSpacing]}>휴대전화번호</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={v => setPhone(formatPhone(v))}
          placeholder="숫자만 입력해 주세요"
          placeholderTextColor={COLOR.gray500}
          keyboardType="number-pad"
          maxLength={13}
        />

        <Pressable
          style={[styles.primaryButton, !canSendCode && styles.disabledButton]}
          onPress={onPressSendCode}
          disabled={!canSendCode}
        >
          <Text style={[styles.primaryButtonText, !canSendCode && styles.disabledButtonText]}>
            인증번호 발송
          </Text>
        </Pressable>

        {/* [ADD] 3단계 영역: 인증번호 발송 후 노출 */}
        {step === 3 ? (
          <View style={styles.verifyWrap}>
            <Text style={styles.verifyGuide}>
              휴대전화번호로 인증번호를 발송합니다{' '}
              <Text style={styles.reSendText}>인증번호 재전송</Text>
            </Text>
            <Text style={styles.timerText}>5:00</Text>

            <TextInput
              style={styles.input}
              value={code}
              onChangeText={setCode}
              placeholder="인증번호를 입력해 주세요"
              placeholderTextColor={COLOR.gray500}
              keyboardType="number-pad"
              maxLength={6}
            />

            <Pressable
              style={[styles.primaryButton, !canVerify && styles.disabledButton]}
              disabled={!canVerify}
            >
              <Text style={[styles.primaryButtonText, !canVerify && styles.disabledButtonText]}>
                인증
              </Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  // [ADD]
  headerContainer: {
    backgroundColor: COLOR.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
  },
  // [ADD]
  headerTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
  },
  // [ADD]
  headerClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },

  // [ADD]
  contentContainer: {
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  container: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLOR.gray100,
  },

  // [ADD]
  sectionTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
    marginBottom: SPACING.md,
  },
  // [ADD]
  label: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
    marginBottom: SPACING.sm,
  },
  // [ADD]
  labelSpacing: {
    marginTop: SPACING.md,
  },

  // [ADD]
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: COLOR.gray500,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.white,
    paddingHorizontal: SPACING.md,
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  // [ADD]
  primaryButton: {
    marginTop: SPACING.md,
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  primaryButtonText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
  // [ADD]
  disabledButton: {
    backgroundColor: COLOR.gray300,
  },
  // [ADD]
  disabledButtonText: {
    color: COLOR.white,
  },

  // [ADD]
  verifyWrap: {
    marginTop: SPACING.md,
  },
  // [ADD]
  verifyGuide: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
    marginBottom: 2,
  },
  // [ADD]
  reSendText: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.semibold,
  },
  // [ADD]
  timerText: {
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
    textAlign: 'right',
    marginBottom: SPACING.xs,
  },
});
