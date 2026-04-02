import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SHADOWS, BORDER_RADIUS } from '@/theme/theme';

interface DailyStreakWidgetProps {
    streakCount: number;
}

export const DailyStreakWidget = ({ streakCount }: DailyStreakWidgetProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.fireCircle}>
                    <Icon name="fire" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{streakCount} Day Streak!</Text>
                    <Text style={styles.subtitle}>You're on fire! Keep it up today.</Text>
                </View>
                <View style={styles.xpBonus}>
                    <Text style={styles.bonusText}>+50 XP Bonus</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 16,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#1E293B',
        borderRadius: BORDER_RADIUS.card,
    },
    fireCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#FF4D4D',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    subtitle: {
        fontSize: 12,
        color: '#94A3B8',
    },
    xpBonus: {
        backgroundColor: 'rgba(52, 211, 153, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BORDER_RADIUS.tag,
    },
    bonusText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#10B981',
    },
});
