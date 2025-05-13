import axiosConfig from "../../axiosConfig/axiosConfig";

export const saveStudentMarks = async (marksData: { quizId: number; studentMarks: { studentId: string; mark: number }[] }) => {
    const sms_url = import.meta.env.VITE_SMS_URL;
  try {
    const response = await axiosConfig.post(`${sms_url}/api/sms/student-quiz-marks`, marksData);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }
};


export const getStudentMarksByQuizId = async (quizId: number) => {
  const sms_url = import.meta.env.VITE_SMS_URL;
  try {
    const response = await axiosConfig.get(`${sms_url}/api/sms/student-quiz-marks/${quizId}`);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    throw new Error(message);
  }
};

export const updateStudentMarks = async (marksData: { quizId: number; studentMarks: { studentId: string; mark: number }[] }) => {
  const sms_url = import.meta.env.VITE_SMS_URL;
  try {
    // Log the request data for debugging
    console.log("Sending marksData:", marksData);

    // Validate marksData
    if (!marksData.quizId || !Array.isArray(marksData.studentMarks) || marksData.studentMarks.length === 0) {
      throw new Error("Invalid marks data. Ensure quizId and studentMarks are provided.");
    }

    const response = await axiosConfig.put(`${sms_url}/api/sms/student-quiz-marks`, marksData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || "An error occurred";
    console.error("Error in updateStudentMarks:", message);
    throw new Error(message);
  }
};
