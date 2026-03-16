import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { UserType } from './usertype.type';
import { ROUTES, StackParamList } from '@/app/app.route';
import { getUserType, setUserType } from './usertype.service';
import { useWindowDimensions } from 'react-native';

export function useUserType() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();

    const { width } = useWindowDimensions();
    const contentWidth = Math.min(width - 32, 360);

    const [selectedType, setSelectedType] = useState<UserType | null>(() => {
        const savedUserType = getUserType();
        return savedUserType || null;
    });

    const handleSelect = (type: UserType) => {
        setSelectedType(type);
        setUserType(type);
        navigation.push(ROUTES.HOME);
    };

    return {
        contentWidth,
        selectedType,
        handleSelect,
    };
}
