import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@/theme/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { enrollInDegree } from '@/store/slices/gamificationSlice';
import { DEGREES } from '@/constants/degrees';



const DegreesScreen = () => {
    const navigation = useNavigation() as any;
    const dispatch = useAppDispatch();
    const { user } = useAppSelector((state: RootState) => state.auth);
    const { enrolledDegrees } = useAppSelector((state: RootState) => state.gamification);

    const handleEnroll = (degreeId: string) => {
        if (user) {
            dispatch(enrollInDegree({ uid: user.uid, degreeId }));
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Academic Degrees</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.introSection}>
                    <Text style={styles.introTitle}>Your Learning Path</Text>
                    <Text style={styles.introSubtitle}>
                        Complete a series of verified courses to earn your official Miss Nova Degree on the blockchain.
                    </Text>
                </View>

                {DEGREES.map((degree) => {
                    const isEnrolled = enrolledDegrees.includes(degree.id);
                    return (
                        <TouchableOpacity key={degree.id} style={styles.degreeCard} activeOpacity={0.9}>
                            <View style={[styles.iconContainer, { backgroundColor: degree.color + '1A' }]}>
                                <Icon name={degree.icon} size={32} color={degree.color} />
                            </View>
                            
                            <View style={styles.degreeInfo}>
                                <Text style={styles.degreeTitle}>{degree.title}</Text>
                                <Text style={styles.degreeDescription}>{degree.description}</Text>
                                
                                <View style={styles.statsRow}>
                                    <View style={styles.stat}>
                                        <Icon name="book-open-variant" size={14} color="#64748B" />
                                        <Text style={styles.statText}>{degree.courses} Courses</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Icon name="clock-outline" size={14} color="#64748B" />
                                        <Text style={styles.statText}>{degree.duration}</Text>
                                    </View>
                                    <View style={styles.stat}>
                                        <Icon name="trending-up" size={14} color="#64748B" />
                                        <Text style={styles.statText}>{degree.difficulty}</Text>
                                    </View>
                                </View>

                                <TouchableOpacity 
                                    style={[
                                        styles.enrollButton, 
                                        { backgroundColor: isEnrolled ? '#F0F9FF' : degree.color, borderWidth: isEnrolled ? 1 : 0, borderColor: '#E0F2FE' }
                                    ]}
                                    onPress={() => !isEnrolled && handleEnroll(degree.id)}
                                >
                                    <Text style={[styles.enrollButtonText, { color: isEnrolled ? '#0EA5E9' : '#FFFFFF' }]}>
                                        {isEnrolled ? 'Continue Learning' : 'Enroll Path'}
                                    </Text>
                                    <Icon name={isEnrolled ? "play-circle-outline" : "chevron-right"} size={16} color={isEnrolled ? '#0EA5E9' : '#FFFFFF'} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        ...SHADOWS.sm,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    backButton: {
        padding: 8,
    },
    scrollContent: {
        padding: 20,
    },
    introSection: {
        marginBottom: 32,
    },
    introTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    introSubtitle: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
    },
    degreeCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        flexDirection: 'row',
        ...SHADOWS.card,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    degreeInfo: {
        flex: 1,
    },
    degreeTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        marginBottom: 8,
    },
    degreeDescription: {
        fontSize: 14,
        color: '#64748B',
        lineHeight: 20,
        marginBottom: 16,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statText: {
        fontSize: 12,
        color: '#64748B',
        fontWeight: '500',
    },
    enrollButton: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'flex-start',
        gap: 4,
    },
    enrollButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default DegreesScreen;
