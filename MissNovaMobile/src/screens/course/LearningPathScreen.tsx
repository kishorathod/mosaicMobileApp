import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '@/theme/theme';

const LearningPathScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { topic } = (route.params as any) || { topic: 'JavaScript Mastery' };

    // Mock data for the learning path
    const milestones = [
        { id: 1, title: 'The Basics', desc: 'Variables, types, and operators', status: 'completed' },
        { id: 2, title: 'Control Flow', desc: 'Loops, if-else, and functions', status: 'current' },
        { id: 3, title: 'Advanced Concepts', desc: 'Closures, prototypes, and async', status: 'locked' },
        { id: 4, title: 'Frameworks', desc: 'React, Vue, or Angular basics', status: 'locked' },
        { id: 5, title: 'Final Project', desc: 'Build a real-world application', status: 'locked' },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Learning Path</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.topicCard}>
                    <Icon name="map-marker-path" size={40} color={COLORS.primary} />
                    <View style={styles.topicInfo}>
                        <Text style={styles.topicTitle}>{topic}</Text>
                        <Text style={styles.topicSubtitle}>Your personalized AI roadmap</Text>
                    </View>
                </View>

                <View style={styles.timelineContainer}>
                    {milestones.map((milestone, index) => {
                        const isLast = index === milestones.length - 1;
                        const isCompleted = milestone.status === 'completed';
                        const isCurrent = milestone.status === 'current';
                        const isLocked = milestone.status === 'locked';

                        return (
                            <View key={milestone.id} style={styles.milestoneRow}>
                                <View style={styles.indicatorCol}>
                                    <View style={[
                                        styles.dot, 
                                        isCompleted && styles.completedDot,
                                        isCurrent && styles.currentDot,
                                        isLocked && styles.lockedDot
                                    ]}>
                                        <Icon 
                                            name={isCompleted ? 'check' : isCurrent ? 'play' : 'lock'} 
                                            size={14} 
                                            color="#FFFFFF" 
                                        />
                                    </View>
                                    {!isLast && (
                                        <View style={[
                                            styles.line,
                                            isCompleted && styles.completedLine
                                        ]} />
                                    )}
                                </View>
                                <Surface style={[
                                    styles.card,
                                    isCurrent && styles.currentCard,
                                    isLocked && styles.lockedCard
                                ]}>
                                    <Text style={[styles.milestoneTitle, isLocked && styles.lockedText]}>
                                        {milestone.title}
                                    </Text>
                                    <Text style={styles.milestoneDesc}>{milestone.desc}</Text>
                                    {isCurrent && (
                                        <TouchableOpacity 
                                            style={styles.continueButton}
                                            onPress={() => (navigation as any).navigate('Course', { course: { id: 'path-course', title: topic, slides: [] } })}
                                        >
                                            <Text style={styles.continueButtonText}>Continue</Text>
                                            <Icon name="chevron-right" size={16} color="#FFFFFF" />
                                        </TouchableOpacity>
                                    )}
                                </Surface>
                            </View>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 60,
        paddingBottom: 20,
        backgroundColor: '#FFFFFF',
        ...SHADOWS.sm,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    scrollContent: {
        padding: 20,
    },
    topicCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: BORDER_RADIUS.card,
        marginBottom: 30,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    topicInfo: {
        marginLeft: 16,
    },
    topicTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    topicSubtitle: {
        fontSize: 14,
        color: '#64748B',
    },
    timelineContainer: {
        paddingLeft: 10,
    },
    milestoneRow: {
        flexDirection: 'row',
        minHeight: 100,
    },
    indicatorCol: {
        alignItems: 'center',
        marginRight: 20,
    },
    dot: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        ...SHADOWS.sm,
    },
    completedDot: { backgroundColor: '#22C55E' },
    currentDot: { backgroundColor: COLORS.primary },
    lockedDot: { backgroundColor: '#CBD5E1' },
    line: {
        flex: 1,
        width: 4,
        backgroundColor: '#E2E8F0',
        marginTop: -4,
    },
    completedLine: { backgroundColor: '#22C55E' },
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 20,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    currentCard: {
        borderColor: COLORS.primary,
        borderWidth: 2,
        backgroundColor: '#F0F9FF',
    },
    lockedCard: {
        backgroundColor: '#F8FAFC',
        opacity: 0.8,
    },
    milestoneTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1E293B',
        marginBottom: 4,
    },
    lockedText: { color: '#94A3B8' },
    milestoneDesc: {
        fontSize: 13,
        color: '#64748B',
        lineHeight: 18,
    },
    continueButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 8,
        borderRadius: 8,
        marginTop: 12,
        gap: 4,
    },
    continueButtonText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: 'bold',
    },
});

export default LearningPathScreen;
