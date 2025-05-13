// attendance.slice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_AMS_BASE_URL;

export interface AttendanceRecord {
  studentId: string;
  isPresent: boolean;
}

interface AttendanceState {
  attendanceRecords: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  isLocked: boolean;
}

const initialState: AttendanceState = {
  attendanceRecords: [],
  loading: false,
  error: null,
  isLocked: false,
};

export const fetchAttendance = createAsyncThunk<
  AttendanceRecord[],
  string, // classId
  { rejectValue: string }
>("attendance/fetchAttendance", async (classId, { rejectWithValue }) => {
  try {
    const response = await axios.get<AttendanceRecord[]>(
      `${BASE_URL}/ams/attendence/${classId}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const markAttendanceRecords = createAsyncThunk<
  AttendanceRecord[],
  { classId: string; attendanceRecords: AttendanceRecord[] },
  { rejectValue: string; state: RootState }
>("attendance/updateAttendanceRecords", async ({ classId, attendanceRecords }, { rejectWithValue, getState }) => {
  const state = getState();
  const token = state.auth.user?.jwtToken;

  if (!token) {
    return rejectWithValue("No authentication token found.");
  }

  try {
    const response = await axios.post<AttendanceRecord[]>(
      `${BASE_URL}ams/attendence/bulk`,
      attendanceRecords,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

const attendanceSlice = createSlice({
  name: "attendance",
  initialState,
  reducers: {
    toggleAttendance: (state, action: PayloadAction<{ studentId: string; isPresent: boolean }>) => {
        if (!state.isLocked) { // Prevent toggling if locked
            const { studentId, isPresent } = action.payload;
            const record = state.attendanceRecords.find((r) => r.studentId === studentId);
            if (record) {
              record.isPresent = isPresent;
            } else {
              state.attendanceRecords.push({ studentId, isPresent });
            }
          }
        },
    resetAttendance: (state) => {
      state.attendanceRecords = [];
      state.isLocked = false;
    },
    lockAttendance: (state) => {
      state.isLocked = !state.isLocked;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendanceRecords = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(markAttendanceRecords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAttendanceRecords.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(markAttendanceRecords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { toggleAttendance, resetAttendance, lockAttendance } = attendanceSlice.actions;
export default attendanceSlice.reducer;