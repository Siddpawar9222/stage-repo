// classService.ts
import axiosConfig from '../../axiosConfig/axiosConfig'; // Import the centralized Axios instance

export interface ClassItem {
  id: number;
  classId: string;
  className: string;
  [key: string]: any;
}

export const fetchClasses = async (): Promise<ClassItem[]> => {
  try {
    const response = await axiosConfig.get('/dms/api/classes');
    return response.data as ClassItem[];
  } catch (error: any) {
    const message =
      (error.response &&
        error.response.data &&
        error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};