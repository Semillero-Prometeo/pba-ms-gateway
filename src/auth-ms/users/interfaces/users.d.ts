import { person, role, user, user_role } from '@prisma/client';

export interface UserRoleResponse extends user_role {
  role?: role;
}

export interface UserResponse extends user {
  user_role?: UserRoleResponse[];
  person?: person;
}

export interface FirstTimeLoginUser extends UserResponse {
  requiresPasswordChange: boolean;
  resetToken: string;
}
