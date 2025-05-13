import axiosConfig from '../../axiosConfig/axiosConfig';

export interface ChapterItem {
  id?: number;
  classId: string;
  subjectId: string;
  chapterId?: string;
  chapterName: string;
  videoId: string;
  [key: string]: any;
}


export const fetchAllChaptersByClassAndSubject = async (classId: string, subjectId: string): Promise<ChapterItem[]> => {
    try {
        const response = await axiosConfig.get(`/dms/api/chapters/by-class&Subject/${classId}/${subjectId}`);
        return response.data as ChapterItem[];
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
}

export const createChapter = async (chapterData: ChapterItem): Promise<ChapterItem> => {
    try {
        const response = await axiosConfig.post(`/dms/api/chapters`, chapterData);
        return response.data as ChapterItem;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};

export const addBulkChapter = async (chapterData: ChapterItem[]): Promise<ChapterItem> => {
    try {
        const response = await axiosConfig.post(`/dms/api/chapters/bulk`, chapterData);
        return response.data as ChapterItem;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};

export const updateChapter = async (id: number, chapterData: ChapterItem): Promise<ChapterItem> => {
    try {
        const response = await axiosConfig.put(`/dms/api/chapters/${id}`, chapterData);
        return response.data as ChapterItem;
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
};

export const deleteChapter = async (id: number): Promise<void> => {
    try {
        await axiosConfig.delete(`/dms/api/chapters/${id}`);
    } catch (error: any) {
        throw error.response?.data?.message || error.message;
    }
}