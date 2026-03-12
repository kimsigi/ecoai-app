import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PageLayout } from '@/shared/ui/component/layout';
import {
  COLOR,
  FONT_FACE,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
} from '@/shared/ui/token';

export default function DisposalDetailScreen() {
  return (
    <PageLayout
        back
        title="배출 정보 상세"
    >
      <View style={styles.container}>
        {/* [ADD] 상태/요청정보 */}
        <View style={styles.topWrap}>
          <View style={styles.topRow}>
            <Text style={styles.statusText}>배출신청 추가결제요청</Text>
            <Text style={styles.dateText}>2026-03-04</Text>
          </View>

          <Text style={styles.itemText}>냉장고 - 500리터 이상</Text>

          <View style={styles.reserveNoWrap}>
            <Text style={styles.reserveNoLabel}>예약번호</Text>
            <Text style={styles.reserveNoValue}>KW-20260304124</Text>
          </View>

          <Text style={styles.guideText}>
            배출품에 <Text style={styles.guideBlue}>예약번호가 잘 보이도록</Text> 기재하여{' '}
            <Text style={styles.guideBlue}>배출예정 일시</Text>에 맞춰{' '}
            <Text style={styles.guideBlue}>지정한 배출 위치</Text>에 배출해 주세요.
          </Text>
        </View>

        {/* [ADD] 배출 신청 내용 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>배출 신청 내용</Text>

          <Text style={styles.fieldLabel}>배출예정 일시</Text>
          <Text style={styles.fieldValue}>2026년 3월 4일 오후 12:00 이전까지 배출</Text>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>배출 위치</Text>
          <Text style={styles.fieldValue}>
            서울특별시 구로구 디지털로 33길 27{'\n'}
            307동{'\n'}
            삼성1단지 주차장 입구 폐기물 집하장
          </Text>
        </View>

        {/* [ADD] 수거 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>수거 정보</Text>

          <Text style={styles.fieldLabel}>지역</Text>
          <Text style={styles.fieldValue}>구로구</Text>

          <View style={styles.divider} />

          <Text style={styles.fieldLabel}>수거업체</Text>
          <View style={styles.vendorRow}>
            <Text style={styles.fieldValue}>㈜엠솔</Text>
            <View style={styles.phoneRow}>
              <Text style={styles.phoneIcon}>📞</Text>
              <Text style={styles.phoneText}>02-1234-5678</Text>
            </View>
          </View>
        </View>

        {/* [ADD] 결제금액 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>결제금액</Text>

          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>배출 수수료 총액</Text>
            <Text style={styles.priceValue}>19,000 원</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabelStrong}>환불 예정 수수료</Text>
            <Text style={styles.priceValueStrong}>15,000 원</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>결제방법</Text>
            <Text style={styles.priceSubValue}>신용/체크카드 (기업카드)</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>결제일시</Text>
            <Text style={styles.priceSubValue}>2024.03.04 12:00:01</Text>
          </View>
        </View>

        {/* [ADD] 오른쪽 시안 하단 결합 영역 */}
        <View style={styles.cancelCard}>
          <Text style={styles.cancelTitle}>결제일시</Text>
          <Text style={styles.cancelNotice}>
            ② 배출물에 예약번호를 기재하여 지정한 장소에 올바르게 배출해주셔야 합니다.{'\n'}
            배출예정 일자 수거일에는 치우기 어려운 수 있으니, 실제 수거일에 대한 문의는
            배정된 업체를 통해 문의해 주시기 바랍니다.{'\n'}
            신고정보와 결제 내용에 차이가 있을 경우 추가 수수료가 발생되거나 수거가
            거부될 수 있습니다.{'\n'}
            대형폐기물 신고 없이 무단 배출할 경우 과태료가 부과 됩니다.{'\n'}
            처리이체불 한 경우, 취소 시 운영 수수료는 환불되지 않습니다.
          </Text>

          <Pressable style={styles.cancelBtnOutline}>
            <Text style={styles.cancelBtnOutlineText}>배출신청 취소</Text>
          </Pressable>

          <Pressable style={styles.cancelBtnFill}>
            <Text style={styles.cancelBtnFillText}>2,000 추가 결제</Text>
          </Pressable>
        </View>
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
    backgroundColor: COLOR.gray100,
  },

  // [ADD]
  topWrap: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // [ADD]
  statusText: {
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  dateText: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  itemText: {
    marginTop: SPACING.sm,
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  reserveNoWrap: {
    marginTop: SPACING.md,
    backgroundColor: COLOR.gray200,
    borderRadius: RADIUS.lg,
    paddingHorizontal: SPACING.md,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  // [ADD]
  reserveNoLabel: {
    color: COLOR.gray800,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  reserveNoValue: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.displaySm,
    lineHeight: LINE_HEIGHT.xxl,
  },
  // [ADD]
  guideText: {
    marginTop: SPACING.md,
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  guideBlue: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.semibold,
  },

  // [ADD]
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  sectionTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    marginBottom: SPACING.md,
  },
  // [ADD]
  fieldLabel: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
    marginBottom: SPACING.xs,
  },
  // [ADD]
  fieldValue: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  divider: {
    marginVertical: SPACING.md,
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLOR.gray300,
  },
  // [ADD]
  vendorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // [ADD]
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  // [ADD]
  phoneIcon: {
    fontSize: FONT_SIZE.sm,
  },
  // [ADD]
  phoneText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  // [ADD]
  priceLabel: {
    color: COLOR.gray800,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  priceLabelStrong: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  priceValue: {
    color: COLOR.gray900,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  priceValueStrong: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  priceSubValue: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  cancelCard: {
    margin: SPACING.lg,
    borderWidth: 1,
    borderColor: COLOR.gray400,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    backgroundColor: COLOR.white,
    gap: SPACING.md,
  },
  // [ADD]
  cancelTitle: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  cancelNotice: {
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.md,
  },
  // [ADD]
  cancelBtnOutline: {
    height: 40,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  // [ADD]
  cancelBtnOutlineText: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
  // [ADD]
  cancelBtnFill: {
    height: 40,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  cancelBtnFillText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
});