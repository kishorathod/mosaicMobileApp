import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

export interface PickerOption {
    value: string;
    label: string;
    emoji?: string;
    icon?: string;
    color?: string;
}

interface CustomPickerProps {
    label: string;
    value: string;
    options: PickerOption[];
    onValueChange: (value: string) => void;
    placeholder?: string;
}

export const CustomPicker: React.FC<CustomPickerProps> = ({
    label,
    value,
    options,
    onValueChange,
    placeholder = 'Select an option',
}) => {
    const [modalVisible, setModalVisible] = React.useState(false);

    const selectedOption = options.find(opt => opt.value === value);

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>

            <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setModalVisible(true)}
            >
                <View style={styles.pickerContent}>
                    {selectedOption ? (
                        <>
                            {selectedOption.icon ? (
                                <Icon name={selectedOption.icon} size={20} color={selectedOption.color || COLORS.primary} style={styles.icon} />
                            ) : selectedOption.emoji ? (
                                <Text style={styles.emoji}>{selectedOption.emoji}</Text>
                            ) : null}
                            <Text style={styles.selectedText}>{selectedOption.label}</Text>
                        </>
                    ) : (
                        <Text style={styles.placeholderText}>{placeholder}</Text>
                    )}
                </View>
                <Icon name="chevron-down" size={20} color={COLORS.primary} />
            </TouchableOpacity>

            <Modal
                visible={modalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => setModalVisible(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>{label}</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <Icon name="close" size={24} color={COLORS.textTertiary} />
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.optionsList}>
                            {options.map((option) => (
                                <TouchableOpacity
                                    key={option.value}
                                    style={[
                                        styles.optionItem,
                                        value === option.value && styles.optionItemSelected,
                                    ]}
                                    onPress={() => {
                                        onValueChange(option.value);
                                        setModalVisible(false);
                                    }}
                                >
                                    {option.icon ? (
                                        <Icon name={option.icon} size={24} color={option.color || COLORS.primary} style={styles.optionIcon} />
                                    ) : option.emoji ? (
                                        <Text style={styles.optionEmoji}>{option.emoji}</Text>
                                    ) : null}
                                    <Text
                                        style={[
                                            styles.optionText,
                                            value === option.value && styles.optionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {value === option.value && (
                                        <Icon name="check-circle" size={20} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: 16,
        height: 48,
        ...SHADOWS.sm,
    },
    pickerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    emoji: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        marginRight: SPACING.sm,
    },
    selectedText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.text,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
    },
    placeholderText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.textTertiary,
    },
    chevron: {
        fontSize: 10,
        color: COLORS.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(15, 23, 42, 0.4)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: '80%',
        ...SHADOWS.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.borderLight,
    },
    modalTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.text,
    },
    closeButton: {
        fontSize: 24,
        color: COLORS.textTertiary,
    },
    optionsList: {
        padding: SPACING.md,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    optionItemSelected: {
        backgroundColor: COLORS.primary + '08',
        borderColor: COLORS.primary + '20',
    },
    optionEmoji: {
        fontSize: TYPOGRAPHY.fontSize.xxl,
        marginRight: SPACING.md,
    },
    icon: {
        marginRight: SPACING.sm,
    },
    optionIcon: {
        marginRight: SPACING.md,
    },
    optionText: {
        flex: 1,
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    optionTextSelected: {
        fontWeight: TYPOGRAPHY.fontWeight.bold,
        color: COLORS.primary,
    },
    checkmark: {
        fontSize: 16,
        color: COLORS.primary,
    },
});
