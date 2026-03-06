import React, { useMemo, useState } from 'react';
import {
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputContentSizeChangeEventData,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ROUTES, StackParamList } from '@/app/app.route';
import SearchNavHeader from '@/shared/ui/component/header/SearchNavHeader';
import { AppIcon } from '@/shared/ui/component/icon';
import {
  COLOR,
  FONT_FACE,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
} from '@/shared/ui/token';
import { useAiChatStore } from '@/features/aichat/aiChat.store';

// [ADD] 추천 키워드(피그마 시안 기준)
const RECOMMENDED_KEYWORDS = [
  '공기청정기',
  '인테리어',
  '가전제품',
  '폐기물 처리절차',
  '대형폐기물',
  '종량제 봉투 구매 장소',
  '건전지',
  '형광등',
  '무단 배출 신고',
] as const;

// [ADD] 검색 결과 목업 데이터
type SearchItem = {
  id: number;
  title: string;
  summary: string;
  tags: string[];
};

const SEARCH_SOURCE: SearchItem[] = [
  {
    id: 1,
    title: '에어컨',
    summary: '에어컨 분리배출 시 냉매 제거 여부와 지역별 수거 기준 확인이 필요합니다.',
    tags: ['가전제품', '폐기물 처리절차'],
  },
  {
    id: 2,
    title: '에어컨 실외기',
    summary: '실외기는 대형폐기물 또는 전문 수거 대상이며 지역 규정을 우선 확인해야 합니다.',
    tags: ['대형폐기물', '가전제품'],
  },
  {
    id: 3,
    title: '인버터 에어컨',
    summary: '인버터 제품은 모델별 부품 분리 방식이 달라 제조사 안내를 함께 확인하는 것이 안전합니다.',
    tags: ['가전제품', '인테리어'],
  },
  {
    id: 4,
    title: '에어컨 2IN1',
    summary: '2IN1 제품은 본체/실외기 분리 접수로 처리되는 경우가 많아 배출 신고를 별도로 진행해야 합니다.',
    tags: ['대형폐기물', '무단 배출 신고'],
  },
  {
    id: 5,
    title: '에어컨 필터',
    summary: '필터는 재질에 따라 일반폐기물/재활용 분류가 달라 지자체 가이드 확인이 필요합니다.',
    tags: ['폐기물 처리절차', '건전지'],
  },
];

const MIN_INPUT_HEIGHT = 40;
const MAX_INPUT_HEIGHT = 92;
const EXPAND_TRIGGER_LENGTH = 34;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function buildSelectedPrompt(item: SearchItem, query: string) {
  return [
    `[자연어 검색 선택 결과]`,
    `검색어: ${query.trim()}`,
    `선택 항목: ${item.title}`,
    `핵심 정보: ${item.summary}`,
    `연관 태그: ${item.tags.join(', ')}`,
  ].join('\n');
}

export default function HomeSearchScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();
  const insets = useSafeAreaInsets();

  const append = useAiChatStore(state => state.append);

  // [ADD] 입력/확장 상태
  const [query, setQuery] = useState('');
  const [inputHeight, setInputHeight] = useState(MIN_INPUT_HEIGHT);

  const trimmedQuery = query.trim();
  const isExpandedInput =
    query.length >= EXPAND_TRIGGER_LENGTH ||
    query.includes('\n') ||
    inputHeight > MIN_INPUT_HEIGHT + 2;

  // [ADD] 검색 필터
  const results = useMemo(() => {
    if (!trimmedQuery) return SEARCH_SOURCE;

    const q = trimmedQuery.toLowerCase();
    return SEARCH_SOURCE.filter(item => {
      const inTitle = item.title.toLowerCase().includes(q);
      const inSummary = item.summary.toLowerCase().includes(q);
      const inTags = item.tags.some(tag => tag.toLowerCase().includes(q));
      return inTitle || inSummary || inTags;
    });
  }, [trimmedQuery]);

  const pushToAiChat = (text: string) => {
    const clean = text.trim();
    if (!clean) return;

    // [ADD] AICHAT 진입 전에 사용자 메시지로 저장
    append({
      id: `${Date.now()}-${Math.random()}`,
      sender: 'user',
      html: `<div>${escapeHtml(clean)}</div>`,
    });

    navigation.navigate(ROUTES.AI_CHAT);
  };

  const handleSubmitFromInput = () => {
    if (!trimmedQuery) return;
    pushToAiChat(trimmedQuery);
  };

  const handleSelectResult = (item: SearchItem) => {
    const extracted = buildSelectedPrompt(item, query || item.title);
    pushToAiChat(extracted);
  };

  const handleInputContentSize = (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
  ) => {
    const nextHeight = Math.max(
      MIN_INPUT_HEIGHT,
      Math.min(MAX_INPUT_HEIGHT, Math.ceil(e.nativeEvent.contentSize.height)),
    );
    setInputHeight(nextHeight);
  };

  return (
    <View style={styles.container}>
      {/* [ADD] 상단 검색 헤더 */}
      <View style={[styles.headerArea, { paddingTop: insets.top + SPACING.sm }]}>
        {isExpandedInput ? (
          // [ADD] 긴 입력 시: 멀티라인 확장 헤더
          <View style={styles.expandedHeaderRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={8}>
              <AppIcon name="chevronLeft" size={24} />
            </Pressable>

            <View style={[styles.expandedInputWrap, { minHeight: inputHeight + 12 }]}>
              <TextInput
                value={query}
                onChangeText={setQuery}
                autoFocus
                multiline
                blurOnSubmit
                returnKeyType="search"
                onSubmitEditing={handleSubmitFromInput}
                onContentSizeChange={handleInputContentSize}
                placeholder="입력중..."
                placeholderTextColor={COLOR.gray700}
                style={[styles.expandedInput, { height: inputHeight }]}
                textAlignVertical="top"
              />
              {!!query && (
                <Pressable onPress={() => setQuery('')} style={styles.clearButton} hitSlop={6}>
                  <AppIcon name="close" size={12} />
                </Pressable>
              )}
            </View>
          </View>
        ) : (
          // [ADD] 기본/짧은 입력 시: SearchNavHeader 재사용
          <SearchNavHeader
            mode="input"
            value={query}
            placeholder="입력중..."
            showBack
            autoFocus
            onBackPress={() => navigation.goBack()}
            onChangeText={setQuery}
            onSubmit={handleSubmitFromInput}
            onClear={() => setQuery('')}
          />
        )}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* [ADD] 추천 키워드 */}
        <View style={styles.chipWrap}>
          {RECOMMENDED_KEYWORDS.map(keyword => (
            <Pressable
              key={keyword}
              style={styles.chip}
              onPress={() => setQuery(keyword)}
            >
              <Text style={styles.chipText}>{keyword}</Text>
            </Pressable>
          ))}
        </View>

        {/* [ADD] 검색 결과 */}
        <View style={styles.resultWrap}>
          {results.map(item => (
            <Pressable
              key={item.id}
              style={styles.resultRow}
              onPress={() => handleSelectResult(item)}
            >
              <Text style={styles.resultText}>{item.title}</Text>
            </Pressable>
          ))}

          {results.length === 0 ? (
            <View style={styles.emptyRow}>
              <Text style={styles.emptyText}>검색 결과가 없습니다.</Text>
            </View>
          ) : null}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  // [ADD]
  container: {
    flex: 1,
    backgroundColor: COLOR.gray100,
  },

  // [ADD]
  headerArea: {
    backgroundColor: COLOR.gray100,
    paddingBottom: SPACING.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
  },

  // [ADD]
  expandedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  // [ADD]
  backButton: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  // [ADD]
  expandedInputWrap: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLOR.gray300,
    borderRadius: RADIUS.xxxl,
    backgroundColor: COLOR.white,
    paddingLeft: SPACING.md,
    paddingRight: 34,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xs,
  },
  // [ADD]
  expandedInput: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.lg,
    padding: 0,
  },
  // [ADD]
  clearButton: {
    position: 'absolute',
    right: SPACING.sm,
    top: SPACING.sm,
    width: 20,
    height: 20,
    borderRadius: RADIUS.pill,
    backgroundColor: COLOR.gray300,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // [ADD]
  body: {
    flex: 1,
  },
  // [ADD]
  bodyContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.xl,
  },

  // [ADD]
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  // [ADD]
  chip: {
    borderWidth: 1,
    borderColor: COLOR.gray500,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.md,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  chipText: {
    color: COLOR.gray900,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  resultWrap: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR.gray300,
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  resultRow: {
    minHeight: 42,
    justifyContent: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    paddingHorizontal: SPACING.xs,
  },
  // [ADD]
  resultText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },

  // [ADD]
  emptyRow: {
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
  },
  // [ADD]
  emptyText: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
});
