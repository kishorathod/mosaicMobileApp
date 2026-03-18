import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useAppSelector } from '@/store/hooks';
import { RootState } from '@/store';
import { COLORS, SHADOWS, TYPOGRAPHY } from '@/theme/theme';

interface LeaderboardModalProps {
  visible: boolean;
  onClose: () => void;
  courseTitle: string;
}

const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ visible, onClose, courseTitle }) => {
  const { leaderboard } = useAppSelector((state: RootState) => state.gamification);
  const { user } = useAppSelector((state: RootState) => state.auth);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <Surface style={styles.modalContent}>
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Course Leaderboard</Text>
              <Text style={styles.subtitle}>{courseTitle}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {leaderboard.map((entry, index) => {
              const isMe = entry.id === user?.uid;
              return (
              <View 
                key={entry.id} 
                style={[
                  styles.entry,
                  isMe && styles.myEntry
                ]}
              >
                <View style={styles.rankContainer}>
                  {entry.rank <= 3 ? (
                    <Icon 
                      name="crown" 
                      size={20} 
                      color={entry.rank === 1 ? '#F59E0B' : entry.rank === 2 ? '#94A3B8' : '#B45309'} 
                    />
                  ) : (
                    <Text style={styles.rankText}>{entry.rank}</Text>
                  )}
                </View>

                <View style={styles.avatar}>
                   <Text style={styles.avatarText}>{entry.name.substring(0, 2).toUpperCase()}</Text>
                </View>

                <View style={styles.nameContainer}>
                  <Text style={[styles.name, isMe && styles.myName]}>
                    {entry.name}{isMe ? ' (You)' : ''}
                  </Text>
                </View>

                <Text style={styles.points}>{entry.points} pts</Text>
              </View>
            );
            })}
          </ScrollView>

          <TouchableOpacity style={styles.footerButton} onPress={onClose}>
            <Text style={styles.footerButtonText}>Got it!</Text>
          </TouchableOpacity>
        </Surface>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    maxHeight: '80%',
    ...SHADOWS.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  closeButton: {
    padding: 4,
  },
  list: {
    marginBottom: 24,
  },
  entry: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  myEntry: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  rankContainer: {
    width: 32,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#94A3B8',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  avatarText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    color: '#1E293B',
    fontWeight: '500',
  },
  myName: {
    fontWeight: 'bold',
    color: '#0369A1',
  },
  points: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1DA1F2',
  },
  footerButton: {
    backgroundColor: '#1DA1F2',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.md,
  },
  footerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LeaderboardModal;
