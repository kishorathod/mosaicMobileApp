import axios, { AxiosError } from 'axios';

// Replace with your actual backend URL
// For Android emulator: http://10.0.2.2:3000/api
// For iOS simulator: http://localhost:3000/api
// For physical device: Use your computer's IP address (e.g., http://192.168.1.100:3000/api)
const API_BASE_URL = 'http://10.0.2.2:3000/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 60000, // Increased timeout for AI generation
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for logging
api.interceptors.request.use(
    (config) => {
        console.log(`📤 [API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        return config;
    },
    (error) => {
        console.error('📤 [API] Request error:', error);
        return Promise.reject(error);
    }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
    (response) => {
        console.log(`📥 [API] ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
        return response;
    },
    (error: AxiosError) => {
        console.error('📥 [API] Response error:', error.response?.data || error.message);

        // Handle specific error cases
        if (error.response) {
            // Server responded with error status
            const message = (error.response.data as any)?.error || 'Server error occurred';
            throw new Error(message);
        } else if (error.request) {
            // Request was made but no response received
            throw new Error('Network error. Please check your connection.');
        } else {
            // Something else happened
            throw new Error(error.message || 'An unexpected error occurred');
        }
    }
);

export interface GenerateCourseRequest {
    prompt: string;
}

export interface Course {
    title: string;
    description: string;
    total_slides: number;
    slides: Slide[];
    category?: string;
    difficulty?: string;
    courseType?: string;
}

export interface Slide {
    slide_number: number;
    title: string;
    content: string;
    quiz: Quiz;
}

export interface Quiz {
    question: string;
    options: string[];
    correct_answer: string;
    explanation: string;
}

export interface AudioCourse {
    title: string;
    description: string;
    audioUrl: string;
    duration: number;
    transcript?: string;
    category?: string;
    difficulty?: string;
}

export interface VideoCourse {
    title: string;
    description: string;
    videoUrl: string;
    duration: number;
    transcript?: string;
    category?: string;
    difficulty?: string;
}

export const courseAPI = {
    generateCourse: async (prompt: string): Promise<Course> => {
        const response = await api.post<Course>('/generate-course', { prompt });
        return response.data;
    },

    generateAudioCourse: async (prompt: string): Promise<AudioCourse> => {
        const response = await api.post<AudioCourse>('/generate-audio-course', { prompt });
        return response.data;
    },

    generateVideoCourse: async (prompt: string): Promise<VideoCourse> => {
        const response = await api.post<VideoCourse>('/generate-video-course', { prompt });
        return response.data;
    },

    getCourses: async (): Promise<Course[]> => {
        const response = await api.get<Course[]>('/courses');
        return response.data;
    },
};

export const authAPI = {
    // Add any additional auth API calls here if needed
};
