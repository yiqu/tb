'use server';

import axios from 'axios';
import { unstable_cacheLife as cacheLife } from 'next/cache';
import { revalidateTag, unstable_cacheTag as cacheTag } from 'next/cache';

import { Tea } from '@/models/teas/teas.models';
import { API_TIMEOUT } from '@/constants/constants';
import { FIREBASE_BOBA_STORE_API_BASE_URL } from '@/constants/endpoints';

const teasAxiosInstance = axios.create({
  baseURL: `${FIREBASE_BOBA_STORE_API_BASE_URL}`,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getTeas(): Promise<Tea[]> {
  'use cache';
  cacheTag('tea-list');
  cacheLife('hours');

  // sleep for 2 seconds
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await teasAxiosInstance.get<Record<string, Tea>>('/selections/teas.json');
  const teasList: Tea[] = Object.values(res.data);
  return teasList;
}

export async function revalidateTeaList() {
  revalidateTag('tea-list');
}
