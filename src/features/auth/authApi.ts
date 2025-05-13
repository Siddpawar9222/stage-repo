import axios from 'axios';
import { AppDispatch } from '../../app/store';
import { loginSuccess } from './authSlice';
import { openModal } from '../../app/reducers/modalSlice';
import { MODAL_CONSTANTS } from '../../utils/modalUtils';

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface LoginResponse {
  data: {
    jwtToken: string;
    roles: string[];
    name: string;
    email: string; // Add email
    isPasswordValid: boolean
  };
  message: string;
}

interface SignupResponse {
  message: string;
}

interface ErrorResponse {
  message: string;
}

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.post<LoginResponse>(`${BASE_URL}/login`, {
      email,
      password,
    });

    if (!response.data.data.isPasswordValid) {
      dispatch(openModal({ title: response?.statusText, bodyType: MODAL_CONSTANTS.PASSWORD_WARNING }));
      return;
    }

    if (response.data.data.jwtToken) {
      dispatch(
        loginSuccess({
          user: response.data.data,
          message: response.data.message,
        })
      );

      localStorage.setItem('jwtToken', response.data.data.jwtToken);
      localStorage.setItem('roles', JSON.stringify(response.data.data.roles));

      return response.data;
    } else {
      throw new Error('Invalid credentials');
    }
  } catch (error: any) {
    if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
      throw new Error(error.response.data.message || 'Login failed');
    } else {
      throw new Error('Login failed');
    }
  }
};

export const signupUser = (name: string, email: string, password: string) => async () => {
  try {
    const response = await axios.post<SignupResponse>(`${BASE_URL}/register`, {
      name,
      email,
      password,
    });

    if (response.data.message) {
      return response.data;
    } else {
      throw new Error('Signup failed');
    }
  } catch (error: any) {
    if (axios.isAxiosError<ErrorResponse>(error) && error.response) {
      throw new Error(error.response.data.message || 'Signup failed');
    } else {
      throw new Error('Signup failed');
    }
  }
};