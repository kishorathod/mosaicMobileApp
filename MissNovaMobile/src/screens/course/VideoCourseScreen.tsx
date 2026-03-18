import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, ProgressBar, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { updateCoursePoints, LeaderboardEntry } from '@/store/slices/gamificationSlice';

const { width } = Dimensions.get('window');

interface VideoCourse {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    transcript?: string;
    type: 'video';
}

const VideoCourseScreen = () => {
    const route = useRoute();
    const navigation = useNavigation() as any;
    const dispatch = useAppDispatch();
    const { course } = (route.params as { course: any }) || { course: null };

    const { leaderboard } = useAppSelector((state: RootState) => state.gamification);
    const myRank = leaderboard?.find((l: LeaderboardEntry) => l.isMe)?.rank || 5;
    
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

    if (!course) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                     <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={28} color={COLORS.text} />
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>No course data available.</Text>
                </View>
            </View>
        );
    }

    const coursePoints = 500; // Mock fixed points for audio/video for now

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // TODO: Implement actual video playback with react-native-video
    };

    const handleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
        // TODO: Implement actual fullscreen functionality
    };

    const handleSpeedChange = () => {
        const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
        const currentIndex = speeds.indexOf(playbackSpeed);
        const nextIndex = (currentIndex + 1) % speeds.length;
        setPlaybackSpeed(speeds[nextIndex]);
        // TODO: Implement actual speed change
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = course.duration > 0 ? currentTime / course.duration : 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="chevron-left" size={28} color={COLORS.text} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        Video Course
                    </Text>
                    <View style={styles.statsContainer}>
                        <View style={styles.statPill}>
                            <Icon name="star" size={14} color="#F59E0B" />
                            <Text style={styles.statText}>{coursePoints} pts</Text>
                        </View>
                        <View style={[styles.statPill, { backgroundColor: '#F0F9FF' }]}>
                            <Icon name="trophy" size={14} color="#0EA5E9" />
                            <Text style={[styles.statText, { color: '#0EA5E9' }]}>#{myRank}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Video Player */}
                <Card style={styles.videoCard}>
                    <View style={styles.videoContainer}>
                        {/* Video Placeholder */}
                        <View style={styles.videoPlaceholder}>
                            <Icon name="play-circle" size={80} color={COLORS.surface} style={{ marginBottom: SPACING.md }} />
                            <Text style={styles.videoPlaceholderSubtext}>
                                {course.title}
                            </Text>
                        </View>

                        {/* Video Controls Overlay */}
                        <View style={styles.controlsOverlay}>
                            <TouchableOpacity
                                style={styles.playButtonOverlay}
                                onPress={handlePlayPause}
                            >
                                <IconButton
                                    icon={isPlaying ? 'pause' : 'play'}
                                    size={48}
                                    iconColor={COLORS.surface}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.fullscreenButton}
                                onPress={handleFullscreen}
                            >
                                <IconButton
                                    icon={isFullscreen ? 'fullscreen-exit' : 'fullscreen'}
                                    size={24}
                                    iconColor={COLORS.surface}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Progress Bar */}
                    <Card.Content>
                        <View style={styles.progressContainer}>
                            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                            <ProgressBar
                                progress={progress}
                                style={styles.progressBar}
                                color={COLORS.primary}
                            />
                            <Text style={styles.timeText}>{formatTime(course.duration)}</Text>
                        </View>

                        {/* Additional Controls */}
                        <View style={styles.additionalControls}>
                            <TouchableOpacity
                                style={styles.speedButton}
                                onPress={handleSpeedChange}
                            >
                                <Text style={styles.speedText}>{playbackSpeed}x</Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>

                {/* Course Info */}
                <View style={styles.infoCard}>
                    <Text style={styles.courseTitle}>
                        {course.title}
                    </Text>
                    <Text style={styles.description}>
                        {course.description}
                    </Text>
                </View>

                {/* Transcript */}
                {course.transcript && (
                    <View style={styles.transcriptCard}>
                        <View style={styles.transcriptHeader}>
                            <Icon name="text-box-outline" size={20} color="#111827" style={{ marginRight: 8 }} />
                            <Text style={styles.transcriptTitle}>
                                Transcript
                            </Text>
                        </View>
                        <Text style={styles.transcriptText}>
                            {course.transcript}
                        </Text>
                    </View>
                )}

                {/* Placeholder Note */}
                <View style={styles.noteCard}>
                    <Text style={styles.noteText}>
                        Video playback functionality will be implemented soon
                    </Text>
                </View>

                {/* Finish Button */}
                <TouchableOpacity 
                    style={styles.finishButton}
                    onPress={() => {
                        dispatch(updateCoursePoints({ 
                            courseId: course.id || 'video-1', 
                            points: 500 
                        }));
                        navigation.replace('Certificate', { 
                            courseTitle: course.title,
                            score: 100
                        });
                    }}
                >
                    <Text style={styles.finishButtonLabel}>Finish Course</Text>
                    <Icon name="certificate" size={20} color="#FFFFFF" />
                </TouchableOpacity>
            </ScrollView>
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
    headerTitle: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 18,
    },
    content: {
        flex: 1,
    },
    videoCard: {
        margin: 0,
        backgroundColor: '#000000',
        borderRadius: 0,
        ...SHADOWS.lg,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000000',
        position: 'relative',
    },
    videoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0F172A',
    },
    videoPlaceholderSubtext: {
        fontSize: 14,
        color: '#94A3B8',
        textAlign: 'center',
        paddingHorizontal: 32,
        fontWeight: '500',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
    },
    playButtonOverlay: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#1DA1F2E6',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.lg,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: 16,
        right: 16,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 16,
    },
    progressBar: {
        flex: 1,
        marginHorizontal: 12,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    timeText: {
        fontSize: 12,
        color: '#FFFFFF',
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
    },
    additionalControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        paddingBottom: 16,
    },
    speedButton: {
        paddingHorizontal: 20,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    speedText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    infoCard: {
        margin: 16,
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        ...SHADOWS.card,
    },
    courseTitle: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 24,
        letterSpacing: -0.5,
        marginBottom: 16,
    },
    description: {
        color: '#6B7280',
        lineHeight: 24,
        fontSize: 16,
    },
    transcriptCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#FFFFFF',
        ...SHADOWS.card,
    },
    transcriptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    transcriptTitle: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 18,
    },
    transcriptText: {
        color: '#4B5563',
        lineHeight: 24,
        fontSize: 15,
    },
    noteCard: {
        marginHorizontal: 16,
        marginBottom: 48,
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F0F9FF',
        borderWidth: 1,
        borderColor: '#BAE6FD',
    },
    noteText: {
        color: '#0369A1',
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '600',
    },
    finishButton: {
        margin: 16,
        marginTop: 0,
        marginBottom: 40,
        height: 56,
        backgroundColor: '#1DA1F2',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...SHADOWS.md,
    },
    finishButtonLabel: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default VideoCourseScreen;
