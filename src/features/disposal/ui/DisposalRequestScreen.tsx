import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PageLayout } from '@/shared/ui/component/layout';
import { AppIcon } from '@/shared/ui/component/icon';
import DisposalScheduleOverlay from './DisposalScheduleOverlay';
import {
  COLOR,
  FONT_FACE,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
} from '@/shared/ui/token';

type AgreementItem = {
  id: string;
  label: string;
  required: boolean;
};

const AGREEMENTS: AgreementItem[] = [
  { id: 'terms', label: '서비스 이용약관 동의', required: true },
  { id: 'privacy', label: '개인정보처리방침 동의', required: true },
  { id: 'notify', label: '배출관련 문자/PUSH 수신동의', required: false },
];

function toKoreanDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`);
  return `${d.getFullYear()}-${`${d.getMonth() + 1}`.padStart(2, '0')}-${`${d.getDate()}`.padStart(
    2,
    '0',
  )}`;
}

export default function DisposalRequestScreen() {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({
    terms: false,
    privacy: false,
    notify: false,
  });

  // [ADD] 배출예정 일시 상태 + 오버레이
  const [scheduleDate, setScheduleDate] = useState('2026-03-05');
  const [scheduleTime, setScheduleTime] = useState('12:00~15:00');
  const [showScheduleOverlay, setShowScheduleOverlay] = useState(false);

  const toggleAgreement = (id: string) => {
    setCheckedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const requiredChecked = useMemo(() => {
    return AGREEMENTS.filter(v => v.required).every(v => checkedMap[v.id]);
  }, [checkedMap]);

  return (
    <PageLayout
      back
      title="대형폐기물 배출 신청"
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>배출자 정보</Text>

          <Text style={styles.label}>이름</Text>
          <View style={styles.readonlyBox}>
            <Text style={styles.readonlyText}>박보검</Text>
          </View>

          <Text style={[styles.label, styles.blockGap]}>휴대전화번호</Text>
          <View style={styles.readonlyBox}>
            <Text style={styles.readonlyText}>010-1234-5678</Text>
          </View>

          <Text style={[styles.sectionTitle, styles.blockGapLg]}>배출예정 일시</Text>
          {/* [MOD] 클릭 시 오버레이 오픈 */}
          <Pressable style={styles.dateTimeBox} onPress={() => setShowScheduleOverlay(true)}>
            <Text style={styles.dateTimeText}>{toKoreanDate(scheduleDate)}</Text>
            <View style={styles.dateDivider} />
            <Text style={styles.dateTimeText}>{scheduleTime}</Text>
          </Pressable>

          <Text style={[styles.sectionTitle, styles.blockGapLg]}>배출 위치</Text>
          <View style={styles.noticeRow}>
            <Text style={styles.noticeIcon}>ⓘ</Text>
            <View>
              <Text style={styles.noticeText}>현재 앱에 설정된 주소만 현재 위치입니다.</Text>
              <Text style={styles.noticeText}>주소를 눌러 다른 변경 가능합니다.</Text>
            </View>
          </View>

          <Pressable style={[styles.readonlyBox, styles.addressBox]}>
            <Text style={styles.readonlyText}>서울 구로구 디지털로 33길 27</Text>
          </Pressable>
          <Text style={styles.addressSubText}>서울 구로구 구로동 197-5</Text>

          <View style={styles.agreementHeaderRow}>
            <Text style={styles.sectionTitle}>약관 및 동의</Text>
            <Pressable>
              <Text style={styles.allViewText}>전체동의</Text>
            </Pressable>
          </View>

          <View style={styles.agreementList}>
            {AGREEMENTS.map(item => (
              <View key={item.id} style={styles.agreementRow}>
                <Pressable style={styles.checkArea} onPress={() => toggleAgreement(item.id)}>
                  <View style={[styles.checkCircle, checkedMap[item.id] && styles.checkCircleOn]}>
                    {checkedMap[item.id] ? <Text style={styles.checkMark}>✓</Text> : null}
                  </View>

                  <Text style={styles.agreementText}>
                    {item.label}
                    <Text style={styles.requiredText}>({item.required ? '필수' : '선택'})</Text>
                  </Text>
                </Pressable>

                <Pressable>
                  <Text style={styles.detailLink}>보기</Text>
                </Pressable>
              </View>
            ))}
          </View>
        </ScrollView>

        <View style={styles.bottomArea}>
          <Pressable
            style={[styles.payButton, !requiredChecked && styles.payButtonDisabled]}
            disabled={!requiredChecked}
          >
            <Text style={styles.payButtonText}>19,000 원 결제</Text>
          </Pressable>
        </View>
      </View>

      {/* [ADD] 오버레이 컴포넌트 */}
      <DisposalScheduleOverlay
        visible={showScheduleOverlay}
        initialDate={scheduleDate}
        initialTime={scheduleTime}
        onClose={() => setShowScheduleOverlay(false)}
        onConfirm={({ date, timeSlot }) => {
          setScheduleDate(date);
          setScheduleTime(timeSlot);
          setShowScheduleOverlay(false);
        }}
      />
    </PageLayout>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLOR.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
  },
  headerTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
  },
  headerClose: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.lg,
  },
  contentContainer: {
    backgroundColor: COLOR.gray100,
  },
  container: {
    flex: 1,
    backgroundColor: COLOR.gray100,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },
  sectionTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    marginBottom: SPACING.md,
  },
  label: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    marginBottom: SPACING.sm,
  },
  blockGap: {
    marginTop: SPACING.md,
  },
  blockGapLg: {
    marginTop: SPACING.xl,
  },
  readonlyBox: {
    minHeight: 42,
    borderWidth: 1,
    borderColor: COLOR.gray500,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.gray200,
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
  },
  readonlyText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
  dateTimeBox: {
    height: 44,
    borderWidth: 1,
    borderColor: COLOR.gray500,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.gray100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dateDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLOR.gray500,
  },
  dateTimeText: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  noticeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.xs,
    marginBottom: SPACING.sm,
  },
  noticeIcon: {
    color: '#FF3B30',
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
    marginTop: -1,
  },
  noticeText: {
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
  },
  addressBox: {
    backgroundColor: COLOR.gray200,
  },
  addressSubText: {
    marginTop: SPACING.sm,
    marginLeft: SPACING.md,
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  agreementHeaderRow: {
    marginTop: SPACING.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  allViewText: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    textDecorationLine: 'underline',
  },
  agreementList: {
    gap: SPACING.md,
  },
  agreementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: COLOR.gray400,
    backgroundColor: COLOR.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircleOn: {
    borderColor: COLOR.blue600,
    backgroundColor: COLOR.blue600,
  },
  checkMark: {
    color: COLOR.white,
    fontSize: 11,
    lineHeight: 12,
  },
  agreementText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
  requiredText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
  },
  detailLink: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    textDecorationLine: 'underline',
  },
  bottomArea: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.md,
    backgroundColor: COLOR.gray100,
  },
  payButton: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payButtonDisabled: {
    backgroundColor: COLOR.gray300,
  },
  payButtonText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
});
