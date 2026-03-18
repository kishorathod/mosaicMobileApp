import firestore from '@react-native-firebase/firestore';
import { Badge, LeaderboardEntry } from '../store/slices/gamificationSlice';

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
};
