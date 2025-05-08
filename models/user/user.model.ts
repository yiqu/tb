export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  dateAdded: string | Date | undefined;
  updatedAt?: string | Date | null;
  isAdmin: boolean;
};

export type UserProfileAddable = Pick<UserProfile, 'name' | 'email' | 'isAdmin'>;
export type UserProfileEditable = Partial<UserProfileAddable>;
export type UserLocationEditable = Required<Pick<UserProfile, 'address' | 'city' | 'state' | 'zip' | 'country'>>;
export type UserLocationEditableWithUserId = UserLocationEditable & { userId: string };
