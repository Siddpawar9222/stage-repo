// paymentService.ts
import { apiCall } from '../../axios-config/apiCall';
import { axiosDownloadFileConfig } from '../../axios-config/axiosDownloadFileConfig ';
import axiosConfig from '../../axiosConfig/axiosConfig'; // Import your configured Axios instance

interface Student {
  tenantId: string;
  tenantEntityId: string;
  createDate: string;
  deleteDate: string | null;
  id: number;
  studentId: string;
  studentName: string;
  email: string;
  contactNumber: string;
  fatherName: string;
  motherName: string;
  dob: string;
  address: string;
  studentAdmissionDate: string;
  classStartDate: string;
  deletePermanently: string | null;
}

interface PaymentSummary {
  [monthYear: string]: {
    AdditionalCharge: any;
    StudentPayment: any;
    Charge: {
      [chargeName: string]: number;
      total: number;
    };
    cumulativeDue: {
      amount: number;
    };
  };
}

interface Transaction {
  id: number
  receiptId: string;
  paymentMode: string;
  paidAmount: number;
  paymentDate: string;
  // Add other fields as per your API response
}

interface TransactionsResponse {
  content: Transaction[];
  totalElements: number;
  // Add other fields as per your API response structure
}
export interface AddPaymentSuccessResponse {
  message: string;
  data: {
    id: number;
    studentPaymentId: string;
    paymentMode: string;
    paidAmount: number;
    notNumber: string;
    upiId: string;
    remarks: string;
    receiptId: string;
    studentId: string;
    classId: string | null;
    paymentDate: string;
    sessionId: string;
  };
}

interface DueAmount {
  studentId: string;
  dueAmount: number;
  studentName: string;
}

interface DueAmountResponse {
  message: string;
  data: {
    content: DueAmount[];
    totalElements: number;
    totalPages: number;
    pageSize: number;
    pageNumber: number;
    firstPage: boolean;
    lastPage: boolean;
  };
}

interface AdditionalChargeData {
  additionalChargeName: string;
  amount: number;
  dueDate: string;
  studentId: string;
}

interface AdditionalChargeResponse {
  message: string;
  data: {
    id: number;
    additionalChargeId: string;
    additionalChargeName: string;
    amount: number;
    dueDate: string;
    studentId: string;
    sessionId: string;
  };
}

type AddPaymentReturnType = AddPaymentSuccessResponse | string;

export const fetchStudents = async (classId: string): Promise<Student[]> => {
  try {
    const response = await axiosConfig.get(`/dms/api/class-students/class/${classId}`);
    return response.data.data as Student[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const fetchPaymentSummary = async ({
  classId,
  studentId,
}: {
  classId: string;
  studentId: string;
}): Promise<PaymentSummary> => {
  try {
    const response = await axiosConfig.get(
      `/api/ps/student-payments/payment-summary?classId=${classId}&studentId=${studentId}`
    );
    return response.data.data as PaymentSummary;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const fetchPaymentSummaryByStudentId = async ({
  studentId,
}: {
  studentId: string;
}): Promise<PaymentSummary> => {
  try {
    const response = await axiosConfig.get(
      `/api/ps/student-payments/payment-summary?studentId=${studentId}`
    );
    return response.data.data as PaymentSummary;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const fetchTransactions = async ({
  studentId,
  pageNumber,
  pageSize,
}: {
  studentId: string;
  pageNumber: number;
  pageSize: number;
}): Promise<TransactionsResponse> => {
  try {
    const response = await axiosConfig.get(
      `/api/ps/student-payments/ts/${studentId}?pageNumber=${pageNumber}&pageSize=${pageSize}`
    );
    return response.data.data as TransactionsResponse;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const fetchPaymentModes = async (): Promise<string[]> => {
  try {
    const response = await axiosConfig.get(`/api/ps/student-payments/payment-mode`);
    return response.data.data as string[];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const addStudentPayment = async ({
  studentId,
  classId,
  paymentMode,
  studentName,
  upiId,
  amount,
  currency,
  remark,
}: {
  studentId: any;
  classId: string;
  paymentMode: string;
  upiId: string;
  studentName: string;
  amount: number;
  currency: string;
  remark: string;
}): Promise<AddPaymentReturnType> => { // Corrected return type
  try {
    const payload = {
      studentId,
      classId,
      paymentMode,
      paidAmount: amount,
      studentName,
      notNumber: currency,
      upiId: upiId,
      remarks: remark,
      receiptId: '',
      sessionId: '2024',
    };

    const response = await axiosConfig.post<AddPaymentSuccessResponse>(
      `/api/ps/student-payments`,
      payload
    );
    return response.data; // Return the full data object
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const deleteStudentPayment = async (id: number): Promise<string> => {
  try {
    const response = await axiosConfig.delete(`/api/ps/student-payments/${id}`);
    return response.data.message; // Return the success message
  } catch (error: any) {
    throw error.response?.data?.message || "Failed to delete payment.";
  }
};

export const fetchClassDue = async ({
  classId,
  pageNumber,
  pageSize,
  download = false, // Add a download flag
}: {
  classId: string;
  pageNumber: number;
  pageSize: number;
  download?: boolean;
}): Promise<DueAmountResponse> => {
  try {
    const response = await axiosConfig.get<DueAmountResponse>(
      `/api/ps/student-payments/total-due-amount/${classId}?pageNumber=${pageNumber}&pageSize=${pageSize}${download ? '&download=true' : ''}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'An error occurred');
  }
};

export const addAdditionalCharge = async (
  additionalChargeData: AdditionalChargeData
): Promise<AdditionalChargeResponse> => {
  try {
    const response = await axiosConfig.post<AdditionalChargeResponse>(
      '/api/ps/additional-charges',
      additionalChargeData
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to add additional charge.');
  }
};


export const addAdditionalChargeToClassDue = async (additionalCharge: object) => {
  const fileName = `charges-applied-student.csv`;

  const requestParams = {
    URL: `/api/ps/student-payments/apply-additional-charges`,
    fileType: "text/csv",
    fileName: fileName,
    method: 'POST' as 'POST',
    body: additionalCharge
  };
  const response = await axiosDownloadFileConfig(requestParams);
  return response;
}


export const fetchTotalRemainingDueAmount = async (studentId: string | undefined) => {
  return await apiCall("get", `/api/ps/student-payments/total-remaining-due-amount/${studentId}`);
};