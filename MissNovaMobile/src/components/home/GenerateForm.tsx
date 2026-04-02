import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { COLORS, SHADOWS, BORDER_RADIUS, TYPOGRAPHY } from '@/theme/theme';
import { CustomPicker } from '@/components/CustomPicker';
import { Badge } from '@/components/Badge';
import { PlayfulButton } from '@/components/PlayfulButton';
import { CATEGORIES, DIFFICULTY_LEVELS, COURSE_TYPES } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface GenerateFormProps {
    prompt: string;
    setPrompt: (text: string) => void;
    category: string;
    onCategoryChange: (value: string) => void;
    difficulty: string;
    onDifficultyChange: (value: string) => void;
    courseType: string;
    onCourseTypeChange: (value: string) => void;
    onGenerate: () => void;
    loading: boolean;
    error: string | null;
}

export const GenerateForm = ({
    prompt,
    setPrompt,
    category,
    onCategoryChange,
    difficulty,
    onDifficultyChange,
    courseType,
    onCourseTypeChange,
    onGenerate,
    loading,
    error,
}: GenerateFormProps) => {
    const selectedCategory = CATEGORIES.find(c => c.value === category);
    const selectedDifficulty = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
    const selectedCourseType = COURSE_TYPES.find(t => t.value === courseType);

    return (
        <View style={styles.formContainer}>
            <Text style={styles.formTitle}>🚀 Create Your Course</Text>
            <Text style={styles.formDescription}>
                Tell me what you want to learn, and I'll create a personalized course for you!
            </Text>

            <TextInput
                value={prompt}
                onChangeText={setPrompt}
                mode="outlined"
                placeholder="E.g. Advanced React, Python AI, Quantum Physics..."
                style={styles.input}
                textColor="#111827"
                placeholderTextColor="#9CA3AF"
                outlineColor="#E2E8F0"
                activeOutlineColor={COLORS.primary}
                theme={{ roundness: 12, colors: { background: '#F8FAFC' } }}
                left={<TextInput.Icon icon="magnify" color="#9CA3AF" />}
            />

            <View style={styles.pickerRow}>
                <View style={{ flex: 1, marginRight: 8 }}>
                    <CustomPicker
                        label="Category"
                        value={category}
                        options={CATEGORIES}
                        onValueChange={onCategoryChange}
                        placeholder="Choose"
                    />
                </View>
                <View style={{ flex: 1 }}>
                    <CustomPicker
                        label="Difficulty"
                        value={difficulty}
                        options={DIFFICULTY_LEVELS}
                        onValueChange={onDifficultyChange}
                        placeholder="Level"
                    />
                </View>
            </View>

            <CustomPicker
                label="Course Format"
                value={courseType}
                options={COURSE_TYPES}
                onValueChange={onCourseTypeChange}
                placeholder="Select course format"
            />

            <View style={styles.badgesContainer}>
                {selectedCategory && <Badge icon={selectedCategory.icon} label={selectedCategory.label} color={selectedCategory.color} />}
                {selectedDifficulty && <Badge icon={selectedDifficulty.icon} label={selectedDifficulty.label} color={selectedDifficulty.color} />}
                {selectedCourseType && <Badge icon={selectedCourseType.icon} label={selectedCourseType.label} color={selectedCourseType.color} />}
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Icon name="alert-circle" size={18} color="#EF4444" style={{ marginRight: 8 }} />
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <PlayfulButton
                onPress={() => {
                    if (!prompt.trim()) {
                        // We can set a local error or use a toast, but for now let's use the error prop pattern
                        onGenerate(); // The parent will handle the 'empty' case or we can handle it here
                        return;
                    }
                    if (!category) {
                        onGenerate(); 
                        return;
                    }
                    onGenerate();
                }}
                loading={loading}
                disabled={loading} // Only disable when loading, not when empty
                style={styles.generateButton}
                icon="rocket-launch"
            >
                Create My Course
            </PlayfulButton>
        </View>
    );
};

const styles = StyleSheet.create({
    formContainer: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: BORDER_RADIUS.card,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.card,
        marginBottom: 24,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    formDescription: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 20,
        lineHeight: 20,
    },
    input: {
        height: 52,
        marginBottom: 16,
        fontSize: 15,
        backgroundColor: '#F8FAFC',
    },
    pickerRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        marginBottom: 24,
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF1F1',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#FEE2E2',
    },
    errorText: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: '600',
    },
    generateButton: {
        marginTop: 8,
        height: 54, // Prominent height
    },
});
