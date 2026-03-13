import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { courseAPI, Course, AudioCourse, VideoCourse } from '@/api/client';

export type { Course, Quiz } from '@/api/client';

export interface AudioCourseData extends AudioCourse {
    type: 'audio';
}

export interface VideoCourseData extends VideoCourse {
    type: 'video';
}

export interface SlideCourseData extends Course {
    type: 'slides';
}

export type AnyCourse = SlideCourseData | AudioCourseData | VideoCourseData;

interface CourseState {
    currentCourse: AnyCourse | null;
    courses: Course[];
    loading: boolean;
    error: string | null;
    // Course generation options
    category: string;
    difficulty: string;
    courseType: 'slides' | 'audio' | 'video';
}

const initialState: CourseState = {
    currentCourse: null,
    courses: [],
    loading: false,
    error: null,
    category: '',
    difficulty: 'beginner',
    courseType: 'slides',
};

// Generate slide-based course
export const generateCourse = createAsyncThunk(
    'course/generate',
    async (prompt: string, { rejectWithValue }) => {
        try {
            const response = await courseAPI.generateCourse(prompt);
            return { ...response, type: 'slides' as const };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate course');
        }
    }
);

// Generate audio course
export const generateAudioCourse = createAsyncThunk(
    'course/generateAudio',
    async (prompt: string, { rejectWithValue }) => {
        try {
            const response = await courseAPI.generateAudioCourse(prompt);
            return { ...response, type: 'audio' as const };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate audio course');
        }
    }
);

// Generate video course
export const generateVideoCourse = createAsyncThunk(
    'course/generateVideo',
    async (prompt: string, { rejectWithValue }) => {
        try {
            const response = await courseAPI.generateVideoCourse(prompt);
            return { ...response, type: 'video' as const };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to generate video course');
        }
    }
);

const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        setCurrentCourse: (state, action: PayloadAction<AnyCourse>) => {
            state.currentCourse = action.payload;
        },
        setCategory: (state, action: PayloadAction<string>) => {
            state.category = action.payload;
        },
        setDifficulty: (state, action: PayloadAction<string>) => {
            state.difficulty = action.payload;
        },
        setCourseType: (state, action: PayloadAction<'slides' | 'audio' | 'video'>) => {
            state.courseType = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Slide course generation
            .addCase(generateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(generateCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Audio course generation
            .addCase(generateAudioCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateAudioCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(generateAudioCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Video course generation
            .addCase(generateVideoCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(generateVideoCourse.fulfilled, (state, action) => {
                state.loading = false;
                state.currentCourse = action.payload;
            })
            .addCase(generateVideoCourse.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const {
    setCurrentCourse,
    setCategory,
    setDifficulty,
    setCourseType,
    clearError
} = courseSlice.actions;

export default courseSlice.reducer;
