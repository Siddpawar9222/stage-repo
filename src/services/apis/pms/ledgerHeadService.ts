import { apiCall } from "../../axios-config/apiCall";

export const getAllLedgerheadsApi = async () => {
    return await apiCall("get", `/api/ps/ledger-heads`);
};
  