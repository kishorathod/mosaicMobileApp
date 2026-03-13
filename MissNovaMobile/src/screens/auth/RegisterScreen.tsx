import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
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

        await dispatch(register({ email, password, displayName }));
    };

    const navigateToLogin = () => {
        dispatch(clearError());
        navigation.navigate('Login');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text variant="displaySmall" style={styles.title}>
                        Miss Nova
                    </Text>
                    <Text variant="headlineSmall" style={styles.subtitle}>
                        Create Account
                    </Text>
                    <Text variant="bodyLarge" style={styles.description}>
                        Join us and start learning!
                    </Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Display Name"
                        value={displayName}
                        onChangeText={setDisplayName}
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="account" />}
                    />

                    <TextInput
                        label="Email"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        style={styles.input}
                        left={<TextInput.Icon icon="email" />}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" />}
                    />

                    <TextInput
                        label="Confirm Password"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        mode="outlined"
                        secureTextEntry
                        style={styles.input}
                        left={<TextInput.Icon icon="lock-check" />}
                    />

                    {(error || localError) && (
                        <Text variant="bodySmall" style={styles.error}>
                            {error || localError}
                        </Text>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}>
                        {loading ? <ActivityIndicator color="white" /> : 'Register'}
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={navigateToLogin}
                        style={styles.button}>
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
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontWeight: 'bold',
        color: COLORS.primary,
        fontSize: 32,
        marginBottom: 8,
        letterSpacing: -1,
    },
    subtitle: {
        fontWeight: '700',
        fontSize: 24,
        color: COLORS.text,
        marginBottom: 8,
    },
    description: {
        color: COLORS.textSecondary,
        fontSize: 16,
    },
    form: {
        gap: 16,
        backgroundColor: COLORS.surface,
        padding: 24,
        borderRadius: BORDER_RADIUS.xl,
        ...SHADOWS.lg,
        borderWidth: 1,
        borderColor: COLORS.borderLight,
    },
    input: {
        marginBottom: 8,
        backgroundColor: COLORS.surface,
        fontSize: 15,
        height: 48,
    },
    button: {
        marginTop: 8,
        borderRadius: BORDER_RADIUS.lg,
    },
    buttonContent: {
        height: 56,
    },
    error: {
        color: COLORS.error,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default RegisterScreen;
