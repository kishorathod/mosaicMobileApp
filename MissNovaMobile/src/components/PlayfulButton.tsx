import React from 'react';
import { TouchableOpacity, StyleSheet, View, Text, ViewStyle, TextStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '@/theme/theme';

interface PlayfulButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: ViewStyle;
    labelStyle?: TextStyle;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
}

export const PlayfulButton: React.FC<PlayfulButtonProps> = ({
    onPress,
    children,
    style,
    labelStyle,
    color = COLORS.primary,
    disabled = false,
    loading = false,
}) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            activeOpacity={0.9}
            style={[
                styles.button,
                { backgroundColor: color },
                disabled && styles.disabled,
                style,
            ]}
        >
            <View style={styles.content}>
                {typeof children === 'string' ? (
                    <Text style={[styles.label, labelStyle]}>{children}</Text>
                ) : (
                    children
                )}
            </View>
            <View style={[styles.shadow, { backgroundColor: color + '40' }]} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 56,
        borderRadius: BORDER_RADIUS.full,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        // The 3D effect is created using a darker bottom border or shadow view
        borderBottomWidth: 4,
        borderBottomColor: 'rgba(0,0,0,0.1)',
    },
    disabled: {
        backgroundColor: '#E2E8F0',
        borderBottomColor: 'rgba(0,0,0,0.05)',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    label: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontFamily: 'Nunito', // If loaded, otherwise system bold
    },
    shadow: {
        position: 'absolute',
        top: 4,
        left: 0,
        right: 0,
        bottom: -4,
        borderRadius: BORDER_RADIUS.full,
        zIndex: -1,
    },
});
