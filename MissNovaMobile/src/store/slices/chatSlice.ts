import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/api/client';

export interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: string;
}

interface ChatState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    messages: [
        {
            id: '1',
            text: "Hi there! I'm Miss Nova, your AI learning assistant. How can I help you today?",
            sender: 'ai',
            timestamp: new Date().toISOString(),
        }
    ],
    loading: false,
    error: null,
};

export const sendMessage = createAsyncThunk(
    'chat/sendMessage',
    async (text: string, { rejectWithValue }) => {
        try {
            // Simulate AI response for now or call a real endpoint if available
            // In a real app, this would be: await api.post('/chat', { message: text })
            
            // Artificial delay to feel "real"
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            const aiResponse = `That's a great question about "${text}"! As your AI teacher, I'd suggest looking into our specialized courses on this topic in the Explore section. Is there something specific you'd like me to explain?`;
            
            return aiResponse;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to get AI response');
        }
    }
);

const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        addUserMessage: (state, action: PayloadAction<string>) => {
            state.messages.push({
                id: Date.now().toString(),
                text: action.payload,
                sender: 'user',
                timestamp: new Date().toISOString(),
            });
        },
        clearChat: (state) => {
            state.messages = initialState.messages;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(sendMessage.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.loading = false;
                state.messages.push({
                    id: Date.now().toString(),
                    text: action.payload,
                    sender: 'ai',
                    timestamp: new Date().toISOString(),
                });
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const { addUserMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
