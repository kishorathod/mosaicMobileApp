import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Keyboard,
    TouchableOpacity,
} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import MascotSvg from '@/assets/images/mascot.svg';
import { login, clearError } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const LoginScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<LoginScreenNavigationProp>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        if (!email || !password) {
            return;
        }
        Keyboard.dismiss();
        await dispatch(login({ email, password }));
    };

    const navigateToRegister = () => {
        dispatch(clearError());
        navigation.navigate('Register');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <View style={styles.mascotContainer}>
                        <MascotSvg width={60} height={60} />
                    </View>
                    <Text variant="titleMedium" style={styles.title}>
                        Miss Nova
                    </Text>
                    <Text variant="headlineMedium" style={styles.subtitle}>
                        Welcome Back!
                    </Text>
                    <Text variant="bodyLarge" style={styles.description}>
                        Login to continue learning
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        textColor="#222222"
                        placeholderTextColor="#999999"
                        outlineColor="#CCCCCC"
                        activeOutlineColor="#7B61FF"
                        left={<TextInput.Icon icon="email" color="#999999" />}
                        theme={{ colors: { background: '#FFFFFF' } }}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        textColor="#222222"
                        placeholderTextColor="#999999"
                        outlineColor="#CCCCCC"
                        activeOutlineColor="#7B61FF"
                        left={<TextInput.Icon icon="lock" color="#999999" />}
                        theme={{ colors: { background: '#FFFFFF' } }}
                    />

                    {error && (
                        <Text variant="bodySmall" style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            onPress={handleLogin}
                            disabled={loading}
                            activeOpacity={0.8}
                            style={[
                                styles.customButton,
                                loading && styles.buttonDisabled
                            ]}>
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.buttonLabel}>Login</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Button
                        mode="text"
                        onPress={navigateToRegister}
                        textColor="#7B61FF"
                        style={styles.textButton}>
                        Don't have an account? Register
                    </Button>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 60, // Added top padding for balance
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginBottom: 32,
    },
    mascotContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        ...SHADOWS.md,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        fontSize: 16,
        marginBottom: 8,
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    subtitle: {
        fontWeight: 'bold',
        fontSize: 32,
        color: COLORS.text,
        marginBottom: 8,
        letterSpacing: -1,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    form: {
        gap: 16,
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
        elevation: 8,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    input: {
        marginBottom: 8,
        backgroundColor: '#FFFFFF',
        height: 52,
        fontSize: 15,
    },
    buttonWrapper: {
        height: 52,
        marginTop: 8,
    },
    customButton: {
        backgroundColor: '#7B61FF',
        height: 52,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        ...SHADOWS.md,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    textButton: {
        marginTop: 12,
    },
    error: {
        color: COLORS.error,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default LoginScreen;
