import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text, TextInput, Button, ActivityIndicator, Menu, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MascotSvg from '@/assets/images/mascot.svg';
import {
    generateCourse,
    generateAudioCourse,
    generateVideoCourse,
    setCategory,
    setDifficulty,
    setCourseType,
    fetchCourses,
} from '@/store/slices/courseSlice';
import { logout } from '@/store/slices/authSlice';
import { loadUserStats, setLeaderboard, fetchUserCourses } from '@/store/slices/gamificationSlice';
import { AppDispatch, RootState } from '@/store';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { firestoreService } from '@/api/firestoreService';
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
import { useAppSelector } from '@/store/hooks';
import { DEGREES } from '@/constants/degrees';

// New Components
import { HomeHeader } from '@/components/home/HomeHeader';
import { HomeActionCenter } from '@/components/home/HomeActionCenter';
import { QuickTopicChips } from '@/components/home/QuickTopicChips';
import { CourseCreatorWizard } from '@/components/home/CourseCreatorWizard';
import { CourseCard } from '@/components/home/CourseCard';
import { MascotTipSection } from '@/components/home/MascotTipSection';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const dispatch = useDispatch<AppDispatch>();
    
    // Auth State
    const { user } = useSelector((state: RootState) => state.auth);
    
    // Course State (Explore)
    const { 
        courses: exploreCourses, 
        loading: courseLoading, 
        isGenerating,
        error, 
        category, 
        difficulty, 
        courseType 
    } = useSelector((state: RootState) => state.course);
    
    // Gamification & User Progress State
    const { 
        totalXP, 
        rank, 
        userCourses,
        dailyXP,
        dailyGoal,
        streakCount,
        loading: statsLoading
    } = useSelector((state: RootState) => state.gamification);

    const [prompt, setPrompt] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const [currentTipIndex, setCurrentTipIndex] = useState(0);

    const tips = [
        "Be specific about what you want to learn. E.g. 'Advanced React Hooks' instead of just 'React'.",
        "Try topics like 'Introduction to Quantum Physics' for a deep dive into science.",
        "Ask about practical skills like 'How to manage time effectively' for personal growth.",
        "Combine topics! Try 'Python for Finance' or 'AI in Healthcare'.",
        "Specify the audience: 'Coding for kids' or 'Marketing for seniors'."
    ];

    const nextTip = () => {
        setCurrentTipIndex((prev) => (prev + 1) % tips.length);
    };

    // Initial load and real-time listeners
    React.useEffect(() => {
        if (user?.uid) {
            dispatch(loadUserStats(user.uid));
            dispatch(fetchCourses());
            dispatch(fetchUserCourses(user.uid));
        }

        // Subscribe to real-time leaderboard
        const unsubscribe = firestoreService.subscribeToLeaderboard((leaderboard: any[]) => {
            dispatch(setLeaderboard(leaderboard));
        });

        // Set a random initial tip
        setCurrentTipIndex(Math.floor(Math.random() * tips.length));

        return () => unsubscribe();
    }, [user?.uid, dispatch]);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    const handleLogoutWithMenu = () => {
        closeMenu();
        dispatch(logout());
    };

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            Alert.alert('Oops!', 'Please enter a topic you want to learn!');
            return;
        }

        if (!category) {
            Alert.alert('Oops!', 'Please select a category for your course!');
            return;
        }

        // Navigate to Loading screen instead of calling API here
        navigation.navigate('Loading', { 
            topic: prompt, 
            courseType: courseType 
        });
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

    // Dynamic Course Icons mapping
    const getCourseIcon = (iconName: string) => {
        const iconMap: Record<string, string> = {
            'language-python': 'language-python',
            'react': 'react',
            'atom': 'atom',
            'code-braces': 'code-braces',
            'finance': 'finance',
            'palette-swatch-outline': 'palette-swatch-outline'
        };
        return iconMap[iconName] || 'book-open-variant';
    };

    const handleCoursePress = (course: any) => {
        const screenName = 
            course.type === 'audio' ? 'AudioCourse' : 
            course.type === 'video' ? 'VideoCourse' : 
            'Course';
            
        // Provide enough mock data for the screen to load
        navigation.navigate(screenName as any, { 
            course: {
                id: course.id,
                title: course.title,
                description: `A comprehensive course about ${course.title} by ${course.author}.`,
                total_slides: 5,
                slides: [
                    {
                        slide_number: 1,
                        title: 'Introduction',
                        content: `Welcome to ${course.title}! This course will cover the fundamentals and advanced topics.`,
                        quiz: {
                            question: 'What is the main focus of this course?',
                            options: [course.title, 'Something else', 'None of the above'],
                            correct_answer: course.title,
                            explanation: 'Correct! This is exactly what we are learning.'
                        }
                    }
                ],
                audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
                videoUrl: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                duration: 300
            }
        });
    };

    return (
        <ScrollView style={styles.container}>
            <HomeHeader 
                totalXP={totalXP}
                rank={rank}
                menuVisible={menuVisible}
                openMenu={openMenu}
                closeMenu={closeMenu}
                onNavigate={(screen) => navigation.navigate(screen as any)}
                onLogout={handleLogoutWithMenu}
            />

            <HomeActionCenter 
                dailyXP={dailyXP}
                dailyGoal={dailyGoal}
                streakCount={streakCount}
                lvl={Math.floor(totalXP / 1000) + 1}
                onChallengePress={() => navigation.navigate('AIAssistant')}
            />

            <MascotTipSection 
                tip={tips[currentTipIndex]} 
                onRefresh={nextTip}
                onAskNova={() => navigation.navigate('AIAssistant')}
            />

            <CourseCreatorWizard 
                prompt={prompt}
                setPrompt={setPrompt}
                category={category}
                onCategoryChange={handleCategoryChange}
                difficulty={difficulty}
                onDifficultyChange={handleDifficultyChange}
                courseType={courseType}
                onCourseTypeChange={handleCourseTypeChange}
                onGenerate={handleGenerate}
                loading={isGenerating}
                error={error}
            />

            <View style={styles.exploreSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Explore & Degrees</Text>
                    <TouchableOpacity onPress={() => (navigation as any).navigate('Degrees')}>
                        <Text style={styles.viewAllText}>Degrees</Text>
                    </TouchableOpacity>
                </View>
                {courseLoading && exploreCourses.length === 0 ? (
                    <ActivityIndicator size="small" color={COLORS.primary} style={{ marginVertical: 20 }} />
                ) : (
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.exploreScrollContainer}
                    >
                        {exploreCourses.map((item: any) => (
                            <CourseCard 
                                key={item.id} 
                                course={item} 
                                onPress={() => handleCoursePress(item)} 
                            />
                        ))}
                    </ScrollView>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    degreesCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: SPACING.md,
        padding: 16,
        borderRadius: BORDER_RADIUS.card,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    degreesIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        backgroundColor: '#F5F3FF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    degreesText: {
        flex: 1,
    },
    degreesTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 2,
    },
    degreesSubtitle: {
        fontSize: 13,
        color: '#64748B',
    },

    // Form styles are now in GenerateForm.tsx

    // Course and Tips styles are now in their respective components
    
    exploreSection: {
        marginTop: 8,
        marginBottom: SPACING.md,
    },
    continueSection: {
        paddingHorizontal: 0,
        marginBottom: SPACING.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xs,
        paddingHorizontal: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: -0.3,
    },
    viewAllText: {
        fontSize: 14,
        color: COLORS.primary,
        fontWeight: '600',
    },
    continueScrollContainer: {
        paddingLeft: 16,
        paddingRight: 16,
    },
    enrolledPathCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: BORDER_RADIUS.card,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        width: 280,
        marginRight: 12,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    pathIconContainer: {
        width: 44,
        height: 44,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    pathInfo: {
        flex: 1,
        marginRight: 8,
    },
    pathTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    pathProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniProgressBar: {
        flex: 1,
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        marginRight: 8,
    },
    miniProgressFill: {
        height: '100%',
        borderRadius: 3,
    },
    pathProgressText: {
        fontSize: 11,
        fontWeight: 'bold',
        color: '#64748B',
    },
    exploreTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: SPACING.xs,
    },
    exploreScrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 4,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.sm,
        gap: 4,
    },
    viewAllCoursesText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default HomeScreen;
