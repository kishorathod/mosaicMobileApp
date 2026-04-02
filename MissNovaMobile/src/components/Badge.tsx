import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/theme/theme';

interface BadgeProps {
    emoji?: string;
    icon?: string;
    label: string;
    color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ emoji, icon, label, color = COLORS.primary }) => {
    return (
        <View style={[styles.badge, { backgroundColor: color + '10', borderColor: color + '20' }]}>
            {icon ? (
                <Icon name={icon} size={14} color={color} style={styles.icon} />
            ) : emoji ? (
                <Text style={styles.emoji}>{emoji}</Text>
            ) : null}
            <Text style={[styles.label, { color }]}>{label.toUpperCase()}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 24, // Consistent height
        borderRadius: BORDER_RADIUS.tag,
        borderWidth: 1,
    },
    emoji: {
        fontSize: 12,
        marginRight: 4,
    },
    icon: {
        marginRight: 4,
    },
    label: {
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.2,
    },
});
