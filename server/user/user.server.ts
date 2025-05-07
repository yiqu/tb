'use server';

import { revalidateTag } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { displayNameSchema } from '@/validators/settings/account/PersonalInfo';
import { UserProfile, UserProfileAddable, UserProfileEditable } from '@/models/user/user.model';
import {
  SettingsPersonalInfoAdminModeActionState,
  SettingsPersonalInfoDisplayNameActionState,
} from '@/models/settings/SettingsPersonalInfo';

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
    console.log('Getting user...', users);
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
    try {
      const updatedUser = await updateUser(userId as string, {
        name: displayName as string,
      });

      revalidateTag('get-user');

      return {
        isSuccess: true,
        result: updatedUser,
        statusCode: 200,
        zodErrorIssues: undefined,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at updateUserAction() - updating user: ', JSON.stringify(error));
      throw new Error(`User '${userId}' could not be updated. Code: ${error.code}`);
    }
  } else {
    try {
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
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at updateUserAction() - adding new user: ', JSON.stringify(error));
      throw new Error(`User could not be added. Code: ${error.code}`);
    }
  }
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

export async function toggleAdminMode(userId: string, isAdmin: boolean) {
  //sleep
  await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: { isAdmin },
    });

    revalidateTag('get-user');

    return updatedUser;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at toggleAdminMode(): ', JSON.stringify(error));
    throw new Error(`User '${userId}' could not be updated. Code: ${error.code}`);
  }
}

export async function toggleAdminModeAction(
  prevState: SettingsPersonalInfoAdminModeActionState,
  formData: any,
): Promise<SettingsPersonalInfoAdminModeActionState> {
  const isAdminString: string = formData.isAdmin || '';
  const userId: string = formData.userId || '';

  const isAdmin: boolean = isAdminString.toString() === 'true';

  if (userId) {
    try {
      const updatedUser = await toggleAdminMode(userId as string, isAdmin);

      return {
        isSuccess: true,
        result: updatedUser.isAdmin,
        statusCode: 200,
        updatedAt: updatedUser.updatedAt,
        zodErrorIssues: undefined,
      };
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at toggleAdminModeAction(): ', JSON.stringify(error));
      throw new Error(`User '${userId}' could not be updated. Code: ${error.code}`);
    }
  }

  return {
    isSuccess: false,
    result: prevState.result,
    statusCode: 400,
    updatedAt: prevState.updatedAt,
    zodErrorIssues: undefined,
  };
}
