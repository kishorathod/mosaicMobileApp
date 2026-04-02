import React, { useState, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SHADOWS, BORDER_RADIUS, SPACING, TYPOGRAPHY, CATEGORIES, DIFFICULTY_LEVELS, COURSE_TYPES } from '@/theme/theme';
import { PlayfulButton } from '@/components/PlayfulButton';
import { CustomPicker } from '@/components/CustomPicker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface CourseCreatorWizardProps {
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

export const CourseCreatorWizard: React.FC<CourseCreatorWizardProps> = ({
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
}) => {
    const [step, setStep] = useState(1);
    const [containerWidth, setContainerWidth] = useState(SCREEN_WIDTH - 72); // Account for margins (32) and padding (40)
    const [stepHeights, setStepHeights] = useState<Record<number, number>>({});
    
    const slideAnim = useRef(new Animated.Value(0)).current;
    const heightAnim = useRef(new Animated.Value(200)).current;

    const onLayout = (event: any) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width - 40); // Subtract horizontal padding (20 + 20)
    };

    const updateHeight = (stepNum: number, h: number) => {
        setStepHeights(prev => {
            const next = { ...prev, [stepNum]: h };
            if (step === stepNum && heightAnim) {
                heightAnim.setValue(h);
            }
            return next;
        });
    };

    const nextStep = () => {
        if (step < 3) {
            const next = step + 1;
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -containerWidth * step,
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(heightAnim, {
                    toValue: stepHeights[next] || 300,
                    duration: 300,
                    useNativeDriver: false,
                })
            ]).start(() => setStep(next));
        }
    };

    const prevStep = () => {
        if (step > 1) {
            const prev = step - 1;
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -containerWidth * (step - 2),
                    duration: 300,
                    useNativeDriver: false,
                }),
                Animated.timing(heightAnim, {
                    toValue: stepHeights[prev] || 200,
                    duration: 300,
                    useNativeDriver: false,
                })
            ]).start(() => setStep(prev));
        }
    };

    const isStep1Valid = prompt.trim().length > 0;
    const isStep2Valid = category.length > 0;

    return (
        <View style={styles.container} onLayout={onLayout}>
            <View style={styles.header}>
                <Text style={styles.title}>Create Your Path</Text>
                <View style={styles.stepIndicator}>
                    <View style={[styles.dot, step >= 1 && styles.activeDot]} />
                    <View style={[styles.dot, step >= 2 && styles.activeDot]} />
                    <View style={[styles.dot, step >= 3 && styles.activeDot]} />
                </View>
            </View>

            <Animated.View style={{ height: heightAnim, overflow: 'hidden' }}>
                <Animated.View style={[styles.wizardWrapper, { transform: [{ translateX: slideAnim }], alignItems: 'flex-start' }]}>
                    {/* Step 1: Topic */}
                    <View 
                        style={[styles.stepContainer, { width: containerWidth }]}
                        onLayout={(e) => updateHeight(1, e.nativeEvent.layout.height)}
                    >
                        <Text style={styles.stepLabel}>1. What do you want to learn?</Text>
                        <TextInput
                            value={prompt}
                            onChangeText={setPrompt}
                            placeholder="E.g. JavaScript, Python, UI Design..."
                            mode="outlined"
                            style={styles.input}
                            outlineColor="#E2E8F0"
                            activeOutlineColor={COLORS.primary}
                            textColor="#111827"
                            theme={{ roundness: 12 }}
                            left={<TextInput.Icon icon="magnify" />}
                        />
                        <PlayfulButton 
                            onPress={nextStep} 
                            disabled={!isStep1Valid}
                            style={styles.nextButton}
                        >
                            Next Step
                        </PlayfulButton>
                    </View>

                    {/* Step 2: Category */}
                    <View 
                        style={[styles.stepContainer, { width: containerWidth }]}
                        onLayout={(e) => updateHeight(2, e.nativeEvent.layout.height)}
                    >
                        <Text style={styles.stepLabel}>2. Select a category</Text>
                        <View style={styles.categoryGrid}>
                            {CATEGORIES.map((cat) => (
                                <TouchableOpacity 
                                    key={cat.value} 
                                    style={[
                                        styles.categoryItem, 
                                        category === cat.value && styles.activeCategoryItem,
                                        { borderColor: category === cat.value ? cat.color : '#E2E8F0' }
                                    ]}
                                    onPress={() => onCategoryChange(cat.value)}
                                >
                                    <Icon 
                                        name={cat.icon} 
                                        size={24} 
                                        color={category === cat.value ? cat.color : '#64748B'} 
                                    />
                                    <Text style={[
                                        styles.categoryText, 
                                        category === cat.value && { color: cat.color, fontWeight: 'bold' }
                                    ]}>
                                        {cat.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <View style={styles.buttonRow}>
                            <TouchableOpacity onPress={prevStep} style={styles.backLink}>
                                <Text style={styles.backLinkText}>Back</Text>
                            </TouchableOpacity>
                            <View style={{ flex: 1 }}>
                                <PlayfulButton 
                                    onPress={nextStep} 
                                    disabled={!isStep2Valid}
                                    style={[styles.nextButton, { width: '100%' }] as any}
                                >
                                    Last Step
                                </PlayfulButton>
                            </View>
                        </View>
                    </View>

                    {/* Step 3: Format & Difficulty */}
                    <View 
                        style={[styles.stepContainer, { width: containerWidth }]}
                        onLayout={(e) => updateHeight(3, e.nativeEvent.layout.height)}
                    >
                        <Text style={styles.stepLabel}>3. Finalize details</Text>
                    <View style={styles.pickerGroup}>
                         <CustomPicker
                            label="Level"
                            value={difficulty}
                            options={DIFFICULTY_LEVELS}
                            onValueChange={onDifficultyChange}
                            placeholder="Select Level"
                        />
                        <View style={{ height: 16 }} />
                        <CustomPicker
                            label="Format"
                            value={courseType}
                            options={COURSE_TYPES}
                            onValueChange={onCourseTypeChange}
                            placeholder="Select Format"
                        />
                    </View>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={prevStep} style={styles.backLink}>
                            <Text style={styles.backLinkText}>Back</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1 }}>
                            <PlayfulButton 
                                onPress={onGenerate} 
                                loading={loading}
                                style={[styles.generateButton, { width: '100%' }] as any}
                            >
                                Build Journey
                            </PlayfulButton>
                        </View>
                    </View>
                </View>
                </Animated.View>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: BORDER_RADIUS.card,
        padding: 20,
        ...SHADOWS.card,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
        marginBottom: 24,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    stepIndicator: {
        flexDirection: 'row',
        gap: 6,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E2E8F0',
    },
    activeDot: {
        backgroundColor: COLORS.primary,
        width: 20,
    },
    wizardWrapper: {
        flexDirection: 'row',
    },
    stepContainer: {
        paddingRight: 8, // Ensure a small gap between sliding steps
        paddingBottom: 16, // Provide breathing room so buttons aren't clipped by overflow
    },
    stepLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 16,
    },
    input: {
        backgroundColor: '#F8FAFC',
        marginBottom: 20,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 10,
        marginBottom: 20,
    },
    categoryItem: {
        width: '48%',
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderRadius: 12,
        borderWidth: 1,
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F8FAFC',
    },
    activeCategoryItem: {
        backgroundColor: '#FFFFFF',
        ...SHADOWS.sm,
    },
    categoryText: {
        fontSize: 12,
        color: '#64748B',
        textAlign: 'center',
    },
    pickerGroup: {
        marginBottom: 24,
    },
    buttonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    nextButton: {
        height: 50,
    },
    generateButton: {
        height: 50,
        backgroundColor: COLORS.primary,
    },
    backLink: {
        paddingHorizontal: 12,
    },
    backLinkText: {
        color: '#64748B',
        fontWeight: '600',
    },
});
