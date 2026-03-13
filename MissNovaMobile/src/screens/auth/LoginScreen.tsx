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
        await dispatch(login({ email, password }));
    };

    const navigateToRegister = () => {
        dispatch(clearError());
        navigation.navigate('Register');
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

                    {error && (
                        <Text variant="bodySmall" style={styles.error}>
                            {error}
                        </Text>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        disabled={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}>
                        {loading ? <ActivityIndicator color="white" /> : 'Login'}
                    </Button>

                    <Button
                        mode="outlined"
                        onPress={navigateToRegister}
                        style={styles.button}>
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

export default LoginScreen;
