import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Linking, ActivityIndicator } from 'react-native';
import CertificateComponent from '@/components/CertificateComponent';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { COLORS, SHADOWS } from '@/theme/theme';

const CertificateScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { user } = useAppSelector((state: RootState) => state.auth);
    const { courseTitle, score } = route.params as { courseTitle: string; score: number };
    
    const [isVerifying, setIsVerifying] = React.useState(false);
    const [txHash, setTxHash] = React.useState<string | null>(null);

    const handleVerify = async () => {
        setIsVerifying(true);
        // Simulate blockchain transaction delay
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Mock transaction hash for EduChain
        const mockHash = '0x' + Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        setTxHash(mockHash);
        setIsVerifying(false);
    };

    const openExplorer = () => {
        if (txHash) {
            Linking.openURL(`https://edu-chain-testnet.blockscout.com/tx/${txHash}`);
        }
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `I just completed "${courseTitle}" on Miss Nova with a score of ${score}%! Check out my certificate on EduChain.`,
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Icon name="close" size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Your Certificate</Text>
                <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
                    <Icon name="share-variant" size={24} color="#1DA1F2" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.certWrapper}>
                    <CertificateComponent
                        userName={user?.displayName || 'Student'}
                        courseTitle={courseTitle}
                        score={score}
                        date={new Date().toLocaleDateString()}
                        level="Scholar"
                        txHash={txHash || undefined}
                    />
                </View>

                <View style={styles.congratsContainer}>
                    <Icon name="party-popper" size={40} color="#F59E0B" />
                    <Text style={styles.congratsTitle}>Congratulations!</Text>
                    <Text style={styles.congratsText}>
                        You've successfully completed the course. Your achievement is verified on the blockchain.
                    </Text>
                </View>

                <View style={styles.actionButtons}>
                    <TouchableOpacity 
                        style={[styles.primaryButton, { backgroundColor: '#8B5CF6' }]} 
                        onPress={txHash ? openExplorer : handleVerify}
                        disabled={isVerifying}
                    >
                        {isVerifying ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <>
                                <Icon name={txHash ? "open-in-new" : "shield-check"} size={20} color="#FFFFFF" />
                                <Text style={styles.primaryButtonLabel}>
                                    {txHash ? 'View on EduChain' : 'Verify Certificate'}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.primaryButton} onPress={handleShare}>
                        <Icon name="linkedin" size={20} color="#FFFFFF" />
                        <Text style={styles.primaryButtonLabel}>Share Achievement</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        style={styles.secondaryButton} 
                        onPress={() => navigation.navigate('Home' as never)}
                    >
                        <Text style={styles.secondaryButtonLabel}>Back to Dashboard</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F1F5F9', // Slightly gray background to make the white cert pop
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
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
    shareButton: {
        padding: 8,
    },
    scrollContent: {
        padding: 24,
        alignItems: 'center',
    },
    certWrapper: {
        width: '100%',
        maxWidth: 400,
        marginBottom: 32,
    },
    congratsContainer: {
        alignItems: 'center',
        marginBottom: 32,
        paddingHorizontal: 20,
    },
    congratsTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#111827',
        marginTop: 12,
        marginBottom: 8,
    },
    congratsText: {
        fontSize: 15,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
    },
    actionButtons: {
        width: '100%',
        gap: 12,
        marginBottom: 40,
    },
    primaryButton: {
        height: 52,
        backgroundColor: '#1DA1F2',
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        ...SHADOWS.md,
    },
    primaryButtonLabel: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    secondaryButton: {
        height: 52,
        backgroundColor: 'transparent',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    secondaryButtonLabel: {
        color: '#64748B',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default CertificateScreen;
