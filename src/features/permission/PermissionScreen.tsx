import { usePermission } from "./usePermission";
import { PERMISSION_STATE } from "./permission.constant";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./permission.style";
import { AppButton } from "@/shared/ui/component/button";
import { PageLayout } from "@/shared/ui/component/layout";
import { AppText } from "@/shared/ui/component/text";

export default function PermissionScreen({ onGranted }: { onGranted?: () => void }) {
    
    const { permissions, 
            isChecking, 
            isAllGranted, 
            getStatusColor, 
            getStatusText, 
            requestAllPermission, 
            requestPermission } = usePermission({onGranted});

    return (
        <PageLayout
            header={false}
            useHeaderOffset={false}
            useStatusBarOffset={false}
        >
            {
                isChecking ?
                (
                    <View style={styles.container}>
                        <Text style={styles.loadingText}>권한을 확인중입니다...</Text>
                    </View>
                )
                :
                (
                    <View style={styles.container}>
                        <View style={styles.header}>
                            <AppText style={styles.title}>앱 권한 설정</AppText>
                            <AppText style={styles.subtitle}>
                            원활한 서비스 이용을 위해 아래 권한을 허용해주세요
                            </AppText>
                        </View>                
                        <View style={styles.permissionList}>
                            {
                                permissions.map((permission, _) => (
                                    <TouchableOpacity
                                        key={permission.type}
                                        style={styles.permissionItem}
                                        onPress={() => requestPermission(permission)}
                                        disabled={permission.status === PERMISSION_STATE.GRANTED}
                                    >
                                        <View style={styles.permissionIcon}>
                                            <AppText style={styles.iconText}>{permission.icon}</AppText>
                                        </View>
                                        <View style={styles.permissionInfo}>
                                            <AppText style={styles.permissionTitle}>{permission.title}</AppText>
                                            <AppText style={styles.permissionDescription}>
                                                {permission.description}
                                            </AppText>
                                        </View>
                                        <View
                                        style={[
                                            styles.statusBadge,
                                            { backgroundColor: getStatusColor(permission.status) },
                                        ]}
                                        >
                                            <AppText style={styles.statusText}>
                                                {getStatusText(permission.status)}
                                            </AppText>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            }
                        </View>
                        <AppButton onPress={requestAllPermission} disabled={isAllGranted}>
                            {isAllGranted ? "모두 허용됨" : "모두 허용"}
                        </AppButton>
                    </View>
                )
            }
        </PageLayout>
  );
}