import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { firestoreService } from '../../api/firestoreService';
import { Badge, LeaderboardEntry } from '../../types/gamification';

interface GamificationState {
  totalXP: number;
  dailyXP: number;
  dailyGoal: number;
  streakCount: number;
  rank: number;
  badges: Badge[];
  recentActivity: string[];
  coursePoints: Record<string, number>; // courseId -> points
  leaderboard: LeaderboardEntry[];
  enrolledDegrees: string[]; // IDs of enrolled degrees
  userCourses: any[]; 
  badgeCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: GamificationState = {
  totalXP: 0,
  dailyXP: 120, // Mocked for now
  dailyGoal: 500, // Mocked for now (XP target)
  streakCount: 5, // Mocked for now
  rank: 10,
  badges: [],
  recentActivity: [],
  coursePoints: {},
  leaderboard: [],
  enrolledDegrees: [],
  userCourses: [],
  badgeCount: 0,
  loading: false,
  error: null,
};

// Async thunk to load user stats from Firestore
export const loadUserStats = createAsyncThunk(
  'gamification/loadStats',
  async (uid: string, { rejectWithValue }) => {
    try {
      const stats = await firestoreService.getUserStats(uid);
      return stats;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to sync XP to Firestore
export const syncXP = createAsyncThunk(
  'gamification/syncXP',
  async ({ uid, xpToAdd }: { uid: string; xpToAdd: number }, { dispatch, rejectWithValue }) => {
    try {
      await firestoreService.updateUserXP(uid, xpToAdd);
      dispatch(addXP(xpToAdd));
      return xpToAdd;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to sync course points to Firestore
export const syncCoursePoints = createAsyncThunk(
  'gamification/syncCoursePoints',
  async ({ uid, courseId, points }: { uid: string; courseId: string; points: number }, { dispatch, getState, rejectWithValue }) => {
    try {
      const state = getState() as { gamification: GamificationState };
      const currentPoints = state.gamification.coursePoints[courseId] || 0;
      
      if (points > currentPoints) {
        const diff = points - currentPoints;
        await firestoreService.updateUserXP(uid, diff);
        dispatch(updateCoursePoints({ courseId, points }));
        return { courseId, points, diff };
      }
      return { courseId, points, diff: 0 };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to enroll in a degree
export const enrollInDegree = createAsyncThunk(
  'gamification/enrollDegree',
  async ({ uid, degreeId }: { uid: string; degreeId: string }, { rejectWithValue }) => {
    try {
      await firestoreService.enrollDegree(uid, degreeId);
      return degreeId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to fetch user enrolled courses and progress
export const fetchUserCourses = createAsyncThunk(
  'gamification/fetchUserCourses',
  async (uid: string, { rejectWithValue }) => {
    try {
      const courses = await firestoreService.getUserEnrolledCourses(uid);
      return courses;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const gamificationSlice = createSlice({
  name: 'gamification',
  initialState,
  reducers: {
    setLeaderboard: (state, action: PayloadAction<LeaderboardEntry[]>) => {
      state.leaderboard = action.payload;
    },
    addXP: (state, action: PayloadAction<number>) => {
      state.totalXP += action.payload;
      // rank calculation for display
      state.rank = Math.max(1, 10 - Math.floor(state.totalXP / 1000));
    },
    updateCoursePoints: (state, action: PayloadAction<{ courseId: string; points: number }>) => {
      const { courseId, points } = action.payload;
      const currentPoints = state.coursePoints[courseId] || 0;
      if (points > currentPoints) {
        const diff = points - currentPoints;
        state.coursePoints[courseId] = points;
        state.totalXP += diff;
      }
    },
    unlockBadge: (state, action: PayloadAction<Badge>) => {
      if (!state.badges.find(b => b.id === action.payload.id)) {
        state.badges.push({ ...action.payload, unlockedAt: new Date().toISOString() });
        state.badgeCount = state.badges.length;
      }
    },
    addEnrolledDegree: (state, action: PayloadAction<string>) => {
      if (!state.enrolledDegrees.includes(action.payload)) {
        state.enrolledDegrees.push(action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadUserStats.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.totalXP = action.payload.totalXP || 0;
          state.badges = action.payload.badges || [];
          state.badgeCount = state.badges.length;
          state.enrolledDegrees = action.payload.enrolledDegrees || [];
          state.rank = Math.max(1, 10 - Math.floor(state.totalXP / 1000));
        }
      })
      .addCase(loadUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(enrollInDegree.fulfilled, (state, action) => {
        if (!state.enrolledDegrees.includes(action.payload)) {
          state.enrolledDegrees.push(action.payload);
        }
      })
      .addCase(fetchUserCourses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.userCourses = action.payload;
      })
      .addCase(fetchUserCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setLeaderboard, addXP, updateCoursePoints, unlockBadge, addEnrolledDegree } = gamificationSlice.actions;
export default gamificationSlice.reducer;
