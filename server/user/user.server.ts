'use server';

import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { displayNameSchema } from '@/validators/settings/account/PersonalInfo';
import { UserProfile, UserProfileAddable, UserProfileEditable } from '@/models/user/user.model';
import { SettingsPersonalInfoDisplayNameActionState } from '@/models/settings/SettingsPersonalInfo';

// eslint-disable-next-line no-unused-vars
import type { Prisma } from '@prisma/client';

export async function addNewUser(user: UserProfileAddable): Promise<UserProfile> {
  try {
    const newUser: UserProfile = await prisma.userProfile.create({
      data: user,
    });

    return newUser;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at addNewUser(): ', JSON.stringify(error));
    if (error.code === 'P2002') {
      throw new Error(`User '${user.name}' already exists.`);
    }
    throw new Error(`User '${user.name}' could not be added. Code: ${error.code}`);
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.userProfile.findUnique({
      where: { id },
    });
    return user;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getUser(): ', JSON.stringify(error));
    throw new Error(`User '${id}' could not be found. Code: ${error.code}`);
  }
}

export async function getUser(): Promise<UserProfile | null> {
  'use cache';
  cacheLife('hours');
  cacheTag('get-user');

  await new Promise((resolve) => setTimeout(resolve, 1000));
  try {
    const users = await prisma.userProfile.findFirst();
    console.log('Fetched user.');
    return users;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getUser(): ', JSON.stringify(error));
    throw new Error(`Users could not be found. Code: ${error.code}`);
  }
}

export async function updateUserAction(
  prevState: SettingsPersonalInfoDisplayNameActionState,
  formData: FormData,
): Promise<SettingsPersonalInfoDisplayNameActionState> {
  const displayName = formData.get('displayName') || '';
  const userId = formData.get('userId') || '';
  const zodError = displayNameSchema.safeParse({ name: displayName });

  if (!zodError.success) {
    return {
      ...prevState,
      result: {
        name: displayName as string,
      },
      zodErrorIssues: zodError.error?.issues,
      isSuccess: false,
      statusCode: 400,
    };
  }

  if (userId) {
  } else {
    const newUser = await addNewUser({
      name: displayName as string,
      email: '',
      isAdmin: false,
    });

    return {
      isSuccess: true,
      result: newUser,
      statusCode: 200,
      zodErrorIssues: undefined,
      updatedAt: newUser.updatedAt,
    };
  }

  return {
    ...prevState,
    isSuccess: true,
    result: { name: displayName as string },
    statusCode: 200,
    zodErrorIssues: undefined,
  };
}

export async function updateUser(id: string, user: UserProfileEditable) {
  try {
    const updatedUser = await prisma.userProfile.update({
      where: { id },
      data: user,
    });
    return updatedUser;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateUser(): ', JSON.stringify(error));
    throw new Error(`User '${id}' could not be updated. Code: ${error.code}`);
  }
}
