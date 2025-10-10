'use server';

import { updateTag } from 'next/cache';

export async function revalidateBobaTime() {
  updateTag('bobaTime');
}
