import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text, Button, ProgressBar, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={COLORS.text} />
                </TouchableOpacity>
                <Text variant="titleLarge" style={styles.headerTitle}>
                    Audio Course
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Course Info */}
                <Card style={styles.infoCard}>
                    <Card.Content>
                        <View style={styles.titleContainer}>
                            <Icon name="headphones" size={32} color={COLORS.primary} style={{ marginRight: 12 }} />
                            <Text variant="headlineSmall" style={styles.courseTitle}>
                                {course.title}
                            </Text>
                        </View>
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
                            <Icon name="sine-wave" size={48} color={COLORS.primary} />
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
                            <View style={styles.transcriptHeader}>
                                <Icon name="text-box-outline" size={20} color={COLORS.text} style={{ marginRight: 8 }} />
                                <Text variant="titleMedium" style={styles.transcriptTitle}>
                                    Transcript
                                </Text>
                            </View>
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
                            Audio playback functionality will be implemented soon
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
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: COLORS.surface,
        ...SHADOWS.sm,
        marginBottom: 10,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.surfaceVariant,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.text,
        fontSize: 18,
    },
    content: {
        flex: 1,
    },
    infoCard: {
        margin: SPACING.lg,
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    courseTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
        fontSize: 24,
        letterSpacing: -0.5,
        flex: 1,
    },
    description: {
        color: COLORS.textSecondary,
        lineHeight: 24,
        fontSize: 16,
    },
    playerCard: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    waveformContainer: {
        height: 100,
        backgroundColor: COLORS.primary + '05',
        borderRadius: BORDER_RADIUS.lg,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: COLORS.primary + '20',
    },
    waveformPlaceholder: {
        fontSize: 14,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: 2,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    progressBar: {
        flex: 1,
        marginHorizontal: SPACING.md,
        height: 8,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceVariant,
    },
    timeText: {
        fontSize: 12,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        width: 45,
        textAlign: 'center',
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    playButton: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: SPACING.xl,
        ...SHADOWS.lg,
    },
    speedControl: {
        alignItems: 'center',
    },
    speedButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.sm,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: COLORS.surfaceVariant,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    speedText: {
        fontSize: 14,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textSecondary,
        letterSpacing: 1,
    },
    transcriptCard: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        padding: SPACING.lg,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    transcriptHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    transcriptTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.text,
        fontSize: 18,
    },
    transcriptText: {
        color: COLORS.textSecondary,
        lineHeight: 24,
        fontSize: 15,
    },
    noteCard: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.xxl,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        backgroundColor: COLORS.info + '10',
        borderWidth: 1,
        borderColor: COLORS.info + '20',
    },
    noteText: {
        color: COLORS.info,
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '500',
    },
});

export default AudioCourseScreen;
