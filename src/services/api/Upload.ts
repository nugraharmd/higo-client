import axios from 'axios';
import { BASE_URL_API } from '.';

export const uploadDataset = async (file: File): Promise<{ message: string, success: boolean } | null> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await axios.post(`${BASE_URL_API}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return {
      message: response.data.message || 'Upload success',
      success: true,
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errData = error.response?.data;
      const errMsg =
        typeof errData === 'string'
          ? errData
          : errData?.error || errData?.message || error.message;

      return {
        message: errMsg,
        success: false,
      };
    }

    return {
      message: 'Unexpected error occurred',
      success: false,
    };
  }
};
