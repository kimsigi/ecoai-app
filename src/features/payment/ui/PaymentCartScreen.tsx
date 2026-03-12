import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

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

type CartItem = {
  id: number;
  name: string;
  condition: string;
  unitPrice: number;
  quantity: number;
};

const INITIAL_ITEMS: CartItem[] = [
  { id: 1, name: '의자', condition: '훼손/부식', unitPrice: 4000, quantity: 1 },
  { id: 2, name: '냉장고', condition: '500리터 이상', unitPrice: 15000, quantity: 1 },
];

const formatWon = (value: number) => `${value.toLocaleString('ko-KR')} 원`;

export default function PaymentCartScreen() {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);

  const updateQty = (id: number, next: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, next) } : item,
      ),
    );
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const totalCount = useMemo(
    () => items.reduce((acc, cur) => acc + cur.quantity, 0),
    [items],
  );

  const totalFee = useMemo(
    () => items.reduce((acc, cur) => acc + cur.unitPrice * cur.quantity, 0),
    [items],
  );

  return (
    <PageLayout
        title="배출카트"
        right={[
            {
                icon: <AppIcon name="close" size={24} />,
                //onPress: 
            },
        ]}
    >
      <View style={styles.container}>
        <View style={styles.listWrap}>
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.thumb} />
              <View style={styles.itemContent}>
                <View style={styles.itemTopRow}>
                  <View style={styles.itemTextWrap}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemCondition}>{item.condition}</Text>
                  </View>
                  <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                    <AppIcon name="close" size={16} />
                  </Pressable>
                </View>

                <View style={styles.itemBottomRow}>
                  <View style={styles.counterRow}>
                    <Pressable
                      style={styles.counterBtn}
                      onPress={() => updateQty(item.id, item.quantity - 1)}
                    >
                      <Text style={styles.counterBtnText}>-</Text>
                    </Pressable>
                    <View style={styles.counterValueBox}>
                      <Text style={styles.counterValue}>{item.quantity}</Text>
                    </View>
                    <Pressable
                      style={styles.counterBtn}
                      onPress={() => updateQty(item.id, item.quantity + 1)}
                    >
                      <Text style={styles.counterBtnText}>+</Text>
                    </Pressable>
                  </View>

                  <Text style={styles.priceText}>
                    {formatWon(item.unitPrice * item.quantity)}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <Pressable style={styles.addBtn}>
          <Text style={styles.addBtnText}>+ 배출 품목 추가</Text>
        </Pressable>

        <View style={styles.bottomArea}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>수수료 합계</Text>
            <Text style={styles.summaryValue}>총 {totalCount}개</Text>
            <Text style={styles.summaryTotal}>총 {formatWon(totalFee)}</Text>
          </View>

          <Pressable style={styles.submitBtn}>
            <Text style={styles.submitBtnText}>배출 신청</Text>
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
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
    color: COLOR.gray950,
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
  listWrap: {
    backgroundColor: COLOR.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLOR.gray300,
  },
  // [ADD]
  itemRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLOR.gray300,
    gap: SPACING.md,
  },
  // [ADD]
  thumb: {
    width: 62,
    height: 62,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLOR.gray300,
    backgroundColor: COLOR.gray50,
  },
  // [ADD]
  itemContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  // [ADD]
  itemTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  // [ADD]
  itemTextWrap: {
    gap: 2,
  },
  // [ADD]
  itemName: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.lg,
  },
  // [ADD]
  itemCondition: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },

  // [ADD]
  itemBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // [ADD]
  counterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  // [ADD]
  counterBtn: {
    width: 22,
    height: 22,
    borderRadius: RADIUS.xs,
    backgroundColor: COLOR.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  counterBtnText: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.lg,
    lineHeight: LINE_HEIGHT.md,
  },
  // [ADD]
  counterValueBox: {
    minWidth: 26,
    height: 22,
    borderWidth: 1,
    borderColor: COLOR.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xs,
  },
  // [ADD]
  counterValue: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.sm,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  priceText: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },

  // [ADD]
  addBtn: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    height: 42,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.white,
  },
  // [ADD]
  addBtnText: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },

  // [ADD]
  bottomArea: {
    marginTop: 'auto',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingTop: SPACING.xl,
    gap: SPACING.lg,
  },
  // [ADD]
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // [ADD]
  summaryLabel: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  summaryValue: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },
  // [ADD]
  summaryTotal: {
    color: COLOR.black,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
  },

  // [ADD]
  submitBtn: {
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  submitBtnText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
});