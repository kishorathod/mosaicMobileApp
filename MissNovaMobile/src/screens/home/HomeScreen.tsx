import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
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
} from '@/store/slices/courseSlice';
import { logout } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { CustomPicker } from '@/components/CustomPicker';
import {
    loadUserStats,
    setLeaderboard,
    addXP,
    LeaderboardEntry,
} from '@/store/slices/gamificationSlice';
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

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const HomeScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<HomeScreenNavigationProp>();
    const { loading, error, category, difficulty, courseType } = useSelector(
        (state: RootState) => state.course
    );
    const { user } = useSelector((state: RootState) => state.auth);
    const { totalXP, rank, enrolledDegrees } = useAppSelector((state: RootState) => state.gamification);

    const enrolledPaths = DEGREES.filter(degree => enrolledDegrees.includes(degree.id));

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
        }

        // Subscribe to real-time leaderboard
        const unsubscribe = firestoreService.subscribeToLeaderboard((leaderboard: LeaderboardEntry[]) => {
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
            return;
        }

        if (!category) {
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

    const exploreCourses = [
        {
            id: 'mock-1',
            title: 'Python for Data Science',
            author: 'Dr. Sarah Kim',
            progress: 75,
            category: 'Technology',
            categoryColor: '#E0F2FE',
            accentColor: '#0369A1',
            icon: 'code-braces',
            difficulty: 'Intermediate',
            type: 'slides'
        },
        {
            id: 'mock-2',
            title: 'Digital Marketing Strategy',
            author: 'Mike Johnson',
            progress: 90,
            category: 'Marketing',
            categoryColor: '#F3E8FF',
            accentColor: '#7E22CE',
            icon: 'finance',
            difficulty: 'Beginner',
            type: 'audio'
        },
        {
            id: 'mock-3',
            title: 'Advanced Web Design & UX',
            author: 'Emma Rodriguez',
            progress: 68,
            category: 'Design',
            categoryColor: '#DCFCE7',
            accentColor: '#15803D',
            icon: 'palette-swatch-outline',
            difficulty: 'Intermediate',
            type: 'video'
        }
    ];

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
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <View style={styles.headerAvatarContainer}>
                        <MascotSvg width={24} height={24} />
                    </View>
                    <Text style={styles.headerTitle}>
                        Miss Nova
                    </Text>
                </View>

                <View style={styles.headerRight}>
                    <View style={styles.xpPill}>
                        <Icon name="star" size={16} color="#F59E0B" />
                        <Text style={styles.xpText}>{totalXP} XP</Text>
                    </View>
                    <View style={styles.rankPill}>
                        <Icon name="trophy" size={16} color="#0EA5E9" />
                        <Text style={styles.rankText}>#{rank}</Text>
                    </View>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        anchor={
                            <TouchableOpacity onPress={openMenu} style={styles.logoutButton}>
                                <Icon name="menu" size={24} color={COLORS.text} />
                            </TouchableOpacity>
                        }
                        contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            borderRadius: 16,
                            marginTop: 40, // Adjust position
                            ...SHADOWS.lg, 
                            elevation: 8 
                        }}
                    >
                        <Menu.Item 
                            onPress={() => { closeMenu(); navigation.navigate('Degrees'); }} 
                            title="Academic Degrees" 
                            leadingIcon={({ size, color }) => (
                                <Icon name="school" size={size} color="#1DA1F2" />
                            )}
                            titleStyle={{ color: '#111827', fontWeight: '500' }}
                        />
                        <Menu.Item 
                            onPress={() => { closeMenu(); navigation.navigate('Leaderboard'); }} 
                            title="Leaderboard" 
                            leadingIcon={({ size, color }) => (
                                <Icon name="trophy" size={size} color="#F59E0B" />
                            )}
                            titleStyle={{ color: '#111827', fontWeight: '500' }}
                        />
                        <Menu.Item 
                            onPress={() => { closeMenu(); navigation.navigate('Badges'); }} 
                            title="My Badges" 
                            leadingIcon={({ size, color }) => (
                                <Icon name="seal-variant" size={size} color="#8B5CF6" />
                            )}
                            titleStyle={{ color: '#111827', fontWeight: '500' }}
                        />
                        <Menu.Item 
                            onPress={() => { closeMenu(); navigation.navigate('AIAssistant'); }} 
                            title="Chat with Miss Nova" 
                            leadingIcon={({ size, color }) => (
                                <Icon name="chat-processing" size={size} color="#1DA1F2" />
                            )}
                            titleStyle={{ color: '#111827', fontWeight: '500' }}
                        />
                        <Divider />
                        <Menu.Item 
                            onPress={handleLogoutWithMenu} 
                            title="Logout" 
                            leadingIcon={({ size, color }) => (
                                <Icon name="logout" size={size} color="#EF4444" />
                            )}
                            titleStyle={{ color: '#EF4444', fontWeight: '500' }}
                        />
                    </Menu>
                </View>
            </View>



            <TouchableOpacity 
                style={styles.assistantBanner}
                onPress={() => navigation.navigate('AIAssistant')}
                activeOpacity={0.9}
            >
                <View style={styles.bannerAvatar}>
                    <MascotSvg width={60} height={60} />
                </View>
                <View style={styles.bannerTextContainer}>
                    <View style={styles.bannerHeader}>
                        <Text style={styles.bannerTitle}>Hi! I'm Miss Nova.</Text>
                        <View style={styles.chatBadge}>
                            <Icon name="chat-outline" size={12} color="#1DA1F2" style={{ marginRight: 4 }} />
                            <Text style={styles.chatBadgeText}>TAP TO CHAT</Text>
                        </View>
                    </View>
                    <Text style={styles.bannerSubtext}>Your AI teacher ready to create a course on any topic.</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.degreesCard} 
                onPress={() => navigation.navigate('Degrees')}
            >
                <View style={styles.degreesIcon}>
                    <Icon name="school" size={24} color="#8B5CF6" />
                </View>
                <View style={styles.degreesText}>
                    <Text style={styles.degreesTitle}>Academic Degrees</Text>
                    <Text style={styles.degreesSubtitle}>Enroll in professional learning paths</Text>
                </View>
                <Icon name="chevron-right" size={20} color="#CBD5E1" />
            </TouchableOpacity>

            <View style={styles.formContainer}>
                <Text variant="headlineSmall" style={styles.formTitle}>
                    Create Your Course
                </Text>
                <Text variant="bodyMedium" style={styles.formDescription}>
                    Tell me what you want to learn, and I'll create a personalized course for you!
                </Text>

                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    mode="outlined"
                    placeholder="E.g. JavaScript, React, AI Basics"
                    style={styles.input}
                    textColor="#111827"
                    placeholderTextColor="#9CA3AF"
                    outlineColor="#E5E7EB"
                    activeOutlineColor="#1DA1F2"
                    left={<TextInput.Icon icon="magnify" color="#9CA3AF" />}
                    contentStyle={{ paddingLeft: 10 }}
                    theme={{ roundness: 12, colors: { background: '#F9FAFB' } }}
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

                <TouchableOpacity
                    onPress={handleGenerate}
                    disabled={loading || !prompt.trim() || !category}
                    style={styles.generateButton}
                    activeOpacity={0.8}
                >
                    <View style={styles.buttonInner}>
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <View style={styles.buttonInnerContent}>
                                <Icon name="creation" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
                                <Text style={styles.buttonLabel}>Create My Course</Text>
                            </View>
                        )}
                    </View>
                </TouchableOpacity>
            </View>

            {enrolledPaths.length > 0 && (
                <View style={styles.continueSection}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Continue Learning</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Degrees')}>
                            <Text style={styles.viewAllText}>Manage Paths</Text>
                        </TouchableOpacity>
                    </View>
                    <ScrollView 
                        horizontal={true} 
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.continueScrollContainer}
                    >
                        {enrolledPaths.map((path) => (
                            <TouchableOpacity 
                                key={path.id}
                                style={styles.enrolledPathCard}
                                activeOpacity={0.9}
                                onPress={() => navigation.navigate('Degrees')} // Or specific path detail if implemented
                            >
                                <View style={[styles.pathIconContainer, { backgroundColor: path.color + '1A' }]}>
                                    <Icon name={path.icon} size={24} color={path.color} />
                                </View>
                                <View style={styles.pathInfo}>
                                    <Text style={styles.pathTitle} numberOfLines={1}>{path.title}</Text>
                                    <View style={styles.pathProgressRow}>
                                        <View style={styles.miniProgressBar}>
                                            <View style={[styles.miniProgressFill, { width: '35%', backgroundColor: path.color }]} />
                                        </View>
                                        <Text style={styles.pathProgressText}>35%</Text>
                                    </View>
                                </View>
                                <Icon name="chevron-right" size={20} color="#CBD5E1" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            )}

            <View style={styles.exploreSection}>
                <Text style={styles.exploreTitle}>Explore Courses</Text>
                <ScrollView 
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.exploreScrollContainer}
                >
                    {exploreCourses.map((item) => (
                        <TouchableOpacity 
                            key={item.id}
                            onPress={() => handleCoursePress(item)}
                            activeOpacity={0.9}
                            style={styles.courseCard}
                        >
                            <View style={styles.courseContent}>
                                <View style={[styles.categoryPill, { backgroundColor: item.categoryColor }]}>
                                    <Text style={[styles.categoryText, { color: item.accentColor }]}>{item.category}</Text>
                                </View>
                                <View style={styles.courseHeader}>
                                    <Text style={styles.courseTitle} numberOfLines={2}>
                                        {item.title}
                                    </Text>
                                    <Icon name={item.icon || 'book-open-variant'} size={24} color={item.accentColor} />
                                </View>
                                <View style={styles.courseAuthorContainer}>
                                    <View style={styles.courseAuthorAvatar}>
                                        <Icon name="account" size={16} color="#94A3B8" />
                                    </View>
                                    <Text style={styles.courseAuthor}>{item.author}</Text>
                                </View>
                                
                                <View style={styles.progressSection}>
                                    <View style={styles.progressHeader}>
                                        <Text style={styles.progressLabel}>Progress</Text>
                                        <Text style={[styles.courseProgressText, { color: item.accentColor }]}>
                                            {item.progress}%
                                        </Text>
                                    </View>
                                    <View style={styles.progressBarContainer}>
                                        <View style={[styles.progressBar, { width: `${item.progress}%`, backgroundColor: item.accentColor }]} />
                                    </View>
                                </View>

                                <View style={styles.courseFooter}>
                                    <View style={styles.courseDifficulty}>
                                        <Icon name={item.difficulty === 'Beginner' ? 'sprout-outline' : 'trending-up'} size={16} color="#64748B" />
                                        <Text style={styles.difficultyText}>{item.difficulty}</Text>
                                    </View>
                                    <View style={[styles.playBtn, { backgroundColor: item.accentColor }]}>
                                        <Icon name="play" size={20} color="#FFFFFF" />
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity 
                    style={styles.viewAllButton}
                    onPress={() => navigation.navigate('Degrees')}
                >
                    <Text style={styles.viewAllCoursesText}>View All Courses</Text>
                    <Icon name="chevron-right" size={20} color="#1DA1F2" />
                </TouchableOpacity>
            </View>
            
            <View style={styles.tipsSection}>
                <View style={styles.tipsHeaderRow}>
                    <View style={styles.tipsIdentity}>
                        <MascotSvg width={32} height={32} />
                        <Text style={styles.tipsIdentityText}>Miss Nova's Tips</Text>
                    </View>
                    <TouchableOpacity onPress={nextTip} style={styles.refreshTip}>
                        <Icon name="refresh" size={18} color="#1DA1F2" />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.tipBubble}>
                    <View style={styles.tipBubbleArrow} />
                    <Text style={styles.tipText}>
                        {tips[currentTipIndex]}
                    </Text>
                </View>
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
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        ...SHADOWS.sm,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    xpPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    xpText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#D97706',
    },
    rankPill: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 20,
        gap: 4,
        borderWidth: 1,
        borderColor: '#E0F2FE',
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#0EA5E9',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    headerAvatarContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: -0.5,
    },
    logoutButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },

    assistantBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginTop: 8,
        marginBottom: 32,
        padding: 16,
        borderRadius: 16,
        ...SHADOWS.sm,
    },
    bannerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    chatBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E0F2FE',
    },
    chatBadgeText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#1DA1F2',
    },
    bannerAvatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    bannerTextContainer: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 4,
    },
    bannerSubtext: {
        fontSize: 14,
        color: '#6B7280',
        lineHeight: 20,
    },
    degreesCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        marginBottom: 32,
        padding: 16,
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#F1F5F9',
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
    formContainer: {
        padding: 24,
        backgroundColor: '#FFFFFF',
        marginHorizontal: 16,
        borderRadius: 16,
        ...SHADOWS.card,
    },
    formTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        fontSize: 24,
        marginBottom: 8,
        color: '#111827',
        letterSpacing: -0.5,
    },
    formDescription: {
        color: '#6B7280',
        marginBottom: 24,
        fontSize: 14,
        lineHeight: 20,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#F9FAFB',
        fontSize: 15,
        height: 52,
    },
    badgesContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
        marginBottom: 32,
    },
    errorContainer: {
        backgroundColor: '#FEE2E2',
        padding: 16,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FECACA',
    },
    error: {
        color: '#EF4444',
        fontSize: 13,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        flex: 1,
        textAlign: 'center',
    },
    generateButton: {
        height: 52,
        borderRadius: 14,
        backgroundColor: '#1DA1F2',
        justifyContent: 'center',
        shadowColor: '#1DA1F2',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 8,
    },
    buttonInner: {
        height: '100%',
    },
    buttonInnerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    buttonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    exploreSection: {
        marginTop: 40,
        marginBottom: 16,
    },
    continueSection: {
        paddingHorizontal: 20,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    viewAllText: {
        fontSize: 14,
        color: '#1DA1F2',
        fontWeight: '500',
    },
    continueScrollContainer: {
        paddingRight: 20,
    },
    enrolledPathCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 12,
        flexDirection: 'row',
        alignItems: 'center',
        width: 280,
        marginRight: 16,
        ...SHADOWS.sm,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    pathIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 12,
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
        color: '#1E293B',
        marginBottom: 4,
    },
    pathProgressRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    miniProgressBar: {
        flex: 1,
        height: 4,
        backgroundColor: '#F1F5F9',
        borderRadius: 2,
        marginRight: 8,
    },
    miniProgressFill: {
        height: '100%',
        borderRadius: 2,
    },
    pathProgressText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#64748B',
    },
    exploreTitle: {
        fontSize: 20,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: '#111827',
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    exploreScrollContainer: {
        paddingHorizontal: 16,
        paddingBottom: 8, // For shadow visibility
    },
    courseCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 16,
        width: 280,
        marginRight: 16,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        overflow: 'hidden',
    },
    courseContent: {
        padding: 4, // Reduced since card has padding
    },
    categoryPill: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 10,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    courseHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    courseTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#111827',
        flex: 1,
        marginRight: 8,
        lineHeight: 22,
    },
    courseEmoji: {
        fontSize: 22,
    },
    courseAuthorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    courseAuthorAvatar: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    courseAuthor: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    progressSection: {
        marginBottom: 16,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    progressLabel: {
        fontSize: 11,
        color: '#94A3B8',
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    progressBarContainer: {
        height: 6,
        backgroundColor: '#F1F5F9',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    courseFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    courseDifficulty: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#F8FAFC',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
    },
    difficultyEmoji: {
        fontSize: 12,
    },
    difficultyText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#64748B',
    },
    courseProgressText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#1DA1F2',
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#1DA1F2',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 24,
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 16,
        marginHorizontal: 16,
        gap: 8,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        ...SHADOWS.sm,
    },
    viewAllCoursesText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#1DA1F2',
    },
    tipsSection: {
        marginHorizontal: 16,
        marginTop: 40,
        marginBottom: 48,
    },
    tipsHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
        paddingHorizontal: 4,
    },
    tipsIdentity: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    tipsIdentityText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#111827',
    },
    refreshTip: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F0F9FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    tipBubble: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 20,
        borderBottomLeftRadius: 4,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        position: 'relative',
    },
    tipBubbleArrow: {
        position: 'absolute',
        bottom: -10,
        left: 0,
        width: 20,
        height: 20,
        backgroundColor: '#FFFFFF',
        transform: [{ rotate: '45deg' }],
        zIndex: -1,
    },
    tipText: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 22,
        fontStyle: 'italic',
    },
});

export default HomeScreen;
