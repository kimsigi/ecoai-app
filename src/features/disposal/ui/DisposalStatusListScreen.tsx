import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

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

type DisposalTab = '배출신청' | '신청접수' | '수거진행' | '배출완료' | '배출취소';

type DisposalItem = {
  id: string;
  status: DisposalTab;
  orderNo: string;
  itemName: string;
  scheduleText: string;
  hasExtraPayment?: boolean;
};

const TABS: DisposalTab[] = ['배출신청', '신청접수', '수거진행', '배출완료', '배출취소'];

const MOCK_LIST: DisposalItem[] = [
  {
    id: '1',
    status: '배출신청',
    orderNo: 'KW-20260304123',
    itemName: '의자 - 훼손용의자',
    scheduleText: '2026년 3월 4일 오후 12:00 이전 배출',
    hasExtraPayment: true,
  },
  {
    id: '2',
    status: '배출신청',
    orderNo: 'KW-20260304124',
    itemName: '냉장고 - 500리터 이상',
    scheduleText: '2026년 3월 4일 오후 12:00 이전 배출',
  },
  {
    id: '3',
    status: '신청접수',
    orderNo: 'KW-20260304124',
    itemName: '냉장고 - 500리터 이상',
    scheduleText: '2026년 3월 4일 오후 12:00 이전 배출',
  },
  {
    id: '4',
    status: '수거진행',
    orderNo: 'KW-20260304124',
    itemName: '냉장고 - 500리터 이상',
    scheduleText: '2026년 3월 4일 오후 12:00 이전 배출',
  },
  {
    id: '5',
    status: '배출완료',
    orderNo: 'KW-20260304124',
    itemName: '냉장고 - 500리터 이상',
    scheduleText: '2026년 3월 4일 오후 12:00 이전 배출',
  },
];

export default function DisposalStatusListScreen() {
  const [activeTab, setActiveTab] = useState<DisposalTab>('배출신청');

  const filteredItems = useMemo(
    () => MOCK_LIST.filter(item => item.status === activeTab),
    [activeTab],
  );

  return (
    <PageLayout
      headerState="content"
      headerHeight={56}
      headerContainerStyle={styles.headerContainer}
      headerCenter={<Text style={styles.headerTitle}>배출 정보 목록</Text>}
      headerRight={
        <Pressable hitSlop={8} style={styles.headerClose}>
          <AppIcon name="close" size={20} />
        </Pressable>
      }
      contentContainerStyle={styles.contentContainer}
      protectBottomInset
    >
      <View style={styles.container}>
        {/* [ADD] 탭 */}
        <View style={styles.tabRow}>
          {TABS.map(tab => {
            const isActive = tab === activeTab;
            return (
              <Pressable key={tab} style={styles.tabBtn} onPress={() => setActiveTab(tab)}>
                <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{tab}</Text>
                {isActive ? <View style={styles.tabUnderline} /> : <View style={styles.tabUnderlineSpacer} />}
              </Pressable>
            );
          })}
        </View>

        {/* [ADD] 목록 */}
        <ScrollView contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false}>
          {filteredItems.map(item => (
            <Pressable key={item.id} style={styles.card}>
              <View style={styles.badgeRow}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{item.status}</Text>
                </View>
                {item.hasExtraPayment ? (
                  <View style={styles.extraBadge}>
                    <Text style={styles.extraBadgeText}>추가결제요청</Text>
                  </View>
                ) : null}
              </View>

              <Text style={styles.orderNo}>{item.orderNo}</Text>
              <Text style={styles.itemName}>{item.itemName}</Text>
              <Text style={styles.scheduleText}>{item.scheduleText}</Text>
            </Pressable>
          ))}

          {filteredItems.length === 0 ? (
            <View style={styles.emptyWrap}>
              <Text style={styles.emptyText}>해당 상태의 배출 정보가 없습니다.</Text>
            </View>
          ) : null}
        </ScrollView>
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
  tabRow: {
    height: 46,
    flexDirection: 'row',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  // [ADD]
  tabText: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  tabTextActive: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
  },
  // [ADD]
  tabUnderline: {
    marginTop: SPACING.sm,
    width: '70%',
    height: 2,
    backgroundColor: COLOR.blue600,
    borderRadius: RADIUS.pill,
  },
  // [ADD]
  tabUnderlineSpacer: {
    marginTop: SPACING.sm,
    width: '70%',
    height: 2,
    backgroundColor: COLOR.transparent,
  },

  // [ADD]
  listContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  // [ADD]
  card: {
    borderWidth: 1,
    borderColor: COLOR.gray400,
    borderRadius: RADIUS.md,
    backgroundColor: COLOR.gray100,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    gap: SPACING.xs,
  },
  // [ADD]
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  // [ADD]
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    height: 18,
    borderRadius: RADIUS.pill,
    backgroundColor: COLOR.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  statusBadgeText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
  },
  // [ADD]
  extraBadge: {
    paddingHorizontal: SPACING.sm,
    height: 18,
    borderRadius: RADIUS.pill,
    backgroundColor: '#FF3B30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  extraBadgeText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.xs,
  },
  // [ADD]
  orderNo: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.displaySm,
    lineHeight: LINE_HEIGHT.xxl,
  },
  // [ADD]
  itemName: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  scheduleText: {
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  emptyWrap: {
    marginTop: SPACING.xl,
    alignItems: 'center',
  },
  // [ADD]
  emptyText: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
});