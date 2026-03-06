import React, { useMemo, useState } from 'react';
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

// [ADD] 알림 mock 데이터 (피그마 시안 마크업용)
type NotificationItem = {
  id: number;
  date: string;
  title: string;
  detail: string[];
};

const NOTIFICATION_LIST: NotificationItem[] = [
  {
    id: 1,
    date: '2026-05-01',
    title: '운영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정...',
    detail: [
      '가. 지속적인 폐기물 발생 증가에 따른 사회적 문제 발생',
      '○ 매년 막대한 양의 폐기물 배출 발생',
      '지난 6년간(2018~2023) 사업장폐기물 36%, 생활폐기물 9.6% 증가',
      '※ 출처: 환경부, 「2023년 전국 폐기물 발생 및 처리현황」(2023)',
      '그러나 폐기물 총 발생량 약 5억 톤 규모로 지속적 증가세 유지',
      '○ 1인당 일평균 생활폐기물 발생량 1.01kg으로 OECD 평균 대비 높은 수준',
    ],
  },
  {
    id: 2,
    date: '2026-05-01',
    title: '운영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정...',
    detail: [
      '세부 안내 내용입니다.',
      '공지사항 정책 변경 사항을 확인해 주세요.',
    ],
  },
  {
    id: 3,
    date: '2026-05-01',
    title: '운영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정...',
    detail: [
      '세부 안내 내용입니다.',
      '공지사항 정책 변경 사항을 확인해 주세요.',
    ],
  },
  {
    id: 4,
    date: '2026-05-01',
    title: '운영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정책 개정 안내문영 정...',
    detail: [
      '세부 안내 내용입니다.',
      '공지사항 정책 변경 사항을 확인해 주세요.',
    ],
  },
];

export default function NotificationScreen() {
  // [ADD] 3번째 항목 기본 펼침 (피그마 기준)
  const [expandedId, setExpandedId] = useState<number>(3);
  const items = useMemo(() => NOTIFICATION_LIST, []);

  return (
    <PageLayout
      headerState="content"
      showBack
      headerHeight={44}
      headerContainerStyle={styles.headerContainer}
      headerCenter={<Text style={styles.headerTitle}>알림</Text>}
      contentContainerStyle={styles.contentContainer}
      protectBottomInset
    >
      <View style={styles.container}>
        <View style={styles.listWrap}>
          {items.map(item => {
            const expanded = expandedId === item.id;

            return (
              <View key={item.id} style={styles.itemBlock}>
                <Pressable
                  style={styles.itemHeader}
                  onPress={() => setExpandedId(prev => (prev === item.id ? -1 : item.id))}
                >
                  <View style={styles.itemMain}>
                    <Text style={styles.dateText}>{item.date}</Text>
                    <Text
                      numberOfLines={2}
                      style={[styles.titleText, expanded && styles.titleTextExpanded]}
                    >
                      {item.title}
                    </Text>
                  </View>

                  <View style={styles.arrowWrap}>
                    <AppIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={22} />
                  </View>
                </Pressable>

                {expanded ? (
                  <View style={styles.detailWrap}>
                    {item.detail.map((line, idx) => (
                      <Text key={`${item.id}-${idx}`} style={styles.detailText}>
                        {line}
                      </Text>
                    ))}
                  </View>
                ) : null}
              </View>
            );
          })}
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
    paddingHorizontal: SPACING.sm,
  },
  // [ADD]
  headerTitle: {
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
    color: COLOR.gray950,
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
  listWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR.gray300,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  itemBlock: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  itemHeader: {
    minHeight: 82,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.lg,
    paddingRight: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  // [ADD]
  itemMain: {
    flex: 1,
    gap: SPACING.xs,
  },
  // [ADD]
  dateText: {
    color: COLOR.gray600,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  titleText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  titleTextExpanded: {
    color: COLOR.blue700,
  },
  // [ADD]
  arrowWrap: {
    width: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },

  // [ADD]
  detailWrap: {
    backgroundColor: COLOR.gray50,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.lg,
    gap: SPACING.xs,
  },
  // [ADD]
  detailText: {
    color: COLOR.gray900,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.lg,
  },
});
