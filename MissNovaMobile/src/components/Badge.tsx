import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '@/theme/theme';

interface BadgeProps {
    emoji?: string;
    label: string;
    color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ emoji, label, color = COLORS.primary }) => {
    return (
        <View style={[styles.badge, { backgroundColor: color + '15', borderColor: color + '30' }]}>
            {emoji && <Text style={styles.emoji}>{emoji}</Text>}
            <Text style={[styles.label, { color }]}>{label}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.xs,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
    },
    emoji: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        marginRight: SPACING.xs,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
});
