import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import MascotSvg from '@/assets/images/mascot.svg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { generateCourse, generateAudioCourse, generateVideoCourse } from '@/store/slices/courseSlice';
import { COLORS, SHADOWS } from '@/theme/theme';

const LOADING_MESSAGES = [
    "Consulting the archives of knowledge...",
    "Brainstorming the perfect curriculum...",
    "Miss Nova is gathering her thoughts...",
    "Crafting interactive slides just for you...",
    "Almost there! Adding some magic...",
];

const LoadingScreen = () => {
    const route = useRoute();
    const navigation = useNavigation() as any;
    const dispatch = useDispatch<AppDispatch>();
    const { topic, courseType } = route.params as { topic: string; courseType: string };
    
    const [messageIndex, setMessageIndex] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const spinValue = new Animated.Value(0);

    useEffect(() => {
        // Animation for the mascot (subtle bounce)
        Animated.loop(
            Animated.sequence([
                Animated.timing(spinValue, {
                    toValue: 1,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(spinValue, {
                    toValue: 0,
                    duration: 1500,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Cycle through messages
        const messageInterval = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
        }, 2000);

        // Start the generation
        const startGeneration = async () => {
            let result;
            if (courseType === 'audio') {
                result = await dispatch(generateAudioCourse(topic));
            } else if (courseType === 'video') {
                result = await dispatch(generateVideoCourse(topic));
            } else {
                result = await dispatch(generateCourse(topic));
            }

            if (generateCourse.fulfilled.match(result) || 
                generateAudioCourse.fulfilled.match(result) || 
                generateVideoCourse.fulfilled.match(result)) {
                
                // Success! Navigate to the course screen
                const screenName = courseType === 'audio' ? 'AudioCourse' : 
                                  courseType === 'video' ? 'VideoCourse' : 'Course';
                
                navigation.replace(screenName, { course: result.payload });
            } else {
                // Error!
                const errorMsg = (result.payload as any) || result.error?.message || "Something went wrong";
                setError(errorMsg);
            }
        };

        startGeneration();

        return () => {
            clearInterval(messageInterval);
        };
    }, []);

    const bounce = spinValue.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    if (error) {
        return (
            <View style={styles.container}>
                <View style={[styles.mascotContainer, { backgroundColor: '#FEF2F2', borderColor: '#FEE2E2' }]}>
                    <Icon name="alert-circle" size={80} color="#EF4444" />
                </View>
                
                <View style={[styles.textContainer, { marginBottom: 32 }]}>
                    <Text style={[styles.headline, { color: '#B91C1C' }]}>Oops! Something went wrong</Text>
                    <Text style={styles.message}>{error}</Text>
                </View>

                <View style={styles.helpBox}>
                    <Text style={styles.helpTitle}>Debugging Tips:</Text>
                    <Text style={styles.helpText}>• Ensure your backend server is running on port 3000</Text>
                    <Text style={styles.helpText}>• Check if your computer and phone are on the same Wi-Fi</Text>
                    <Text style={styles.helpText}>• Try running: <Text style={{fontWeight: 'bold'}}>npm run dev</Text> in the root directory</Text>
                </View>

                <TouchableOpacity 
                    style={[styles.primaryButton, { marginTop: 32, width: '100%' }]} 
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.primaryButtonLabel}>Try Different Topic</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.mascotContainer, { transform: [{ translateY: bounce }] }]}>
                <MascotSvg width={120} height={120} />
            </Animated.View>
            
            <View style={styles.textContainer}>
                <Text style={styles.headline}>Miss Nova is working...</Text>
                <Text style={styles.message}>{LOADING_MESSAGES[messageIndex]}</Text>
            </View>

            <View style={styles.topicPill}>
                <Text style={styles.topicLabel}>Course Topic:</Text>
                <Text style={styles.topicText}>{topic}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
    },
    mascotContainer: {
        width: 180,
        height: 180,
        borderRadius: 90,
        backgroundColor: '#F8FAFC',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 12,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
    },
    topicPill: {
        backgroundColor: '#F0F9FF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#E0F2FE',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    topicLabel: {
        fontSize: 14,
        color: '#0EA5E9',
        fontWeight: '600',
    },
    topicText: {
        fontSize: 14,
        color: '#0369A1',
        fontWeight: 'bold',
    },
    helpBox: {
        backgroundColor: '#F8FAFC',
        padding: 20,
        borderRadius: 16,
        width: '100%',
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    helpTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#334155',
        marginBottom: 8,
    },
    helpText: {
        fontSize: 13,
        color: '#64748B',
        marginBottom: 4,
        lineHeight: 18,
    },
    primaryButton: {
        height: 52,
        backgroundColor: '#1DA1F2',
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        ...SHADOWS.md,
    },
    primaryButtonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default LoadingScreen;
