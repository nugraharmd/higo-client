import axios from 'axios';
import { BASE_URL_API } from '.';

export const loadDataset = async (): Promise<{ success: boolean; message: string }> => {
  try {
    const res = await axios.post(`${BASE_URL_API}/load-dataset`);
    return {
      success: true,
      message: res.data.message || 'Dataset loading started.',
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      return {
        success: false,
        message: error.response.data.message,
      };
    }
    return {
      success: false,
      message: 'Failed to start dataset loading.',
    };
  }
};
