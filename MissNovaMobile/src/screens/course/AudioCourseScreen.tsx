import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ProgressBar, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

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
    const navigation = useNavigation();
    const { course } = route.params as { course: AudioCourse };

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
            {/* Header */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                    iconColor={COLORS.text}
                />
                <Text variant="titleLarge" style={styles.headerTitle}>
                    Audio Course
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Course Info */}
                <Card style={styles.infoCard}>
                    <Card.Content>
                        <Text variant="displaySmall" style={styles.courseTitle}>
                            🎧 {course.title}
                        </Text>
                        <Text variant="bodyLarge" style={styles.description}>
                            {course.description}
                        </Text>
                    </Card.Content>
                </Card>

                {/* Audio Player */}
                <Card style={styles.playerCard}>
                    <Card.Content>
                        {/* Waveform Visualization Placeholder */}
                        <View style={styles.waveformContainer}>
                            <Text style={styles.waveformPlaceholder}>
                                🎵 Audio Waveform
                            </Text>
                        </View>

                        {/* Progress Bar */}
                        <View style={styles.progressContainer}>
                            <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                            <ProgressBar
                                progress={progress}
                                style={styles.progressBar}
                                color={COLORS.primary}
                            />
                            <Text style={styles.timeText}>{formatTime(course.duration)}</Text>
                        </View>

                        {/* Playback Controls */}
                        <View style={styles.controls}>
                            <IconButton
                                icon="rewind-10"
                                size={32}
                                onPress={() => handleSeek(Math.max(0, currentTime - 10))}
                                iconColor={COLORS.textSecondary}
                            />

                            <TouchableOpacity
                                style={styles.playButton}
                                onPress={handlePlayPause}
                            >
                                <IconButton
                                    icon={isPlaying ? 'pause' : 'play'}
                                    size={40}
                                    iconColor={COLORS.surface}
                                />
                            </TouchableOpacity>

                            <IconButton
                                icon="fast-forward-10"
                                size={32}
                                onPress={() => handleSeek(Math.min(course.duration, currentTime + 10))}
                                iconColor={COLORS.textSecondary}
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
                    </Card.Content>
                </Card>

                {/* Transcript */}
                {course.transcript && (
                    <Card style={styles.transcriptCard}>
                        <Card.Content>
                            <Text variant="titleMedium" style={styles.transcriptTitle}>
                                📝 Transcript
                            </Text>
                            <Text variant="bodyMedium" style={styles.transcriptText}>
                                {course.transcript}
                            </Text>
                        </Card.Content>
                    </Card>
                )}

                {/* Placeholder Note */}
                <Card style={styles.noteCard}>
                    <Card.Content>
                        <Text variant="bodyMedium" style={styles.noteText}>
                            ℹ️ Audio playback functionality will be implemented with react-native-track-player
                        </Text>
                    </Card.Content>
                </Card>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.md,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    headerTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.text,
    },
    content: {
        flex: 1,
    },
    infoCard: {
        margin: SPACING.md,
        backgroundColor: COLORS.surface,
        ...SHADOWS.md,
    },
    courseTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
        marginBottom: SPACING.md,
    },
    description: {
        color: COLORS.textSecondary,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.lg,
    },
    playerCard: {
        margin: SPACING.md,
        marginTop: 0,
        backgroundColor: COLORS.surface,
        ...SHADOWS.lg,
    },
    waveformContainer: {
        height: 120,
        backgroundColor: COLORS.surfaceVariant,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    waveformPlaceholder: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        color: COLORS.textTertiary,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    progressBar: {
        flex: 1,
        marginHorizontal: SPACING.md,
        height: 6,
        borderRadius: BORDER_RADIUS.sm,
    },
    timeText: {
        fontSize: TYPOGRAPHY.fontSize.sm,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    playButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SPACING.lg,
        ...SHADOWS.lg,
    },
    speedControl: {
        alignItems: 'center',
    },
    speedButton: {
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        backgroundColor: COLORS.surfaceVariant,
    },
    speedText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.primary,
    },
    transcriptCard: {
        margin: SPACING.md,
        marginTop: 0,
        backgroundColor: COLORS.surface,
        ...SHADOWS.md,
    },
    transcriptTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        marginBottom: SPACING.md,
        color: COLORS.text,
    },
    transcriptText: {
        color: COLORS.textSecondary,
        lineHeight: TYPOGRAPHY.lineHeight.relaxed * TYPOGRAPHY.fontSize.md,
    },
    noteCard: {
        margin: SPACING.md,
        marginTop: 0,
        marginBottom: SPACING.xxl,
        backgroundColor: '#E0F2FE',
    },
    noteText: {
        color: '#0369A1',
        textAlign: 'center',
    },
});

export default AudioCourseScreen;
