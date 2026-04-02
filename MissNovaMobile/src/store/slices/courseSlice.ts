import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { courseAPI, Course, AudioCourse, VideoCourse } from '@/api/client';
import { firestoreService } from '@/api/firestoreService';

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
    isGenerating: boolean;
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
    isGenerating: false,
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

// Fetch all explore courses from Firestore
export const fetchCourses = createAsyncThunk(
    'course/fetchCourses',
    async (_, { rejectWithValue }) => {
        const mockCourses = [
            {
                id: 'mock-1',
                title: 'Python for Data Science',
                author: 'Dr. Sarah Kim',
                progress: 75,
                category: 'Technology',
                categoryColor: '#E0F2FE',
                accentColor: '#0369A1',
                icon: 'code-braces',
                difficulty: 'Intermediate',
                type: 'slides'
            },
            {
                id: 'mock-2',
                title: 'Digital Marketing Strategy',
                author: 'Mike Johnson',
                progress: 90,
                category: 'Marketing',
                categoryColor: '#F3E8FF',
                accentColor: '#7E22CE',
                icon: 'finance',
                difficulty: 'Beginner',
                type: 'audio'
            },
            {
                id: 'mock-3',
                title: 'Advanced Web Design & UX',
                author: 'Emma Rodriguez',
                progress: 68,
                category: 'Design',
                categoryColor: '#DCFCE7',
                accentColor: '#15803D',
                icon: 'palette-swatch-outline',
                difficulty: 'Intermediate',
                type: 'video'
            }
        ];

        try {
            // Racing the Firestore fetch against a 3-second timeout
            // Using a simple timeout-only promise that doesn't reject, but returns null
            const timeoutPromise = new Promise((resolve) => 
                setTimeout(() => resolve('timeout'), 3000)
            );
            
            const fetchPromise = (async () => {
                try {
                    await firestoreService.seedInitialCourses();
                    return await firestoreService.getExploreCourses();
                } catch (e) {
                    console.log('❌ [CourseSlice] Firestore error:', e);
                    return null;
                }
            })();

            const result = await Promise.race([fetchPromise, timeoutPromise]);
            
            let courses = result === 'timeout' || !result || (Array.isArray(result) && result.length === 0) 
                ? mockCourses 
                : result as any[];

            // Final safety normalization - ensure all courses have UI tokens
            return courses.map(c => ({
                ...c,
                accentColor: c.accentColor || '#1DA1F2',
                categoryColor: c.categoryColor || '#F1F5F9',
                icon: c.icon || 'book-open-variant',
                title: c.title || 'Untitled Course',
                progress: c.progress || 0
            }));
        } catch (error: any) {
            console.log('⚠️ [CourseSlice] Fetch crashed, using fallback');
            return mockCourses;
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
                state.isGenerating = true;
                state.error = null;
            })
            .addCase(generateCourse.fulfilled, (state, action) => {
                state.isGenerating = false;
                state.currentCourse = action.payload;
            })
            .addCase(generateCourse.rejected, (state, action) => {
                state.isGenerating = false;
                state.error = action.payload as string;
            })
            // Audio course generation
            .addCase(generateAudioCourse.pending, (state) => {
                state.isGenerating = true;
                state.error = null;
            })
            .addCase(generateAudioCourse.fulfilled, (state, action) => {
                state.isGenerating = false;
                state.currentCourse = action.payload;
            })
            .addCase(generateAudioCourse.rejected, (state, action) => {
                state.isGenerating = false;
                state.error = action.payload as string;
            })
            // Video course generation
            .addCase(generateVideoCourse.pending, (state) => {
                state.isGenerating = true;
                state.error = null;
            })
            .addCase(generateVideoCourse.fulfilled, (state, action) => {
                state.isGenerating = false;
                state.currentCourse = action.payload;
            })
            .addCase(generateVideoCourse.rejected, (state, action) => {
                state.isGenerating = false;
                state.error = action.payload as string;
            })
            // Fetch courses
            .addCase(fetchCourses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCourses.fulfilled, (state, action) => {
                state.loading = false;
                state.courses = action.payload;
            })
            .addCase(fetchCourses.rejected, (state, action) => {
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
