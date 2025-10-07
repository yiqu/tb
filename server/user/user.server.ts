/* eslint-disable no-unused-vars */
'use server';

import { cache } from 'react';
import { Prisma } from '@prisma/client';
import { revalidateTag } from 'next/cache';
import { unstable_cacheTag as cacheTag } from 'next/cache';
import { unstable_cacheLife as cacheLife } from 'next/cache';

import prisma from '@/lib/prisma';
import { UserAchievement } from '@/models/auth/user.model';
import { CACHE_TAG_USER_ACHIEVEMENTS } from '@/constants/constants';
import { displayNameSchema } from '@/validators/settings/account/PersonalInfo';
import { UserProfile, UserProfileAddable, UserProfileEditable, UserLocationEditable } from '@/models/user/user.model';
import {
  SettingsPersonalInfoLocationActionState,
  SettingsPersonalInfoAdminModeActionState,
  SettingsPersonalInfoDisplayNameActionState,
} from '@/models/settings/SettingsPersonalInfo';

export async function revalidateUser() {
  revalidateTag('get-user');
}

export const getUserCached = cache(async () => {
  console.log("USER CACHED");
  const res = await getUser();
  return res;
});

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
    console.error('Server error at getUser()!!: ', JSON.stringify(error));
    throw new Error(`User '${id}' could not be found. Code: ${error.code}`);
  }
}

export async function getUser(): Promise<UserProfile | null> {
  'use cache';
  cacheLife('weeks');
  cacheTag('get-user');

  try {
    const users = await prisma.userProfile.findFirst();
    return users;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getUser()??: ', JSON.stringify(error));
    throw new Error(`Users could not be found??. Code: ${error.code}`);
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

      revalidateUser();

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
  //await new Promise((resolve) => setTimeout(resolve, 2000));
  try {
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: { isAdmin },
    });

    revalidateUser();

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
    message: 'User is required',
  };
}

export async function updateUserLocationAction(
  prevState: SettingsPersonalInfoLocationActionState,
  formData: any,
): Promise<SettingsPersonalInfoLocationActionState> {
  const locationData: UserLocationEditable = {
    address: (formData.address as string) || '',
    city: (formData.city as string) || '',
    state: (formData.state as string) || '',
    zip: (formData.zip as string) || '',
    country: (formData.country as string) || '',
  };

  const userId: string = (formData.userId as string) || '';

  if (userId) {
    try {
      const updatedUser = await updateUserLocation(userId, locationData);

      return {
        isSuccess: true,
        result: {
          address: updatedUser.address || '',
          city: updatedUser.city || '',
          state: updatedUser.state || '',
          zip: updatedUser.zip || '',
          country: updatedUser.country || '',
        },
        statusCode: 200,
        zodErrorIssues: undefined,
        updatedAt: updatedUser.updatedAt,
      };
    } catch (error: Prisma.PrismaClientKnownRequestError | any) {
      console.error('Server error at updateUserLocationAction(): ', JSON.stringify(error));
      throw new Error(`User '${userId}' could not be updated. Code: ${error.code}`);
    }
  }

  return {
    isSuccess: false,
    result: prevState.result,
    statusCode: 400,
    updatedAt: prevState.updatedAt,
    zodErrorIssues: undefined,
    message: 'User has not been created',
  };
}

export async function updateUserLocation(userId: string, location: UserLocationEditable) {
  // delay
  // await new Promise((resolve) => setTimeout(resolve, 3000));

  try {
    const updatedUser = await prisma.userProfile.update({
      where: { id: userId },
      data: location,
    });

    revalidateUser();

    return updatedUser;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at updateUserLocation(): ', JSON.stringify(error));
    throw new Error(`User '${userId}' could not be updated. Code: ${error.code}`);
  }
}

export async function getUserAchievements(): Promise<UserAchievement[]> {
  'use cache';
  cacheLife('weeks');
  cacheTag(CACHE_TAG_USER_ACHIEVEMENTS);

  const userAchievements: UserAchievement[] = [
    {
      achievementId: 'general',
      level: 1,
    },
    {
      achievementId: 'admin',
      level: 1,
    },
    {
      achievementId: 'searcher',
      level: 0,
    },
    {
      achievementId: 'learner',
      level: 0,
    },
    {
      achievementId: 'explorer',
      level: 0,
    },
  ];
  try {
    return userAchievements;
  } catch (error: Prisma.PrismaClientKnownRequestError | any) {
    console.error('Server error at getUserAchievements(): ', JSON.stringify(error));
    throw new Error(`User achievements could not be retrieved. Code: ${error.code}`);
  }
}
