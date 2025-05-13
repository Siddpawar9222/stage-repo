import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from "axios";
import customAxiosConfig from "./CustomAxiosConfig";

// Define allowed HTTP methods
type HttpMethod = "get" | "post" | "put" | "delete" | "patch";

// Define response type
interface ApiResponse {
  status: number;
  data?: any;
  statusText: string;
}

// Define expected error response structure
interface ErrorResponse {
  message?: string;
}

/**
 * A reusable function to make API calls.
 * @param {HttpMethod} method - The HTTP method (GET, POST, PUT, DELETE, PATCH).
 * @param {string} url - The API endpoint.
 * @param {object} [payload] - The request payload for methods like POST or PUT.
 * @returns {Promise<ApiResponse>}
 */
export const apiCall = async (
  method: HttpMethod,
  url: string,
  payload: object = {}
): Promise<ApiResponse> => {
  try {
    const axiosInstance = customAxiosConfig();

    // Axios request config
    const config: AxiosRequestConfig = payload ? { data: payload } : {};

    // Make the request dynamically based on method
    const response: AxiosResponse = await axiosInstance.request({
      method,
      url,
      ...config,
    });

    return { status: response.status, data: response.data, statusText: "Success" };
  } catch (error) {
    console.error("API Call Error:", error);

    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      const errorData = data as ErrorResponse;
      console.error(`Error Status: ${status}, Message: ${errorData?.message || "Unknown error"}`);

      return { status, statusText: errorData?.message || "Unknown error" };
    } else if (axios.isAxiosError(error) && error.request) {
      console.error("Request was made but no response received:", error.request);
      return { status: 0, statusText: "Request was made but no response received" };
    } else {
      console.error("Error occurred while setting up the request:", (error as Error).message);
      return { status: 0, statusText: "Error occurred while setting up the request" };
    }
  }
};
