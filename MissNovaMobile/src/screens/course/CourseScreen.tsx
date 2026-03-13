import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ProgressBar, IconButton } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import QuizWidget from '@/components/QuizWidget';
import type { Course } from '@/store/slices/courseSlice';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

const CourseScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { course } = route.params as { course: Course };

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);

    const currentSlide = course.slides[currentSlideIndex];
    const progress = (currentSlideIndex + 1) / course.slides.length;
    const isLastSlide = currentSlideIndex === course.slides.length - 1;

    const handleNext = () => {
        if (!quizCompleted) {
            return;
        }

        if (isLastSlide) {
            navigation.goBack();
        } else {
            setCurrentSlideIndex(currentSlideIndex + 1);
            setQuizCompleted(false);
        }
    };

    const handlePrevious = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setQuizCompleted(false);
        }
    };

    const handleQuizComplete = (isCorrect: boolean) => {
        setQuizCompleted(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={24} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text variant="titleLarge" style={styles.courseTitle} numberOfLines={1}>
                        {course.title}
                    </Text>
                    <View style={{ width: 40 }} />
                </View>
                <View style={styles.progressSection}>
                    <ProgressBar
                        progress={progress}
                        style={styles.progressBar}
                        color={COLORS.primary}
                    />
                    <View style={styles.progressInfo}>
                        <Icon name="book-open-variant" size={14} color={COLORS.textTertiary} />
                        <Text variant="bodySmall" style={styles.progressText}>
                            STEP {currentSlideIndex + 1} OF {course.slides.length}
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                <View style={styles.slideCard}>
                    <Text variant="headlineSmall" style={styles.slideTitle}>
                        {currentSlide.title}
                    </Text>

                    <Markdown style={markdownStyles}>
                        {currentSlide.content}
                    </Markdown>
                </View>

                <View style={styles.quizWrapper}>
                    <QuizWidget
                        quiz={currentSlide.quiz}
                        onComplete={handleQuizComplete}
                    />
                </View>
            </ScrollView>

            <View style={styles.navigation}>
                <View style={styles.navInner}>
                    {currentSlideIndex > 0 ? (
                        <Button
                            mode="text"
                            onPress={handlePrevious}
                            style={styles.navButton}
                            labelStyle={{ color: COLORS.textSecondary }}>
                            Previous
                        </Button>
                    ) : <View style={{ flex: 1 }} />}

                    <Button
                        mode="contained"
                        onPress={handleNext}
                        disabled={!quizCompleted}
                        style={[styles.navButton, styles.nextButton]}
                        contentStyle={styles.nextButtonContent}
                        buttonColor={COLORS.primary}
                        icon={isLastSlide ? "check-circle" : "arrow-right"}>
                        {isLastSlide ? 'Finish Course' : 'Continue'}
                    </Button>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        backgroundColor: COLORS.surface,
        paddingTop: 16,
        paddingBottom: 16,
        paddingHorizontal: 24,
        ...SHADOWS.sm,
        marginBottom: 10,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.text,
        fontSize: 20,
        letterSpacing: -0.5,
    },
    progressSection: {
        width: '100%',
    },
    progressBar: {
        height: 10,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: '#E2E8F0',
        marginBottom: 6,
    },
    progressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    progressText: {
        color: COLORS.textTertiary,
        fontSize: 10,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        letterSpacing: 1,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    slideCard: {
        margin: SPACING.lg,
        padding: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    slideTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        marginBottom: SPACING.lg,
        color: COLORS.primary,
        fontSize: 24,
        letterSpacing: -0.5,
    },
    quizWrapper: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.xl,
    },
    navigation: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderTopWidth: 1,
        borderTopColor: COLORS.borderLight,
    },
    navInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    navButton: {
        flex: 1,
        borderRadius: BORDER_RADIUS.lg,
    },
    nextButton: {
        ...SHADOWS.md,
    },
    nextButtonContent: {
        height: 52,
    },
});

const markdownStyles = {
    body: {
        fontSize: 16,
        lineHeight: 26,
        color: COLORS.textSecondary,
    },
    heading2: {
        fontSize: 20,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        marginTop: 24,
        marginBottom: 12,
        color: COLORS.text,
    },
    paragraph: {
        marginBottom: 16,
    },
    listItem: {
        marginBottom: 12,
    },
    bullet_list: {
        marginTop: 8,
    },
};

export default CourseScreen;
