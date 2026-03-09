import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
    generateCourse,
    generateAudioCourse,
    generateVideoCourse,
    setCategory,
    setDifficulty,
    setCourseType,
} from '@/store/slices/courseSlice';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { CustomPicker } from '@/components/CustomPicker';
import { Badge } from '@/components/Badge';
import {
    COLORS,
    SPACING,
    TYPOGRAPHY,
    BORDER_RADIUS,
    SHADOWS,
    CATEGORIES,
    DIFFICULTY_LEVELS,
    COURSE_TYPES,
} from '@/theme/theme';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { loading, error, category, difficulty, courseType } = useSelector(
        (state: RootState) => state.course
    );
    const { user } = useSelector((state: RootState) => state.auth);

    const [prompt, setPrompt] = useState('');

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            return;
        }

        if (!category) {
            // Could show an alert here
            return;
        }

        let result;

        // Dispatch appropriate action based on course type
        if (courseType === 'audio') {
            result = await dispatch(generateAudioCourse(prompt));
        } else if (courseType === 'video') {
            result = await dispatch(generateVideoCourse(prompt));
        } else {
            result = await dispatch(generateCourse(prompt));
        }

        // Navigate to appropriate screen based on course type
        if (generateCourse.fulfilled.match(result) ||
            generateAudioCourse.fulfilled.match(result) ||
            generateVideoCourse.fulfilled.match(result)) {

            if (courseType === 'audio') {
                navigation.navigate('AudioCourse', { course: result.payload });
            } else if (courseType === 'video') {
                navigation.navigate('VideoCourse', { course: result.payload });
            } else {
                navigation.navigate('Course', { course: result.payload });
            }
        }
    };

    const handleLogout = () => {
        dispatch(logout());
    };

    const handleCategoryChange = (value: string) => {
        dispatch(setCategory(value));
    };

    const handleDifficultyChange = (value: string) => {
        dispatch(setDifficulty(value));
    };

    const handleCourseTypeChange = (value: string) => {
        dispatch(setCourseType(value as 'slides' | 'audio' | 'video'));
    };

    const selectedCategory = CATEGORIES.find(c => c.value === category);
    const selectedDifficulty = DIFFICULTY_LEVELS.find(d => d.value === difficulty);
    const selectedCourseType = COURSE_TYPES.find(t => t.value === courseType);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text variant="headlineLarge" style={styles.title}>
                        Miss Nova
                    </Text>
                    <Text variant="bodyMedium" style={styles.welcome}>
                        Welcome, {user?.displayName || 'User'}!
                    </Text>
                </View>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.mascotContainer}>
                <Text style={styles.mascot}>👩‍🏫</Text>
                <View style={styles.speechBubble}>
                    <Text variant="bodyLarge" style={styles.speechText}>
                        Let's learn something new today!
                    </Text>
                </View>
            </View>

            <View style={styles.formContainer}>
                <Text variant="headlineSmall" style={styles.formTitle}>
                    Create Your Course
                </Text>
                <Text variant="bodyMedium" style={styles.formDescription}>
                    Tell me what you want to learn, and I'll create a personalized course for you!
                </Text>

                <TextInput
                    label="What do you want to learn?"
                    value={prompt}
                    onChangeText={setPrompt}
                    mode="outlined"
                    placeholder="e.g., Black Holes, World War 2, How to focus"
                    multiline
                    numberOfLines={3}
                    style={styles.input}
                    outlineColor={COLORS.border}
                    activeOutlineColor={COLORS.primary}
                />

                <CustomPicker
                    label="Category *"
                    value={category}
                    options={CATEGORIES}
                    onValueChange={handleCategoryChange}
                    placeholder="Select a category"
                />

                <CustomPicker
                    label="Difficulty Level"
                    value={difficulty}
                    options={DIFFICULTY_LEVELS}
                    onValueChange={handleDifficultyChange}
                    placeholder="Select difficulty"
                />

                <CustomPicker
                    label="Course Type"
                    value={courseType}
                    options={COURSE_TYPES}
                    onValueChange={handleCourseTypeChange}
                    placeholder="Select course type"
                />

                {/* Selected options badges */}
                <View style={styles.badgesContainer}>
                    {selectedCategory && (
                        <Badge
                            emoji={selectedCategory.emoji}
                            label={selectedCategory.label}
                            color={selectedCategory.color}
                        />
                    )}
                    {selectedDifficulty && (
                        <Badge
                            emoji={selectedDifficulty.emoji}
                            label={selectedDifficulty.label}
                            color={selectedDifficulty.color}
                        />
                    )}
                    {selectedCourseType && (
                        <Badge
                            emoji={selectedCourseType.emoji}
                            label={selectedCourseType.label}
                            color={selectedCourseType.color}
                        />
                    )}
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text variant="bodySmall" style={styles.error}>
                            {error}
                        </Text>
                    </View>
                )}

                <Button
                    mode="contained"
                    onPress={handleGenerate}
                    disabled={loading || !prompt.trim() || !category}
                    style={styles.button}
                    contentStyle={styles.buttonContent}
                    buttonColor={COLORS.primary}
                    icon="sparkles">
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        'Create My Course ✨'
                    )}
                </Button>
            </View>

            <View style={styles.tipsContainer}>
                <Text variant="titleMedium" style={styles.tipsTitle}>
                    💡 Tips for better courses:
                </Text>
                <Text variant="bodyMedium" style={styles.tip}>
                    • Be specific about what you want to learn
                </Text>
                <Text variant="bodyMedium" style={styles.tip}>
                    • Try topics like "Introduction to Quantum Physics"
                </Text>
                <Text variant="bodyMedium" style={styles.tip}>
                    • Ask about practical skills like "How to manage time effectively"
                </Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    title: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
    },
    welcome: {
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    logoutButton: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    logoutText: {
        color: COLORS.textSecondary,
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    mascotContainer: {
        alignItems: 'center',
        padding: SPACING.xxl,
        backgroundColor: COLORS.surface,
        marginTop: SPACING.md,
        marginHorizontal: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
    },
    mascot: {
        fontSize: 80,
    },
    speechBubble: {
        backgroundColor: COLORS.primary,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.md,
    },
    speechText: {
        color: COLORS.surface,
        textAlign: 'center',
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    formContainer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        margin: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        ...SHADOWS.md,
    },
    formTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        marginBottom: SPACING.sm,
        color: COLORS.text,
    },
    formDescription: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
    },
    input: {
        marginBottom: SPACING.md,
        backgroundColor: COLORS.surface,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.md,
        marginBottom: SPACING.md,
    },
    errorContainer: {
        backgroundColor: COLORS.error + '15',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.error + '30',
    },
    error: {
        color: COLORS.error,
        textAlign: 'center',
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    button: {
        marginTop: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
    },
    buttonContent: {
        paddingVertical: SPACING.sm,
    },
    tipsContainer: {
        padding: SPACING.lg,
        backgroundColor: '#FEF3C7',
        margin: SPACING.md,
        marginBottom: SPACING.xxl,
        borderRadius: BORDER_RADIUS.lg,
    },
    tipsTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        marginBottom: SPACING.md,
        color: COLORS.text,
    },
    tip: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.sm,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
    },
});

export default HomeScreen;
