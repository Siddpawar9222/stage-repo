import { apiCall } from "../../axios-config/apiCall";
import { axiosDownloadFileConfig } from "../../axios-config/axiosDownloadFileConfig ";

export const getReportTypes = async () => {
    return await apiCall("get", `/api/ps/reports/report-types`);
  }
  
export  const downloadReport = async (reportType: string, startDate: string, endDate: string) => {
    const formattedReportType = reportType.replace(/\s+/g, '-');
    const fileName = `${formattedReportType}_${startDate}_${endDate}.csv`;
  
    const requestParams = {
      methodName: "Download Report",
      URL: `/api/ps/reports/${formattedReportType}?startDate=${startDate}&endDate=${endDate}`, 
      fileType: "text/csv",
      fileName: fileName,
    };
      const response = await axiosDownloadFileConfig(requestParams);
      return response;
}
  
  