import axios from 'axios';
import customAxiosConfig from './CustomAxiosConfig';

/**
 * Request configuration for downloading a file.
 */
interface DownloadFileRequest {
  /**
   * The full API endpoint URL to download the file from.
   */
  URL: string;

  /**
   * The MIME type of the file (e.g., 'application/pdf', 'application/zip', 'text/csv').
   */
  fileType: string;

  /**
   * The name to be used for saving the downloaded file.
   */
  fileName: string;

  /**
   * Optional body data to send with the request (used with POST/PUT/PATCH).
   */
  body?: any;

  /**
   * HTTP method to use for the request. Defaults to 'GET'.
   */
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH';
}

/**
 * Response after attempting file download.
 */
interface DownloadFileResponse {
  status: number;
  statusText: string;
}

/**
 * Downloads a file from the given URL using Axios.
 * Supports both GET (default) and other HTTP methods like POST/PUT with optional request body.
 * Handles file download in the browser using a blob and triggers a file save using a temporary link.
 *
 * @param {DownloadFileRequest} config - Configuration object for the download request.
 * @returns {Promise<DownloadFileResponse>} - Returns status and message about the result.
 *
 * @example
 * // Example 1: Simple GET request
 * await axiosDownloadFileConfig({
 *   URL: 'https://example.com/file.csv',
 *   fileType: 'text/csv',
 *   fileName: 'report.csv',
 * });
 *
 * @example
 * // Example 2: POST request with request body
 * await axiosDownloadFileConfig({
 *   URL: 'https://example.com/download-pdf',
 *   fileType: 'application/pdf',
 *   fileName: 'report.pdf',
 *   method: 'POST',
 *   body: { userId: 123 },
 * });
 */
export const axiosDownloadFileConfig = async ({
  URL,
  fileType,
  fileName,
  body,
  method = 'GET',
}: DownloadFileRequest): Promise<DownloadFileResponse> => {
  try {
    const axiosInstance = customAxiosConfig();

    const config = {
      url: URL,
      method: method,
      responseType: 'blob' as const,
      ...(method !== 'GET' && body ? { data: body } : {}),
    };

    const { status, data } = await axiosInstance.request<Blob>(config);

    const blob = new Blob([data], { type: fileType });
    const downloadUrl = window.URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);

    return { status, statusText: 'File downloaded successfully' };
  } catch (error: any) {
    console.error('Error in axiosDownloadFileConfig:', error);

    if (axios.isAxiosError(error) && error.response) {
      const { status, data } = error.response;
      return { status, statusText: data?.message || 'Error occurred' };
    } else if (error.request) {
      return { status: 0, statusText: 'Request made but no response received' };
    } else {
      return { status: 0, statusText: 'Error occurred while setting up request' };
    }
  }
};
