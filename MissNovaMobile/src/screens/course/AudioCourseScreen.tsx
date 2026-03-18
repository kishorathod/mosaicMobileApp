import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ProgressBar, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { updateCoursePoints, LeaderboardEntry } from '@/store/slices/gamificationSlice';

interface AudioCourse {
    title: string;
    description: string;
    audioUrl: string;
    duration: number;
    transcript?: string;
    type: 'audio';
}

const AudioCourseScreen = () => {
    const route = useRoute();
    const navigation = useNavigation() as any;
    const dispatch = useAppDispatch();
    const { course } = route.params as { course: any };

    const { leaderboard } = useAppSelector((state: RootState) => state.gamification);
    const myRank = leaderboard.find((l: LeaderboardEntry) => l.isMe)?.rank || 5;
    const coursePoints = 500; // Mock fixed points for audio/video for now

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
        // TODO: Implement actual audio playback with react-native-track-player
    };

    const handleSeek = (value: number) => {
        setCurrentTime(value);
        // TODO: Implement actual seek functionality
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
                        Audio Course
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
                {/* Course Info */}
                <View style={styles.infoCard}>
                    <View style={styles.titleContainer}>
                        <Icon name="headphones" size={28} color="#1DA1F2" style={{ marginRight: 12 }} />
                        <Text style={styles.courseTitle}>
                            {course.title}
                        </Text>
                    </View>
                    <Text style={styles.description}>
                        {course.description}
                    </Text>
                </View>

                {/* Audio Player */}
                <View style={styles.playerCard}>
                    {/* Waveform Visualization Placeholder */}
                    <View style={styles.waveformContainer}>
                        <Icon name="sine-wave" size={48} color="#1DA1F2" />
                        <Text style={styles.waveformPlaceholder}>
                            AUDIO WAVEFORM
                        </Text>
                    </View>

                    {/* Progress Bar */}
                    <View style={styles.progressContainer}>
                        <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                        <ProgressBar
                            progress={progress}
                            style={styles.progressBar}
                            color="#1DA1F2"
                        />
                        <Text style={styles.timeText}>{formatTime(course.duration)}</Text>
                    </View>

                    {/* Playback Controls */}
                    <View style={styles.controls}>
                        <IconButton
                            icon="rewind-10"
                            size={32}
                            onPress={() => handleSeek(Math.max(0, currentTime - 10))}
                            iconColor="#6B7280"
                        />

                        <TouchableOpacity
                            style={styles.playButton}
                            onPress={handlePlayPause}
                            activeOpacity={0.8}
                        >
                            <Icon 
                                name={isPlaying ? 'pause' : 'play'} 
                                size={40} 
                                color="#FFFFFF" 
                            />
                        </TouchableOpacity>

                        <IconButton
                            icon="fast-forward-10"
                            size={32}
                            onPress={() => handleSeek(Math.min(course.duration, currentTime + 10))}
                            iconColor="#6B7280"
                        />
                    </View>

                    {/* Speed Control */}
                    <View style={styles.speedControl}>
                        <TouchableOpacity
                            style={styles.speedButton}
                            onPress={handleSpeedChange}
                        >
                            <Text style={styles.speedText}>{playbackSpeed}x</Text>
                        </TouchableOpacity>
                    </View>
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
                        Audio playback functionality will be implemented soon
                    </Text>
                </View>

                {/* Finish Button */}
                <TouchableOpacity 
                    style={styles.finishButton}
                    onPress={() => {
                        dispatch(updateCoursePoints({ 
                            courseId: course.id || 'audio-1', 
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
    infoCard: {
        margin: 16,
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        ...SHADOWS.card,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    courseTitle: {
        fontWeight: 'bold',
        color: '#111827',
        fontSize: 24,
        letterSpacing: -0.5,
        flex: 1,
    },
    description: {
        color: '#6B7280',
        lineHeight: 24,
        fontSize: 16,
    },
    playerCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        ...SHADOWS.card,
    },
    waveformContainer: {
        height: 100,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: '#E5E7EB',
    },
    waveformPlaceholder: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#1DA1F2',
        letterSpacing: 1.5,
        marginTop: 8,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 32,
    },
    progressBar: {
        flex: 1,
        marginHorizontal: 12,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#F1F5F9',
    },
    timeText: {
        fontSize: 12,
        color: '#6B7280',
        fontWeight: 'bold',
        width: 40,
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: '#1DA1F2',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 24,
        ...SHADOWS.md,
    },
    speedControl: {
        alignItems: 'center',
    },
    speedButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#F1F5F9',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    speedText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#475569',
    },
    transcriptCard: {
        marginHorizontal: 16,
        marginBottom: 16,
        padding: 24,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
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

export default AudioCourseScreen;
