import { apiCall } from "../../axios-config/apiCall";

export const fetchAllStudentsPaginated = async () => {
    return await apiCall("get", `/api/dms/sessions`);
  };