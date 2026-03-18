import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MascotSvg from '@/assets/images/mascot.svg';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@/theme/theme';

interface CertificateComponentProps {
    userName: string;
    courseTitle: string;
    score: number;
    date: string;
    level: string;
    txHash?: string;
}

const { width } = Dimensions.get('window');

const CertificateComponent: React.FC<CertificateComponentProps> = ({
    userName,
    courseTitle,
    score,
    date,
    level,
    txHash,
}) => {
    return (
        <View style={styles.certificateCard}>
            {/* Border lines for a professional look */}
            <View style={styles.innerBorder}>
                <View style={styles.header}>
                    <MascotSvg width={50} height={50} />
                    <View style={styles.headerText}>
                        <Text style={styles.brandTitle}>Miss Nova Academy</Text>
                        <Text style={styles.brandSubtitle}>AI-Powered Learning on EduChain</Text>
                    </View>
                </View>

                <View style={styles.content}>
                    <Text style={styles.certLabel}>CERTIFICATE OF COMPLETION</Text>
                    <Text style={styles.presentedTo}>This is proudly presented to</Text>
                    <Text style={styles.userName}>{userName}</Text>
                    <View style={styles.divider} />
                    <Text style={styles.forCompleting}>for successfully completing the course</Text>
                    <Text style={styles.courseTitle}>{courseTitle}</Text>
                    
                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>SCORE</Text>
                            <Text style={styles.statValue}>{score}%</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>LEVEL</Text>
                            <Text style={styles.statValue}>{level}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>DATE</Text>
                            <Text style={styles.statValue}>{date}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.footer}>
                    <View style={styles.signature}>
                        <Text style={styles.signatureText}>Nova AI</Text>
                        <View style={styles.signatureLine} />
                        <Text style={styles.signatureLabel}>Lead Instructor</Text>
                    </View>
                    
                    <View style={styles.qrContainer}>
                        <Icon name={txHash ? "check-decagram" : "qrcode-scan"} size={txHash ? 40 : 50} color={txHash ? "#15803D" : "#111827"} />
                        <Text style={styles.qrLabel}>{txHash ? 'VERIFIED ON-CHAIN' : 'Verify on EduChain'}</Text>
                        {txHash && (
                            <Text style={styles.txHashText} numberOfLines={1} ellipsizeMode="middle">
                                {txHash}
                            </Text>
                        )}
                    </View>
                </View>
                
                {/* Decorative corners */}
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    certificateCard: {
        backgroundColor: '#FFFFFF',
        width: '100%',
        aspectRatio: 0.75, // Portrait orientation
        padding: 16,
        borderRadius: 4,
        ...SHADOWS.md,
        borderWidth: 8,
        borderColor: '#1DA1F2',
    },
    innerBorder: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 24,
        position: 'relative',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        gap: 12,
    },
    headerText: {
        alignItems: 'flex-start',
    },
    brandTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1DA1F2',
    },
    brandSubtitle: {
        fontSize: 10,
        color: '#64748B',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    content: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    certLabel: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#111827',
        letterSpacing: 2,
        marginBottom: 24,
        textAlign: 'center',
    },
    presentedTo: {
        fontSize: 14,
        color: '#64748B',
        fontStyle: 'italic',
        marginBottom: 16,
    },
    userName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1DA1F2',
        textAlign: 'center',
        marginBottom: 12,
    },
    divider: {
        width: 100,
        height: 2,
        backgroundColor: '#E2E8F0',
        marginBottom: 16,
    },
    forCompleting: {
        fontSize: 14,
        color: '#64748B',
        marginBottom: 12,
    },
    courseTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111827',
        textAlign: 'center',
        marginBottom: 24,
        paddingHorizontal: 16,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 24,
    },
    statItem: {
        alignItems: 'center',
    },
    statLabel: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#94A3B8',
        marginBottom: 4,
    },
    statValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#111827',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    signature: {
        alignItems: 'center',
    },
    signatureText: {
        fontSize: 18,
        fontStyle: 'italic',
        color: '#111827',
        marginBottom: 4,
    },
    signatureLine: {
        width: 120,
        height: 1,
        backgroundColor: '#E2E8F0',
        marginBottom: 4,
    },
    signatureLabel: {
        fontSize: 10,
        color: '#64748B',
    },
    qrContainer: {
        alignItems: 'center',
    },
    qrLabel: {
        fontSize: 8,
        color: '#6B7280',
        marginTop: 4,
        fontWeight: 'bold',
    },
    txHashText: {
        fontSize: 6,
        color: '#94A3B8',
        marginTop: 2,
        width: 80,
        textAlign: 'center',
    },
    corner: {
        position: 'absolute',
        width: 20,
        height: 20,
        borderColor: '#1DA1F2',
    },
    topLeft: {
        top: -1,
        left: -1,
        borderTopWidth: 4,
        borderLeftWidth: 4,
    },
    topRight: {
        top: -1,
        right: -1,
        borderTopWidth: 4,
        borderRightWidth: 4,
    },
    bottomLeft: {
        bottom: -1,
        left: -1,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
    },
    bottomRight: {
        bottom: -1,
        right: -1,
        borderBottomWidth: 4,
        borderRightWidth: 4,
    },
});

export default CertificateComponent;
