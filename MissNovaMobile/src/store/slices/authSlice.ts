import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import auth from '@react-native-firebase/auth';
import { firestoreService } from '../../api/firestoreService';
import { loadUserStats } from './gamificationSlice';

interface User {
    uid: string;
    email: string | null;
    displayName: string | null;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const login = createAsyncThunk(
    'auth/login',
    async ({ email, password }: { email: string; password: string }, { dispatch, rejectWithValue }) => {
        try {
            const userCredential = await auth().signInWithEmailAndPassword(email, password);
            const user = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName: userCredential.user.displayName,
            };
            
            // Sync with Firestore in the background (non-blocking)
            firestoreService.syncUserProfile(user.uid, {
                displayName: user.displayName || 'Learner',
                email: user.email || '',
            }).then(() => {
                // Load stats only after sync is confirmed in the background
                dispatch(loadUserStats(user.uid));
            });
            
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async (
        { email, password, displayName }: { email: string; password: string; displayName: string },
        { dispatch, rejectWithValue }
    ) => {
        try {
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);
            await userCredential.user.updateProfile({ displayName });
            
            const user = {
                uid: userCredential.user.uid,
                email: userCredential.user.email,
                displayName,
            };

            // Initialize Firestore profile in the background
            firestoreService.syncUserProfile(user.uid, {
                displayName: user.displayName,
                email: user.email || '',
                totalXP: 0,
                rank: 10,
                badges: [],
            }).then(() => {
                dispatch(loadUserStats(user.uid));
            });

            return user;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const logout = createAsyncThunk('auth/logout', async () => {
    await auth().signOut();
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
            state.isAuthenticated = !!action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Logout
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
