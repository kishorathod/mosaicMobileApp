import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

interface QuickTopicChipsProps {
    onSelect: (topic: string) => void;
}

const TOPICS = [
    { label: 'React Hooks', icon: 'react', color: '#61DAFB' },
    { label: 'Python AI', icon: 'language-python', color: '#3776AB' },
    { label: 'Quantum Physics', icon: 'molecule', color: '#8B5CF6' },
    { label: 'JavaScript', icon: 'language-javascript', color: '#F7DF1E' },
    { label: 'Digital Art', icon: 'palette', color: '#EC4899' },
    { label: 'Stock Market', icon: 'finance', color: '#10B981' },
];

export const QuickTopicChips = ({ onSelect }: QuickTopicChipsProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Trending Now</Text>
                <Icon name="trending-up" size={16} color={COLORS.textSecondary} />
            </View>
            <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {TOPICS.map((topic, index) => (
                    <TouchableOpacity 
                        key={index}
                        style={styles.chip}
                        onPress={() => onSelect(topic.label)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: topic.color + '1A' }]}>
                            <Icon name={topic.icon} size={18} color={topic.color} />
                        </View>
                        <Text style={styles.label}>{topic.label}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 24,
        marginHorizontal: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 6,
    },
    title: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: 0.2,
    },
    scrollContent: {
        paddingRight: 16,
        gap: 10,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: BORDER_RADIUS.tag,
        borderWidth: 1.5,
        borderColor: '#E2E8F0',
        ...SHADOWS.sm,
    },
    iconContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 8,
    },
    label: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#1E293B',
    },
});
