import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiCall } from '../../services/axios-config/apiCall';

// Define the structure of a session
// session object
export interface Session {
    id: number;
    sessionId: number;
    sessionName: string;
    startDate : string;
    endDate : string;
    isActive : boolean ;
  }

// Define the initial state structure
interface SessionState {
  sessions: Session[];
  selectedSession: Session | null;
  loading: boolean;
  error: string | null;
}

// Initial state
const initialState: SessionState = {
  sessions: [],
  selectedSession: null,
  loading: false,
  error: null,
};


export const fetchSessions = createAsyncThunk<Session[], void, { rejectValue: string }>(
  'session/fetchSessions',
  async (_, thunkAPI) => {
    try {
      const response = await apiCall('get', '/api/dms/sessions');
      if (response.status === 200 && Array.isArray(response.data.data)) {
        return response.data.data as Session[];
      } else {
        return thunkAPI.rejectWithValue(response.statusText);
      }
    } catch (error) {
      return thunkAPI.rejectWithValue('Something went wrong while fetching sessions');
    }
  }
);

// Create session slice
const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setSelectedSession: (state, action: PayloadAction<Session>) => {
      state.selectedSession = action.payload;
    },
    clearSelectedSession: (state) => {
      state.selectedSession= state.sessions.length > 0 ? state.sessions[0] : null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action: PayloadAction<Session[]>) => {
        state.loading = false;
        state.sessions = action.payload;
        state.selectedSession = action.payload.length > 0 ? action.payload[0] : null;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch sessions';
      });
  },
});

// Export actions and reducer
export const { setSelectedSession, clearSelectedSession } = sessionSlice.actions;
export default sessionSlice.reducer;
