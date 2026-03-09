import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, RadioButton, Button, Card } from 'react-native-paper';
import type { Quiz } from '@/store/slices/courseSlice';

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
                <Text variant="titleMedium" style={styles.title}>
                    📝 Quiz Time!
                </Text>

                <Text variant="bodyLarge" style={styles.question}>
                    {quiz.question}
                </Text>

                <RadioButton.Group value={selectedAnswer} onValueChange={setSelectedAnswer}>
                    {quiz.options.map((option, index) => (
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
                            <Text variant="titleMedium" style={styles.resultText}>
                                {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
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
        backgroundColor: '#fff',
    },
    title: {
        fontWeight: '600',
        marginBottom: 16,
        color: '#6366F1',
    },
    question: {
        fontWeight: '500',
        marginBottom: 20,
        color: '#1F2937',
    },
    option: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        marginBottom: 12,
        backgroundColor: '#FAFAFA',
    },
    correctOption: {
        borderColor: '#10B981',
        backgroundColor: '#D1FAE5',
    },
    incorrectOption: {
        borderColor: '#EF4444',
        backgroundColor: '#FEE2E2',
    },
    optionLabel: {
        fontSize: 16,
    },
    button: {
        marginTop: 16,
    },
    resultContainer: {
        marginTop: 16,
    },
    resultBadge: {
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 16,
    },
    correctBadge: {
        backgroundColor: '#D1FAE5',
    },
    incorrectBadge: {
        backgroundColor: '#FEE2E2',
    },
    resultText: {
        fontWeight: '600',
    },
    explanationContainer: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
    },
    explanationTitle: {
        fontWeight: '600',
        marginBottom: 8,
        color: '#374151',
    },
    explanation: {
        color: '#6B7280',
        lineHeight: 22,
    },
});

export default QuizWidget;
