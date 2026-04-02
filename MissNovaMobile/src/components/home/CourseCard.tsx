import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, BORDER_RADIUS } from '@/theme/theme';

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        author: string;
        progress: number;
        category: string;
        categoryColor: string;
        accentColor: string;
        icon: string;
        difficulty: string;
        type: string;
    };
    onPress: () => void;
}

export const CourseCard = ({ course, onPress }: CourseCardProps) => {
    // Safety Fallbacks
    const safeAccentColor = course.accentColor || COLORS.primary;
    const safeCategoryColor = course.categoryColor || (course.accentColor ? course.accentColor + '10' : '#F1F5F9');
    const safeIcon = course.icon || 'book-open-variant';
    const safeCategory = course.category || 'Course';
    const safeTitle = course.title || 'Untitled Course';
    const safeAuthor = course.author || 'AI Instructor';
    const safeDifficulty = course.difficulty || 'Beginner';
    const safeProgress = Math.min(Math.max(course.progress || 0, 0), 100);

    return (
        <TouchableOpacity 
            style={styles.card} 
            onPress={onPress}
            activeOpacity={0.9}
        >
            <View style={[styles.categoryBadge, { backgroundColor: safeCategoryColor }]}>
                <Text style={[styles.categoryText, { color: safeAccentColor }]}>{safeCategory}</Text>
            </View>
            
            <View style={styles.header}>
                <Text style={styles.title} numberOfLines={2}>
                    {safeTitle}
                </Text>
                <View style={[styles.iconBox, { backgroundColor: safeAccentColor + '20' }]}>
                    <Icon name={safeIcon} size={20} color={safeAccentColor} />
                </View>
            </View>

            <View style={styles.authorRow}>
                <Icon name="account-circle-outline" size={14} color="#94A3B8" />
                <Text style={styles.authorName}>{safeAuthor}</Text>
            </View>

            <View style={styles.progressContainer}>
                <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progress</Text>
                    <Text style={[styles.progressPercent, { color: safeAccentColor }]}>{safeProgress}%</Text>
                </View>
                <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${safeProgress}%`, backgroundColor: safeAccentColor }]} />
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.difficultyBadge}>
                    <Icon name="trending-up" size={14} color="#64748B" />
                    <Text style={styles.difficultyText}>{safeDifficulty}</Text>
                </View>
                
                <TouchableOpacity 
                    style={[styles.actionButton, { backgroundColor: safeAccentColor }]} 
                    onPress={onPress}
                    activeOpacity={0.8}
                >
                    <Text style={styles.actionButtonText}>
                        {safeProgress > 0 ? 'Continue' : 'Start'}
                    </Text>
                    <Icon name={safeProgress > 0 ? 'play-circle' : 'rocket-launch'} size={16} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.card,
        padding: 16,
        width: 280,
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.sm,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BORDER_RADIUS.tag,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        flex: 1,
        marginRight: 12,
        lineHeight: 22,
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        marginBottom: 16,
    },
    authorName: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    progressContainer: {
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: '#94A3B8',
        textTransform: 'uppercase',
    },
    progressPercent: {
        fontSize: 12,
        fontWeight: '800',
    },
    progressTrack: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    difficultyBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    difficultyText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
        ...SHADOWS.sm,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
