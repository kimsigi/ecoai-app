import { usePermission } from "./usePermission";
import { PERMISSION_STATE } from "./permission.constant";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "./permission.style";
import { AppButton } from "@/shared/ui/component/button";

export default function PermissionScreen({ onGranted }: { onGranted?: () => void }) {
    
    const { permissions, 
            isChecking, 
            isAllGranted, 
            getStatusColor, 
            getStatusText, 
            requestAllPermission, 
            requestPermission } = usePermission({onGranted});
    
    if (isChecking) {
        return (
        <View style={styles.container}>
            <Text style={styles.loadingText}>권한을 확인중입니다...</Text>
        </View>
        );
    }
    
    return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>앱 권한 설정</Text>
        <Text style={styles.subtitle}>
          원활한 서비스 이용을 위해{'\n'}아래 권한을 허용해주세요
        </Text>
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
                    <Text style={styles.iconText}>{permission.icon}</Text>
                    </View>
                    <View style={styles.permissionInfo}>
                    <Text style={styles.permissionTitle}>{permission.title}</Text>
                    <Text style={styles.permissionDescription}>
                        {permission.description}
                    </Text>
                    </View>
                    <View
                    style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(permission.status) },
                    ]}
                    >
                    <Text style={styles.statusText}>
                        {getStatusText(permission.status)}
                    </Text>
                    </View>
                </TouchableOpacity>
            ))
        }
      </View>
      <AppButton onPress={requestAllPermission} disabled={isAllGranted}>
        {isAllGranted ? "모두 허용됨" : "모두 허용"}
      </AppButton>
    </View>
  );
}