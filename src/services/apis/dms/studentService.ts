import { apiCall } from "../../axios-config/apiCall";
import { jwtDecode } from 'jwt-decode';

interface Student {
  id: number;
  studentId: string;
  studentName: string;
  email: string;
  contactNumber: string;
  classId: string;
  fatherName: string;
  motherName: string;
  dob: string;
  address: string;
  parentContactNumber:string;
  studentAdmissionDate: string;
  classStartDate: string;
}

export const createStudent = async (studentData: object) => {
  return await apiCall("post", `/dms/api/class-students`, studentData);
};

export const fetchAllStudentsPaginated = async (classId: any, pageNumber: any, pageSize: any, sortBy: any, direction: any,sessionId:any | null) => {
  return await apiCall("get", `/dms/api/class-students/paginated?classId=${classId}&pageNumber=${pageNumber}&pageSize=${pageSize}&sortBy=${sortBy}&direction=${direction}&sessionId=${sessionId}`);
};

export const getAllStudentsByClassId = async (classId : any) => {
  return await apiCall("get", `/dms/api/class-students/class/${classId}`);
}

export const getStudentDetailsByStudentId = async (studentId: any) => {
  return await apiCall("get", `/dms/api/class-students/${studentId}`);
}

export const updateStudent = async (studentId: any, studentData: object) => {
  console.log(studentData);
  return await apiCall("put", `/dms/api/class-students/${studentId}`, studentData);
};

export const deleteStudent = async (id: any) => {
  return await apiCall("delete", `/dms/api/class-students/${id}`);
};

export const fetchAllClassesApi = async () => {
  const pageNumber = -1; // -1 for all
  return await apiCall("get", `/dms/api/classes/paginated?pageNumber=${pageNumber}`);
};

export const fetchStudentByEmail = async (): Promise<Student | undefined> => {
  try {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
          console.error('No token found');
          return undefined;
      }

      const decodedToken: { sub: string } = jwtDecode(token);
      const email = decodedToken.sub;

      const response = await apiCall(
          "get",
          `/dms/api/class-students/by-email/${email}`
      );

      if (response?.status === 200 && response?.data?.message === 'SUCCESS' && response?.data?.data) {
          return response.data.data as Student;
      } else {
          console.error('Failed to fetch student by email:', response?.data?.message || 'Unknown error');
          return undefined;
      }
  } catch (error: any) {
      console.error('Error fetching student by email:', error?.response?.data?.message || error?.message || 'An error occurred');
      return undefined;
  }
};