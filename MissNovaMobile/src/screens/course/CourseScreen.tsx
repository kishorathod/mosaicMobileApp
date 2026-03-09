import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, ProgressBar, Card } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import QuizWidget from '@/components/QuizWidget';
import type { Course } from '@/store/slices/courseSlice';

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
                <Text variant="titleLarge" style={styles.courseTitle}>
                    {course.title}
                </Text>
                <ProgressBar progress={progress} style={styles.progressBar} />
                <Text variant="bodySmall" style={styles.progressText}>
                    Slide {currentSlideIndex + 1} of {course.slides.length}
                </Text>
            </View>

            <ScrollView style={styles.content}>
                <Card style={styles.slideCard}>
                    <Card.Content>
                        <Text variant="headlineSmall" style={styles.slideTitle}>
                            {currentSlide.title}
                        </Text>

                        <Markdown style={markdownStyles}>
                            {currentSlide.content}
                        </Markdown>
                    </Card.Content>
                </Card>

                <View style={styles.quizContainer}>
                    <QuizWidget
                        quiz={currentSlide.quiz}
                        onComplete={handleQuizComplete}
                    />
                </View>
            </ScrollView>

            <View style={styles.navigation}>
                {currentSlideIndex > 0 && (
                    <Button
                        mode="outlined"
                        onPress={handlePrevious}
                        style={styles.navButton}>
                        Previous
                    </Button>
                )}

                <Button
                    mode="contained"
                    onPress={handleNext}
                    disabled={!quizCompleted}
                    style={[styles.navButton, styles.nextButton]}>
                    {isLastSlide ? 'Finish' : 'Next'}
                </Button>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    courseTitle: {
        fontWeight: '600',
        marginBottom: 12,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        marginBottom: 8,
    },
    progressText: {
        color: '#666',
        textAlign: 'center',
    },
    content: {
        flex: 1,
    },
    slideCard: {
        margin: 16,
        backgroundColor: '#fff',
    },
    slideTitle: {
        fontWeight: '600',
        marginBottom: 16,
        color: '#6366F1',
    },
    quizContainer: {
        margin: 16,
    },
    navigation: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        gap: 12,
    },
    navButton: {
        flex: 1,
    },
    nextButton: {
        marginLeft: 'auto',
    },
});

const markdownStyles = {
    body: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
    },
    heading2: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        color: '#1F2937',
    },
    paragraph: {
        marginBottom: 12,
    },
    listItem: {
        marginBottom: 8,
    },
};

export default CourseScreen;
