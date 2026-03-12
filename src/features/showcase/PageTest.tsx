import { useAlert } from "@/shared/ui/component/alert";
import { AppIcon } from "@/shared/ui/component/icon";
import PageLayout from "@/shared/ui/component/layout/PageLayout";
import { AppLottie } from "@/shared/ui/component/lottie";
import { COLOR } from "@/shared/ui/token";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PageTest() {
    const inset = useSafeAreaInsets();

    const {alert} = useAlert()
    const onPress1 = function () {
        alert("아이콘1");
    }
    const onPress2 = function () {
        alert("아이콘2");
    }

    return (
        <PageLayout
            title="동해물과백두산이마르고닳도록하느님이보우하사우리나라만세무궁화삼천리화려강산대한사람대한으로길이보전하세"
            back
            right={[
                        {
                            icon: <AppLottie name="notificationActive" size={24} scale={1.2} />,
                            onPress: onPress1,
                        },
                        {
                            icon: <AppIcon name="menu" size={24} />,
                            onPress: onPress2,
                        },
                    ]}
            statusBarStyle={{backgroundColor: COLOR.blue500}}
            headerStyle={{backgroundColor: COLOR.blue500}}
            statusBarLight
        >
            <View style={{ flex: 1, padding: 20, backgroundColor: 'red' }}>
                <Text>컨텐츠 영역</Text>
            </View>
        </PageLayout>
    );
}
