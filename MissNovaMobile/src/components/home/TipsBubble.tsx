import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MascotSvg from '@/assets/images/mascot.svg';
import { SHADOWS, BORDER_RADIUS, COLORS } from '@/theme/theme';

interface TipsBubbleProps {
    tip: string;
    onRefresh: () => void;
    onAskNova: () => void;
}

export const TipsBubble = ({ tip, onRefresh, onAskNova }: TipsBubbleProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                <View style={styles.identity}>
                    <View style={styles.avatarMini}>
                        <MascotSvg width={24} height={24} />
                    </View>
                    <Text style={styles.name}>Miss Nova's Tips</Text>
                </View>
                <TouchableOpacity onPress={onRefresh} style={styles.refreshBtn}>
                    <Icon name="refresh" size={16} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <View style={styles.bubble}>
                <Text style={styles.tipText}>"{tip}"</Text>
                <View style={styles.bubbleTail} />
            </View>

            <TouchableOpacity style={styles.askButton} onPress={onAskNova}>
                <Icon name="chat-question" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
                <Text style={styles.askButtonText}>Ask Miss Nova Anything</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginBottom: 48,
        marginTop: 24,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    identity: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    avatarMini: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    refreshBtn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bubble: {
        backgroundColor: '#FFFFFF',
        padding: 16,
        borderRadius: 16,
        borderTopLeftRadius: 4,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        marginBottom: 12,
    },
    tipText: {
        fontSize: 15,
        color: '#475569',
        fontStyle: 'italic',
        lineHeight: 22,
    },
    bubbleTail: {
        position: 'absolute',
        top: -10,
        left: 0,
        width: 15,
        height: 15,
        backgroundColor: '#FFFFFF',
        transform: [{ rotate: '45deg' }],
        zIndex: -1,
    },
    askButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: 12,
        borderRadius: 12,
        ...SHADOWS.sm,
    },
    askButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});
