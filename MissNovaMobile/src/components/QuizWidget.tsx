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
        <View style={styles.container}>
            <View style={styles.quizHeader}>
                <Icon name="help-circle-outline" size={24} color="#1DA1F2" style={{ marginRight: 8 }} />
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
                <TouchableOpacity
                    onPress={handleSubmit}
                    disabled={!selectedAnswer}
                    style={[
                        styles.button,
                        !selectedAnswer && styles.buttonDisabled
                    ]}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonLabel}>Submit Answer</Text>
                </TouchableOpacity>
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
                            color={isCorrect ? '#10B981' : '#EF4444'}
                            style={{ marginBottom: 8 }}
                        />
                        <Text style={[
                            styles.resultText,
                            { color: isCorrect ? '#10B981' : '#EF4444' }
                        ]}>
                            {isCorrect ? 'Correct!' : 'Incorrect'}
                        </Text>
                    </View>

                    <View style={styles.explanationContainer}>
                        <Text style={styles.explanationTitle}>
                            Explanation:
                        </Text>
                        <Text style={styles.explanation}>
                            {quiz.explanation}
                        </Text>
                    </View>

                    {!isCorrect && (
                        <TouchableOpacity
                            onPress={handleReset}
                            style={[styles.button, styles.resetButton]}
                        >
                            <Text style={styles.resetButtonLabel}>Try Again</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 24,
        ...SHADOWS.card,
    },
    quizHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1DA1F2',
    },
    question: {
        fontSize: 16,
        color: '#111827',
        fontWeight: '600',
        marginBottom: 24,
        lineHeight: 22,
    },
    option: {
        borderWidth: 1,
        borderColor: '#E2E8F0',
        borderRadius: 12,
        marginBottom: 12,
        backgroundColor: '#F9FAFB',
        overflow: 'hidden',
    },
    correctOption: {
        borderColor: '#10B981',
        backgroundColor: '#ECFDF5',
    },
    incorrectOption: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    optionLabel: {
        fontSize: 15,
        color: '#4B5563',
        fontWeight: '500',
    },
    button: {
        height: 52,
        backgroundColor: '#1DA1F2',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        ...SHADOWS.md,
    },
    buttonDisabled: {
        backgroundColor: '#94A3B8',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resetButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '#E2E8F0',
        shadowOpacity: 0,
        elevation: 0,
    },
    resetButtonLabel: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    resultContainer: {
        marginTop: 24,
    },
    resultBadge: {
        padding: 24,
        borderRadius: 16,
        alignItems: 'center',
        marginBottom: 24,
    },
    correctBadge: {
        backgroundColor: '#ECFDF5',
    },
    incorrectBadge: {
        backgroundColor: '#FEF2F2',
    },
    resultText: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    explanationContainer: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#EAEDF2',
    },
    explanationTitle: {
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#111827',
        fontSize: 14,
    },
    explanation: {
        color: '#6B7280',
        lineHeight: 22,
        fontSize: 14,
    },
});

export default QuizWidget;
