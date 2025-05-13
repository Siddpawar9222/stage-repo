import { apiCall } from "../../axios-config/apiCall"
import axiosConfig from "../../axiosConfig/axiosConfig"

export interface EnrollmentItem {
    enrollmentId:string
    studentClassId?:string
    studentClassName:string
    studentId:string
    sessionId:number
    status:string
}

export const fetchEnrollmentByStudentId = async(studentId: string): Promise <EnrollmentItem[]> => {
    try {
    const response = await axiosConfig.get(
      `/dms/api/student-enrollment/${studentId}`,
    )
    return response.data as EnrollmentItem[]
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}