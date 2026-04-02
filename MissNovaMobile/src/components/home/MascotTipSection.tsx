import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MascotSvg from '@/assets/images/mascot.svg';
import { COLORS, SHADOWS, BORDER_RADIUS } from '@/theme/theme';

interface MascotTipSectionProps {
    tip: string;
    onRefresh: () => void;
    onAskNova: () => void;
}

export const MascotTipSection: React.FC<MascotTipSectionProps> = ({
    tip,
    onRefresh,
    onAskNova,
}) => {
    return (
        <View style={styles.container}>
            <View style={styles.mascotContainer}>
                <MascotSvg width={60} height={60} />
            </View>
            <TouchableOpacity 
                style={styles.bubble}
                onPress={onAskNova}
                activeOpacity={0.8}
            >
                <View style={styles.bubbleHeader}>
                    <Text style={styles.novaTitle}>Miss Nova</Text>
                    <TouchableOpacity onPress={onRefresh}>
                        <Icon name="refresh" size={16} color="#94A3B8" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.tipText}>"{tip}"</Text>
                <View style={styles.badgeRow}>
                    <View style={styles.aiBadge}>
                        <Icon name="robot" size={12} color="#1DA1F2" />
                        <Text style={styles.aiBadgeText}>AI Assistant</Text>
                    </View>
                    <Text style={styles.ctaText}>Tap to chat →</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 16,
        alignItems: 'center',
        marginBottom: 20,
    },
    mascotContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        marginRight: 12,
    },
    bubble: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderTopLeftRadius: 4,
        padding: 12,
        ...SHADOWS.soft,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    bubbleHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    novaTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    tipText: {
        fontSize: 13,
        color: '#475569',
        fontStyle: 'italic',
        lineHeight: 18,
        marginBottom: 8,
    },
    badgeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    aiBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        gap: 4,
    },
    aiBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1DA1F2',
    },
    ctaText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#94A3B8',
    },
});
