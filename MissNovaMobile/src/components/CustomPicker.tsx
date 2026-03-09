import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '@/theme/theme';

export interface PickerOption {
    value: string;
    label: string;
    emoji?: string;
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
                            {selectedOption.emoji && (
                                <Text style={styles.emoji}>{selectedOption.emoji}</Text>
                            )}
                            <Text style={styles.selectedText}>{selectedOption.label}</Text>
                        </>
                    ) : (
                        <Text style={styles.placeholderText}>{placeholder}</Text>
                    )}
                </View>
                <Text style={styles.chevron}>▼</Text>
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
                                <Text style={styles.closeButton}>✕</Text>
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
                                    {option.emoji && (
                                        <Text style={styles.optionEmoji}>{option.emoji}</Text>
                                    )}
                                    <Text
                                        style={[
                                            styles.optionText,
                                            value === option.value && styles.optionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {value === option.value && (
                                        <Text style={styles.checkmark}>✓</Text>
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
        fontSize: TYPOGRAPHY.fontSize.sm,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
        color: COLORS.text,
        marginBottom: SPACING.xs,
    },
    pickerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.surface,
        borderWidth: 2,
        borderColor: COLORS.border,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        minHeight: 56,
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
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    placeholderText: {
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.textTertiary,
    },
    chevron: {
        fontSize: TYPOGRAPHY.fontSize.xs,
        color: COLORS.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.surface,
        borderTopLeftRadius: BORDER_RADIUS.xl,
        borderTopRightRadius: BORDER_RADIUS.xl,
        maxHeight: '70%',
        ...SHADOWS.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: SPACING.lg,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    modalTitle: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.text,
    },
    closeButton: {
        fontSize: TYPOGRAPHY.fontSize.xxl,
        color: COLORS.textSecondary,
        fontWeight: TYPOGRAPHY.fontWeight.medium,
    },
    optionsList: {
        padding: SPACING.sm,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        marginBottom: SPACING.xs,
    },
    optionItemSelected: {
        backgroundColor: COLORS.primaryLight + '20',
    },
    optionEmoji: {
        fontSize: TYPOGRAPHY.fontSize.xl,
        marginRight: SPACING.md,
    },
    optionText: {
        flex: 1,
        fontSize: TYPOGRAPHY.fontSize.md,
        color: COLORS.text,
    },
    optionTextSelected: {
        fontWeight: TYPOGRAPHY.fontWeight.semibold,
        color: COLORS.primary,
    },
    checkmark: {
        fontSize: TYPOGRAPHY.fontSize.lg,
        color: COLORS.primary,
        fontWeight: TYPOGRAPHY.fontWeight.bold,
    },
});
