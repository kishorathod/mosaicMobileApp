import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Menu, Divider } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MascotSvg from '@/assets/images/mascot.svg';
import { COLORS, SHADOWS } from '@/theme/theme';

interface HomeHeaderProps {
    totalXP: number;
    rank: number;
    menuVisible: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    onNavigate: (screen: string) => void;
    onLogout: () => void;
}

export const HomeHeader = ({
    totalXP,
    rank,
    menuVisible,
    openMenu,
    closeMenu,
    onNavigate,
    onLogout,
}: HomeHeaderProps) => {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                <Text style={styles.headerTitle}>Miss Nova</Text>
            </View>

            <View style={styles.headerRight}>
                <View style={styles.statsContainer}>
                    <View style={styles.xpPill}>
                        <Icon name="star" size={14} color="#F59E0B" />
                        <Text style={styles.xpText}>{totalXP} XP</Text>
                    </View>
                    <View style={styles.rankPill}>
                        <Icon name="trophy" size={14} color="#64748B" />
                        <Text style={styles.rankText}>#{rank}</Text>
                    </View>
                </View>
                <Menu
                    visible={menuVisible}
                    onDismiss={closeMenu}
                    anchor={
                        <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                            <Icon name="menu" size={24} color={COLORS.text} />
                        </TouchableOpacity>
                    }
                    contentStyle={styles.menuContent}
                >
                    <Menu.Item 
                        onPress={() => { closeMenu(); onNavigate('Degrees'); }} 
                        title="Academic Degrees" 
                        leadingIcon={({ size }) => <Icon name="school" size={size} color="#1DA1F2" />}
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item 
                        onPress={() => { closeMenu(); onNavigate('Leaderboard'); }} 
                        title="Leaderboard" 
                        leadingIcon={({ size }) => <Icon name="trophy" size={size} color="#F59E0B" />}
                        titleStyle={styles.menuItemText}
                    />
                    <Menu.Item 
                        onPress={() => { closeMenu(); onNavigate('Badges'); }} 
                        title="My Badges" 
                        leadingIcon={({ size }) => <Icon name="seal-variant" size={size} color="#8B5CF6" />}
                        titleStyle={styles.menuItemText}
                    />
                    <Divider />
                    <Menu.Item 
                        onPress={onLogout} 
                        title="Logout" 
                        leadingIcon={({ size }) => <Icon name="logout" size={size} color="#EF4444" />}
                        titleStyle={[styles.menuItemText, { color: '#EF4444' }]}
                    />
                </Menu>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 8,
        backgroundColor: '#FFFFFF',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerAvatarContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: -0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    statsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F1F5F9', // Subtle unified background
        paddingHorizontal: 4,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    xpPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 16,
        gap: 4,
    },
    xpText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D97706',
    },
    rankPill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 5,
        gap: 4,
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#64748B',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    menuContent: {
        backgroundColor: '#FFFFFF', 
        borderRadius: 12,
        marginTop: 44,
        ...SHADOWS.lg, 
        elevation: 8,
    },
    menuItemText: {
        color: '#111827',
        fontWeight: '600'
    }
});
