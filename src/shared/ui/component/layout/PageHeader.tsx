import { View, Text, Pressable, StyleProp, ViewStyle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { SPACING } from "@/shared/ui/token";
import { AppIcon } from "@/shared/ui/component/icon";
import { PageHeaderProps } from "./layout.type";
import { DEFAULT_HEADER_HEIGHT, DEFAULT_SIDE_WIDTH } from "./layout.constant";
import { styles } from "./layout.style";

export default function PageHeader({
    title,
    back,
    right = [],
    bottomLine,
    style,
}: PageHeaderProps) {

    const navigation = useNavigation();
    
    return (
        <View
            style={[
                {
                    height: DEFAULT_HEADER_HEIGHT,
                },
                styles.pageHeaderContainer,
                bottomLine && styles.pageHeaderBottomLine,
                style,
            ]}
        >
            {/* LEFT */}
            <View
                style={[
                    {
                        width: DEFAULT_SIDE_WIDTH,
                    },
                    styles.pageHeaderLeft
                ]}
            >
                { 
                    back && 
                    (
                        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
                            <AppIcon name="chevronLeft" size={24} />
                        </Pressable>
                    )
                }
            </View>

            {/* CENTER */}
            <View
                style={
                    styles.pageHeaderCenter
                }
            >
                <Text numberOfLines={1} style={styles.pageHeaderTitle}>
                    {title}
                </Text>
            </View>

            {/* RIGHT */}
            <View
                style={[
                    {
                        width: DEFAULT_SIDE_WIDTH,
                    },
                    styles.pageHeaderRight
                ]}
            >
                { 
                    right.slice(0, 2).map((item, i) => (
                        <Pressable
                            key={i}
                            onPress={item.onPress}
                            hitSlop={8}
                            style={{
                                marginLeft: i === 0 ? 0 : SPACING.sm,
                            }}
                        >
                            {item.icon}
                        </Pressable>
                    ))
                }
            </View>
        </View>
    );
}