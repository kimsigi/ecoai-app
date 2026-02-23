import { Text, View } from 'react-native';
import { getLocation } from '@/features/location/location.service';
import { getUserType } from '@/features/usertype/usertype.service';

export function HomeScreen() {
    const location = getLocation();
    const userType = getUserType();

    return (
        <View>
            <Text>HomeScreen</Text>
            <Text>lat: {location?.lat}</Text>
            <Text>lng: {location?.lng}</Text>
            <Text>주소: {location?.address}</Text>
            <Text>사용자타입: {userType}</Text>
        </View>
    );
}
