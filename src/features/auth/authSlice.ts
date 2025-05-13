import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  name: string;
  email: string;
  roles: string[];
  jwtToken: string;
}

interface AuthState {
  user: User | null;
  message: string;
  token: string | null;
}

const storedUser = localStorage.getItem('user');
const storedToken = localStorage.getItem('jwtToken');

const initialState: AuthState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  message: '',
  token: storedToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: User; message: string }>) => {
      state.user = action.payload.user;
      state.message = action.payload.message;
      state.token = action.payload.user.jwtToken;
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      localStorage.setItem('jwtToken', action.payload.user.jwtToken);
      localStorage.setItem('userName', action.payload.user.name);
    },
    logout: (state) => {
      state.user = null;
      state.message = '';
      state.token = null;
      localStorage.removeItem('user');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('roles'); 
      localStorage.removeItem('userName'); 
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;