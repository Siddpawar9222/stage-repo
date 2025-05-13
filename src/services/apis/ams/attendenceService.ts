import axios from 'axios';
import axiosConfig from '../../axiosConfig/axiosConfig';

export interface AttendanceRecord {
  id?: number;
  classId: string;
  studentId: string;
  date: string;
  attendenceStatus: 'PRESENT' | 'ABSENT' ;
  actionState: 'LOCKED' | 'NOT_MARKED';
}

const BASEURL = 'http://localhost:8080'

export const getAttendance= async (classId: string, date: string): Promise<AttendanceRecord[]> => {
    try {
      const response = await axiosConfig.get<{ message: string; data: AttendanceRecord[] }>(`/ams/attendence?classId=${(classId)}&date=${date}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching attendance:', error);
      throw error;
    }
}

export const markBulkAttendance= async (attendanceRecords: AttendanceRecord[]): Promise<AttendanceRecord[]> => {
    try {
      const response = await axiosConfig.post<AttendanceRecord[]>(`/ams/attendence/bulk`, attendanceRecords);
      return response.data;
    } catch (error) {
      console.error('Error marking attendance:', error);
      throw error;
    }
}

export const updateAttendence = async (attendanceRecords: AttendanceRecord[]): Promise<AttendanceRecord[]> => {
  try {
    const response = await axiosConfig.put<AttendanceRecord[]>(`/ams/attendence/update`, attendanceRecords);
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error);
    throw error;
  }
}

export const getWeeklyAttendence = async (studentId : string): Promise<AttendanceRecord[]> => {
  try {
    const response = await axiosConfig.get<{ message: string; data: AttendanceRecord[] }>(`/ams/attendence/student/${studentId}/weekly`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
      throw error;
  }
} 

export const getMonthlyAttendence = async (studentId : string): Promise<AttendanceRecord[]> => {
  try {
    const response = await axiosConfig.get<{ message: string; data: AttendanceRecord[] }>(`/ams/attendence/student/${studentId}/monthly`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
      throw error;
  }
} 

export const getCustomAttendence = async (studentId : string, startDate: string, endDate: string): Promise<AttendanceRecord[]> => {
  try {
    const response = await axiosConfig.get<{ message: string; data: AttendanceRecord[] }>(`/ams/attendence/student/${studentId}/custom?startDate=${startDate}&endDate=${endDate}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching weekly attendance:', error);
      throw error;
  }
} 