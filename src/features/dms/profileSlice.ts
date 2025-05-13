import { jwtDecode } from 'jwt-decode';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface Student {
    id: number;
    studentId: string;
    studentName: string;
    email: string;
    contactNumber: string;
    classId: string;
    fatherName: string;
    motherName: string;
    dob: string;
    address: string;
    parentContactNumber:string;
    studentAdmissionDate: string;
    classStartDate: string;
}

interface ProfileState {
    student: Student | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    student: null,
    loading: false,
    error: null,
};

export const fetchStudentByEmail = createAsyncThunk<Student, void, { rejectValue: string }>(
    'profile/fetchStudentByEmail',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const decodedToken: { sub: string } = jwtDecode(token);
            const email = decodedToken.sub;

            const response = await axios.get(`${BASE_URL}/dms/api/class-students/by-email/${email}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });


            if (response.data.message !== 'SUCCESS' || !response.data.data) {
                return rejectWithValue('Student not found or invalid response');
            }

            return response.data.data as Student;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
        }
    }
);

export const updateStudent = createAsyncThunk<Student, Student, { rejectValue: string }>(
    'profile/updateStudent',
    async (student, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('jwtToken');
            if (!token) {
                return rejectWithValue('No token found');
            }

            const response = await axios.put(`${BASE_URL}/dms/api/class-students/${student.studentId}`, student, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.status !== 200) {
                return rejectWithValue('Failed to update student');
            }

            return student;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
        }
    }
);

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchStudentByEmail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStudentByEmail.fulfilled, (state, action: PayloadAction<Student>) => {
                state.loading = false;
                state.student = action.payload;
            })
            .addCase(fetchStudentByEmail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateStudent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateStudent.fulfilled, (state, action) => {
                state.loading = false;
                state.student = action.payload;
            })
            .addCase(updateStudent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default profileSlice.reducer;

