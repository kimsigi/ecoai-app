import { ROUTES, StackParamList } from '@/app/app.route';
import { useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function HomeScreen() {

    const route = useRoute();
    const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar barStyle="light-content" backgroundColor="#2186e8" />
            <ScrollView
                contentContainerStyle={styles.screen}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Pressable style={styles.menuButton}>
                        <Text style={styles.menuIcon}>☰</Text>
                    </Pressable>

                    <Text style={styles.logoTitle}>Eco-i</Text>
                    <Text style={styles.logoSubTitle}>
                        내 손안의 AI 폐기물 처리 도우미
                    </Text>

                    <View style={styles.heroCard}>
                        <View style={styles.badgeRow}>
                            <Text style={styles.badge}>플라스틱류 배출</Text>
                            <Text style={styles.badge}>종이류 배출</Text>
                        </View>

                        <View style={styles.heroObjects}>
                            <View style={styles.bottle} />
                            <View style={styles.bin}>
                                <Text style={styles.recycle}>♻️</Text>
                            </View>
                            <View style={styles.boxOne} />
                            <View style={styles.boxTwo} />
                            <View style={styles.battery} />
                        </View>
                    </View>
                </View>

                <View style={styles.searchWrap}>
                    <Text style={styles.searchPlaceholder}>
                        🔍 AI에게 궁금한 폐기물을 물어보세요
                    </Text>
                </View>

                <View style={styles.body}>
                    <Text style={styles.mainCopy}>
                        찰칵! 가장 똑똑한 자원순환의 시작.{'\n'}
                        복잡한 분리배출 가이드,{'\n'}
                        이제 AI에게 한컷 스마트하게 실천하세요
                    </Text>

                    <Pressable 
                        style={styles.ctaCard} 
                        onPress={() => navigation.push(ROUTES.CAMERA_CAPTURE)}>
                        <View style={styles.ctaCircle}>
                            <Text style={styles.ctaIcon}>♻️</Text>
                        </View>
                    </Pressable>

                    <Text style={styles.ctaLabel}>찰칵! AI가 알려드려요</Text>

                    <View style={styles.partnerRow}>
                        <Text style={styles.partner}>기후에너지환경원</Text>
                        <Text style={styles.partner}>한국환경공단</Text>
                        <Text style={styles.partner}>대기코퍼스마트</Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#2186e8',
    },
    screen: {
        backgroundColor: '#c5daf1',
    },
    header: {
        backgroundColor: '#2186e8',
        paddingTop: 8,
        paddingHorizontal: 14,
        paddingBottom: 12,
        alignItems: 'center',
    },
    menuButton: {
        position: 'absolute',
        top: 10,
        right: 12,
        width: 44,
        height: 34,
        borderWidth: 3,
        borderColor: '#111',
        backgroundColor: '#1e6fc6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    menuIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
    logoTitle: {
        marginTop: 6,
        color: '#fff',
        fontSize: 38,
        fontWeight: '900',
        letterSpacing: 0.5,
    },
    logoSubTitle: {
        marginTop: 2,
        color: '#d9ecff',
        fontSize: 16,
        fontWeight: '700',
    },
    heroCard: {
        width: '100%',
        marginTop: 10,
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 10,
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    badge: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '800',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#dff2ff',
        backgroundColor: '#2f8de8',
    },
    heroObjects: {
        height: 108,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 8,
    },
    bottle: {
        width: 18,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#8ec7f1',
    },
    bin: {
        width: 84,
        height: 86,
        borderRadius: 10,
        backgroundColor: '#4bb0d3',
        borderWidth: 3,
        borderColor: '#5dd889',
        alignItems: 'center',
        justifyContent: 'center',
    },
    recycle: {
        fontSize: 34,
    },
    boxOne: {
        width: 44,
        height: 36,
        borderRadius: 4,
        backgroundColor: '#d8aa73',
    },
    boxTwo: {
        width: 34,
        height: 48,
        borderRadius: 4,
        backgroundColor: '#c89962',
    },
    battery: {
        width: 16,
        height: 30,
        borderRadius: 3,
        backgroundColor: '#444',
    },
    searchWrap: {
        marginHorizontal: 6,
        marginTop: 2,
        borderWidth: 2,
        borderColor: '#adc7df',
        backgroundColor: '#f2f8ff',
        borderRadius: 4,
        paddingVertical: 8,
        paddingHorizontal: 10,
    },
    searchPlaceholder: {
        color: '#7f92a8',
        fontSize: 18,
        fontWeight: '600',
    },
    body: {
        backgroundColor: '#c5daf1',
        alignItems: 'center',
        paddingTop: 16,
        paddingBottom: 20,
        paddingHorizontal: 18,
    },
    mainCopy: {
        textAlign: 'center',
        color: '#0d4590',
        fontSize: 34,
        lineHeight: 44,
        fontWeight: '900',
    },
    ctaCard: {
        marginTop: 16,
        width: 220,
        height: 180,
        borderWidth: 4,
        borderColor: '#111',
        backgroundColor: '#a8c7e6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaCircle: {
        width: 118,
        height: 118,
        borderRadius: 60,
        backgroundColor: '#2a86cf',
        borderWidth: 4,
        borderColor: '#8ed0ff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ctaIcon: {
        fontSize: 44,
    },
    ctaLabel: {
        marginTop: 10,
        color: '#001835',
        fontSize: 24,
        fontWeight: '900',
    },
    partnerRow: {
        marginTop: 18,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    partner: {
        color: '#2f4f73',
        fontSize: 11,
        fontWeight: '700',
    },
});
