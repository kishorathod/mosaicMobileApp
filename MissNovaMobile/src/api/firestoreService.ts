import firestore from '@react-native-firebase/firestore';
import { Badge, LeaderboardEntry } from '../types/gamification';

const USERS_COLLECTION = 'users';

export interface UserStats {
  uid: string;
  displayName: string;
  email: string;
  totalXP: number;
  rank: number;
  badges: Badge[];
  enrolledDegrees?: string[]; // IDs of enrolled degrees
  lastUpdated: string;
}

export const firestoreService = {
  /**
   * Syncs user profile and stats to Firestore.
   * Creates the document if it doesn't exist.
   */
  syncUserProfile: async (uid: string, data: Partial<UserStats>) => {
    try {
      const userDoc = firestore().collection(USERS_COLLECTION).doc(uid);
      await userDoc.set({
        ...data,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
      console.log('✅ [Firestore] User profile synced:', uid);
    } catch (error) {
      console.error('❌ [Firestore] Error syncing user profile:', error);
      throw error;
    }
  },

  /**
   * Enrolls a user in a degree path.
   */
  enrollDegree: async (uid: string, degreeId: string) => {
    try {
      const userDoc = firestore().collection(USERS_COLLECTION).doc(uid);
      await userDoc.update({
        enrolledDegrees: firestore.FieldValue.arrayUnion(degreeId),
        lastUpdated: new Date().toISOString(),
      });
      console.log('✅ [Firestore] User enrolled in degree:', uid, degreeId);
    } catch (error) {
      console.error('❌ [Firestore] Error enrolling in degree:', error);
      throw error;
    }
  },

  /**
   * Updates user XP in Firestore.
   */
  updateUserXP: async (uid: string, xpToAdd: number) => {
    try {
      const userDoc = firestore().collection(USERS_COLLECTION).doc(uid);
      await userDoc.update({
        totalXP: firestore.FieldValue.increment(xpToAdd),
        lastUpdated: new Date().toISOString(),
      });
      console.log('✅ [Firestore] User XP updated:', uid, '+', xpToAdd);
    } catch (error) {
      console.error('❌ [Firestore] Error updating user XP:', error);
      throw error;
    }
  },

  /**
   * Adds a badge to the user's collection in Firestore.
   */
  addBadge: async (uid: string, badge: Badge) => {
    try {
      const userDoc = firestore().collection(USERS_COLLECTION).doc(uid);
      await userDoc.update({
        badges: firestore.FieldValue.arrayUnion({
          ...badge,
          unlockedAt: new Date().toISOString(),
        }),
        lastUpdated: new Date().toISOString(),
      });
      console.log('✅ [Firestore] Badge added:', uid, badge.name);
    } catch (error) {
      console.error('❌ [Firestore] Error adding badge:', error);
      throw error;
    }
  },

  /**
   * Fetches user stats from Firestore.
   */
  getUserStats: async (uid: string): Promise<UserStats | null> => {
    try {
      const doc = await firestore().collection(USERS_COLLECTION).doc(uid).get();
      return doc.exists ? (doc.data() as UserStats) : null;
    } catch (error) {
      console.error('❌ [Firestore] Error fetching user stats:', error);
      throw error;
    }
  },

  /**
   * Subscribes to real-time leaderboard updates.
   * Returns a top-100 list sorted by XP.
   */
  subscribeToLeaderboard: (callback: (leaderboard: LeaderboardEntry[]) => void) => {
    return firestore()
      .collection(USERS_COLLECTION)
      .orderBy('totalXP', 'desc')
      .limit(100)
      .onSnapshot(
        (snapshot) => {
          const leaderboard: LeaderboardEntry[] = snapshot.docs.map((doc, index) => ({
            id: doc.id,
            name: doc.data().displayName || 'Anonymous Student',
            points: doc.data().totalXP || 0,
            rank: index + 1,
          }));
          callback(leaderboard);
        },
        (error) => {
          console.error('❌ [Firestore] Leaderboard subscription error:', error);
        }
      );
  },

  /**
   * Fetches a list of featured/new courses for exploration.
   */
  getExploreCourses: async (): Promise<any[]> => {
    try {
      const snapshot = await firestore().collection('courses').limit(10).get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ [Firestore] Error fetching explore courses:', error);
      return [];
    }
  },

  /**
   * Fetches the user's enrolled courses and their progress.
   */
  getUserEnrolledCourses: async (uid: string): Promise<any[]> => {
    try {
      const snapshot = await firestore()
        .collection('user_courses')
        .where('userId', '==', uid)
        .get();
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('❌ [Firestore] Error fetching user enrolled courses:', error);
      return [];
    }
  },

  /**
   * Saves a generated AI course to the user's personal collection.
   */
  saveGeneratedCourse: async (uid: string, courseData: any) => {
    try {
      const courseRef = firestore().collection('user_courses').doc();
      await courseRef.set({
        ...courseData,
        userId: uid,
        enrolledAt: new Date().toISOString(),
        progress: 0,
        lastStudied: new Date().toISOString(),
      });
      console.log('✅ [Firestore] Generated course saved:', courseRef.id);
      return courseRef.id;
    } catch (error) {
      console.error('❌ [Firestore] Error saving generated course:', error);
      throw error;
    }
  },

  /**
   * Seeds initial courses if the collection is empty.
   */
  seedInitialCourses: async () => {
    try {
      const coursesRef = firestore().collection('courses');
      const snapshot = await coursesRef.limit(1).get();
      
      if (snapshot.empty) {
        const seedData = [
          {
            title: 'Python for AI Mastery',
            author: 'Dr. Sarah Kim',
            category: 'Data Science',
            categoryColor: '#E0F2FE',
            accentColor: '#0EA5E9',
            icon: 'language-python',
            difficulty: 'Beginner',
            lessons: 12,
            popularity: 98,
          },
          {
            title: 'Advanced React Native Hooks',
            author: 'Michael Chen',
            category: 'Development',
            categoryColor: '#F0F9FF',
            accentColor: '#1DA1F2',
            icon: 'react',
            difficulty: 'Advanced',
            lessons: 8,
            popularity: 85,
          },
          {
            title: 'Quantum Physics Basics',
            author: 'Prof. Julian Wick',
            category: 'Academic',
            categoryColor: '#F5F3FF',
            accentColor: '#8B5CF6',
            icon: 'atom',
            difficulty: 'Intermediate',
            lessons: 15,
            popularity: 72,
          }
        ];
        
        for (const course of seedData) {
          await coursesRef.add(course);
        }
        console.log('🌱 [Firestore] Successfully seeded initial courses');
      }
    } catch (error) {
      console.error('❌ [Firestore] Error seeding courses:', error);
    }
  }
};
