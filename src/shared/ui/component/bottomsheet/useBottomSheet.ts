import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useEffect, useMemo, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetProps } from './bottomsheet.type';
import { Dimensions } from 'react-native';

export const SCREEN_HEIGHT = Dimensions.get('window').height;

export function useBottomSheet(props: BottomSheetProps) {
    const {
        open,
        fixedHeight,
        topInset = 0,
        maxHeightRatio = 0.8,
        heightMode = 'expandable',
    } = props;

    const bottomSheetRef = useRef<BottomSheetModal>(null);
    const insets = useSafeAreaInsets();
    const insetTop = topInset;
    const insetBottom = insets.bottom;

    const maxDynamicContentSize = useMemo(() => {
        return SCREEN_HEIGHT * maxHeightRatio;
    }, [maxHeightRatio]);

    const { snapPoints, enableDynamicSizing } = useMemo(() => {
        if (heightMode === 'fixed') {
            return {
                snapPoints: [fixedHeight ?? SCREEN_HEIGHT * 0.5],
                enableDynamicSizing: false,
            };
        }

        if (heightMode === 'fitContent') {
            return {
                snapPoints: undefined,
                enableDynamicSizing: true,
            };
        }

        return {
            snapPoints: ['80%'],
            enableDynamicSizing: true,
        };
    }, [fixedHeight, heightMode]);

    useEffect(() => {
        if (open) {
            bottomSheetRef.current?.present();
            return;
        }

        bottomSheetRef.current?.dismiss();
    }, [open]);

    return {
        bottomSheetRef,
        snapPoints,
        enableDynamicSizing,
        maxDynamicContentSize,
        insetTop,
        insetBottom,
    };
}
