import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Calendar, DateData, LocaleConfig } from 'react-native-calendars';

import { AppIcon } from '@/shared/ui/component/icon';
import {
  COLOR,
  FONT_FACE,
  FONT_SIZE,
  LINE_HEIGHT,
  RADIUS,
  SPACING,
} from '@/shared/ui/token';

LocaleConfig.locales.ko = {
  monthNames: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  monthNamesShort: [
    '1월',
    '2월',
    '3월',
    '4월',
    '5월',
    '6월',
    '7월',
    '8월',
    '9월',
    '10월',
    '11월',
    '12월',
  ],
  dayNames: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
  dayNamesShort: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
  today: '오늘',
};
LocaleConfig.defaultLocale = 'ko';

const TIME_SLOTS = [
  '06:00~09:00',
  '09:00~12:00',
  '12:00~15:00',
  '15:00~18:00',
  '18:00~21:00',
  '21:00~24:00',
] as const;

type Props = {
  visible: boolean;
  initialDate: string;
  initialTime: string;
  onClose: () => void;
  onConfirm: (payload: { date: string; timeSlot: string }) => void;
};

function toKoreanDate(isoDate: string) {
  const d = new Date(`${isoDate}T00:00:00`);
  return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일`;
}

function todayIso() {
  const now = new Date();
  const y = now.getFullYear();
  const m = `${now.getMonth() + 1}`.padStart(2, '0');
  const d = `${now.getDate()}`.padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export default function DisposalScheduleOverlay({
  visible,
  initialDate,
  initialTime,
  onClose,
  onConfirm,
}: Props) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedTime, setSelectedTime] = useState(initialTime);

  const markedDates = useMemo(
    () => ({
      [selectedDate]: {
        selected: true,
        selectedColor: COLOR.blue600,
        selectedTextColor: COLOR.white,
      },
    }),
    [selectedDate],
  );

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>배출예정 일시 선택</Text>
            <Pressable onPress={onClose} style={styles.closeBtn} hitSlop={8}>
              <AppIcon name="close" size={20} />
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>배출예정 일</Text>

          <Calendar
            current={selectedDate}
            minDate={todayIso()}
            markedDates={markedDates}
            onDayPress={onDayPress}
            monthFormat="yyyy년 MM월"
            hideExtraDays={false}
            enableSwipeMonths
            theme={{
              textMonthFontFamily: FONT_FACE.pretendard.bold,
              textMonthFontSize: FONT_SIZE.displaySm,
              textDayFontFamily: FONT_FACE.pretendard.semibold,
              textDayFontSize: FONT_SIZE.md,
              textDayHeaderFontFamily: FONT_FACE.pretendard.bold,
              textDayHeaderFontSize: FONT_SIZE.xs,
              todayTextColor: COLOR.blue600,
              arrowColor: COLOR.gray900,
              dayTextColor: COLOR.gray950,
              textDisabledColor: COLOR.gray400,
            }}
            style={styles.calendar}
          />

          <Text style={styles.warningText}>ⓘ 배출예정 일은 내일부터 선택 가능합니다</Text>

          <Text style={[styles.sectionTitle, styles.timeSectionTitle]}>배출예정 시간</Text>

          <View style={styles.timeGrid}>
            {TIME_SLOTS.map(slot => {
              const active = slot === selectedTime;
              return (
                <Pressable
                  key={slot}
                  style={[styles.timeBtn, active && styles.timeBtnActive]}
                  onPress={() => setSelectedTime(slot)}
                >
                  <Text style={[styles.timeBtnText, active && styles.timeBtnTextActive]}>
                    {slot}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={styles.confirmBtn}
            onPress={() => onConfirm({ date: selectedDate, timeSlot: selectedTime })}
          >
            <Text style={styles.confirmBtnText}>
              {toKoreanDate(selectedDate)} {selectedTime} 선택
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  // [ADD]
  backdrop: {
    flex: 1,
    backgroundColor: '#00000066',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  // [ADD]
  sheet: {
    backgroundColor: COLOR.gray100,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  // [ADD]
  header: {
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  // [ADD]
  headerTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xxl,
    lineHeight: LINE_HEIGHT.xxl,
  },
  // [ADD]
  closeBtn: {
    position: 'absolute',
    right: 0,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  sectionTitle: {
    color: COLOR.gray950,
    fontFamily: FONT_FACE.pretendard.bold,
    fontSize: FONT_SIZE.xl,
    lineHeight: LINE_HEIGHT.xl,
    marginBottom: SPACING.sm,
  },
  // [ADD]
  calendar: {
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLOR.gray300,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    backgroundColor: COLOR.white,
  },
  // [ADD]
  warningText: {
    marginTop: SPACING.sm,
    color: '#FF3B30',
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.xs,
    lineHeight: LINE_HEIGHT.sm,
  },
  // [ADD]
  timeSectionTitle: {
    marginTop: SPACING.lg,
  },
  // [ADD]
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  // [ADD]
  timeBtn: {
    width: '48%',
    height: 40,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLOR.gray500,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR.gray100,
  },
  // [ADD]
  timeBtnActive: {
    borderColor: COLOR.blue600,
    backgroundColor: COLOR.blue50,
  },
  // [ADD]
  timeBtnText: {
    color: COLOR.gray700,
    fontFamily: FONT_FACE.pretendard.regular,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
  // [ADD]
  timeBtnTextActive: {
    color: COLOR.blue600,
    fontFamily: FONT_FACE.pretendard.semibold,
  },
  // [ADD]
  confirmBtn: {
    marginTop: SPACING.xl,
    height: 44,
    borderRadius: RADIUS.sm,
    backgroundColor: COLOR.blue600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // [ADD]
  confirmBtnText: {
    color: COLOR.white,
    fontFamily: FONT_FACE.pretendard.semibold,
    fontSize: FONT_SIZE.md,
    lineHeight: LINE_HEIGHT.md,
  },
});
