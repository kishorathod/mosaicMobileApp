import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, RadioButton, Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import type { Quiz } from '@/store/slices/courseSlice';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

interface QuizWidgetProps {
    quiz: Quiz;
    onComplete: (isCorrect: boolean) => void;
}

const QuizWidget: React.FC<QuizWidgetProps> = ({ quiz, onComplete }) => {
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);

    const handleSubmit = () => {
        const correct = selectedAnswer === quiz.correct_answer;
        setIsCorrect(correct);
        setSubmitted(true);
        onComplete(correct);
    };

    const handleReset = () => {
        setSelectedAnswer('');
        setSubmitted(false);
        setIsCorrect(false);
    };

    return (
        <Card style={styles.container}>
            <Card.Content>
                <View style={styles.quizHeader}>
                    <Icon name="help-circle-outline" size={24} color={COLORS.primary} style={{ marginRight: 8 }} />
                    <Text variant="titleMedium" style={styles.title}>
                        Quiz Time!
                    </Text>
                </View>

                <Text variant="bodyLarge" style={styles.question}>
                    {quiz.question}
                </Text>

                <RadioButton.Group value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {quiz.options.map((option: string, index: number) => (
                        <View
                            key={index}
                            style={[
                                styles.option,
                                submitted && option === quiz.correct_answer && styles.correctOption,
                                submitted && option === selectedAnswer && !isCorrect && styles.incorrectOption,
                            ]}>
                            <RadioButton.Item
                                label={option}
                                value={option}
                                disabled={submitted}
                                labelStyle={styles.optionLabel}
                            />
                        </View>
                    ))}
                </RadioButton.Group>

                {!submitted ? (
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        disabled={!selectedAnswer}
                        style={styles.button}>
                        Submit Answer
                    </Button>
                ) : (
                    <View style={styles.resultContainer}>
                        <View
                            style={[
                                styles.resultBadge,
                                isCorrect ? styles.correctBadge : styles.incorrectBadge,
                            ]}>
                            <Icon
                                name={isCorrect ? "check-circle" : "alert-circle"}
                                size={28}
                                color={isCorrect ? COLORS.success : COLORS.error}
                                style={{ marginBottom: 8 }}
                            />
                            <Text variant="titleMedium" style={[
                                styles.resultText,
                                { color: isCorrect ? COLORS.success : COLORS.error }
                            ]}>
                                {isCorrect ? 'Correct!' : 'Incorrect'}
                            </Text>
                        </View>

                        <View style={styles.explanationContainer}>
                            <Text variant="bodyMedium" style={styles.explanationTitle}>
                                Explanation:
                            </Text>
                            <Text variant="bodyMedium" style={styles.explanation}>
                                {quiz.explanation}
                            </Text>
                        </View>

                        {!isCorrect && (
                            <Button
                                mode="outlined"
                                onPress={handleReset}
                                style={styles.button}>
                                Try Again
                            </Button>
                        )}
                    </View>
                )}
            </Card.Content>
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.lg,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        fontSize: 18,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
    },
    question: {
        fontSize: 16,
        color: COLORS.text,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        marginBottom: SPACING.lg,
        lineHeight: 22,
    },
    option: {
        borderWidth: 2,
        borderColor: COLORS.borderLight,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.sm,
        backgroundColor: COLORS.surfaceVariant,
    },
    correctOption: {
        borderColor: COLORS.success,
        backgroundColor: COLORS.success + '10',
    },
    incorrectOption: {
        borderColor: COLORS.error,
        backgroundColor: COLORS.error + '10',
    },
    optionLabel: {
        fontSize: 15,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    button: {
        marginTop: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
    },
    resultContainer: {
        marginTop: SPACING.lg,
    },
    resultBadge: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    correctBadge: {
        backgroundColor: COLORS.success + '15',
    },
    incorrectBadge: {
        backgroundColor: COLORS.error + '15',
    },
    resultText: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontSize: 18,
    },
    explanationContainer: {
        backgroundColor: COLORS.surfaceVariant,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    explanationTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        marginBottom: 8,
        color: COLORS.text,
        fontSize: 14,
    },
    explanation: {
        color: COLORS.textSecondary,
        lineHeight: 20,
        fontSize: 14,
    },
});

export default QuizWidget;
