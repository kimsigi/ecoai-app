import { StackParamList } from '@/app/app.type';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { UserType } from './usertype.type';
import { ROUTES } from '@/app/app.route';
import { getUserType, setUserType } from './usertype.service';

export function useUserType() {
    const navigation =
        useNavigation<NativeStackNavigationProp<StackParamList>>();
    const [selectedType, setSelectedType] = useState<UserType | null>(() => {
        const savedUserType = getUserType();
        return savedUserType || null;
    });

    const handleSelect = (type: UserType) => {
        setSelectedType(type);
        setUserType(type);
        navigation.push(ROUTES.HOME);
    };

    return { selectedType, handleSelect, getUserType };
}
