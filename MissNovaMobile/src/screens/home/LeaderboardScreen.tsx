import React from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Text, Avatar, Surface } from 'react-native-paper';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootState } from '@/store';
import { COLORS, SHADOWS, SPACING } from '@/theme/theme';

const LeaderboardScreen = () => {
    const navigation = useNavigation();
    const { leaderboard } = useSelector((state: RootState) => state.gamification);
    const { user } = useSelector((state: RootState) => state.auth);

    const renderItem = ({ item }: { item: any }) => {
        const isMe = item.id === user?.uid;
        
        return (
            <Surface style={[styles.row, isMe && styles.myRow]}>
                <View style={styles.rankContainer}>
                    {item.rank === 1 ? (
                        <Icon name="crown" size={24} color="#F59E0B" />
                    ) : item.rank === 2 ? (
                        <Icon name="medal" size={24} color="#94A3B8" />
                    ) : item.rank === 3 ? (
                        <Icon name="medal" size={24} color="#B45309" />
                    ) : (
                        <Text style={styles.rankText}>{item.rank}</Text>
                    )}
                </View>
                
                <Avatar.Text 
                    size={40} 
                    label={item.name.substring(0, 2).toUpperCase()} 
                    style={[styles.avatar, { backgroundColor: isMe ? '#1DA1F2' : '#F1F5F9' }]}
                    labelStyle={{ color: isMe ? '#FFFFFF' : '#64748B' }}
                />
                
                <View style={styles.nameContainer}>
                    <Text style={[styles.name, isMe && styles.myName]}>
                        {item.name} {isMe && '(You)'}
                    </Text>
                </View>
                
                <View style={styles.xpContainer}>
                    <Text style={styles.xpText}>{item.points} XP</Text>
                </View>
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
                <Icon name="trophy" size={48} color="#F59E0B" />
                <Text style={styles.headerTitle}>Global Leaderboard</Text>
                <Text style={styles.headerSubtitle}>Compete with students worldwide on EduChain</Text>
            </View>
            
            <FlatList
                data={leaderboard}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
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
        alignItems: 'center',
        paddingVertical: 32,
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        ...SHADOWS.md,
        marginBottom: 16,
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 12,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
    listContent: {
        padding: 16,
        paddingBottom: 32,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
        ...SHADOWS.sm,
        elevation: 2,
    },
    myRow: {
        backgroundColor: '#F0F9FF',
        borderColor: '#1DA1F2',
        borderWidth: 1,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    avatar: {
        marginHorizontal: 12,
    },
    nameContainer: {
        flex: 1,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    myName: {
        color: '#1DA1F2',
        fontWeight: 'bold',
    },
    xpContainer: {
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    xpText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#C2410C',
    },
});

export default LeaderboardScreen;
