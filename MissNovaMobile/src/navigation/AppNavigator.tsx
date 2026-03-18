import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

import LoginScreen from '@/screens/auth/LoginScreen';
import RegisterScreen from '@/screens/auth/RegisterScreen';
import HomeScreen from '@/screens/home/HomeScreen';
import CourseScreen from '@/screens/course/CourseScreen';
import AudioCourseScreen from '@/screens/course/AudioCourseScreen';
import VideoCourseScreen from '@/screens/course/VideoCourseScreen';
import LoadingScreen from '@/screens/course/LoadingScreen';
import CertificateScreen from '@/screens/course/CertificateScreen';
import DegreesScreen from '@/screens/home/DegreesScreen';
import LeaderboardScreen from '@/screens/home/LeaderboardScreen';
import BadgesScreen from '@/screens/home/BadgesScreen';
import AIAssistantScreen from '@/screens/home/AIAssistantScreen';

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Course: { course: any };
    AudioCourse: { course: any };
    VideoCourse: { course: any };
    Loading: { topic: string; courseType: string };
    Certificate: { courseTitle: string; score: number };
    Degrees: undefined;
    Leaderboard: undefined;
    Badges: undefined;
    AIAssistant: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <>
                        <Stack.Screen name="Login" component={LoginScreen} />
                        <Stack.Screen name="Register" component={RegisterScreen} />
                    </>
                ) : (
                    <>
                        <Stack.Screen name="Home" component={HomeScreen} />
                        <Stack.Screen name="Course" component={CourseScreen} />
                        <Stack.Screen name="AudioCourse" component={AudioCourseScreen} />
                        <Stack.Screen name="VideoCourse" component={VideoCourseScreen} />
                        <Stack.Screen name="Loading" component={LoadingScreen} />
                        <Stack.Screen name="Certificate" component={CertificateScreen} />
                        <Stack.Screen name="Degrees" component={DegreesScreen} />
                        <Stack.Screen name="Leaderboard" component={LeaderboardScreen} />
                        <Stack.Screen name="Badges" component={BadgesScreen} />
                        <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
