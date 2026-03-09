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

export type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    Home: undefined;
    Course: { course: any };
    AudioCourse: { course: any };
    VideoCourse: { course: any };
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
                    </>
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};
