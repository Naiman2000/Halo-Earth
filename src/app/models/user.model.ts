export type UserRole = 'super-admin' | 'admin';

export interface User {
  id?: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt?: Date | any;
  updatedAt?: Date | any;
  createdBy?: string;
  active?: boolean;
}

