import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import Markdown from 'react-native-markdown-display';
import QuizWidget from '@/components/QuizWidget';
import RoadmapTimeline from '@/components/RoadmapTimeline';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { setCurrentCourse } from '@/store/slices/courseSlice';
import { syncCoursePoints, LeaderboardEntry } from '@/store/slices/gamificationSlice';
import LeaderboardModal from '@/components/LeaderboardModal';
import type { AnyCourse, SlideCourseData } from '@/store/slices/courseSlice';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

const CourseScreen = () => {
    const route = useRoute();
    const navigation = useNavigation() as any;
    const dispatch = useAppDispatch();
    const { course } = (route.params as { course: any }) || { course: null };

    useEffect(() => {
        if (course) {
            // Cast Course to SlideCourseData and set it
            const slideCourse = { ...course, type: 'slides' } as SlideCourseData;
            dispatch(setCurrentCourse(slideCourse));
        }
    }, [course, dispatch]);

    const currentCourse = useAppSelector((state: RootState) => state.course.currentCourse) as SlideCourseData | null;
    const { leaderboard } = useAppSelector((state: RootState) => state.gamification);
    
    // Get my rank from leaderboard for this course (mocked)
    const myRank = leaderboard?.find((l: LeaderboardEntry) => l.isMe)?.rank || 5;
    const coursePoints = currentCourse?.slides ? currentCourse.slides.length * 100 : 0;

    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [leaderboardVisible, setLeaderboardVisible] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const { user } = useAppSelector((state: RootState) => state.auth);

    if (!course || !currentCourse) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={28} color="#111827" />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color={COLORS.primary} size="large" />
                    <Text style={{ marginTop: 16, color: '#64748B' }}>Loading course content...</Text>
                </View>
            </View>
        );
    }

    const currentSlide = currentCourse.slides[currentSlideIndex];
    const progress = (currentSlideIndex + 1) / currentCourse.slides.length;
    const isLastSlide = currentSlideIndex === currentCourse.slides.length - 1;



    const handleNext = () => {
        if (!quizCompleted) {
            return;
        }

        if (isLastSlide && user?.uid) {
            // Finalize course
            dispatch(syncCoursePoints({ 
                uid: user.uid,
                courseId: currentCourse.id, 
                points: (currentCourse.slides?.length || 0) * 100 
            }));
            
            // Navigate to Certificate
            navigation.replace('Certificate', { 
                courseTitle: currentCourse.title,
                score: 100 // Mock score for now
            });
        } else if (user?.uid) {
            // Update points for partial completion
            dispatch(syncCoursePoints({ 
                uid: user.uid,
                courseId: currentCourse.id, 
                points: (currentSlideIndex + 1) * 100 
            }));
            setCurrentSlideIndex(prev => prev + 1);
            setQuizCompleted(false);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    };

    const handlePrevious = () => {
        if (currentSlideIndex > 0) {
            setCurrentSlideIndex(currentSlideIndex - 1);
            setQuizCompleted(false);
            scrollViewRef.current?.scrollTo({ x: 0, y: 0, animated: true });
        }
    };

    const handleQuizComplete = (isCorrect: boolean) => {
        setQuizCompleted(true);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity 
                        onPress={() => navigation.goBack()}
                        style={styles.backButton}
                    >
                        <Icon name="chevron-left" size={28} color="#111827" />
                    </TouchableOpacity>
                    <Text style={styles.courseTitle} numberOfLines={1}>
                        {currentCourse.title}
                    </Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statPill}>
                            <Icon name="star" size={14} color="#F59E0B" />
                            <Text style={styles.statText}>{coursePoints} pts</Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.statPill, { backgroundColor: '#F0F9FF' }]}
                            onPress={() => setLeaderboardVisible(true)}
                        >
                            <Icon name="trophy" size={14} color="#0EA5E9" />
                            <Text style={[styles.statText, { color: '#0EA5E9' }]}>#{myRank}</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {currentCourse.type === 'slides' && currentCourse.slides && (
                    <RoadmapTimeline 
                        steps={currentCourse.slides.map((s: any, i: number) => ({
                            id: i,
                            title: s.title,
                            completed: i < currentSlideIndex,
                            active: i === currentSlideIndex
                        }))}
                        currentStepIndex={currentSlideIndex}
                    />
                )}

                <LeaderboardModal 
                    visible={leaderboardVisible}
                    onClose={() => setLeaderboardVisible(false)}
                    courseTitle={currentCourse.title}
                />
            </View>

            <ScrollView ref={scrollViewRef} style={styles.content} contentContainerStyle={styles.scrollContent}>
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
                    {currentSlideIndex > 0 && (
                        <TouchableOpacity 
                            onPress={handlePrevious}
                            style={styles.prevButton}
                        >
                            <Text style={styles.prevButtonLabel}>Previous</Text>
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        onPress={handleNext}
                        disabled={!quizCompleted}
                        style={[
                            styles.nextButton,
                            !quizCompleted && styles.nextButtonDisabled
                        ]}
                    >
                        <Text style={styles.nextButtonLabel}>
                            {isLastSlide ? 'Finish Course' : 'Continue'}
                        </Text>
                        {!isLastSlide && <Icon name="arrow-right" size={20} color="#FFFFFF" />}
                    </TouchableOpacity>
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
        backgroundColor: '#FFFFFF',
        paddingTop: 16,
        paddingBottom: 24,
        paddingHorizontal: 16,
        ...SHADOWS.sm,
    },
    headerTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    courseTitle: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 16,
        letterSpacing: -0.5,
        flex: 1,
        textAlign: 'center',
        marginHorizontal: 8,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    statPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#D97706',
    },
    progressSection: {
        width: '100%',
        paddingHorizontal: 8,
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F1F5F9',
        marginBottom: 8,
    },
    progressInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    progressText: {
        color: '#6B7280',
        fontSize: 11,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    slideCard: {
        margin: 16,
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        ...SHADOWS.card,
    },
    slideTitle: {
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#111827',
        fontSize: 24,
        letterSpacing: -0.5,
    },
    quizWrapper: {
        marginHorizontal: 16,
        marginBottom: 32,
    },
    navigation: {
        paddingHorizontal: 16,
        paddingVertical: 20,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    navInner: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    prevButton: {
        flex: 1,
        height: 52,
        justifyContent: 'center',
        alignItems: 'center',
    },
    prevButtonLabel: {
        color: '#6B7280',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButton: {
        flex: 2,
        height: 52,
        backgroundColor: '#1DA1F2',
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...SHADOWS.md,
    },
    nextButtonDisabled: {
        backgroundColor: '#94A3B8',
        shadowOpacity: 0,
        elevation: 0,
    },
    nextButtonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

const markdownStyles = {
    body: {
        fontSize: 16,
        lineHeight: 26,
        color: '#4B5563',
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
