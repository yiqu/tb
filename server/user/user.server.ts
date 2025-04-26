'use server';
import prisma from '@/lib/prisma';
import { UserProfileAddable, UserProfileEditable } from '@/models/user/user.model';

// eslint-disable-next-line no-unused-vars
import type { Prisma } from '@prisma/client';

export async function addNewUser(user: UserProfileAddable) {
  try {
    const newUser = await prisma.userProfile.create({
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

export async function getUser(id: string) {
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
