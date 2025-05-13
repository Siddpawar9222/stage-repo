// chargesService.ts
import axiosConfig from '../../axiosConfig/axiosConfig'; // Import the centralized Axios instance

export interface ChargeItem {
  id: number;
  chargeId: string;
  chargeName: string;
  chargeAmount: number;
  dueDate: string;
  ledgerHeadId: string;
  ledgerHeadName: string;
  classId: string;
  [key: string]: any;
}

export interface MonthlyCharges {
  [month: string]: ChargeItem[];
}

export interface AddChargePayload {
  chargeName: string;
  chargeAmount: number;
  dueDate: string;
  ledgerHeadId: string;
  classId: string;
}

export const fetchChargesGroupByMonth = async (
  classId: string
): Promise<MonthlyCharges> => {
  try {
    const response = await axiosConfig.get(
      `/api/ps/charges/group-by-month/${classId}`
    );
    return response.data.data;
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

export const addCharge = async (payload: AddChargePayload): Promise<void> => {
  try {
    await axiosConfig.post('/api/ps/charges', payload);
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

export const updateCharge = async (
  payload: ChargeItem
): Promise<void> => {
  try {
    await axiosConfig.put(`/api/ps/charges/${payload.id}`, payload);
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

export const deleteCharge = async (chargeId: number): Promise<void> => {
  try {
    await axiosConfig.delete(`/api/ps/charges/${chargeId}`);
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

export const fetchLedgerHeads = async (): Promise<ChargeItem[]> => {
  try {
    const response = await axiosConfig.get('/api/ps/ledger-heads');
    return response.data.data;
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