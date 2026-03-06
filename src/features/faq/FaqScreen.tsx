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

// [ADD] FAQ mock data (피그마 시안 기준 마크업용)
type FaqItem = {
  id: number;
  category: string;
  question: string;
  date: string;
  answer: string;
};

const FAQ_LIST: FaqItem[] = [
  {
    id: 1,
    category: '구분',
    question: '회원가입을 해야 사용할 수 있나요? 회원가입을 해야 사용할 수 있나요?',
    date: '2026-05-01',
    answer: '회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.',
  },
  {
    id: 2,
    category: '구분',
    question: '회원가입을 해야 사용할 수 있나요? 회원가입을 해야 사용할 수 있나요?',
    date: '2026-05-01',
    answer: '회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.',
  },
  {
    id: 3,
    category: '구분',
    question: '회원가입을 해야 사용할 수 있나요? 회원가입을 해야 사용할 수 있나요?',
    date: '2026-05-01',
    answer: '회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.',
  },
  {
    id: 4,
    category: '구분',
    question: '회원가입을 해야 사용할 수 있나요? 회원가입을 해야 사용할 수 있나요?',
    date: '2026-05-01',
    answer: '회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.회원가입은 하지않아도 사용 가능합니다.',
  },
];

export default function FaqScreen() {
  // [ADD] 3번 항목 기본 펼침 (피그마 기준)
  const [expandedId, setExpandedId] = useState<number>(3);

  const items = useMemo(() => FAQ_LIST, []);

  return (
    <PageLayout
      headerState="content"
      showBack
      headerHeight={44}
      headerContainerStyle={styles.headerContainer}
      headerCenter={<Text style={styles.headerTitle}>자주 묻는 질문</Text>}
      contentContainerStyle={styles.contentContainer}
      protectBottomInset
    >
      <View style={styles.container}>
        {/* [ADD] 검색 바 */}
        <View style={styles.searchWrap}>
          <View style={styles.searchInputWrap}>
            <AppIcon name="search" size={22} />
            <TextInput
              style={styles.searchInput}
              placeholder="무엇이 궁금하신 가요?"
              placeholderTextColor={COLOR.gray700}
            />
          </View>
        </View>

        {/* [ADD] FAQ 리스트 */}
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
                    <View style={styles.badge}>
                      <Text style={styles.badgeText}>{item.category}</Text>
                    </View>

                    <Text
                      numberOfLines={1}
                      style={[styles.questionText, expanded && styles.questionTextExpanded]}
                    >
                      {item.question}
                    </Text>

                    <Text style={styles.dateText}>{item.date}</Text>
                  </View>

                  <View style={styles.arrowWrap}>
                    <AppIcon name={expanded ? 'chevronUp' : 'chevronDown'} size={22} />
                  </View>
                </Pressable>

                {expanded ? (
                  <View style={styles.answerWrap}>
                    <Text style={styles.answerText}>{item.answer}</Text>
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
    letterSpacing: 0,
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
  searchWrap: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.md,
  },
  // [ADD]
  searchInputWrap: {
    height: 42,
    borderWidth: 1,
    borderColor: COLOR.gray400,
    borderRadius: RADIUS.pill,
    backgroundColor: COLOR.gray100,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  // [ADD]
  searchInput: {
    flex: 1,
    padding: 0,
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
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
    minHeight: 88,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.xl,
    paddingRight: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  // [ADD]
  itemMain: {
    flex: 1,
    gap: SPACING.xs,
  },
  // [ADD]
  badge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: COLOR.blue500,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  badgeText: {
    color: COLOR.blue500,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  questionText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  questionTextExpanded: {
    color: COLOR.blue700,
  },
  // [ADD]
  dateText: {
    color: COLOR.gray600,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  arrowWrap: {
    width: 24,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },

  // [ADD]
  answerWrap: {
    backgroundColor: COLOR.gray50,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  // [ADD]
  answerText: {
    color: COLOR.gray900,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.xl,
  },
});