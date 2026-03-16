import {
    Pressable,
    Text,
    View,
} from 'react-native';
import { PageLayout } from '@/shared/ui/component/layout';
import { AppIcon } from '@/shared/ui/component/icon';
import { styles } from './usertype.style';
import { UserTypeBadgeName } from './usertype.type';
import { USER_TYPES } from './usertype.model';
import { useUserType } from './useUserType';

export default function UserTypeScreen() {
    const { 
        contentWidth,
        selectedType,
        handleSelect,
    } = useUserType();

    return (
        <PageLayout
            back
            headerBottomLine
        >
            <View style={styles.container}>
                <View style={[styles.section, { width: contentWidth }]}>
                    <Text style={styles.title}>배출자 유형을 선택해주세요.</Text>

                    <View style={styles.buttonGroup}>
                        {
                            USER_TYPES.map((option) => {
                                const isSelected = selectedType === option.type;
                                const badgeName = `${option.badge}${isSelected ? 'Active' : 'Inactive'}` as UserTypeBadgeName;

                                return (
                                    <Pressable
                                        key={option.type}
                                        accessibilityRole="button"
                                        accessibilityLabel={`${option.label} 선택`}
                                        onPress={() => handleSelect(option.type)}
                                        style={[
                                            styles.button,
                                            isSelected
                                                ? styles.buttonActive
                                                : styles.buttonInactive,
                                        ]}
                                    >
                                        <View
                                            style={[
                                                styles.badge,
                                            ]}
                                        >
                                            <AppIcon name={badgeName} size={40} />
                                        </View>

                                        <Text
                                            style={[
                                                styles.label,
                                                isSelected
                                                    ? styles.labelActive
                                                    : styles.labelInactive,
                                            ]}
                                        >
                                            {option.label}
                                        </Text>
                                    </Pressable>
                                );
                            })
                        }
                    </View>
                </View>
            </View>
        </PageLayout>
    );
}
