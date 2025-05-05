import axios from 'axios';
import { BASE_URL_API } from '.';
import { SummaryResponse } from '@/interfaces/responses';

export const fetchSummary = async (
  search: string = '',
  page: number = 1,
  limit: number = 10
): Promise<SummaryResponse | null> => {
  try {
    const res = await axios.get<SummaryResponse>(`${BASE_URL_API}/summary`, {
      params: { search, page, limit },
    });
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Axios error:', error.response?.data || error.message);
    } else {
      console.error('Unexpected error:', error);
    }
    return null;
  }
};
