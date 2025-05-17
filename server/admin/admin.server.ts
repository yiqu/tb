'use server';

import { revalidatePath } from 'next/cache';

let isAdminPasswordCorrect = false;

export async function triggerPasswordCorrect() {
  isAdminPasswordCorrect = true;
  revalidatePath('/admin');
}

export async function triggerPasswordIncorrect() {
  isAdminPasswordCorrect = false;
}

export async function getAdminPasswordCorrect() {
  return isAdminPasswordCorrect;
}
