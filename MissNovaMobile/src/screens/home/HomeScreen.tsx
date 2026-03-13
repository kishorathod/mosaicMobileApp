import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
import { PlayfulButton } from '@/components/PlayfulButton';

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
                    <Icon name="logout" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
            </View>

            <View style={styles.heroSection}>
                <View style={styles.mascotWrapper}>
                    <View style={styles.mascotCircle}>
                        <Icon name="school" size={64} color={COLORS.primary} />
                    </View>
                    <View style={styles.statusBadge}>
                        <Text style={styles.statusText}>Miss Nova is here!</Text>
                    </View>
                </View>

                <View style={styles.speechBubbleWrapper}>
                    <View style={styles.speechBubbleArrow} />
                    <View style={styles.speechBubble}>
                        <Text variant="headlineSmall" style={styles.speechGreeting}>
                            Hi! I'm Miss Nova.
                        </Text>
                        <Text variant="bodyLarge" style={styles.speechSubtext}>
                            Your AI teacher ready to create a course on any topic.
                        </Text>
                    </View>
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
                    left={<TextInput.Icon icon="auto-fix-high" color={COLORS.primary} />}
                    theme={{ roundness: BORDER_RADIUS.md }}
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
                            icon={selectedCategory.icon}
                            label={selectedCategory.label}
                            color={selectedCategory.color}
                        />
                    )}
                    {selectedDifficulty && (
                        <Badge
                            icon={selectedDifficulty.icon}
                            label={selectedDifficulty.label}
                            color={selectedDifficulty.color}
                        />
                    )}
                    {selectedCourseType && (
                        <Badge
                            icon={selectedCourseType.icon}
                            label={selectedCourseType.label}
                            color={selectedCourseType.color}
                        />
                    )}
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Icon name="alert-circle" size={20} color={COLORS.error} style={{ marginRight: 8 }} />
                        <Text variant="bodySmall" style={styles.error}>
                            {error}
                        </Text>
                    </View>
                )}

                <PlayfulButton
                    onPress={handleGenerate}
                    disabled={loading || !prompt.trim() || !category}
                    loading={loading}
                    style={styles.generateButton}>
                    <View style={styles.buttonInner}>
                        <Icon name="sparkles" size={24} color="#FFF" style={{ marginRight: 8 }} />
                        <Text style={styles.buttonLabel}>
                            {loading ? 'Creating your course...' : 'Create My Course'}
                        </Text>
                    </View>
                </PlayfulButton>
            </View>

            <View style={styles.tipsContainer}>
                <View style={styles.tipsHeader}>
                    <Icon name="lightbulb-on" size={20} color="#92400E" />
                    <Text variant="titleMedium" style={styles.tipsTitle}>
                        Tips for better courses:
                    </Text>
                </View>
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
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: COLORS.surface,
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
        letterSpacing: -0.5,
    },
    welcome: {
        fontSize: 14,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        marginTop: 2,
    },
    logoutButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    logoutText: {
        color: COLORS.textSecondary,
        fontSize: 10,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    heroSection: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        marginVertical: 24,
    },
    mascotWrapper: {
        position: 'relative',
    },
    mascotCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0F2FE', // Sky 100
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFF',
        ...SHADOWS.md,
    },
    statusBadge: {
        position: 'absolute',
        bottom: -4,
        right: -10,
        backgroundColor: COLORS.secondary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: BORDER_RADIUS.full,
        ...SHADOWS.sm,
    },
    statusText: {
        color: '#FFF',
        fontSize: 10,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    speechBubbleWrapper: {
        flex: 1,
        marginLeft: 20,
        position: 'relative',
    },
    speechBubbleArrow: {
        position: 'absolute',
        left: -10,
        top: '50%',
        marginTop: -10,
        width: 20,
        height: 20,
        backgroundColor: '#FFF',
        transform: [{ rotate: '45deg' }],
        borderLeftWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'rgba(14, 165, 233, 0.2)',
    },
    speechBubble: {
        backgroundColor: '#FFF',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(14, 165, 233, 0.2)',
        ...SHADOWS.md,
    },
    speechGreeting: {
        color: COLORS.primary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontSize: 20,
        marginBottom: 4,
    },
    speechSubtext: {
        color: COLORS.textSecondary,
        fontSize: 14,
        lineHeight: 18,
    },
    formContainer: {
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        marginHorizontal: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    formTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontSize: 22,
        marginBottom: 8,
        color: COLORS.text,
        letterSpacing: -0.5,
    },
    formDescription: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
        fontSize: 14,
        lineHeight: 20,
    },
    input: {
        marginBottom: SPACING.md,
        backgroundColor: COLORS.surface,
        fontSize: 15,
        minHeight: 48,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: SPACING.sm,
        marginBottom: SPACING.lg,
    },
    errorContainer: {
        backgroundColor: COLORS.error + '10',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.error + '20',
    },
    error: {
        color: COLORS.error,
        fontSize: 13,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        flex: 1,
        textAlign: 'center',
    },
    generateButton: {
        marginTop: SPACING.sm,
    },
    buttonInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonLabel: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
    tipsContainer: {
        padding: 20,
        backgroundColor: '#fff7e6',
        marginHorizontal: SPACING.lg,
        marginTop: SPACING.xl,
        marginBottom: SPACING.xxl,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: '#ffe0a3',
    },
    tipsTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontSize: 16,
        marginBottom: SPACING.md,
        color: '#92400E', // Amber 800
    },
    tip: {
        color: '#B45309', // Amber 700
        marginBottom: SPACING.sm,
        fontSize: 14,
        lineHeight: 20,
    },
    tipsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
        gap: 8,
    },
});

export default HomeScreen;
