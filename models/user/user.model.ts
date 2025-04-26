export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  dateAdded: string;
  updatedAt?: string;
  isAdmin: boolean;
};

export type UserProfileAddable = Pick<UserProfile, 'name' | 'email' | 'isAdmin'>;
export type UserProfileEditable = Partial<UserProfileAddable>;
