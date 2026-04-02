import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MascotSvg from '@/assets/images/mascot.svg';
import { COLORS, SHADOWS, BORDER_RADIUS } from '@/theme/theme';

interface HeroBannerProps {
    dailyXP: number;
    dailyGoal: number;
    streakCount: number;
    onPress: () => void;
}

export const HeroBanner = ({ dailyXP, dailyGoal, streakCount, onPress }: HeroBannerProps) => {
    const progress = Math.min(dailyXP / dailyGoal, 1);
    
    return (
        <TouchableOpacity 
            style={styles.heroBanner}
            onPress={onPress}
            activeOpacity={0.95}
        >
            <View style={styles.bannerContent}>
                <View style={styles.textContent}>
                    <View style={styles.streakBadge}>
                        <Text style={styles.streakText}>🔥 {streakCount} DAY STREAK</Text>
                    </View>
                    <Text style={styles.title}>Hi there! I'm Miss Nova.</Text>
                    <Text style={styles.subtitle}>What shall we learn today?</Text>
                    
                    <View style={styles.goalContainer}>
                        <View style={styles.goalHeader}>
                            <Text style={styles.goalLabel}>Daily Goal</Text>
                            <Text style={styles.goalValue}>{dailyXP}/{dailyGoal} XP</Text>
                        </View>
                        <ProgressBar 
                            progress={progress} 
                            color={COLORS.primary} 
                            style={styles.progressBar} 
                        />
                    </View>
                </View>
                
                <View style={styles.imageContainer}>
                    <View style={styles.glassCircle} />
                    <MascotSvg width={80} height={80} />
                </View>
            </View>
            
            <View style={styles.bannerFooter}>
                <Text style={styles.footerText}>TAP TO CHAT WITH YOUR AI TEACHER</Text>
                <Icon name="chevron-right" size={16} color={COLORS.primary} />
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    heroBanner: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 16,
        borderRadius: BORDER_RADIUS.card,
        ...SHADOWS.md,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    bannerContent: {
        flexDirection: 'row',
        padding: 16,
        alignItems: 'center',
    },
    textContent: {
        flex: 1,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF1F1',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: BORDER_RADIUS.tag,
        alignSelf: 'flex-start',
        marginBottom: 6,
    },
    streakText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#FF4D4D',
        letterSpacing: 0.2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 2,
    },
    subtitle: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 12,
    },
    goalContainer: {
        width: '100%',
    },
    goalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    goalLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
    },
    goalValue: {
        fontSize: 11,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F1F5F9',
    },
    imageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 8,
    },
    glassCircle: {
        position: 'absolute',
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#F0F9FF',
    },
    bannerFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#F8FAFC',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    footerText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 0.4,
    }
});
