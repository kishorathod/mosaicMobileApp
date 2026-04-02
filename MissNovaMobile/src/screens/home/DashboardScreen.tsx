import React from 'react';
import { View, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Surface, ProgressBar, Avatar } from 'react-native-paper';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { RootState } from '@/store';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING } from '@/theme/theme';

const { width } = Dimensions.get('window');

const DashboardScreen = () => {
    const navigation = useNavigation();
    const { totalXP, dailyXP, dailyGoal, streakCount, badgeCount } = useSelector((state: RootState) => state.gamification);
    const { user } = useSelector((state: RootState) => state.auth);

    const level = Math.floor(totalXP / 1000) + 1;
    const progressToNextLevel = (totalXP % 1000) / 1000;

    const stats = [
        { label: 'Total XP', value: totalXP, icon: 'star', color: '#F59E0B' },
        { label: 'Streak', value: `${streakCount}d`, icon: 'fire', color: '#EF4444' },
        { label: 'Badges', value: badgeCount || 0, icon: 'seal-variant', color: '#8B5CF6' },
        { label: 'Hours', value: '12.5', icon: 'clock-outline', color: '#10B981' },
    ];

    const weeklyProgress = [
        { day: 'M', xp: 450 },
        { day: 'T', xp: 200 },
        { day: 'W', xp: 600 },
        { day: 'T', xp: 150 },
        { day: 'F', xp: 0 },
        { day: 'S', xp: 0 },
        { day: 'S', xp: 0 },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#1E293B" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Progress</Text>
                <TouchableOpacity style={styles.headerAction}>
                    <Icon name="share-variant" size={20} color="#1E293B" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Avatar.Text 
                        size={80} 
                        label={user?.displayName?.substring(0, 2).toUpperCase() || 'MN'} 
                        style={styles.avatar} 
                        labelStyle={styles.avatarLabel}
                    />
                    <Text style={styles.profileName}>{user?.displayName || 'Nova Learner'}</Text>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>LEVEL {level}</Text>
                    </View>
                </View>

                {/* Growth Section */}
                <Surface style={styles.growthCard}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.cardTitle}>Growth Journey</Text>
                        <Text style={styles.nextLevelText}>{(1 - progressToNextLevel) * 1000} XP to next level</Text>
                    </View>
                    <ProgressBar 
                        progress={progressToNextLevel} 
                        color={COLORS.primary} 
                        style={styles.mainProgressBar} 
                    />
                    <View style={styles.statsGrid}>
                        {stats.map((stat, i) => (
                            <View key={i} style={styles.statBox}>
                                <Icon name={stat.icon} size={20} color={stat.color} />
                                <Text style={styles.statValue}>{stat.value}</Text>
                                <Text style={styles.statLabel}>{stat.label}</Text>
                            </View>
                        ))}
                    </View>
                </Surface>

                {/* Weekly Activity */}
                <Text style={styles.sectionTitle}>Weekly Activity</Text>
                <Surface style={styles.chartCard}>
                    <View style={styles.chartRow}>
                        {weeklyProgress.map((p, i) => {
                            const barHeight = (p.xp / 600) * 80;
                            return (
                                <View key={i} style={styles.chartCol}>
                                    <View style={[styles.chartBar, { height: Math.max(barHeight, 4), backgroundColor: p.xp > 0 ? COLORS.primary : '#F1F5F9' }]} />
                                    <Text style={styles.chartLabel}>{p.day}</Text>
                                </View>
                            );
                        })}
                    </View>
                </Surface>

                {/* Skills Mastered */}
                <Text style={styles.sectionTitle}>Skills Mastered</Text>
                <View style={styles.skillsGrid}>
                    <Surface style={styles.skillBadge}>
                        <Icon name="language-javascript" size={24} color="#F7DF1E" />
                        <Text style={styles.skillName}>JavaScript</Text>
                    </Surface>
                    <Surface style={styles.skillBadge}>
                        <Icon name="react" size={24} color="#61DAFB" />
                        <Text style={styles.skillName}>React</Text>
                    </Surface>
                    <Surface style={styles.skillBadge}>
                        <Icon name="database" size={24} color="#47A248" />
                        <Text style={styles.skillName}>Node.js</Text>
                    </Surface>
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
    backButton: { padding: 8 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
    headerAction: { padding: 8 },
    scrollContent: { padding: 20, paddingBottom: 40 },
    profileSection: { alignItems: 'center', marginBottom: 24 },
    avatar: { backgroundColor: COLORS.primary, ...SHADOWS.md },
    avatarLabel: { fontWeight: 'bold' },
    profileName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginTop: 12 },
    levelBadge: { backgroundColor: '#1E293B', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12, marginTop: 8 },
    levelText: { color: "#FFFFFF", fontSize: 11, fontWeight: 'bold', letterSpacing: 1 },
    growthCard: { padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', ...SHADOWS.soft, marginBottom: 24 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
    nextLevelText: { fontSize: 11, color: '#64748B' },
    mainProgressBar: { height: 12, borderRadius: 6, backgroundColor: '#F1F5F9', marginBottom: 20 },
    statsGrid: { flexDirection: 'row', justifyContent: 'space-between' },
    statBox: { alignItems: 'center' },
    statValue: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginTop: 4 },
    statLabel: { fontSize: 11, color: '#64748B' },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
    chartCard: { padding: 20, borderRadius: 24, backgroundColor: '#FFFFFF', ...SHADOWS.soft, marginBottom: 24 },
    chartRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 100 },
    chartCol: { alignItems: 'center', width: 30 },
    chartBar: { width: 12, borderRadius: 6 },
    chartLabel: { fontSize: 11, color: '#94A3B8', marginTop: 8 },
    skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    skillBadge: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 16, backgroundColor: '#FFFFFF', ...SHADOWS.sm, gap: 8 },
    skillName: { fontSize: 13, fontWeight: '600', color: '#334155' },
});

export default DashboardScreen;
