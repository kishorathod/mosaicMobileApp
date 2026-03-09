import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, ProgressBar, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

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
    const navigation = useNavigation();
    const { course } = route.params as { course: VideoCourse };

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

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
            {/* Header */}
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()}
                    iconColor={COLORS.text}
                />
                <Text variant="titleLarge" style={styles.headerTitle}>
                    Video Course
                </Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content}>
                {/* Video Player */}
                <Card style={styles.videoCard}>
                    <View style={styles.videoContainer}>
                        {/* Video Placeholder */}
                        <View style={styles.videoPlaceholder}>
                            <Text style={styles.videoPlaceholderText}>
                                🎬 Video Player
                            </Text>
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
                <Card style={styles.infoCard}>
                    <Card.Content>
                        <Text variant="headlineSmall" style={styles.courseTitle}>
                            {course.title}
                        </Text>
                        <Text variant="bodyLarge" style={styles.description}>
                            {course.description}
                        </Text>
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
                            ℹ️ Video playback functionality will be implemented with react-native-video
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
    videoCard: {
        margin: 0,
        backgroundColor: COLORS.surface,
    },
    videoContainer: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#000',
        position: 'relative',
    },
    videoPlaceholder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
    },
    videoPlaceholderText: {
        fontSize: TYPOGRAPHY.fontSize.xxl,
        color: COLORS.surface,
        marginBottom: SPACING.sm,
    },
    videoPlaceholderSubtext: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.textTertiary,
        textAlign: 'center',
        paddingHorizontal: SPACING.lg,
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    playButtonOverlay: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(99, 102, 241, 0.9)',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.lg,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: SPACING.md,
        right: SPACING.md,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: BORDER_RADIUS.sm,
    },
    progressContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.md,
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
    additionalControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.md,
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

export default VideoCourseScreen;
