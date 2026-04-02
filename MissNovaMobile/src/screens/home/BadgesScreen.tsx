import React from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '@/store';
import { COLORS, SHADOWS } from '@/theme/theme';

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 48) / 2;

const BadgesScreen = () => {
    const navigation = useNavigation();
    const { badges } = useSelector((state: RootState) => state.gamification);

    const renderItem = ({ item }: { item: any }) => {
        const isUnlocked = !!item.unlockedAt;
        
        return (
            <Surface style={[styles.badgeCard, !isUnlocked && styles.lockedBadge]}>
                <View style={[styles.iconContainer, { backgroundColor: isUnlocked ? '#E0F2FE' : '#F1F5F9' }]}>
                    <Icon 
                        name={item.icon} 
                        size={48} 
                        color={isUnlocked ? '#1DA1F2' : '#94A3B8'} 
                    />
                    {!isUnlocked && (
                        <View style={styles.lockOverlay}>
                            <Icon name="lock" size={20} color="#64748B" />
                        </View>
                    )}
                </View>
                
                <Text style={[styles.badgeName, !isUnlocked && styles.lockedText]}>
                    {item.name}
                </Text>
                <Text style={styles.badgeDescription}>
                    {item.description}
                </Text>
                
                {isUnlocked && (
                    <View style={styles.unlockedTag}>
                        <Icon name="check-decagram" size={14} color="#15803D" />
                        <Text style={styles.unlockedText}>Unlocked</Text>
                    </View>
                )}
            </Surface>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => (navigation as any).canGoBack() ? navigation.goBack() : (navigation as any).navigate('Home')}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerIcon}>
                    <Icon name="seal-variant" size={40} color="#8B5CF6" />
                </View>
                <Text style={styles.headerTitle}>My Achievements</Text>
                <Text style={styles.headerSubtitle}>
                    Earn badges by completing courses and excelling in quizzes
                </Text>
            </View>
            
            <FlatList
                data={badges}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                numColumns={2}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.columnWrapper}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: 'center',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...SHADOWS.md,
        marginBottom: 8,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        zIndex: 10,
    },
    headerIcon: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3E8FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 20,
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    badgeCard: {
        width: COLUMN_WIDTH,
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        ...SHADOWS.sm,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    lockedBadge: {
        opacity: 0.7,
        backgroundColor: '#F8FAFC',
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    lockOverlay: {
        position: 'absolute',
        top: -4,
        right: -4,
        backgroundColor: '#E2E8F0',
        padding: 4,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FFFFFF',
    },
    badgeName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        textAlign: 'center',
    },
    lockedText: {
        color: '#64748B',
    },
    badgeDescription: {
        fontSize: 12,
        color: '#6B7280',
        textAlign: 'center',
        marginTop: 4,
        lineHeight: 16,
    },
    unlockedTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 12,
        gap: 4,
    },
    unlockedText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#15803D',
        textTransform: 'uppercase',
    },
});

export default BadgesScreen;
