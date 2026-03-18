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
import { register, clearError } from '@/store/slices/authSlice';
import { AppDispatch, RootState } from '@/store';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '@/navigation/AppNavigator';
import { COLORS, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

const RegisterScreen = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigation = useNavigation<RegisterScreenNavigationProp>();
    const { loading, error } = useSelector((state: RootState) => state.auth);

    const [displayName, setDisplayName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const handleRegister = async () => {
        setLocalError('');

        if (!displayName || !email || !password || !confirmPassword) {
            setLocalError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters');
            return;
        }

        Keyboard.dismiss();
        await dispatch(register({ email, password, displayName }));
    };

    const navigateToLogin = () => {
        dispatch(clearError());
        navigation.navigate('Login');
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
                        Join Miss Nova!
                    </Text>
                    <Text variant="bodyLarge" style={styles.description}>
                        Create an account to start learning
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Display Name"
                        value={displayName}
                        onChangeText={setDisplayName}
                        mode="outlined"
                        style={styles.input}
                        textColor="#222222"
                        placeholderTextColor="#999999"
                        outlineColor="#CCCCCC"
                        activeOutlineColor="#7B61FF"
                        left={<TextInput.Icon icon="account" color="#999999" />}
                        theme={{ colors: { background: '#FFFFFF' } }}
                    />

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

                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        textColor="#222222"
                        placeholderTextColor="#999999"
                        outlineColor="#CCCCCC"
                        activeOutlineColor="#7B61FF"
                        left={<TextInput.Icon icon="lock-check" color="#999999" />}
                        theme={{ colors: { background: '#FFFFFF' } }}
                    />

                    {(error || localError) && (
                        <Text variant="bodySmall" style={styles.error}>
                            {error || localError}
                        </Text>
                    )}

                    <View style={styles.buttonWrapper}>
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            activeOpacity={0.8}
                            style={[
                                styles.customButton,
                                loading && styles.buttonDisabled
                            ]}>
                            {loading ? (
                                <ActivityIndicator color="white" size="small" />
                            ) : (
                                <Text style={styles.buttonLabel}>Register</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    <Button
                        mode="text"
                        onPress={navigateToLogin}
                        textColor="#7B61FF"
                        style={styles.textButton}>
                        Already have an account? Login
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
        fontSize: 15,
        height: 52,
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

export default RegisterScreen;
