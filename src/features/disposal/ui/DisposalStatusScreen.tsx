import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PageLayout } from '@/shared/ui/component/layout';
import { AppIcon } from '@/shared/ui/component/icon';
import {
  COLOR,
  FONT_FACE,
  FONT_SIZE,
  LINE_HEIGHT,
  SPACING,
} from '@/shared/ui/token';

type StatusRow = {
  key: string;
  title: string;
  count: number;
  extra?: string;
};

const STATUS_ROWS: StatusRow[] = [
  { key: 'requesting', title: '배출신청', count: 2, extra: '(추가결제요청 1 건)' },
  { key: 'received', title: '신청접수', count: 0 },
  { key: 'collecting', title: '수거진행', count: 0 },
  { key: 'completed', title: '배출완료', count: 0 },
  { key: 'cancelled', title: '배출취소', count: 0 },
];

export default function DisposalStatusScreen() {
  return (
    <PageLayout
      headerState="content"
      headerHeight={56}
      headerContainerStyle={styles.headerContainer}
      headerCenter={<Text style={styles.headerTitle}>내 배출 정보</Text>}
      headerRight={
        <Pressable hitSlop={8} style={styles.headerClose}>
          <AppIcon name="close" size={20} />
        </Pressable>
      }
      contentContainerStyle={styles.contentContainer}
      protectBottomInset
    >
      <View style={styles.container}>
        {/* [ADD] 사용자 정보 박스 */}
        <View style={styles.userInfoWrap}>
          <Text style={styles.userInfoText}>
            <Text style={styles.userNameText}>[박보검](010-1234-5678)</Text>님의 배출 정보
          </Text>
        </View>

        {/* [ADD] 상태 리스트 */}
        <View style={styles.listWrap}>
          {STATUS_ROWS.map(row => (
            <Pressable key={row.key} style={styles.row}>
              <View style={styles.rowLeft}>
                <Text style={styles.rowTitle}>{row.title}</Text>
                {row.extra ? <Text style={styles.rowExtra}>{row.extra}</Text> : null}
              </View>

              <View style={styles.rowRight}>
                <Text style={styles.rowCount}>{row.count} 건</Text>
                <AppIcon name="arrowRight" size={16} />
              </View>
            </Pressable>
          ))}
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
  userInfoWrap: {
    minHeight: 64,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  userInfoText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  userNameText: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.semibold,
  },

  // [ADD]
  listWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR.gray300,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  row: {
    height: 64,
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // [ADD]
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
  },
  // [ADD]
  rowTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  rowExtra: {
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  // [ADD]
  rowCount: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
});