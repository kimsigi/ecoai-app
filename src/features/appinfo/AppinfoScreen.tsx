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

// [ADD] 앱 정보 화면 마크업 (피그마 시안 기준)
export default function AppinfoScreen() {
  return (
    <PageLayout
        back
        title="앱 정보"
    >
      <View style={styles.container}>
        {/* [ADD] 섹션 타이틀 */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>앱 이름</Text>
        </View>

        {/* [ADD] 현재 버전 안내 */}
        <View style={styles.row}>
          <Text style={styles.rowText}>최신 버전(1.0.1)을 사용하고 있습니다.</Text>
        </View>

        {/* [ADD] 업데이트 안내 행 */}
        <Pressable style={styles.rowPressable}>
          <Text style={styles.rowText}>최신 버전(1.0.2)으로 업데이트 하시겠습니까?</Text>
          <AppIcon name="arrowRight" size={18} />
        </Pressable>

        {/* [ADD] 권한 메뉴 행 */}
        <Pressable style={styles.rowPressable}>
          <Text style={styles.rowTitle}>권한</Text>
          <AppIcon name="arrowRight" size={18} />
        </Pressable>
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
  sectionHeader: {
    height: 38,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  sectionHeaderText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  row: {
    minHeight: 40,
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  rowPressable: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    backgroundColor: COLOR.white,
  },
  // [ADD]
  rowText: {
    flex: 1,
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
    marginRight: SPACING.sm,
  },
  // [ADD]
  rowTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
});