import axiosConfig from '../../axiosConfig/axiosConfig';

export const getQuizByClassId = async (classId: number | undefined) => {
    const qms_url = import.meta.env.VITE_QMS_URL
  try {
    const response = await axiosConfig.get(`${qms_url}/qms/quiz/class/${classId}`);
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    const message =
      error.response?.data?.message || error.message || 'An error occurred';
    throw new Error(message);
  }
};