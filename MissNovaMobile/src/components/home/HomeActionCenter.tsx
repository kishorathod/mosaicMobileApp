import React from 'react';
import { View, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Text, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '@/theme/theme';

interface HomeActionCenterProps {
    dailyXP: number;
    dailyGoal: number;
    streakCount: number;
    lvl: number;
    onChallengePress: () => void;
}

export const HomeActionCenter: React.FC<HomeActionCenterProps> = ({
    dailyXP,
    dailyGoal,
    streakCount,
    lvl,
    onChallengePress,
}) => {
    const progress = Math.min(dailyXP / dailyGoal, 1);

    return (
        <View style={styles.container}>
            {/* Top Row: Level and Streak */}
            <View style={styles.statsRow}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>LVL {lvl}</Text>
                </View>
                <View style={styles.badgeSpacer} />
                <View style={styles.streakBadge}>
                    <Icon name="fire" size={16} color="#F97316" />
                    <Text style={styles.streakText}>{streakCount} day streak</Text>
                </View>
            </View>

            {/* Daily Goal card */}
            <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                    <View style={styles.progressTitleRow}>
                        <Icon name="bullseye-arrow" size={18} color={COLORS.primary} style={{ marginRight: 6 }} />
                        <Text style={styles.progressTitle}>Daily Goal</Text>
                    </View>
                    <Text style={styles.progressData}>{dailyXP}/{dailyGoal} XP</Text>
                </View>
                <ProgressBar 
                    progress={progress} 
                    color={COLORS.primary} 
                    style={styles.progressBar} 
                />
            </View>

            {/* Daily Challenge CTA */}
            <TouchableOpacity 
                style={styles.challengeCard}
                onPress={onChallengePress}
                activeOpacity={0.9}
            >
                <View style={styles.challengeIcon}>
                    <Icon name="lightning-bolt" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.challengeContent}>
                    <Text style={styles.challengeTitle}>Today's Challenge</Text>
                    <Text style={styles.challengeSubtitle}>Complete 1 quick lesson to boost XP!</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#94A3B8" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 20,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        paddingHorizontal: 4, // Align with inner card content
    },
    badgeSpacer: {
        width: 10,
    },
    levelBadge: {
        backgroundColor: '#1E293B',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.tag,
        ...SHADOWS.sm,
    },
    levelText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    streakBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BORDER_RADIUS.tag,
        borderWidth: 1,
        borderColor: '#FFEDD5',
    },
    streakText: {
        color: '#C2410C',
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    progressCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.card,
        padding: 16,
        marginBottom: 12,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    progressTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    progressTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    progressData: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F1F5F9',
    },
    challengeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.card,
        padding: 12,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    challengeIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
        ...SHADOWS.sm,
    },
    challengeContent: {
        flex: 1,
    },
    challengeTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    challengeSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },
});
