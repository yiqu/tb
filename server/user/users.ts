'use server';

import axios, { AxiosResponse } from 'axios';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

import { User } from '@/models/auth/user.model';
import { API_TIMEOUT } from '@/constants/constants';
import { FIREBASE_API_BASE_URL } from '@/constants/endpoints';

const userAxiosInstance = axios.create({
  baseURL: `${FIREBASE_API_BASE_URL}/user`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getUser(): Promise<User> {
  'use cache';
  cacheTag('current-user');
  cacheLife('hours');
  // sleep for 2 seconds
  // await new Promise((resolve) => setTimeout(resolve, 1500));

  const res: AxiosResponse<User, any> = await userAxiosInstance.get<User>('.json');
  const user = {
    ...res.data,
    firstName: Math.random() > 0.5 ? 'Kev' : 'Kevin',
  };

  return user;
}

export async function reauthUser(): Promise<void> {
  revalidateTag('current-user');
}
