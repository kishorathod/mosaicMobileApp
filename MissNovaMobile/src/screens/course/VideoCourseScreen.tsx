import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, Button, ProgressBar, Card, IconButton } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={COLORS.text} />
                </TouchableOpacity>
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
                            Video playback functionality will be implemented soon
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
    videoCard: {
        margin: 0,
        backgroundColor: '#000',
        borderRadius: 0,
        ...SHADOWS.lg,
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
        backgroundColor: '#0F172A',
    },
    videoPlaceholderText: {
        fontSize: 48,
        color: COLORS.surface,
        marginBottom: SPACING.md,
    },
    videoPlaceholderSubtext: {
        fontSize: 16,
        color: COLORS.textTertiary,
        textAlign: 'center',
        paddingHorizontal: SPACING.xxl,
        fontWeight: '500',
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(15, 23, 42, 0.3)',
    },
    playButtonOverlay: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary + 'CC',
        justifyContent: 'center',
        alignItems: 'center',
        ...SHADOWS.lg,
    },
    fullscreenButton: {
        position: 'absolute',
        bottom: SPACING.lg,
        right: SPACING.lg,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: BORDER_RADIUS.md,
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
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    timeText: {
        fontSize: 12,
        color: COLORS.surface,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        width: 45,
        textAlign: 'center',
    },
    additionalControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: SPACING.md,
        paddingBottom: SPACING.md,
    },
    speedButton: {
        paddingHorizontal: SPACING.xl,
        paddingVertical: 6,
        borderRadius: BORDER_RADIUS.full,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    speedText: {
        fontSize: 12,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.surface,
        letterSpacing: 1,
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
    courseTitle: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.text,
        fontSize: 24,
        letterSpacing: -0.5,
        marginBottom: SPACING.md,
    },
    description: {
        color: COLORS.textSecondary,
        lineHeight: 24,
        fontSize: 16,
    },
    transcriptCard: {
        marginHorizontal: SPACING.lg,
        marginBottom: SPACING.lg,
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        backgroundColor: COLORS.surface,
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

export default VideoCourseScreen;
