import React, { useRef } from 'react';
import { Pressable, StyleSheet, View, Text, ViewStyle, TextStyle, ActivityIndicator, Animated, StyleProp } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

interface PlayfulButtonProps {
    onPress: () => void;
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    labelStyle?: StyleProp<TextStyle>;
    color?: string;
    disabled?: boolean;
    loading?: boolean;
    icon?: string;
}

export const PlayfulButton: React.FC<PlayfulButtonProps> = ({
    onPress,
    children,
    style,
    labelStyle,
    color = COLORS.primary,
    disabled = false,
    loading = false,
    icon,
}) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 4,
            tension: 40,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable
                onPress={onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                disabled={disabled || loading}
                style={({ pressed }) => [
                    styles.button,
                    { backgroundColor: color },
                    (disabled || loading) && styles.disabled,
                    style,
                ]}
            >
            <View style={[styles.content, loading && { opacity: 0.6 }]}>
                {icon && !loading && (
                    <Icon name={icon} size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                )}
                {typeof children === 'string' ? (
                    <Text style={[styles.label, labelStyle]}>{children}</Text>
                ) : (
                    children
                )}
            </View>
            {loading && (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator color="white" size="small" />
                </View>
            )}
            </Pressable>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 54,
        borderRadius: BORDER_RADIUS.button,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        zIndex: 1,
        // Refined shadow logic
        ...SHADOWS.soft,
    },
    disabled: {
        backgroundColor: '#F1F5F9',
        opacity: 0.8,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    label: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        textTransform: 'uppercase',
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
