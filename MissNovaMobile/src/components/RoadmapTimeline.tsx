import React from 'react';
import { View, StyleSheet, Text, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { SHADOWS } from '@/theme/theme';

interface RoadmapStep {
  id: number;
  title: string;
  completed: boolean;
  active: boolean;
}

interface RoadmapTimelineProps {
  steps: RoadmapStep[];
  currentStepIndex: number;
}

const RoadmapTimeline: React.FC<RoadmapTimelineProps> = ({ steps, currentStepIndex }) => {
  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {steps.map((step, index) => {
          const isLast = index === steps.length - 1;
          const isCompleted = index < currentStepIndex;
          const isActive = index === currentStepIndex;

          return (
            <React.Fragment key={index}>
              <View style={styles.stepWrapper}>
                <View style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isActive && styles.dotActive
                ]}>
                  {isCompleted ? (
                    <Icon name="check" size={14} color="#FFFFFF" />
                  ) : isActive ? (
                    <Icon name="lightbulb" size={14} color="#FFFFFF" />
                  ) : (
                    <Icon name="circle-outline" size={14} color="#94A3B8" />
                  )}
                </View>
                <Text style={[
                  styles.stepLabel,
                  isActive && styles.stepLabelActive
                ]} numberOfLines={1}>
                  {step.title}
                </Text>
              </View>
              {!isLast && (
                <View style={[
                  styles.line,
                  isCompleted && styles.lineCompleted
                ]} />
              )}
            </React.Fragment>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  stepWrapper: {
    alignItems: 'center',
    width: 80,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    ...SHADOWS.sm,
  },
  dotCompleted: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  dotActive: {
    backgroundColor: '#1DA1F2',
    borderColor: '#1DA1F2',
    transform: [{ scale: 1.1 }],
    ...SHADOWS.md,
  },
  line: {
    width: 30,
    height: 3,
    backgroundColor: '#E2E8F0',
    marginTop: -22, // Align with dot center vertically
  },
  lineCompleted: {
    backgroundColor: '#10B981',
  },
  stepLabel: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#1DA1F2',
    fontWeight: 'bold',
  },
});

export default RoadmapTimeline;
