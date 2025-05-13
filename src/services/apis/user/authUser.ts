import { apiCall } from "../../axios-config/apiCall";

export const registerUser = async (userData: object) => {
    return await apiCall("post", `/api/auth/register-class-student`, userData);
};


export const requestForgetPassword = async (email: string) => {
    return await apiCall("post", `/api/auth/request-forget-password/${email}`);
};


export const resetPassword = async (userData: object) => {
    return await apiCall("post", `/api/auth/reset-forget-password`,userData);
};

export const isTokenValid = async (token: string | null) => {
    return await apiCall("get", `/api/auth/is-valid-token/${token}`);
};