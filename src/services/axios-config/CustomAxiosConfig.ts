import axios, { AxiosInstance } from "axios";
import store from "../../app/store";
import { openModal } from "../../app/reducers/modalSlice";
import { MODAL_CONSTANTS } from "../../utils/modalUtils";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const customAxiosConfig = (): AxiosInstance => {
    const TOKEN = localStorage.getItem("jwtToken");

    const axiosInstance = axios.create({
        baseURL: BASE_URL,
        headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
    });

    axiosInstance.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response) {
                const { status } = error.response;
                if (status === 401 || status === 403) {
                    store.dispatch(
                        openModal({ title: "Session Expired", bodyType: MODAL_CONSTANTS.SESSION_EXPIRED })
                    );
                } else if (status === 500) {
                    store.dispatch(
                        openModal({ title: "Internal Server Error", bodyType: MODAL_CONSTANTS.ERROR })
                    );
                }
            }
            return Promise.reject(error);
        }
    );

    return axiosInstance;
};

export default customAxiosConfig;
