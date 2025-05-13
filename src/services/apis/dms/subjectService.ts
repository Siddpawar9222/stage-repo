import axiosConfig from "../../axiosConfig/axiosConfig"

export interface SubjectItem {
  id?: number
  subjectId?: string
  classId: string
  subjectName: string
  bookName: string
  subjectDescription: string
  [key: string]: any
}

export const fetchSubjectsByClass = async (
  classId: string,
): Promise<SubjectItem[]> => {
  try {
    const response = await axiosConfig.get(
      `/dms/api/subjects/by-class/${classId}`,
    )
    return response.data as SubjectItem[]
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const addSubject = async (
  subjectData: SubjectItem,
): Promise<SubjectItem> => {
  try {
    const response = await axiosConfig.post("/dms/api/subjects", subjectData)
    return response.data as SubjectItem
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const addBulkSubject = async (
  subjectData: SubjectItem[],
): Promise<SubjectItem> => {
  try {
    const response = await axiosConfig.post("/dms/api/subjects/bulk", subjectData)
    return response.data as SubjectItem
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const updateSubject = async (
  id: number,
  subjectData: SubjectItem,
): Promise<SubjectItem> => {
  try {
    const response = await axiosConfig.put(
      `/dms/api/subjects/${id}`,
      subjectData,
    )
    return response.data as SubjectItem
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}

export const deleteSubject = async (id: number): Promise<void> => {
  try {
    await axiosConfig.delete(`/dms/api/subjects/${id}`)
  } catch (error: any) {
    throw error.response?.data?.message || error.message
  }
}
