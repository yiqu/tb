export interface User {
  email?: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  id: string;
}


export type UserAchievement = {
  achievementId: string;
  level: number;
  createdAt?: number;
  updatedAt?: number;
}
