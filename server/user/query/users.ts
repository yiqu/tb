import axios, { AxiosResponse } from 'axios';
import { queryOptions } from '@tanstack/react-query';

import { User } from '@/models/auth/user.model';
import { FIREBASE_KQ_1_API_BASE_URL } from '@/constants/endpoints';
import { API_TIMEOUT, TANSTACK_QUERY_QUERY_KEY_FIREBASE_USER } from '@/constants/constants';

// Axios instance
const userFirebaseAxiosInstance = axios.create({
  baseURL: `${FIREBASE_KQ_1_API_BASE_URL}/user`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Fetch functions
async function getUserFirebase(): Promise<User> {
  const res: AxiosResponse<User, any> = await userFirebaseAxiosInstance.get<User>('.json');
  return res.data;
}

// TanStack Query options
export function getUserFirebaseQueryOptions() {
  return queryOptions({
    queryKey: [TANSTACK_QUERY_QUERY_KEY_FIREBASE_USER],
    queryFn: getUserFirebase,
    staleTime: 1000 * 1 * 60 * 5, // 5 minutes
  });
}
