import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, FlatList } from 'react-native';
import { Text, TextInput, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import MascotSvg from '@/assets/images/mascot.svg';
import { RootState } from '@/store';
import { addUserMessage, sendMessage } from '@/store/slices/chatSlice';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@/theme/theme';

const AIAssistantScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { messages, loading } = useAppSelector((state: RootState) => state.chat);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (inputText.trim() && !loading) {
            const text = inputText.trim();
            dispatch(addUserMessage(text));
            dispatch(sendMessage(text));
            setInputText('');
        }
    };

    useEffect(() => {
        // Scroll to bottom on new message
        if (messages.length > 0) {
            setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
        }
    }, [messages]);

    const renderMessage = ({ item }: { item: any }) => {
        const isAI = item.sender === 'ai';
        return (
            <View style={[
                styles.messageWrapper,
                isAI ? styles.aiWrapper : styles.userWrapper
            ]}>
                {isAI && (
                    <View style={styles.aiAvatarWrapper}>
                        <MascotSvg width={32} height={32} />
                    </View>
                )}
                <View style={[
                    styles.messageBubble,
                    isAI ? styles.aiBubble : styles.userBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isAI ? styles.aiText : styles.userText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.timestamp,
                        isAI ? styles.aiTimestamp : styles.userTimestamp
                    ]}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <KeyboardAvoidingView 
            style={styles.container} 
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-left" size={24} color="#111827" />
                </TouchableOpacity>
                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle}>Miss Nova AI</Text>
                    <View style={styles.statusRow}>
                        <View style={styles.statusDot} />
                        <Text style={styles.statusText}>Always Online</Text>
                    </View>
                </View>
                <TouchableOpacity style={styles.menuButton}>
                    <Icon name="dots-vertical" size={24} color="#64748B" />
                </TouchableOpacity>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatList}
                ListFooterComponent={loading ? (
                    <View style={styles.loadingWrapper}>
                        <View style={styles.aiAvatarWrapper}>
                            <MascotSvg width={32} height={32} />
                        </View>
                        <View style={styles.typingBubble}>
                            <ActivityIndicator size="small" color="#1DA1F2" />
                        </View>
                    </View>
                ) : null}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Ask Miss Nova anything..."
                    style={styles.input}
                    mode="flat"
                    underlineColor="transparent"
                    activeUnderlineColor="transparent"
                    placeholderTextColor="#94A3B8"
                    right={
                        <TextInput.Icon 
                            icon="send" 
                            color={inputText.trim() ? "#1DA1F2" : "#CBD5E1"}
                            disabled={!inputText.trim() || loading}
                            onPress={handleSend}
                        />
                    }
                />
            </View>
        </KeyboardAvoidingView>
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
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        ...SHADOWS.sm,
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerInfo: {
        flex: 1,
        marginLeft: 8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
    },
    statusRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#10B981',
        marginRight: 6,
    },
    statusText: {
        fontSize: 12,
        color: '#64748B',
    },
    menuButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatList: {
        padding: 16,
        paddingBottom: 32,
    },
    messageWrapper: {
        flexDirection: 'row',
        marginBottom: 20,
        maxWidth: '85%',
    },
    aiWrapper: {
        alignSelf: 'flex-start',
    },
    userWrapper: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    aiAvatarWrapper: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...SHADOWS.sm,
    },
    messageBubble: {
        padding: 12,
        paddingHorizontal: 16,
        borderRadius: 20,
        ...SHADOWS.sm,
    },
    aiBubble: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    userBubble: {
        backgroundColor: '#1DA1F2',
        borderTopRightRadius: 4,
    },
    messageText: {
        fontSize: 15,
        lineHeight: 22,
    },
    aiText: {
        color: '#1E293B',
    },
    userText: {
        color: '#FFFFFF',
    },
    timestamp: {
        fontSize: 10,
        marginTop: 4,
    },
    aiTimestamp: {
        color: '#94A3B8',
        textAlign: 'left',
    },
    userTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
        textAlign: 'right',
    },
    loadingWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    typingBubble: {
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 20,
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#F1F5F9',
        ...SHADOWS.sm,
    },
    inputContainer: {
        padding: 16,
        paddingBottom: Platform.OS === 'ios' ? 40 : 16,
        backgroundColor: '#FFFFFF',
        borderTopWidth: 1,
        borderTopColor: '#F1F5F9',
    },
    input: {
        backgroundColor: '#F8FAFC',
        borderRadius: 24,
        height: 48,
        fontSize: 14,
    },
});

export default AIAssistantScreen;
